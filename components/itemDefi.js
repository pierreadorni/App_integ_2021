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
          console.warn(e);
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
                onAnimationComplete={() => console.log('onAnimationComplete')}
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
            return(this._displayStatusIcon())
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
                        <Text style={styles.infosNumber}>{this.props.defi['nb'].toString()}</Text>
                        <Text>Nouvös</Text>
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
        backgroundColor: 'rgba(255,255,255,0.7)',
        height: 100,
        flexDirection: 'row',
        borderColor: 'rgba(0,0,0,0.5)',
        borderWidth: 0,
        borderRadius: 10,
        marginTop:10,
        marginLeft:10,
        marginRight:10,
        padding: 10

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
        paddingTop: 5,
    },
    infosDefi:{
        fontWeight: 'bold',
    },
    infosNumber:{
        fontSize: 40,
        position: 'relative',
        top: -4,
        marginBottom: -10

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
        top: -35
    }
})

export default ItemDefi