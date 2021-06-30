import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Button, Modal, TouchableHighlight, FlatList} from "react-native";
import { IconButton, Colors } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import NumberPicker from './numberPicker.js';
import Defi from './defi.js';
import ChoixClan from './choixClan.js'


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
            defis : undefined,
            image : undefined,
            clan: 'kb',
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
        }
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

    _saveDefis(obj){
        FileSystem.writeAsStringAsync(FileSystem.documentDirectory+'defis_envoyes.json', JSON.stringify(obj));
        this.setState({
            defis: obj
            })
    }
    _readDefis(){
        FileSystem.getInfoAsync(FileSystem.documentDirectory+'defis_envoyes.json').then((res)=>{
            if (res['exists'] == false){return 0;}
            FileSystem.readAsStringAsync(FileSystem.documentDirectory+'defis_envoyes.json').then((content)=>{
                this.setState({
                    defis: JSON.parse(content)
                    })
            })
        })
    }

    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
          allowsEditing: true,
          quality: 1,
        });

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
        let defis = this.state.defis;
        if (defis == undefined){
          defis = [];
        }

        defis.push({
          'video':this.state.image.uri,
          'defi':this.state.defiChoisi,
          'nb': this.state.nb,
          'clan': this.state.clan,
          'id': Math.round(Math.random()*1000000)
        });

        this._saveDefis(defis);
        this.props.navigation.navigate("Upload");
      }else{
        console.log('il manque le défi ou la vidéo')
      }
    }

    componentDidMount(){
        this._readDefis();
    }

    render(){
        return(
            <View style={{alignItems: 'center',flexDirection:'column', flex:1}}>
                
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
                            keyExtractor={(item) => item}
                            renderItem={({item}) => <Defi desc={item} func={
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
                <Text numberOfLines={1}> Vidéo : {this.state.image != undefined ? this.state.image['uri'] : ""} </Text>
                <Text> Défi : {JSON.stringify(this.state.defiChoisi)} </Text>
                <Text> Nombre de nouvös: {this.state.number}</Text>

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
  }

})

export default newUpload;
