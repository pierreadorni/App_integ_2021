import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

class Defi extends React.Component {
    render(){
        return (
            <View>
                <TouchableOpacity style={styles.container} onPress={this.props.func}>
                    <Text style={styles.text}> {this.props.desc} </Text>
                </TouchableOpacity>
                {/*<View style={styles.separator}></View>*/}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        width:'90%',
        paddingLeft:'10%',

        
        justifyContent:'center',
    },
    text:{
        textAlign:'center',
        color:'white',
        marginTop:20,
        fontSize: 16,
        fontWeight:'normal',
        fontStyle:'italic'
    },
    separator:{
        height: 1,
        width: '90%',
        marginLeft:'5%',
        marginTop:10,
        marginBottom:10,
        backgroundColor: 'rgba(255,255,255,0.3)',
    }
})

export default Defi;