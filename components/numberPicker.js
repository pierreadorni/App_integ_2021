import React from 'react';
import {StyleSheet,Text, View, TouchableNativeFeedback} from 'react-native';

class NumberPicker extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            number : 1,
        }
    }

    //componentDidUpdate(){
    //    this.props.update(this.state.number);
    //}

    _add(n){
        if (n+this.state.number > 0){
            this.setState({
                number: this.state.number + n
            },()=>{this.props.update(this.state.number)})
            
        }else{
            this.setState({
                number: 1
            },()=>{this.props.update(this.state.number)})
            
        }
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.circle}>
                    <TouchableNativeFeedback onPress={()=>{this._add(-5);}}>
                        <View >
                            <Text style={[styles.big , styles.red,styles.centered]} >
                                -5
                            </Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
                <View style={styles.circle}>
                    <TouchableNativeFeedback onPress={()=>{this._add(-1);}}>
                        <View >
                            <Text style={[styles.big , styles.red,styles.centered]} >
                                -1
                            </Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>

                <Text style={[styles.big,styles.centered,styles.circle_ios]}>{this.state.number}</Text>
                <View style={styles.circle}>
                    <TouchableNativeFeedback onPress={()=>{this._add(1);}}>
                        <View >
                            <Text style={[styles.big , styles.green,styles.centered]} >
                                +1
                            </Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
                <View style={styles.circle}>
                    <TouchableNativeFeedback onPress={()=>{this._add(5);}}>
                        <View >
                            <Text style={[styles.big , styles.green, styles.centered]} >
                                +5
                            </Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'rgb(200,200,200)',
        width:'80%',
        height:50,
        marginTop: 20,
        borderRadius: 20,
        flexDirection:'row',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 4,
        justifyContent: 'space-between'
    },
    big:{
        fontSize: 30,
    },
    circle:{
        borderRadius: 100,
        width: 50,
        overflow: 'hidden',
        color:'#000000'
    },
    circle_ios:{
        borderRadius: 100,
        width: 50,
    },
    green:{
        color:'rgb(0,200,0)',
    },
    red:{
        color:'rgb(200,0,0)',
    },
    centered:{
        textAlign:'center'
    }


})


export default NumberPicker;