import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

class Defi extends React.Component {
    render(){
        return (
            <View>
                <TouchableOpacity style={styles.container} onPress={this.props.func}>
                    <Text style={styles.text}> {this.props.desc} </Text>
                </TouchableOpacity>
                <View style={styles.separator}></View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        width:'90%',
        paddingLeft:'10%',
        height:50,
        //backgroundColor: 'rgb(200,200,200)',
        justifyContent:'center',
    },
    text:{
        textAlign:'center'
    },
    separator:{
        height: 1,
        width: '90%',
        marginLeft:'5%',
        marginTop:10,
        marginBottom:10,
        backgroundColor: 'rgba(0,0,0,0.1)',
    }
})

export default Defi;