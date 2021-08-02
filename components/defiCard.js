import React from "react";
import { Video } from 'expo-av';
import {View, StyleSheet, Text, TouchableWithoutFeedback} from "react-native";
import { useIsFocused } from "@react-navigation/native";

class DefiCard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            overlay: 1,
            defisListe: this.props.defisListe,
            defiDesc: "",
        }
    }

    

    _setDefiDesc(defisListe){
        console.log('setting defi desc with defisListe length = '+defisListe.length);
        defisListe.forEach((defi)=>{
            if (defi.id == this.props.defi.defi){
                this.setState({
                    defiDesc: defi.description
                })
            } 
        })
    }

    _renderClanForOverlay(clan){
        switch(clan){
            case "tampi":
                return(<Text style={{fontSize: 20, color: "yellow"}}> Tampilaguul </Text>)
            case "youa":
                return(<Text style={{fontSize: 20, color: "blue"}}> Youarille </Text>)
            case "kb":
                return(<Text style={{fontSize: 20, color: "red"}}> Klarf Binn </Text>)
            case "vb":
                return(<Text style={{fontSize: 20, color: "green"}}> Varelbor </Text>)
        }
    }

    _renderOverlay(){
        if(this.state.overlay){
            return(
            <View style={styles.overlay}>
                <Text style={{fontSize: 20, color: "white"}}> × {this.props.defi.nb} </Text>
                {this._renderClanForOverlay(this.props.defi.clan)}
                
                <Text style={{fontSize: 20, color: "white", fontStyle:"italic"}}>{this.state.defiDesc}  </Text>

            </View>
            )
        }
    }

    componentDidMount() {

        if (this.state.defisListe.length == 0){
            fetch('http://assos.utc.fr/integ/integ2021/api/get_defis.php')
            .then(response => response.json())
            .then(data => {
                this.setState({ defisListe: data })
                this._setDefiDesc(data);
            });
        }
        else{
            this._setDefiDesc(this.state.defisListe);
        }
        this.props.navigation.addListener('didFocus', (route) => { 
            console.log('willFocus');
            console.log(route);
        });

    }

    render(){
        const { isFocused } = this.props;

        return(
            <TouchableWithoutFeedback
                onPress={()=>{
                    this.setState({overlay:!this.state.overlay})
                }}
            >
                <View style={styles.card}>
                

                <Video
                    shouldPlay = {isFocused ? true : false}
                    style={styles.video}
                    source={{
                    uri: "https://assos.utc.fr/integ/integ2021/api/"+this.props.defi.uri,
                    }}
                    resizeMode="contain"
                    isLooping
                />
                {this._renderOverlay()}
            </View>
            </TouchableWithoutFeedback>
        )
        
    }
}

const styles = StyleSheet.create({
    card: {
        width: "90%",
        marginLeft: "5%",
        height: "90%",
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#E8E8E8",
        justifyContent: "center",
        backgroundColor: "#555",
    },
    video: {
        flex:1
    },
    overlay: {
        position: 'absolute',
        top:0,
        left:0,
        width:'100%',
        height:"100%",
        backgroundColor:'rgba(0,0,0,0.6)',


    }
})

export default function(props){
    const isFocused = useIsFocused();

    return <DefiCard navigation={props.navigation} defi={props.defi} defisListe={props.defisListe} isFocused={isFocused} />;
}