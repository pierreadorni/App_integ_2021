import * as React from 'react';
import { Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from './screens/home';
import UploadScreen from './screens/upload';
import SecurityScreen from './screens/security';
import newUploadScreen from './screens/newUpload';
import PointsScreen from './screens/points';
import InfosScreen from './screens/infos';
import { RootSiblingParent } from 'react-native-root-siblings';

const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Planning" component={HomeScreen} options={{headerShown :false}}/>
    </HomeStack.Navigator>
  );
}

const UploadStack = createStackNavigator();

function UploadStackScreen() {
  return (
    <UploadStack.Navigator options={{headerShown :false}}>
        <UploadStack.Screen name="Upload" component={UploadScreen} options={{headerShown :false}}/>
        <UploadStack.Screen name="Envoi de défi"  component={newUploadScreen} options={{headerShown :false}}/>
    </UploadStack.Navigator>
  );
}

const VerifStack = createStackNavigator();

function VerifStackScreen() {
  return (
    <VerifStack.Navigator options={{headerShown :false}}>
        <VerifStack.Screen name="Verif" component={SecurityScreen} options={{headerShown :false}}/>
    </VerifStack.Navigator>
  );
}

const InfosStack = createStackNavigator();

function InfosStackScreen(){
  return(
    <InfosStack.Navigator options={{headerShown: false}}>
      <InfosStack.Screen name="Infos" component={InfosScreen} options={{headerShown: false}}/>
    </InfosStack.Navigator>
  );
}

const tabBarIconGap = Dimensions.get('window').height > 810 ? 0 : -7;
const tabBarHeight = Dimensions.get('window').height > 810 ? 80 : 60;

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <RootSiblingParent>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName='Points'
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Planning') {
                iconName = focused ? 'ios-calendar' : 'ios-calendar-outline';
              } else if (route.name === 'Upload') {
                iconName = focused ? 'cloud-upload' : 'cloud-upload-outline';
              } else if (route.name === "Verif") {
                iconName = focused ? "checkmark-circle" : "checkmark-circle-outline";
              } else if (route.name === "Points"){
                iconName = focused ? "podium": "podium-outline";
              } else if (route.name === 'Infos'){
                iconName = focused ? "information-circle": "information-circle-outline";
              }

              return <Ionicons name={iconName} size={size} color={color} style={{backgroundColor: "#2C2C2C"}}/>;
            }
          })}
          tabBarOptions={{
            activeTintColor: '#EA8BDE',
            inactiveTintColor: 'white',
            style: {
              height: tabBarHeight,
              backgroundColor:"#2C2C2C"
            },
            labelStyle:{
              transform: [{translateY: tabBarIconGap}]
            },
            
            
          }}
        >
          <Tab.Screen name="Infos" component={InfosStackScreen} />
          <Tab.Screen name="Planning" component={HomeStackScreen} />
          <Tab.Screen name="Points" component={PointsScreen}/>
          <Tab.Screen name="Upload" component={UploadStackScreen} />
          <Tab.Screen name="Verif" component={VerifStackScreen} />
          
        </Tab.Navigator>
    </NavigationContainer>
    </RootSiblingParent>
    
  );
}
