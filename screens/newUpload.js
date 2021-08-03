import React from 'react';
import {StyleSheet, View, Text, Image,TouchableOpacity, TouchableHighlight, Button, Modal, ActivityIndicator, FlatList, DeviceEventEmitter} from "react-native";
import { IconButton, Colors } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import Defi from '../components/defi.js';
import ChoixClan from '../components/choixClan.js'
import ProgressBar from '../components/progressBar.js';
import Toast from 'react-native-root-toast'
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as VideoThumbnails from 'expo-video-thumbnails';
import NumberTextInput from 'rn-weblineindia-number-input';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';


const options = {
  title: 'Select Avatar',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

class newUpload extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            defi : undefined,
            image : undefined,
            imageSize: 0,
            clan: 'kb',
            id: undefined,
            modalVisible: false,
            defisListe: [
                'Porter une couche pendant une journée',
                'Faire la livraison du Pic',
                'Se prendre en photo avec le plus de chiens dans la rue',
                'Offrir un bouquet de fleurs à des inconnus',
                'Organiser un spectacle de marionette au parc Songeons',
                'Monter les 6 étages de BF en montant 3 marches puis en descendant 1',
                'Organiser un faux mariage sur la place de la mairie (1 par clan)',
                'Faire un faux combat de pokémon (un nouvö joue le rôle du pokémon)',
                "Organiser une course d'escargots",
                'se balader aver un panneau "free hug" dans compiègne',
                'proposer aux compiègnois de laver leur voiture',
                "Demander des conseils pour une tetine dans une pharmacie et faire croire que c'est pour soi-même",
                'Faire un remix de Roméo et Juilette dans le marché aux herbes',
                "Chanter l'hymne national de l'Azerbaïdjan sur la place de la mairie",
                'Faire un poème sur les mollets de la présidente et lui offir',
                'Offrir une tranche de melon à la vice-prez',
                'Aller à deux dans une bijouterie et faire une demande de fiancailles',
                'Colorer/décolorer ses cheveux en la couleur de son clan',
            ],
            defiChoisi: undefined,
            number: 1,
            loading: false,
            uploading: false,
            uploadingProgress: 0,
            thumbnail: undefined
        };
    }

  getPermissionAsync = async () => {
      if (Constants.platform.ios) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
          alert('Vous devez accepter la permission pour poster une image');
          return false
        }
      }
      return true;
  }

    _setModalVisible(v){
        this.setState({
            modalVisible: v
        })
    }

    async _saveDefi(defi){
        
        let defisStr = await this._readDefis();
        let defis = JSON.parse(defisStr);

        if (typeof defis != 'object'){
          defis = []
        }
        
        let found = 0;
  
        for(let i=0;i<defis.length;i++){
          if (defis[i].id == defi.id || defis[i].id == defi.localId){
            found = 1;
            defis[i] = defi;
          }
        }

        if (!found){
          defis.push(defi);
        }
        await FileSystem.writeAsStringAsync(FileSystem.documentDirectory+'defis_envoyes.json', JSON.stringify(defis));
        DeviceEventEmitter.emit("event.DefisChanged", {});
    }

    async _readDefis(){
        let res = await FileSystem.getInfoAsync(FileSystem.documentDirectory+'defis_envoyes.json');
        if (res['exists'] == false){return 0;}
        let content = await FileSystem.readAsStringAsync(FileSystem.documentDirectory+'defis_envoyes.json');
        return content
    }

    _sendImage(){

      const xhr = new XMLHttpRequest();
      const formData = new FormData();

      formData.append('file',{
        uri: this.state.image.uri,
        type: 'video/mp4',
        name: 'video.mp4',
      });

      formData.append('data',JSON.stringify(this.state.defi));

      xhr.upload.addEventListener('progress',(event)=>{
 
        let defi = JSON.parse(JSON.stringify(this.state.defi));
        defi.uploadProgress = Math.round(event.loaded/event.total*100);
        this._saveDefi(defi)
      });

      xhr.addEventListener('load',()=>{
        console.log('response: ');
        console.log(xhr.response);
        
        let defi = JSON.parse(JSON.stringify(this.state.defi));
        defi.status = 1;
        defi.localId = defi.id;
        defi.id = parseInt(JSON.parse(xhr.response).data);
        
        this._saveDefi(defi);
      })

      xhr.open('POST','https://assos.utc.fr/integ/integ2021/api/upload-video.php');
      xhr.setRequestHeader('Content-Type', 'multipart/form-data');

      xhr.send(formData);
    }

    _sendBigImage(){
      console.log('sendBigImage');
    }

    _pickImage = async () => {
        let perm = await this.getPermissionAsync();
        if (!perm){
          return
        }
        
        this.setState({
          loading: true
        })
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
          allowsEditing: true,
          quality: 0,
        });
        this.setState({
          loading: false
        })

        let infos = await FileSystem.getInfoAsync(result.uri);

        console.log(JSON.stringify(infos));

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
            console.log(JSON.stringify(result));
            this.setState({
                image : result,
                imageSize: infos.size
            })
            this._generateThumbnail(result['uri']);
        }
        
    };
    _setClan(c){
        this.setState({
            clan:c
        })
    }
    _updateNumber(n){
        
        this.setState({
            number:n
        })
    }

    _submit(){
      if(this.state.defiChoisi != undefined && this.state.image != undefined){

        this.setState({
          loading: true,
          defi :{
            video : this.state.image.uri,
            defi : this.state.defiChoisi,
            nb :  this.state.number,
            clan : this.state.clan,
            id : Math.round(Math.random()*100000),
            status : 3, // 0 = refusé, 1 = en attente, 2 = accepté, 3 = en cours d'ulpoad 
            uploadProgress : 0
          }
        },()=>{
          if (this.state.imageSize < 50000000){
            this._sendImage();
          }else{
            this._sendBigImage();
          }
          
          this._saveDefi(this.state.defi);
        });

        
        
        this.props.navigation.navigate('Upload',{updateList:true});

        
      }else{
        Toast.show('Il manque le défi ou la vidéo.', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.CENTER,
          shadow: true,
          animation: true,
          delay:0,
          hideOnPress: true,
          backgroundColor: "#fff",
          textColor:"#000"
        });
        //Toast.show('Il manque le défi ou la vidéo.', Toast.SHORT);
      }
    }

    _displayLoading(){
      if(this.state.loading){
        return(
          <View style={styles.loadingScreen}>
            <ActivityIndicator size="large" color="#EB62BC" />
          </View>
        )
      }
    }

    _displayUploading(){
      if (this.state.uploading){
        return(
          <View style={styles.loadingScreen}>
            <ProgressBar progress={this.state.uploadingProgress}/>
          </View>
        )
      }
    }

    _displayDebug(){
      if(this.state.defiChoisi != undefined){
        return(this.state.defiChoisi.id);
      }
    }

    _displayDefiButton(){
      if (this.state.defiChoisi == undefined){
        return ("Choisir un défi")
      }else{
        return (this.state.defiChoisi.description)
      }
    }

    _generateThumbnail = async (url) => {
      try {
        const { uri } = await VideoThumbnails.getThumbnailAsync(
          url,
          {
            time: 15000,
          }

        );
        this.setState({ thumbnail: uri });
      } catch (e) {
        console.warn(e);
      }
    };

    _displayThumbnail(){
      if (this.state.thumbnail){
          return (
              <Image source={{uri: this.state.thumbnail}} style={{width:'100%',height:'100%'}}></Image>
          )
      }else{
          return (
            <Ionicons name={"camera"} size={50}></Ionicons>
          )
      }
      
  }

    componentDidMount(){
      fetch('http://assos.utc.fr/integ/integ2021/api/get_defis.php')
        .then(response => response.json())
        .then(data => {
          this.setState({ defisListe: data });
        });
    }

    componentWillUnmount(){
      DeviceEventEmitter.removeAllListeners("event.mapMarkerSelected")
    }

    render(){
        return(
            <View style={{alignItems: 'center',flexDirection:'column', flex:1, backgroundColor:"#121212", paddingTop: 120}}>
                
                {this._displayLoading()}
                {/* MODAL DE CHOIX DE DEFI*/}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                      Alert.alert('Modal has been closed.');
                    }}>
                    <View style={styles.centeredView}>
                      <View style={styles.modalView}>
                        <IconButton 
                            style={styles.closeButton} 
                            icon='close' 
                            color={Colors.red700} 
                            size={20} 
                            onPress={() => {
                                this._setModalVisible(!this.state.modalVisible);
                              }}
                        />
                        <FlatList
                            style={{width: '120%'}}
                            data={this.state.defisListe}
                            keyExtractor={(item) => item.id}
                            renderItem={({item}) => <Defi desc={item.description} func={
                                () => {
                                    this.setState({
                                        defiChoisi: item
                                    })
                                    this._setModalVisible(!this.state.modalVisible);
                                  }
                            }/>}
                        />
                      </View>
                    </View>
                </Modal>

                {/* croix pour fermer */}
                <View style={{position:'absolute',left:10,top:10}}>
                  <TouchableOpacity onPress={this.props.navigation.goBack} >
                    <Ionicons name={"close"} size={50} color={'#ffffff'} ></Ionicons>
                  </TouchableOpacity>
                </View>
                

                {/* BOUTON DE CHOIX DE DEFI*/}
                <View style={{position:'absolute',left:10,top:80}}>
                  <TouchableOpacity onPress={()=>{this._setModalVisible(true)}}>
                    <Text style={{color:'#00BBE1', fontStyle:'italic',fontSize:20}}> {this._displayDefiButton()} </Text>
                  </TouchableOpacity>
                </View>

                {/* BOUTON DE CHOIX DE VIDEO*/}
                <TouchableOpacity onPress={this._pickImage}>
                      <View style={{backgroundColor:'#D8D8D8', height:200, width:130, marginTop: 30, marginBottom: 30, alignItems:'center', justifyContent:'center'}}>
                          {this._displayThumbnail()}
                      </View>
                </TouchableOpacity>
                {
                  /*
                  <View style={styles.actionButton}>
                      <Button onPress={this._pickImage} title='Choisir une vidéo' color='#000000' ></Button>
                  </View>
                  */
                }

                {/* CHOIX DE NOMBRE DE NOUVO */}
                <Text style={{color:"white", position: 'relative', left:"-35%", fontWeight:"bold"}}> Participants </Text>
                <NumberTextInput
                  type='decimal'
                  decimalPlaces={0}
                  value={this.state.number}
                  onUpdate={(value) => this.setState({ number: value })}
                  style={styles.textInputStyle}
                  returnKeyType={'done'}
                  allowNegative={false}
                ></NumberTextInput>


                
                {/* CHOIX DU CLAN */}
                <Text style={{color:"white", position: "relative", left:"-41%", top:20, fontWeight:"bold"}}> Clan </Text>
                <ChoixClan selected={this.state.clan} kb={()=>{this._setClan('kb')}} vb={()=>{this._setClan('vb')}} tampi={()=>{this._setClan('tampi')}} youa={()=>{this._setClan('youa')}}></ChoixClan>

                {/* AFFICHAGE DEBUG */}
                
                

                {/* VALIDATION DU FORMULAIRE */}
                <TouchableOpacity style={styles.uploadButton} onPress={()=>{this._submit()}}>
                    <Text style={{ color:"white", fontSize:20, fontWeight:'bold', textTransform:"uppercase", marginLeft: 20}}> Envoyer </Text>
                </TouchableOpacity>

        </View>

        )
    }
}

