import React from 'react';
import {View,Text,StyleSheet} from 'react-native';

class ProgressBar extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <View style = {styles.centered}>
                <Text style={styles.number}> {(Math.round(this.props.progress*1000)/10).toString()+'%'} </Text>
                <View style={styles.barsContainer}>
                    <View style={styles.greyBar}>
                    <View style={{
                        width: this.props.progress*300,
                        backgroundColor:'#4444ff',
                        zIndex: 1,
                        height:20,
                    }}></View>
                    </View>
                    
                </View>
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    centered:{
        alignItems: 'center',
        justifyContent: 'center',
    },
    number:{
        fontSize: 40,
        fontWeight: 'bold',
    },
    barsContainer:{
        alignItems: 'flex-start'
    },
    greyBar:{
        width: 300,
        height:20,
        backgroundColor:'#AAAAAA',
        borderRadius: 20,
        overflow: 'hidden'
    },
    blueBar:{
        height:20,
        //marginTop:'-100%',
        backgroundColor:'#AAAAff',
        zIndex: 1
    }
    
})

export default ProgressBar;