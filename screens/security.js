import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import Verif from './verif';
import Auth from './auth';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import {sha256} from 'js-sha256';

class SecurityScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            authenticated: 1
        }
    }

    hash(str){
        let hash = sha256.create();
        hash.update(str);
        return hash.hex();
    }

    async _authenticate(){
        console.log('authenticating...')
        const deviceID = await this._getDeviceId();
        console.log('deviceID: '+deviceID)
        hashStr = this.hash(deviceID.toString());
        console.log('hash: '+hashStr);
        let res = await fetch(`http://assos.utc.fr/integ/integ2021/api/auth/id-auth.php?id=${hashStr}`);
        res = await res.json()
        console.log("response: " + res.status_message);
        if (res && parseInt(res.data)){
            return true;
        };
        return false;
    }

    async _getDeviceId(){
        const path = FileSystem.documentDirectory+'deviceId.json';
        const infos = await FileSystem.getInfoAsync(path);
        if (infos['exists']){
            const deviceID = JSON.parse(await FileSystem.readAsStringAsync(path));
            return deviceID;
        }else{
            const deviceID = Constants.sessionId;
            await FileSystem.writeAsStringAsync(path,JSON.stringify(deviceID));
            return deviceID;
        }   
    }

    componentDidMount() {
        this._authenticate().then(response => {
            if (response){
                this.setState({authenticated: 2});
            }else{
                this.setState({authenticated:0}); 
            }
        })
    }

    render(){
        if (this.state.authenticated == 2){
            return (<Verif/>);
        }else if (this.state.authenticated == 0){
            return (<Auth/>)
        }else{
            return (
                <View style={{backgroundColor: "#121212", flex:1 ,alignItems:"center", justifyContent:"center" }}>
                    <ActivityIndicator size="large" color="#EB62BC" />
                </View>
            )
        }
        
    }
}

export default SecurityScreen;