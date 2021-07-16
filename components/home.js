import React from "react";
import {StyleSheet, View, Text, ActivityIndicator, ScrollView, Image} from "react-native";

class Home extends React.Component{
    constructor(props){
            super(props);
    }
    render(){
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#121212" }}>
            <Text style={{color: "white"}}>Home!</Text>
          </View>
        );
    }
}

export default Home;
