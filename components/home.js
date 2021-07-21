import React from "react";
import {StyleSheet, View, Text, ActivityIndicator, ScrollView, Image} from "react-native";

class Home extends React.Component{
    constructor(props){
            super(props);
    }
    render(){
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#121212" }}>
            <Text style={{color: "white"}}>coucou tm!</Text>
            <Image source={{uri:"https://assos.utc.fr/integ/jambon67/images/helene1.jpg"}} style={{width: 100,height:100}}></Image>
            <Text style={{color: "white"}}>tu penses quoi de la page d'accueil?</Text>
            <Text style={{color: "white"}}>trigano au cachot </Text>
            <Text></Text>
          </View>
        );
    }
}

export default Home;
