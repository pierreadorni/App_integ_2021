import React from 'react';
import {StyleSheet, View, Text, ActivityIndicator, ScrollView, Image, TouchableOpacity} from "react-native";
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

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
            image : undefined
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
            <View>
                <Text> Oui bonjour ceci est un nouvel upload !</Text>
                {this._displayDefis()}
                {this._displayImage()}
                <TouchableOpacity onPress={this._pickImage}>
                    <Text> Choisir une photo </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default newUpload;
