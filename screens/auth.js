import React from 'react';
import {Modal, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors, IconButton} from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import {sha256} from 'js-sha256';

class Auth extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            modalVisible: false
        };
    }
    
    keyword = ""

    hash(str){
        let hash = sha256.create();
        hash.update(str);
        return hash.hex();
    }

    _setModalVisible(visible){
        this.setState({
            modalVisible: visible
        })
    }

    async _getDeviceId(){
        const path = FileSystem.documentDirectory+'deviceId.json';
        const infos = await FileSystem.getInfoAsync(path);
        if (infos['exists']){
            return JSON.parse(await FileSystem.readAsStringAsync(path));
        }else{
            const deviceID = Constants.sessionId;
            await FileSystem.writeAsStringAsync(path,JSON.stringify(deviceID));
            return deviceID;
        }   
    }

    async _getPublicKey(){
        let res = await fetch('https://assos.utc.fr/integ/integ2021/api/auth/get-public-key.php');
        res = await res.json();
        return res['data'];
    }

    async _askForAccess(){
        //create keyword

        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        this.keyword = "";

        for(let i=0;i<6;i++){
            this.keyword += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        
        //hash device ID
        const deviceID = await this._getDeviceId();
        console.log("deviceID: "+deviceID);
        const hashed_deviceID = this.hash(deviceID);

        //send hashed_deviceID, keyword and public_key
        console.log('hashed deviceID: '+hashed_deviceID);

        
        let res = await fetch(`https://assos.utc.fr/integ/integ2021/api/auth/request-access.php?hashed_deviceID=${hashed_deviceID}&keyword=${this.keyword}`);
        res = await res.json();
    
        console.log(JSON.stringify(res));
        this._setModalVisible(true);
    }

    _displayModal(){
        return(
            <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                this.setModalVisible(!modalVisible);
            }}
        >
            <View style={styles.centeredView}>

                <View style={styles.modalContainer}>
                    <IconButton 
                        style={{position:'absolute', top:0, left:0, width:30,height:30}} 
                        icon='close' 
                        color={Colors.red700} 
                        size={20} 
                        onPress={() => {
                            this._setModalVisible(!this.state.modalVisible);
                        }}
                    />
                    <View style={styles.centeredView}>
                        <Text style={{textAlign:'center',color:'white', marginTop:-30, marginBottom:20, maxWidth:'90%'}}> Demande envoyée. Votre code de demande est ci-dessous: </Text>
                        <Text selectable style={{color:'white', textAlign:'center', marginBottom:20, fontSize:40, fontWeight:'bold',letterSpacing:5}}>
                            {this.keyword}
                        </Text>
                        <Text style={{textAlign:'center',color:'white', maxWidth:'90%'}}> Veuillez le transmettre à votre resp info préféré. </Text>
                    </View>

                </View>
            </View>

        </Modal>
        )

    }

    render(){
        return(
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" />
                {this._displayModal()}
                <Text style={{color:'white', fontSize: 20, width: "80%", textAlign: "center", marginBottom:'20%'}}> Cette section est réservée aux membres du BDI.</Text>
                <TouchableOpacity onPress={()=>{this._askForAccess()}}>
                    <Text style={{color:'#00DDF5', textAlign:'center', fontSize:16, textDecorationLine:"underline"}}> Demander un accès </Text>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:"#121212",
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    modalContainer:{
        width: '70%',
        height: '30%',
        marginBottom:80,
        borderRadius:5,
        backgroundColor:"#2C2C2C",
    },
    centeredView:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        marginTop:22
    }
})

export default Auth