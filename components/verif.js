import { definitionSyntax } from "css-tree";
import { appendConstructorOption } from "jimp";
import React from "react";
import {View, Text, StyleSheet, Button} from 'react-native';
import Swiper from 'react-native-deck-swiper'

class Verif extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            defis: [],
        }
    }

    async _getDefiFromServer(){
        let response = await fetch('https://assos.utc.fr/integ/integ2021/api/verif_get_defi.php');
        // console.log('response: '+JSON.stringify(response));
        let data = await response.json();
        console.log('data: '+JSON.stringify(data));
        let defi = JSON.parse(data['data'])
        return defi
    }

    async _freeDefi(id){
        let response = await fetch('http://assos.utc.fr/integ/integ2021/api/free_defi.php?id='+id);
    }

    _renderSwiper(){
        if(this.state.defis.length > 0){
            return(
                <Swiper
                    cards={this.state.defis}
                    renderCard={(defi) => {
                        if (defi != undefined){
                            return (
                                <View style={styles.card}>
                                    <Text style={styles.text}>{defi.id}</Text>
                                </View>
                            )
                        }
                    }}
                    
                    onSwiped={
                        () => {
                            let a = this.state.cards;
                            this._getDefiFromServer().then((defi)=>{
                                a.push(defi);
                            })
                            this.setState({
                                defis:a,
                            })
                            console.log(this.state.defis);

                        }
                    }
                    cardIndex={0}
                    backgroundColor={"#121212"}
                    stackSize={2}
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


    componentDidMount() {
        let defis = [];
        for (let i=0;i<2;i++){
            this._getDefiFromServer().then((defi)=>{
                defis.push(defi);
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
            <View style={styles.body}>
                {this._renderSwiper()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    body:{
        backgroundColor: "#121212",
        flex: 1
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