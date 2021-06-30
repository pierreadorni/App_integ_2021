import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import * as VideoThumbnails from 'expo-video-thumbnails';

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
            console.log(this.state.image);
            return (
                <Image source={{uri: this.state.image}} style={{width:'100%',height:'100%'}}></Image>
            )
        }else{
            return (
                <Text>Ici le thumbnail</Text>
            )
        }
        
    }

    componentDidMount() {
        this.generateThumbnail(this.props.defi['video']);
    }

    render() {
        return(
            <View style={styles.container}>
                <View style={styles.thumbnailBox}>
                    {this._displayThumbnail()}
                </View>
                <View style={styles.infosBox}>
                    <Text>défi: {this.props.defi['defi']}</Text>
                </View>
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'rgba(0,0,0,0.1)',
        height: 100,
        flexDirection: 'row',
        borderColor: 'rgba(0,0,0,0.5)',
        borderWidth: 1
    },
    thumbnailBox:{
        flex: 1,
        justifyContent: 'center',
        borderColor: 'rgba(0,0,0,0.5)',
        borderWidth: 1
    },
    infosBox: {
        flex: 2
    }
})

export default ItemDefi