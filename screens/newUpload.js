import React from "react";
import {
  ActivityIndicator,
  DeviceEventEmitter,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import {Colors, IconButton} from "react-native-paper";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import Defi from "../components/defi.js";
import ChoixClan from "../components/choixClan.js";
import ProgressBar from "../components/progressBar.js";
import Toast from "react-native-root-toast";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as VideoThumbnails from "expo-video-thumbnails";
import NumberTextInput from "rn-weblineindia-number-input";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import uuidv4 from "uuid/v4";
import {SearchBar} from "react-native-elements";

const iphoneX = Platform.OS === 'ios' && Dimensions.get('window').height > 810;
const iphone = Platform.OS === 'ios';
const iphone8 = Platform.OS === 'ios' && Dimensions.get('window').height < 810;

class newUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defi: undefined,
      image: undefined,
      imageSize: 0,
      clan: "kb",
      id: undefined,
      modalVisible: false,
      defisListe: [],
      shownDefis: [],
      defiChoisi: undefined,
      number: 1,
      loading: false,
      uploading: false,
      uploadingProgress: 0,
      thumbnail: undefined,
      search: "",
    };
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Vous devez accepter la permission pour poster une image");
        return false;
      }
    }
    return true;
  };

  _setModalVisible(v) {
    this.setState({
      modalVisible: v,
    });
  }

  async _saveDefi(defi) {
    let defisStr = await this._readDefis();
    let defis = JSON.parse(defisStr);

    if (typeof defis !== "object") {
      defis = [];
    }

    let found = 0;

    for (let i = 0; i < defis.length; i++) {
      if (defis[i].id === defi.id || defis[i].id === defi.localId) {
        found = 1;
        defis[i] = defi;
      }
    }

    if (!found) {
      defis.unshift(defi);
    }
    await FileSystem.writeAsStringAsync(
      FileSystem.documentDirectory + "defis_envoyes.json",
      JSON.stringify(defis)
    );
    DeviceEventEmitter.emit("event.DefisChanged", {});
  }

  async _readDefis() {
    let res = await FileSystem.getInfoAsync(
      FileSystem.documentDirectory + "defis_envoyes.json"
    );
    if (res["exists"] === false) {
      return 0;
    }
    return await FileSystem.readAsStringAsync(
        FileSystem.documentDirectory + "defis_envoyes.json"
    );
  }

  _sendImage() {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    formData.append("file", {
      uri: this.state.image.uri,
      type: "video/mp4",
      name: "video.mp4",
    });

    formData.append("data", JSON.stringify(this.state.defi));

    xhr.upload.addEventListener("progress", (event) => {
      let defi = JSON.parse(JSON.stringify(this.state.defi));
      defi.uploadProgress = Math.round((event.loaded / event.total) * 100);
      this._saveDefi(defi);
    });

    xhr.addEventListener("load", () => {
      console.log("response: ");
      console.log(xhr.response);

      let defi = JSON.parse(JSON.stringify(this.state.defi));
      defi.status = 1;
      defi.localId = defi.id;
      try {
        defi.id = parseInt(JSON.parse(xhr.response).data);
      } catch (e) {
        console.warn(e);
        console.log(xhr.response);
      }

      this._saveDefi(defi);
    });

    xhr.open(
      "POST",
      "https://assos.utc.fr/integ/integ2021/api/upload-video.php"
    );
    xhr.setRequestHeader("Content-Type", "multipart/form-data");

    xhr.send(formData);
    this._saveDefi(this.state.defi);
    this.props.navigation.navigate("Upload", { updateList: true });
  }

  _sendChunk(uri, index, nbParts, uploadID, chunkSize, totalSize) {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();

      const uploadData = {
        uploadID: uploadID,
        index: index,
        nbParts: nbParts,
        chunkSize: chunkSize,
        totalSize: totalSize,
      };

      formData.append("file", {
        uri: uri,
        type: "video/mp4",
        name: "video.mp4",
      });

      formData.append("defiData", JSON.stringify(this.state.defi));
      formData.append("uploadData", JSON.stringify(uploadData));

      xhr.upload.addEventListener("progress", (event) => {
        let defi = JSON.parse(JSON.stringify(this.state.defi));
        let progress = (index * 1024 * 1024 * 10 + event.loaded) / totalSize;
        defi.uploadProgress = Math.round(progress * 100);
        this._saveDefi(defi);
      });

      xhr.addEventListener("load", () => {
        if (index === nbParts - 1) {
          let defi = JSON.parse(JSON.stringify(this.state.defi));
          defi.status = 1;
          defi.localId = defi.id;
          defi.id = parseInt(JSON.parse(xhr.response).data);
          console.log("id " + defi.id + " received. Saving defi.");
          this._saveDefi(defi);
        }
        resolve();
      });

      xhr.open(
        "POST",
        "https://assos.utc.fr/integ/integ2021/api/upload-video-chunk.php"
      );
      xhr.setRequestHeader("Content-Type", "multipart/form-data");

      xhr.send(formData);
      this.props.navigation.navigate("Upload", { updateList: true });
    });
  }

  _sendBigImage() {
    const CHUNK_SIZE = 1024 * 1024 * 10;

    // (1) Transform File to Blob
    fetch(this.state.image.uri)
      .then(async (resp) => {
        this._saveDefi(this.state.defi);
        this.props.navigation.navigate("Upload", { updateList: true });
        const blob = await resp.blob();
        const uriParts = this.state.image.uri.split(".");
        const ext = uriParts[uriParts.length - 1];

        // (2) Separate Blob into chunks

        const nParts = Math.ceil(blob.data.size / CHUNK_SIZE);
        let blobs = [];
        for (let i = 0; i < nParts; i++) {
          blobs.push(
            blob.slice(
              i * CHUNK_SIZE,
              Math.min((i + 1) * CHUNK_SIZE, blob.data.size)
            )
          );
        }

        console.log("sliced blob; size before slice: " + blob.data.size);
        let total = 0;
        blobs.forEach((blobChunk) => {
          console.log("blobChunk: " + blobChunk.data.size);
          total += blobChunk.data.size;
        });
        console.log(
          "End of blobChunks; Total number of chunks: " +
            blobs.length +
            "; Total Size: " +
            total
        );

        // (3) Write Chunks to Temp directory

        const uploadID = uuidv4();
        console.log("uploadID: " + uploadID);

        await FileSystem.makeDirectoryAsync(
          `${FileSystem.cacheDirectory}/${uploadID}`
        );
        console.log(
          `directory created at ${FileSystem.cacheDirectory}/${uploadID}`
        );

        const fr = new FileReader();
        for (let i = 0; i < nParts; i++) {
          await new Promise((resolve) => {
            fr.onload = async () => {
              const fileUri = `${FileSystem.cacheDirectory}/${uploadID}/${i}.${ext}`;
              console.log(`writing to ${fileUri}...`);
              await FileSystem.writeAsStringAsync(
                fileUri,
                fr.result.split(",")[1],
                { encoding: FileSystem.EncodingType.Base64 }
              );
              resolve(this);
            };
            fr.readAsDataURL(blobs[i]);
          });
        }
        console.log("All chunks written to Temp directory.");

        // (4) Send files from Temp directory

        for (let i = 0; i < nParts; i++) {
          const uri = `${FileSystem.cacheDirectory}/${uploadID}/${i}.${ext}`;
          await this._sendChunk(
            uri,
            i,
            nParts,
            uploadID,
            blobs[i].data.size,
            blob.data.size
          );
          console.log(
            "chunk " + i + " sent, " + (nParts - i - 1) + " remaining."
          );
        }

        console.log("all chunks uploaded. ");

        // (5) delete Temp directory
        await FileSystem.deleteAsync(
          `${FileSystem.cacheDirectory}/${uploadID}`
        );
        console.log("temp  files deleted.");

        blob.close();
      })
      .catch((e) => {
        console.warn(e);
        Toast.show(
          "Impossible d'envoyer le fichier. Il est probablement trop volumineux.",
          {
            duration: Toast.durations.SHORT,
            position: Toast.positions.CENTER,
            shadow: true,
            animation: true,
            delay: 0,
            hideOnPress: true,
            backgroundColor: "#fff",
            textColor: "#000",
          }
        );
      });
  }

  _pickImage = async () => {
    let perm = await this.getPermissionAsync();
    if (!perm) {
      return;
    }

    this.setState({
      loading: true,
    });
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 0,
    });
    this.setState({
      loading: false,
    });

    let infos = await FileSystem.getInfoAsync(result.uri);

    /*if (infos.size > 50000000){
          
          Toast.show('Le fichier choisi est trop volumineux. taille max: 50Mo', {
            duration: Toast.durations.SHORT,
            position: Toast.positions.CENTER,
            shadow: true,
            animation: true,
            delay:0,
            hideOnPress: true,
            backgroundColor: "#fff",
            textColor:"#000"
          });
          
        }
        */

    if (!result.cancelled) {
      this.setState({
        image: result,
        imageSize: infos.size,
      });
      this._generateThumbnail(result["uri"]);
    }
  };
  _setClan(c) {
    this.setState({
      clan: c,
    });
  }
  _updateNumber(n) {
    this.setState({
      number: n,
    });
  }

  _submit() {
    if (this.state.defiChoisi !== undefined && this.state.image !== undefined) {
      this.setState(
        {
          loading: true,
          defi: {
            video: this.state.image.uri,
            defi: this.state.defiChoisi,
            nb: this.state.number,
            clan: this.state.clan,
            id: Math.round(Math.random() * 100000),
            status: 3, // 0 = refusé, 1 = en attente, 2 = accepté, 3 = en cours d'ulpoad
            uploadProgress: 0,
          },
        },
        () => {
          if (this.state.imageSize < 50000000) {
            console.log("sending small video");
            this._sendImage();
          } else {
            console.log("sending big video");
            this._sendBigImage();
          }
        }
      );
    } else {
      Toast.show("Il manque le défi ou la vidéo.", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        delay: 0,
        hideOnPress: true,
        backgroundColor: "#fff",
        textColor: "#000",
      });
      //Toast.show('Il manque le défi ou la vidéo.', Toast.SHORT);
    }
  }

  _displayLoading() {
    if (this.state.loading) {
      return (
        <View style={styles.loadingScreen}>
          <ActivityIndicator size="large" color="#EB62BC" />
        </View>
      );
    }
  }

  _displayUploading() {
    if (this.state.uploading) {
      return (
        <View style={styles.loadingScreen}>
          <ProgressBar progress={this.state.uploadingProgress} />
        </View>
      );
    }
  }

  _displayDebug() {
    if (this.state.defiChoisi !== undefined) {
      return this.state.defiChoisi.id;
    }
  }

  _displayDefiButton() {
    if (this.state.defiChoisi === undefined) {
      return "Choisir un défi";
    } else {
      return this.state.defiChoisi.description;
    }
  }

  _generateThumbnail = async (url) => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(url, {
        time: 15000,
      });
      this.setState({ thumbnail: uri });
    } catch (e) {
      console.warn(e);
    }
  };

  _displayThumbnail() {
    if (this.state.thumbnail) {
      return (
        <Image
          source={{ uri: this.state.thumbnail }}
          style={{ width: "100%", height: "100%" }}
        />
      );
    } else {
      return <Ionicons name={"camera"} size={50}/>;
    }
  }
  updateSearch = (search) => {
    let shownDefis = [];
    console.log('updateSearch');
    this.state.defisListe.forEach(defi=>{
      if (defi.description.toLowerCase().includes(search.toLowerCase())){
        shownDefis.push(defi);
      }
    })
    this.setState({ 
      search:search,
      shownDefis: shownDefis
    });
  };

  componentDidMount() {
    fetch("http://assos.utc.fr/integ/integ2021/api/get_defis.php")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ defisListe: data, shownDefis:data });
      });
  }

  componentWillUnmount() {
    DeviceEventEmitter.removeAllListeners("event.mapMarkerSelected");
  }

  render() {
    return (
      <SafeAreaView
        style={{
          alignItems: "center",
          flexDirection: "column",
          flex: 1,
          backgroundColor: "#121212",
          paddingTop: 120,
        }}
      >
        {this._displayLoading()}
        {/* MODAL DE CHOIX DE DEFI*/}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <IconButton
                style={styles.closeButton}
                icon="close"
                color={Colors.red700}
                size={20}
                onPress={() => {
                  this._setModalVisible(!this.state.modalVisible);
                }}
              />
              <View style={{
                width: "100%",
                height: 50,
                overflow:"hidden"
              }}>
                <SearchBar
                  placeholder="Rechercher..."
                  onChangeText={this.updateSearch}
                  value={this.state.search}
                  round
                  containerStyle={{
                    backgroundColor:"#2C2C2C",
                    borderColor:"#2C2C2C",
                    width:'98%',
                    marginTop: -10
                  }}
                />
              </View>


              <FlatList
                style={{ width: "120%" }}
                data={this.state.shownDefis}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Defi
                    desc={item.description}
                    func={() => {
                      this.setState({
                        defiChoisi: item,
                      });
                      this._setModalVisible(!this.state.modalVisible);
                    }}
                  />
                )}
              />
            </View>
          </View>
        </Modal>

        {/* croix pour fermer */}
        <View style={{ position: "absolute", left: 10, top: 10+15*iphoneX }}>
          <TouchableOpacity onPress={this.props.navigation.goBack}>
            <Ionicons name={"close"} size={50} color={"#ffffff"}/>
          </TouchableOpacity>
        </View>

        {/* BOUTON DE CHOIX DE DEFI*/}
        <View style={{ position: "absolute", left: 10, top: 80+15*iphoneX }}>
          <TouchableOpacity
            onPress={() => {
              this._setModalVisible(true);
            }}
          >
            <Text
              style={{ color: "#00BBE1", fontStyle: "italic", fontSize: 20 }}
            >
              {" "}
              {this._displayDefiButton()}{" "}
            </Text>
          </TouchableOpacity>
        </View>

        {/* BOUTON DE CHOIX DE VIDEO*/}
        <TouchableOpacity onPress={this._pickImage}>
          <View
            style={{
              backgroundColor: "#D8D8D8",
              height: 200,
              width: 130,
              marginTop: 30+iphone*80,
              marginBottom: 30,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {this._displayThumbnail()}
          </View>
        </TouchableOpacity>
        {/*
                  <View style={styles.actionButton}>
                      <Button onPress={this._pickImage} title='Choisir une vidéo' color='#000000' ></Button>
                  </View>
                  */}

        {/* CHOIX DE NOMBRE DE NOUVO */}
        <Text
          style={{
            color: "white",
            position: "relative",
            left: "-35%",
            fontWeight: "bold",
          }}
        >
          {" "}
          Participants{" "}
        </Text>
        <NumberTextInput
    type="decimal"
    decimalPlaces={0}
    value={this.state.number}
    onUpdate={(value) => this.setState({number: value})}
    style={styles.textInputStyle}
    returnKeyType={"done"}
    allowNegative={false}
    />

        {/* CHOIX DU CLAN */}
        <Text
          style={{
            color: "white",
            position: "relative",
            left: "-41%",
            top: 20,
            fontWeight: "bold",
          }}
        >
          {" "}
          Clan{" "}
        </Text>
        <ChoixClan
    selected={this.state.clan}
    kb={() => {
      this._setClan("kb");
    }}
    vb={() => {
      this._setClan("vb");
    }}
    tampi={() => {
      this._setClan("tampi");
    }}
    youa={() => {
      this._setClan("youa");
    }}
    />

        {/* AFFICHAGE DEBUG */}

        {/* VALIDATION DU FORMULAIRE */}
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => {
            this._submit();
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: "bold",
              textTransform: "uppercase",
              marginLeft: 20,
            }}
          >
            {" "}
            Envoyer{" "}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  number: {
    fontSize: 200,
    textAlign: "center",
    marginTop: "30%",
  },
  actionButton: {
    marginLeft: "25%",
    marginRight: "25%",
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 5,
  },
  uploadButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 50-30*iphone8,
    right: 50,
    flexDirection: "row",
    backgroundColor: "#EA8BDE",
    height: 50,
    borderRadius: 10,
    paddingRight: 20,
  },

  // === MODAL ===
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    flex: 1,
    width: "100%",
    marginBottom: 0,
    marginTop: "20%",
    backgroundColor: "#2C2C2C",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  loadingScreen: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.8)",
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textInputStyle: {
    color: "rgba(255,255,255,0.8)",
    width: 40,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.8)",
    fontSize: 20,
    position: "relative",
    left: "-39%",
    fontWeight: "bold",
  },
});

export default newUpload;
