import React from "react";
import {AppState, RefreshControl, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text} from 'react-native';
import DefiCard from "../components/defiCard";
import Swiper from 'react-native-deck-swiper';
import Toast from 'react-native-root-toast';
import {sha256} from 'js-sha256';
import * as FileSystem from 'expo-file-system';


class Verif extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            defis: [],
            loadedDefis: [],
            refreshing: false,
            swiped: 0,
            defisListe: [],
            appState: AppState.currentState
        }
    }

    async _getDefiFromServer(){
        let response = await fetch('https://assos.utc.fr/integ/integ2021/api/get_defi_verif.php');
        return await response.json()
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
    hash(str){
        let hash = sha256.create();
        hash.update(str);
        return hash.hex();
    }

    async _setStatus(id, status){
        let deviceID = await this._getDeviceId();
        deviceID = this.hash(deviceID);
        await fetch('http://assos.utc.fr/integ/integ2021/api/set_status.php?id='+id+"&status="+status+"&token="+deviceID);
    }
    
    _renderSwiper(){
    
        if(this.state.loadedDefis.length > 0){

            return(
                <Swiper
                    cards={this.state.defis}
                    renderCard={(defi) => {
                        if (defi !== undefined){

                            return (
                                <DefiCard navigation={this.props.navigation} defi={defi} defisListe={this.state.defisListe}/>
                            )
                        }
                    }}
                    onSwiped={
                        () => {
                            
                            let loaded = this.state.loadedDefis;
                            loaded.shift();
                            this.setState({
                                loadedDefis:loaded,
                                swiped:this.state.swiped+1
                            })
                            this._getDefiFromServer().then((defi)=>{
                                if (Object.keys(defi).length > 0){
                                    let a = this.state.defis;
                                    let loaded = this.state.loadedDefis;
                                    a.push(defi);
                                    loaded.push(defi);
                                    this.setState({
                                        defis:a,
                                        loadedDefis: loaded
                                    })
                                }
                            })
                        }
                    }
                    onSwipedLeft={
                        (cardIndex)=>{
                            
                            Toast.show('Refusé', {
                                duration: 1,
                                position: Toast.positions.CENTER,
                                shadow: true,
                                animation: true,
                                delay:0,
                                hideOnPress: true,
                                backgroundColor: "#f00",
                                textColor:"#fff"
                            });
                            this._setStatus(this.state.defis[cardIndex].id,0)
                        }
                    }
                    onSwipedRight={
                        (cardIndex)=>{
                            
                            Toast.show('Accepté', {
                                duration: 1,
                                position: Toast.positions.CENTER,
                                shadow: true,
                                animation: true,
                                delay:0,
                                hideOnPress: true,
                                backgroundColor: "#0f0",
                                textColor:"#fff"
                            });
                            this._setStatus(this.state.defis[cardIndex].id,2)
                        }
                    }

                    cardIndex={this.state.swiped}
                    backgroundColor={"#121212"}
                    stackSize={2}
                    disableBottomSwipe={true}
                    disableTopSwipe={true}
                    >
                </Swiper>
            )
        }else{
            return(
                <ScrollView
                    refreshControl={<RefreshControl tintColor={"white"} refreshing={this.state.refreshing} onRefresh={()=>{this.onRefresh()}} />}

                    contentContainerStyle={styles.body}
                >
                    <StatusBar barStyle="light-content" />
                    <Text style={{color:"white"}}> Aucun défi à vérifier </Text>
                </ScrollView>
            )
        }
    }
    onRefresh(){
        this.setState({refreshing: true});
        this.componentDidMount();
        this.setState({refreshing: false});
    }


    componentDidMount() {

        AppState.addEventListener('change', this._handleAppStateChange);
        for (let i=0;i<2;i++){
            this._getDefiFromServer().then((defi)=>{
                
                if (Object.keys(defi).length > 0 ){
                    let defis = this.state.defis;
                    let loadedDefis = this.state.loadedDefis;
                    defis.push(defi);
                    loadedDefis.push(defi);
                    this.setState({
                        defis: defis,
                        loadedDefis: loadedDefis
                    })
                }
            })
        }

        fetch('http://assos.utc.fr/integ/integ2021/api/get_defis.php')
        .then(response => response.json())
        .then(data => {
          this.setState({ defisListe: data });

        });

        
    }

    componentWillUnmount() {
        console.log('componentWillUnmount');
        AppState.removeEventListener('change', this._handleAppStateChange);
        this.state.defis.forEach((defi)=>{
            this._setStatus(defi.id,1);
        })
    }

    _handleAppStateChange = (nextAppState) => {
        if (this.state.appState === 'active' && nextAppState.match(/inavtive|background/)){
            this.state.defis.forEach((defi)=>{
                this._setStatus(defi.id,1);
            })
            this.setState({
                loadedDefis: []
            })
        }
        this.setState({appState: nextAppState});
    }


    render(){
        return(
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" />
                {this._renderSwiper()}

            </SafeAreaView>

        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#121212"
    },
    body:{
        backgroundColor: "#121212",
        flex: 1,
        alignItems:"center",
        justifyContent:"center"
    },
    text: {
        textAlign: "center",
        fontSize: 50,
        backgroundColor: "transparent",
        color: 'white'
    },

})

export default Verif