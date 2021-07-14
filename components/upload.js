import React from "react";
import {StyleSheet, View, Text, ActivityIndicator, ScrollView, Image, FlatList, DeviceEventEmitter} from "react-native";
import { IconButton, Colors } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import ItemDefi from "./itemDefi";


class Home extends React.Component{

    constructor(props) {
        super(props);
        this.state={
          defis: [],
          lastDefis:[]
        }
    }

    _uploadScreen(){
        this.props.navigation.navigate("Envoi de défi");
    }

    _readDefis(){

      FileSystem.getInfoAsync(FileSystem.documentDirectory+'defis_envoyes.json').then((res)=>{
          if (res['exists'] == false){return 0;}
          FileSystem.readAsStringAsync(FileSystem.documentDirectory+'defis_envoyes.json').then((content)=>{  

            if (content !== JSON.stringify(this.state.defis) && this._ismounted){
              this.setState({
                lastDefis: this.state.defis,
                defis: JSON.parse(content)
              })
            } 
          })
      })
    }
    _deleteAllDefis(){
      FileSystem.writeAsStringAsync(FileSystem.documentDirectory+'defis_envoyes.json', '[]');
    }
    
    componentDidMount(){
      DeviceEventEmitter.addListener("event.DefisChanged", () => this._readDefis());
      
      this._readDefis();  
      this._ismounted = true;
      this._deleteAllDefis();
    }
    componentWillUnmount(){
      this._ismounted = false;
    }

    componentDidUpdate(prevProps){
      this._readDefis();
    }

    render(){
      //(JSON.stringify(this.state.defis));
        return (
          <View style={styles.container}>
            <FlatList
                style={{width: '100%'}}
                data={this.state.defis}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => <ItemDefi defi={item}/>}
            />
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
