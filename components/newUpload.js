import React from 'react';
import {StyleSheet, View, Text, ActivityIndicator, ScrollView, Image, TouchableOpacity, Button, TouchableNativeFeedback, Modal, TouchableHighlight} from "react-native";
import { IconButton, Colors } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import NumberPicker from './numberPicker.js';

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
            modalVisible: false
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

    _displayDefis(){
        if(this.state.defis != undefined){
            return(
                <Text>
                    défis: {JSON.stringify(this.state.defis)}
                </Text>
            )
        }
    }
    _displayImage(){
        if (this.state.image != undefined){
            return(
                <Text>
                    Image: {JSON.stringify(this.state.image)}
                </Text>
            )
        }
    }

    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          //aspect: [4, 3],
          quality: 1,
        });

        if (!result.cancelled) {
            this.setState({
                image : result
            })
        }
      };

    componentDidMount(){
        this._readDefis();
    }



    render(){
        return(



            <View style={{alignItems: 'center',flexDirection:'column', flex:1}}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                      Alert.alert('Modal has been closed.');
                    }}>
                    <View style={styles.centeredView}>
                      <View style={styles.modalView}>
                        <Text style={styles.modalText}>Hello World!</Text>

                        <TouchableHighlight
                          style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                          onPress={() => {
                            setModalVisible(!modalVisible);
                          }}>
                          <Text style={styles.textStyle}>Hide Modal</Text>
                        </TouchableHighlight>
                      </View>
                    </View>
                  </Modal>

                <View style={styles.actionButton}>
                    <Button onPress={this._pickImage} title='Choisir une vidéo' color='#000000' ></Button>
                </View>
                <View style={styles.actionButton}>
                    <Button onPress={this._setModalVisible} title='Choisir un défi' color='#000000' ></Button>
                </View>
                <NumberPicker></NumberPicker>

                <TouchableOpacity style={styles.uploadButton} onPress={()=>{}}>
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

})

export default newUpload;
