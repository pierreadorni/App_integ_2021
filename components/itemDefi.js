import React from 'react';
import {View, Text, StyleSheet, Image, DeviceEventEmitter} from 'react-native';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Fontisto } from '@expo/vector-icons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';


class ItemDefi extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            image: null,
        }
    }

    generateThumbnail = async (url) => {
        try {
          const { uri } = await VideoThumbnails.getThumbnailAsync(
            url,
            {
              time: 15000,
            }

          );
          this.setState({ image: uri });
        } catch (e) {
        //   console.warn(e);
        }
    };

    _displayThumbnail(){
        if (this.state.image){

            return (
                <Image source={{uri: this.state.image}} style={{width:'100%',height:'100%'}}></Image>
            )
        }else{
            return (
                <Fontisto style='statusIcon' name='ban' size={50} color='#dddddd'/>
            )
        }
        
    }

    _displayProgress(){
        return(
            <View>
                <AnimatedCircularProgress
                size={50}
                width={5}
                fill={this.props.defi.uploadProgress}
                tintColor="#00e0ff"
                
                backgroundColor="#3d5875" 
                tintColor="#EB62BC"
                />
                <Text style={styles.progressText}> {this.props.defi.uploadProgress}% </Text>
            </View>
            
        )
    }

    _displayRight(){
        
        if(this.props.defi['status'] == 3){
            return(this._displayProgress())
        }else{
            return(this._displayStatus())
        }
    }

    _displayStatusIcon(){
        let name = "hourglass";
        let color = "blue";

        if (this.props.defi['status'] == 2){
            name = "check";
            color = "green";
        }
        if (this.props.defi['status'] == 0){
            name = "ban";
            color = "red";
        }
        return(
            <Fontisto style='statusIcon' name={name} size={50} color={color}/>
        )
    }

    _displayStatus(){
        if (this.props.defi.status == 2){
            return(
                <View style={{
                    borderWidth: 1,
                    borderColor: "#EA8BDE",
                    borderRadius: 10,
                    backgroundColor: "#EA8BDE"

                }}>
                    <Text style={{color:"#ffffff", marginBottom: 2}}> Accepté </Text>
                </View>
            )
        }else if (this.props.defi.status == 1){
            return(
                <View style={{
                    borderWidth: 1,
                    borderColor: "#EA8BDE",
                    borderRadius: 10

                }}>
                    <Text style={{color:"#EA8BDE", marginBottom: 2}}> En attente </Text>
                </View>
            )
        }else if (this.props.defi.status == 0){
            return(
                <View style={{
                    borderWidth: 1,
                    borderColor: "#ff0000",
                    borderRadius: 10
                }}>
                    <Text style={{color:"#ff0000", marginBottom: 2}}> Refusé </Text>
                </View>
            )
        }

    }

    componentDidMount() {
        this.generateThumbnail(this.props.defi['video']);
        //DeviceEventEmitter.addListener("event.DefisChanged", () => this._readDefis());
    }

    render() {
        return(
            <View style={styles.container}>
                <View style={styles.thumbnailBox}>
                    {this._displayThumbnail()}
                </View>
                <View style={styles.infosBox}>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={styles.infosDefi}>{this.props.defi['defi'].description}</Text>
                    <View style={styles.numberContainer}>
                        <Text style={styles.infosNumber}>{"×"+this.props.defi['nb'].toString()}</Text>
                        
                    </View>
                </View>
                <View style={styles.statusBox}>
                    {this._displayRight()}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'rgba(255,255,255,0.0589)',
        height: 100,
        flexDirection: 'row',
        borderColor: 'rgba(0,0,0,0.5)',
        borderWidth: 0,
        borderRadius: 10,
        marginTop:10,
        marginLeft:10,
        marginRight:10,
        padding: 10,
        color:"white"

    },
    thumbnailBox:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'rgba(0,0,0,0.5)',
        borderWidth: 0,
        borderRadius: 10,
        overflow: 'hidden',
        marginRight: 20
    },
    infosBox: {
        flex: 2,
        marginTop: -3
    },
    infosDefi:{
        fontWeight: 'bold',
        color:"white"
    },
    infosNumber:{
        fontSize: 40,
        position: 'relative',
        top: -4,
        marginBottom: -10,
        color:"white"

    },
    numberContainer:{
        width: 70,
        height: '80%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    statusBox:{
        flex:1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    progressText:{
        textAlign: 'center',
        position: 'relative',
        top: -35,
        color:'white'
    }
})

export default ItemDefi