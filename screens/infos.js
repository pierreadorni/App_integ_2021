import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Linking, SafeAreaView, Dimensions, Modal, Image} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { IconButton, Colors } from "react-native-paper";



class InfosScreen extends React.Component{
    state = {
        discordLink: "",
        bonPlans: false
    }

    _displayDiscord(){
        if(this.state.discordLink != ""){
            return (
                <TouchableOpacity onPress={()=>Linking.openURL(this.state.discordLink)}>
                    <Text selectable style={[styles.socialsText, {color: "#00bbe1", textDecorationLine:'underline'}]}>{this.state.discordLink}</Text>
                </TouchableOpacity> 
            )
        }else{
            return(
                <ActivityIndicator style={{marginLeft: 20}} size="small" color="#EB62BC"/>
            )
        }
    }

    async getDiscordLink(){
        let socials = await fetch("https://assos.utc.fr/integ/integ2021/fichiers/socials.json");
        socials = await socials.json();
        return socials.discord
    }

    componentDidMount() {
        this.getDiscordLink().then((discordLink)=>{
            this.setState({discordLink})
        })
    }

    render(){
        return(
        <SafeAreaView style={styles.container}>
            <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.bonPlans}
            >
                <View style={styles.modalContainer}>
                    <IconButton
                        style={styles.closeButton}
                        icon="close"
                        color={Colors.red700}
                        size={20}
                        onPress={() => {
                        this._setModalVisible(!this.state.modalVisible);
                        }}
                    />
                </View>   
            </Modal>
            <Text style={styles.headerText}> Informations </Text>
            <Text style={[styles.subTitle, {marginLeft: 25}]}>Réseaux de l'integ</Text>
            <View style={styles.socialsContainer}>
                <View style={styles.socialsRow}>
                    <View style={styles.social}>
                        <Ionicons name="logo-facebook" size={32} color="#EA8BDE" />
                        <Text selectable style={styles.socialsText}>Alain Tégration</Text>
                    </View>
                    <View style={styles.social}>
                        <Ionicons name="logo-snapchat" size={32} color="#EA8BDE" />
                        <Text selectable style={styles.socialsText}>integ utc</Text>
                    </View>
                </View>
                <View style={styles.socialsRow}>
                    <View style={styles.social}>
                        <Ionicons name="logo-instagram" size={32} color="#EA8BDE" />
                        <Text selectable style={styles.socialsText}>integrationutc</Text>
                    </View>
                    <View style={styles.social}>
                        <Ionicons name="logo-twitter" size={32} color="#EA8BDE" />
                        <Text selectable style={styles.socialsText}>IntegrationUtc</Text>
                    </View>
                </View>

                    <View style={styles.social}>
                        <FontAwesome5 name="discord" size={32} color="#EA8BDE"/>
                        {this._displayDiscord()}
                    </View>
            </View>
            <Text style={[styles.subTitle, {marginLeft: 25}]}>Numéros Utiles</Text>
            <View style={{flexDirection:'row'}}>
                <View style={styles.numbersLeft}>
                    
                    <Text style={styles.numberText}> Prez: </Text>
                    <Text style={styles.numberText}> Vice-Prez: </Text>
                    <Text style={styles.numberText}> Resp Sécu: </Text>
                    <Text style={[styles.numberText, {color:'red', fontWeight:'bold'}]}> BDI: </Text>
                    {/* <Text style={styles.numberText}> Resp Anim: </Text>
                    <Text style={styles.numberText}> Resp Tuc: </Text> */}
                </View>
                <View style={styles.numbersRight}>
                    <Text selectable style={styles.number}>+33 6 52 31 69 22</Text>
                    <Text selectable style={styles.number}>+33 6 67 54 51 59</Text>
                    <Text selectable style={styles.number}>+33 6 58 84 49 92</Text>
                    <Text selectable style={[styles.number,{color:'red'}]}>+33 7 67 15 24 20</Text>
                    {/* <Text selectable style={styles.number}>+33 7 83 54 92 72</Text>
                    <Text selectable style={styles.number}>+33 7 60 53 19 35</Text> */}
                </View>
            </View>
            <Text style={[styles.subTitle, {marginLeft: 25}]}>Bons Plans</Text>
            <View style={styles.bonplansContainer}>
                <TouchableOpacity onPress={()=>Linking.openURL("https://lhirsute.business.site/")}>
                    <View style={styles.bonplans}>
                        <Image  source={require("../assets/hirsute.png")} style={{ width: "100%", height: "100%",resizeMode: 'cover'}}/>
                        {/* <Text style={styles.bonplansText}> Bons Plans </Text>
                        <Ionicons name="pricetags" size={32} color="white"/> */}
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: "#121212",
        flex: 1
    },
    headerText:{
        color:'white',
        fontSize: 30,
        fontWeight: "bold",
        letterSpacing: 0.5,
        margin: 15
    },
    subTitle:{
        color:'white',
        fontSize: 20,
        fontWeight: "bold",
        textDecorationLine:'underline',
        margin: 15
    },
    socialsContainer:{
        alignItems:'center',
        marginTop: 0,
    },
    socialsRow:{
        flexDirection:'row',
        alignItems:'stretch',
    }, 
    social:{
        flexDirection: 'row',
        alignItems:'center',
        marginVertical: 5,
        marginHorizontal: 10
    },
    socialsText:{
        color:'white',
        fontSize: 16,
        marginLeft: 5
    },
    numberText:{
        color: 'white',
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 15
    },
    number:{
        color:'white',
        fontWeight:'bold',
        fontSize: 20,
        marginBottom: 15
    },
    numbersLeft:{
        flex: 1
    },
    numbersRight:{
        flex:1
    },
    bonplansContainer:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        
    },
    bonplans:{
        flexDirection:'row',
        width: Dimensions.get("window").width*0.8,
        height: "70%",
        borderRadius: 10,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:"#121212",
        overflow:"hidden",
        minHeight:150
    },
    bonplansText:{
        color:'white',
        fontWeight:'bold',
        fontSize: 36
    },
    modalContainer:{
        backgroundColor:'white',
        flex:1,
        width:'100%'
    }
})

export default InfosScreen