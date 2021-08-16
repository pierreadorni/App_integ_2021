import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import React from 'react';
import {View, StyleSheet, Text, Animated} from 'react-native';
import {BoxShadow} from 'react-native-shadow'

/*
j'ai mis les barres de points dans un component 
pour pouvoir éventuellement à l'avenir rajouter
un  deuxième component 'feed de défis' qui afficherait
tous les défis envoyés en temps réel sur le screen des points.
*/

class PointsBars extends React.Component{
    state = {
        displayedPoints:{
            'kb':0,
            'youa':0,
            'tampi':0,
            'vb':0
        },

    }

    colors={
        'kb':'#D22730',
        'vb':'#44D62C',
        'tampi':'#E0E722',
        'youa':'#4D4DFF'
    }

    getHeights(points){
        const maxHeight = this.props.maxHeight;
        //hauteur absolue
        if (Math.max(...Object.keys(points).map((key)=>points[key]))/2 < maxHeight){
            return ({
                'kb': points['kb']/2,
                'vb': points['vb']/2,
                'tampi': points['tampi']/2,
                'youa': points['youa']/2
            })
        }
        //hauteur relative
        let clans = ['kb','vb','tampi','youa'];
        let maxKey = "kb";
        let maxValue = 0;
        let heights = {};
        Object.keys(points).forEach((key)=>{
            if (points[key] > maxValue){
                maxKey = key;
                maxValue = points[key];
            }
        })
        console.log(`found max value of ${maxValue} for key=${maxKey}`);
        heights[maxKey] = maxHeight;
        clans.filter((value)=>value!=maxKey).forEach((key) => {
            const val = points[key];
            heights[key] = Math.round(maxHeight*(val/maxValue));
        })
        return(heights)
    }

    componentDidMount(){
        console.log(this.getHeights(this.props.points))
        this.setState({
            displayedPoints:this.getHeights(this.props.points)
        })  
    }
    componentWillReceiveProps(nextProps){
        console.log(this.getHeights(nextProps.points))
        this.setState({
            displayedPoints:this.getHeights(nextProps.points)
        })  
    }

    render() {
        return(
            <View style={styles.container}>
                <View>
                    <Text style={{color:this.colors['kb'], textAlign:'center', marginBottom: 20, fontSize:16, fontWeight:'bold'}}>{this.props.points['kb']}</Text>
                    <BoxShadow setting={{width:20, height:Math.max(this.state.displayedPoints['kb'],20), color:this.colors['kb'], border:20,radius:10,opacity:0.5,x:0,y:0,style:{marginHorizontal:20}}}>
                        
                        <BoxShadow setting={{width:20, height:Math.max(this.state.displayedPoints['kb'],20), color:'#fff', border:0,radius:10,opacity:0.8,x:0,y:0,}}>
                            <View style={[styles.bar, {borderColor:this.colors['kb'],height:Math.max(this.state.displayedPoints['kb'],20)}]} ></View>
                        </BoxShadow>
                    </BoxShadow>
                </View>

                <View>
                    <Text style={{color:this.colors['vb'], textAlign:'center', marginBottom: 20, fontSize:16, fontWeight:'bold'}}>{this.props.points['vb']}</Text>
                    <BoxShadow setting={{width:20, height:Math.max(this.state.displayedPoints['vb'],20), color:this.colors['vb'], border:20,radius:10,opacity:0.5,x:0,y:0,style:{marginHorizontal:20}}}>
                        <BoxShadow setting={{width:20, height:Math.max(this.state.displayedPoints['vb'],20), color:'#fff', border:0,radius:10,opacity:0.8,x:0,y:0,}}>
                            <View style={[styles.bar, {borderColor:this.colors['vb'],height:Math.max(this.state.displayedPoints['vb'],20)}]} ></View>
                        </BoxShadow>
                    </BoxShadow>
                </View>

                <View>
                    <Text style={{color:this.colors['tampi'], textAlign:'center', marginBottom: 20, fontSize:16, fontWeight:'bold'}}>{this.props.points['tampi']}</Text>
                    <BoxShadow setting={{width:20, height:Math.max(this.state.displayedPoints['tampi'],20), color:this.colors['tampi'], border:20,radius:10,opacity:0.5,x:0,y:0,style:{marginHorizontal:20}}}>
                        <BoxShadow setting={{width:20, height:Math.max(this.state.displayedPoints['tampi'],20), color:'#fff', border:0,radius:10,opacity:0.8,x:0,y:0,}}>
                            <View style={[styles.bar, {borderColor:this.colors['tampi'],height:Math.max(this.state.displayedPoints['tampi'],20)}]} ></View>
                        </BoxShadow>
                    </BoxShadow>
                </View>


                <View>
                    <Text style={{color:this.colors['youa'], textAlign:'center', marginBottom: 20, fontSize:16, fontWeight:'bold'}}>{this.props.points['youa']}</Text>
                    <BoxShadow setting={{width:20, height:Math.max(this.state.displayedPoints['youa'],20), color:this.colors['youa'], border:20,radius:10,opacity:0.5,x:0,y:0,style:{marginHorizontal:20}}}>
                        <BoxShadow setting={{width:20, height:Math.max(this.state.displayedPoints['youa'],20), color:'#fff', border:0,radius:10,opacity:0.8,x:0,y:0,}}>
                            <View style={[styles.bar, {borderColor:this.colors['youa'],height:Math.max(this.state.displayedPoints['youa'],20)}]} ></View>
                        </BoxShadow>
                    </BoxShadow>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        width: '100%',
        flex:1,
        backgroundColor:'#121212',
        alignItems:'flex-end',
        justifyContent:'space-between',
        flexDirection:'row',
        paddingBottom:50,
        paddingHorizontal: "10%"
    },
    bar:{
        width:20,
        borderRadius: 8,
        borderWidth:2,
    },

})


export default PointsBars