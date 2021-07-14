import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Button, Modal, ActivityIndicator, FlatList, DeviceEventEmitter} from "react-native";
import { IconButton, Colors } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import NumberPicker from './numberPicker.js';
import Defi from './defi.js';
import ChoixClan from './choixClan.js'
import ProgressBar from './progressBar.js';
import Toast from 'react-native-simple-toast';

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
            uploadingProgress: 0
        };
    }

    /*
    useEffect(() => {
        (async () => {
          if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
            }
          }
        })();
      }, []);
     */

    _setModalVisible(v){
        this.setState({
            modalVisible: v
        })
    }



    async _saveDefi(defi){
        
        let defisStr = await this._readDefis();
        let defis = JSON.parse(defisStr);
        let found = 0;
  
        for(let i=0;i<defis.length;i++){
          if (defis[i].id == defi.id){
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
        data: this.state.defi,
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
        defi.id = parseInt(JSON.parse(xhr.response).data);
        this._saveDefi(defi);
      })

      xhr.open('POST','https://assos.utc.fr/integ/integ2021/api/upload-video.php');
      xhr.setRequestHeader('Content-Type', 'multipart/form-data');
      this.setState({
        loading: false,
      })
      xhr.send(formData);

      
    }

    _pickImage = async () => {
        
        this.setState({
          loading: true
        })
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
          allowsEditing: true,
          quality: 1,
        });
        this.setState({
          loading: false
        })

        if (!result.cancelled) {
            this.setState({
                image : result
            })
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
          this._sendImage(()=>{});
          this._saveDefi(this.state.defi);
        });

        
        
        this.props.navigation.navigate('Upload',{updateList:true});

        
      }else{
        Toast.show('Il manque le défi ou la vidéo.', Toast.SHORT);
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
            <View style={{alignItems: 'center',flexDirection:'column', flex:1}}>
                
                
                {this._displayLoading()}
                {this._displayUploading()}
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

                {/* BOUTON DE CHOIX DE VIDEO*/}
                <View style={styles.actionButton}>
                    <Button onPress={this._pickImage} title='Choisir une vidéo' color='#000000' ></Button>
                </View>

                {/* BOUTON DE CHOIX DE DEFI*/}
                <View style={styles.actionButton}>
                    <Button onPress={()=>{this._setModalVisible(true)}} title='Choisir un défi' color='#000000' ></Button>
                </View>

                {/* CHOIX DE NOMBRE DE NOUVO */}
                <NumberPicker update={(n)=>{this._updateNumber(n)}}></NumberPicker>
                
                {/* CHOIX DU CLAN */}
                <ChoixClan selected={this.state.clan} kb={()=>{this._setClan('kb')}} vb={()=>{this._setClan('vb')}} tampi={()=>{this._setClan('tampi')}} youa={()=>{this._setClan('youa')}}></ChoixClan>

                {/* AFFICHAGE DEBUG */}
                <Text>{/*this._displayDebug()*/}</Text>
                

                {/* VALIDATION DU FORMULAIRE */}
                <TouchableOpacity style={styles.uploadButton} onPress={()=>{this._submit()}}>
                    <View></View>
                    <IconButton style={styles.uploadIcon} icon='cloud' color={Colors.white} size={45} />
                    <Text style={{fontSize: 25,fontWeight:'bold', color:Colors.white, marginLeft:-15,marginTop:-5}}> Upload </Text>
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
      position: 'absolute',
      bottom: 20,
      flexDirection:'row',
      backgroundColor: Colors.green500,
      height: 50,
      borderRadius: 100,
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
    backgroundColor: 'white',
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
  }

})

export default newUpload;
