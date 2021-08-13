import React from 'react';
import {View, StyleSheet, Dimensions, SafeAreaView, Text, ActivityIndicator,} from 'react-native';
import PointsBars from '../components/pointsBars';


/*
à faire: ne pas render les barres tant que les points n'ont pas été récupérés du server.
*/

class PointsScreen extends React.Component{
    state = {
        points: {},
        ranking : ['kb','vb','tampi','youa']
    }

    colors={
        'kb':'#D22730',
        'vb':'#44D62C',
        'tampi':'#E0E722',
        'youa':'#4D4DFF'
    }
    names={
        'kb': 'Klarf Binn',
        'vb': 'Varelbor',
        'tampi': 'Tampilaguul',
        'youa': 'Youarille'
    }

    _getRanking(){
        let ranking = [];
        let arr = Object.keys(this.state.points);
        for (let i=0; i < 4; i++){
            let maxVal = 0;
            let maxKey = "kb";
            arr.forEach(key=>{
                const val = this.state.points[key];
                if (val >= maxVal){
                    maxVal = val;
                    maxKey = key;
                }
            })
            ranking.push(maxKey);
            arr = arr.filter((value)=>value!=maxKey);
        }
        return ranking;
    }

    async _getPoints(){
        let points = await fetch('https://assos.utc.fr/integ/integ2021/api/get_points.php');
        points = await points.json();
        this.setState({points});
    }

    _renderRanking(rank){
        const clan = this.state.ranking[rank];

        return (
            <Text
                style={{
                    color:this.colors[clan],
                    fontSize: 28-4*(rank)

                }}
            > 
            #{rank+1} : {this.names[clan]}
            </Text>
        )
    }

    _renderPointsBars(){
        if (Object.keys(this.state.points).length > 0){
            return(
                <PointsBars points={this.state.points} maxHeight={Dimensions.get("window").height*0.4}/>
            )
        }else{
            return(
                <View style={{flex:1, justifyContent: 'center'}}>
                    <ActivityIndicator size="large" color="#EB62BC"/>
                </View>
                
            )
        }
    }

    _renderPodium(){
        if (Object.keys(this.state.points).length > 0){
            return(
                <View style={{alignItems:'center',}}>
                    {this._renderRanking(0)}
                    {this._renderRanking(1)}
                    {this._renderRanking(2)}
                    {this._renderRanking(3)}
                </View>
            )
        }else{
            return(
                <View style={{flex:1, justifyContent: 'center'}}>
                    <ActivityIndicator size="large" color="#EB62BC"/>
                </View>
                
            )
        }
    }


    componentDidMount(){
        this._getPoints().then(()=>{
            this.setState({
                ranking: this._getRanking()
            })
        })        
    }

    render(){
        return(
            <SafeAreaView style={{backgroundColor: "#121212", flex:1}}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}> Podium </Text>
                </View>
                <View style={styles.podiumContainer}>
                    {this._renderPodium()}
                </View>
                <View style={styles.pointsContainer}>
                    {this._renderPointsBars()}
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    headerContainer:{
        flex: 1
    },
    headerText:{
        color:'white',
        fontSize: 30,
        fontWeight: "bold",
        letterSpacing: 0.5,
        margin: 15
    },
    podiumContainer:{
        backgroundColor:"#121212",
        flex:2,
        alignItems:'center',
        justifyContent:'center',
        borderWidth:1,
        borderColor: "#EA8BDE",
        borderRadius: 10,
        margin: 20,
    },
    pointsContainer:{
        backgroundColor:"#121212",
         flex:5
    } 

});

export default PointsScreen;