import React from "react";
import {StyleSheet, View, Text, ActivityIndicator, ScrollView, Image} from "react-native";
import { IconButton, Colors } from 'react-native-paper';

class Home extends React.Component{

    constructor(props) {
        super(props);
    }

    _uploadScreen(){
        this.props.navigation.navigate("Envoi de défi");
    }

    render(){
        return (
          <View style={styles.container}>
            <Text style={styles.title}>Historique</Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
            <View style={styles.centeredContainer}>
                <IconButton style={styles.plusButton} icon='plus-circle' color={Colors.green500} size={50} onPress={() => {this._uploadScreen()}}/>
            </View>
          </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: 'center',
    //justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
    marginTop: 15,
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '90%',
    marginLeft:'5%',
  },
  plusButton:{
    flex:1,
    alignItems: "center",
    position: 'absolute',
    bottom: 20,
  },
  centeredContainer:{
      flex:1,
      alignItems:"center",
  }
});
export default Home;
