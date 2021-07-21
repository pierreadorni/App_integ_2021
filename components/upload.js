import React from "react";
import {StyleSheet, View, Text, RefreshControl,ActivityIndicator, ScrollView, Image, FlatList, DeviceEventEmitter, ImageBackground} from "react-native";
import { IconButton, Colors } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import ItemDefi from "./itemDefi";


class Home extends React.Component{

    constructor(props) {
        super(props);
        this.state={
          defis: [],
          refreshing: false
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

    async _checkStatus(){
      this.state.defis.forEach(async (defi)=>{
        if (defi.status == 1){
          let response = await fetch('http://assos.utc.fr/integ/integ2021/api/check_status.php?id='+defi.id);
          let data = await response.json();
          let status = parseInt(data['data'])
          if (status != defi.status){
            defi.status = status;
            this._saveDefi(defi);
          }
        }
      })
    }
    _totalPoints(){
      let total = 0;
      this.state.defis.forEach((defi)=>{
        console.log('status:'+defi.status);
        if (defi.status==2){
          total += defi.defi.points * defi.nb;
        }
      })
      return total;
    }
    _nDefis(){
      return this.state.defis.length;
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

    onRefresh(){
      this.setState({refreshing: true});
      this._checkStatus().then(()=>{
        this.setState({refreshing: false});
      })
      
    }

    render(){
      //(JSON.stringify(this.state.defis));
        return (
          <View style={styles.container}>
            
              <ImageBackground source={{ uri: "http://assos.utc.fr/integ/integ2021/img/background2.jpg" }} resizeMode="cover" style={styles.header} imageStyle={{width:400}}>
                <View style={styles.headerInside}>
                  <View style={styles.headerNumberContainer}>
                    <Text style={styles.headerNumber}>{this._totalPoints()}</Text>
                    <Text style={styles.headerText}>Points Gagnés</Text>
                  </View>
                  <View style={styles.headerMiddle}>
                    <View style={{backgroundColor:'#ffffff', height:80,width:2,marginTop:10}}></View>
                  </View>
                  <View style={styles.headerNumberContainer}>
                    <Text style={styles.headerNumber}>{this._nDefis()}</Text>
                    <Text style={styles.headerText}>Défis</Text>
                  </View>
                </View>

              </ImageBackground>
            
            <Text style={styles.title}>Défis</Text>
            <View>
              <FlatList
                  refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={()=>{this.onRefresh()}} />}
                  style={{width: '100%'}}
                  data={this.state.defis}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({item}) => <ItemDefi defi={item}/>}
              />
            </View>
            
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
  header:{
    height: 100,
    width:'80%',
    marginLeft: '10%',
    marginTop: 20,
    marginBottom: 20,
    borderRadius:20,
    overflow:'hidden',
  },
  headerInside:{
    flexDirection:'row',
    backgroundColor: "rgba(0,0,0,0.5)",
    height:'100%',
  },

  headerSeparator:{
    height: 60,
    width:2,
    backgroundColor:'white',
    color:'white',
    borderColor:'white',
    marginTop: 20,

  },
  headerNumberContainer:{
    flex:4,
    alignItems:'center',
    justifyContent:'center',
  },
  headerNumber:{
    color:"white",
    fontWeight:'bold',
    fontSize:40
  },
  headerMiddle:{
    flex:1,
    alignItems:'center',
  },
  headerText:{
    color:'white'
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
