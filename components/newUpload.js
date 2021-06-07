import React from 'react';
import {StyleSheet, View, Text, ActivityIndicator, ScrollView, Image} from "react-native";
import * as FileSystem from 'expo-file-system';


class newUpload extends React.Component{

    _writeNewFile(obj){
        FileSystem.getInfoAsync(fileUri, options).then((res)=>{
            if (res['exists'] == false){
                FileSystem.writeAsStringAsync(FileSystem.documentDirectory+'defis_envoyes.json', contents, options)
            }else{

            }

        })

    }

    render(){
        return(
            <View>
                <Text> Oui bonjour ceci est un nouvel upload !</Text>
            </View>
        )
    }
}

export default newUpload;
