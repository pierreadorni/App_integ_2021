import React from "react";
import {Text, StyleSheet, RefreshControl, ScrollView, SafeAreaView} from 'react-native';
import DefiCard from "../components/defiCard";
import Swiper from 'react-native-deck-swiper';
import Toast from 'react-native-root-toast';



class Verif extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            defis: [],
            loadedDefis: [],
            refreshing: false,
            swiped: 0,
            defisListe: []
        }
    }

    async _getDefiFromServer(){
        let response = await fetch('https://assos.utc.fr/integ/integ2021/api/get_defi_verif.php');
        let data = await response.json();
        
        return data
    }

    async _setStatus(id, status){
        let response = await fetch('http://assos.utc.fr/integ/integ2021/api/set_status.php?id='+id+"&status="+status);
    }
    
    _renderSwiper(){
    
        if(this.state.loadedDefis.length > 0){

            return(
                <Swiper
                    cards={this.state.defis}
                    renderCard={(defi) => {
                        if (defi != undefined){

                            return (
                                <DefiCard navigation={this.props.navigation} defi={defi} defisListe={this.state.defisListe}/>
                            )
                        }
                    }}
                    onSwiped={
                        (cardIndex) => {
                            
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
                <SafeAreaView style={{flex:1,alignItems:"center",justifyContent:'center'}}>
                    <Text style={{color:"white"}}> Aucun défi à vérifier </Text>
                </SafeAreaView>
                
            )
        }
    }
    onRefresh(){
        this.setState({refreshing: true});
        this.componentDidMount();
        this.setState({refreshing: false});
    }


    componentDidMount() {

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
        this.state.defis.forEach((defi)=>{
            this._setStatus(defi.id,1);
        })
    }


    render(){
        
        return(
            <SafeAreaView>
                <ScrollView 
                refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={()=>{this.onRefresh()}} />}
                contentContainerStyle={styles.body}
                >
                    {this._renderSwiper()}
                </ScrollView>
            </SafeAreaView>

        );
    }
}

const styles = StyleSheet.create({
    body:{
        backgroundColor: "#121212",
        flex: 1,
    },
    
    text: {
        textAlign: "center",
        fontSize: 50,
        backgroundColor: "transparent",
        color: 'white'
    },

})

export default Verif