const styles = StyleSheet.create({
    number: {
        fontSize: 200,
        textAlign:'center',
        marginTop: '30%'
    },
    actionButton: {
        marginLeft: '25%',
        marginRight: '25%',
        marginTop:20,
        borderWidth: 1,
        borderRadius: 5,
    },
    uploadButton:{
      flex:1,
      alignItems: "center",
      justifyContent:'center',
      position: 'absolute',
      bottom: 50,
      right: 50,
      flexDirection:'row',
      backgroundColor: "#EA8BDE",
      height: 50,
      borderRadius: 10,
      paddingRight: 20,
  },

  // === MODAL ===
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    
  },
  modalView: {
    flex: 1,
    width: '80%',
    height:'100%',
    margin: 20,
    backgroundColor:"#2C2C2C",
    borderColor: "#ffffff",
    borderWidth:1,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeButton:{
      position:'absolute',
      top:0,
      left:0
  },
  loadingScreen:{
    position:'absolute',
    width:'100%',
    height:'100%',
    backgroundColor: 'rgba(255,255,255,0.8)',
    zIndex: 1,
    alignItems:'center',
    justifyContent:'center'
  },
  textInputStyle:{
    color:"rgba(255,255,255,0.8)",
    width: 40,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.8)",
    fontSize: 20,
    position:'relative',
    left: "-39%",
    fontWeight: 'bold'
  }

})

export default newUpload;
