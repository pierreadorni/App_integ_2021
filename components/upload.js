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
        }
    }

    _uploadScreen(){
        this.props.navigation.navigate("Envoi de défi");
    }


    async _readDefisAsync(){
      let res = await FileSystem.getInfoAsync(FileSystem.documentDirectory+'defis_envoyes.json');
      if (res['exists'] == false){return 0;}
      let content = await FileSystem.readAsStringAsync(FileSystem.documentDirectory+'defis_envoyes.json');
      return content
    }

    _readDefis(){

      FileSystem.getInfoAsync(FileSystem.documentDirectory+'defis_envoyes.json').then((res)=>{
          if (res['exists'] == false){return 0;}
          FileSystem.readAsStringAsync(FileSystem.documentDirectory+'defis_envoyes.json').then((content)=>{  

            if (content !== JSON.stringify(this.state.defis) && this._ismounted){
              this.setState({
                defis: JSON.parse(content)
              })
            } 
          })
      })
    }

    async _saveDefi(defi){
        
      let defisStr = await this._readDefisAsync();
      let defis = JSON.parse(defisStr);

      if (typeof defis != 'object'){
        defis = []
      }
      
      let found = 0;

      for(let i=0;i<defis.length;i++){
        if (defis[i].id == defi.id || defis[i].id == defi.localId){
          found = 1;
          defis[i] = defi;
        }
      }

      if (!found){
        defis.push(defi);
      }
      await FileSystem.writeAsStringAsync(FileSystem.documentDirectory+'defis_envoyes.json', JSON.stringify(defis));
      DeviceEventEmitter.emit("event.DefisChanged", {});
  }

    _deleteAllDefis(){
      FileSystem.writeAsStringAsync(FileSystem.documentDirectory+'defis_envoyes.json', '[]');
    }

    _checkStatus(){
      this.state.defis.forEach((defi)=>{
        if (defi.status == 1){
          fetch('http://assos.utc.fr/integ/integ2021/api/check_status.php?id='+defi.id)
        .then(response => response.json())
        .then(data => {
          let status = parseInt(data['data'])
          console.log('id='+defi.id+', status='+status);
          if (status != defi.status){
            defi.status = status;
            this._saveDefi(defi);
          }
        });
        }
      })
    }
    
    componentDidMount(){
      DeviceEventEmitter.addListener("event.DefisChanged", () => this._readDefis());
      this._ismounted = true;
      this._readDefis();
      //this._deleteAllDefis();
    }
    componentWillUnmount(){
      this._ismounted = false;
    }

    componentDidUpdate(prevProps){
      this._readDefis();
      this._checkStatus();
    }

    render(){
      //(JSON.stringify(this.state.defis));
        return (
          <View style={styles.container}>
            <Text style={styles.title}>Défis</Text>
            <FlatList
                style={{width: '100%'}}
                data={this.state.defis}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => <ItemDefi defi={item}/>}
            />
            <View style={styles.centeredContainer}>
                <IconButton style={styles.plusButton} icon='plus-circle' color="#EA8BDE" size={50} onPress={() => {this._uploadScreen()}}/>
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
    backgroundColor: "#121212",
    //paddingTop: 50
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
    color:'white'
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
