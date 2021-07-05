import React from 'react';
import {StyleSheet,View, Image, TouchableOpacity} from 'react-native';

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
    'kb':[require('../assets/kb.png'),require('../assets/kb-gris.png'),styles.clanLogoKb],
    'vb':[require('../assets/vb.png'),require('../assets/vb-gris.png'),styles.clanLogoVb],
    'tampi':[require('../assets/tampi.png'),require('../assets/tampi-gris.png'),styles.clanLogoTampi],
    'youa':[require('../assets/youa.png'),require('../assets/youa-gris.png'),styles.clanLogoYoua]
}



class ChoixClan extends React.Component{

    _renderClan(c){
        return(
            <Image style={clans[c][2]} source={clans[c][(this.props.selected == c)?0:1]}/>
        )
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