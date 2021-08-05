import React from 'react';
import {StyleSheet,View, Image, TouchableOpacity, Text} from 'react-native';

const styles = StyleSheet.create({
    container:{
        marginTop:30,
        width: '90%',
        height: 100,
        //backgroundColor: 'rgb(200,200,200)',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    clanLogoVb:{
        height: 90,
        width: 80
    },
    clanLogoKb:{
        height: 90,
        width: 85
    },
    clanLogoTampi:{
        marginTop:5,
        height: 80,
        width:90
    },
    clanLogoYoua:{
        marginTop:3,
        height: 85,
        width: 80
    }
})

const clans={
    'kb':[require('../assets/kb1.png'),require('../assets/kb1-gris.png'),styles.clanLogoKb],
    'vb':[require('../assets/vb1.png'),require('../assets/vb1-gris.png'),styles.clanLogoVb],
    'tampi':[require('../assets/tampi1.png'),require('../assets/tampi1-gris.png'),styles.clanLogoTampi],
    'youa':[require('../assets/youa1.png'),require('../assets/youa1-gris.png'),styles.clanLogoYoua]
}

const clanNames={
    'kb':['Klarf Binn','red'],
    'vb':['Varelbor','green'],
    'tampi':['Tampilaguul','yellow'],
    'youa':['Youarille','blue']
}

class ChoixClan extends React.Component{

    _renderClan(c){
        if (this.props.selected == c){
            return(
                <View>
                    <Image style={clans[c][2]} source={clans[c][0]}/>
                    <Text style={{textAlign:'center',color:clanNames[c][1], fontWeight:'bold'}}> {clanNames[c][0]} </Text>
                </View>
            )
        }else{
            return (
                <Image style={clans[c][2]} source={clans[c][1]}/>
            )
        }

    }

    render(){
        return(
            <View style={styles.container}>
                <TouchableOpacity onPress={this.props.kb}>
                    {this._renderClan('kb')}
                </TouchableOpacity>
                <TouchableOpacity onPress={this.props.vb}>
                    {this._renderClan('vb')}
                </TouchableOpacity>
                <TouchableOpacity onPress={this.props.tampi}>
                    {this._renderClan('tampi')}
                </TouchableOpacity>
                <TouchableOpacity onPress={this.props.youa}>
                    {this._renderClan('youa')}
                </TouchableOpacity>
            </View>
        )
    }
}



export default ChoixClan;