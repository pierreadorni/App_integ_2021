import { definitionSyntax } from "css-tree";
import { appendConstructorOption } from "jimp";
import React from "react";
import {View, Text, StyleSheet, RefreshControl, ScrollView} from 'react-native';
import Swiper from 'react-native-deck-swiper'

class Verif extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            defis: [],
            loadedDefis: [],
            refreshing: false
        }
    }

    async _getDefiFromServer(){
        let response = await fetch('https://assos.utc.fr/integ/integ2021/api/get_defi_verif.php');
        let data = await response.json();
        
        return data
    }

    async _freeDefi(id){
        let response = await fetch('http://assos.utc.fr/integ/integ2021/api/free_defi.php?id='+id);
    }
    _renderSwiper(){
    
        if(this.state.loadedDefis.length > 0){
            return(
                <Swiper
                    cards={this.state.defis}
                    renderCard={(defi) => {
                        if (defi != undefined){
                            return (
                                <View style={styles.card}>
                                    <Text style={styles.text}>{defi['id']}</Text>
                                </View>
                            )
                        }
                    }}
                    onSwiped={
                        (cardIndex) => {
                            console.log(this.state.loadedDefis);
                            let loaded = this.state.loadedDefis;
                            loaded.shift();
                            this.setState({
                                loadedDefis:loaded
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

                    cardIndex={0}
                    backgroundColor={"#121212"}
                    stackSize={3}
                    disableBottomSwipe={true}
                    disableTopSwipe={true}
                    >
                </Swiper>
            )
        }else{
            return(
                <View style={{flex:1,alignItems:"center",justifyContent:'center'}}>
                    <Text style={{color:"white"}}> Aucun défi à vérifier </Text>
                </View>
                
            )
        }
    }
    onRefresh(){
        this.setState({refreshing: true});
        this.componentDidMount();
        this.setState({refreshing: false});
    }


    componentDidMount() {
        
        for (let i=0;i<3;i++){
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
        
    }

    componentWillUnmount() {
        this.state.defis.forEach((defi)=>{
            this._freeDefi(defi.id);
        })
    }


    render(){
        return(
            <ScrollView 
            refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={()=>{this.onRefresh()}} />}
            contentContainerStyle={styles.body}
            >
                {this._renderSwiper()}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    body:{
        backgroundColor: "#121212",
        flex: 1,
    },
    card: {
        width: "90%",
        marginLeft: "5%",
        height: "90%",
        borderRadius: 4,
        borderWidth: 2,
        // borderColor: "#E8E8E8",
        justifyContent: "center",
        backgroundColor: "#555",
    },
    text: {
        textAlign: "center",
        fontSize: 50,
        backgroundColor: "transparent",
        color: 'white'
    }
})

export default Verif