import * as React from 'react';
import { Button, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from './screens/home';
import UploadScreen from './screens/upload';
import SecurityScreen from './screens/security';
import newUploadScreen from './screens/newUpload';
import { RootSiblingParent } from 'react-native-root-siblings';

const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} options={{headerShown :false}}/>
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

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <RootSiblingParent>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'ios-information-circle' : 'ios-information-circle-outline';
              } else if (route.name === 'Upload') {
                iconName = focused ? 'cloud-upload' : 'cloud-upload-outline';
              } else if (route.name == "Verif") {
                iconName = focused ? "checkmark-circle" : "checkmark-circle-outline";
              }

              return <Ionicons name={iconName} size={size} color={color} style={{backgroundColor: "#2C2C2C"}}/>;
            },
          })}
          tabBarOptions={{
            activeTintColor: '#EA8BDE',
            inactiveTintColor: 'white',
            style: {
              height: 80,
              backgroundColor:"#2C2C2C"
            },
            labelStyle:{
              transform: [{translateY: -15}]
            }
          }}
        >
          <Tab.Screen name="Home" component={HomeStackScreen} />
          <Tab.Screen name="Upload" component={UploadStackScreen} />
          <Tab.Screen name="Verif" component={VerifStackScreen} />
        </Tab.Navigator>
    </NavigationContainer>
    </RootSiblingParent>
    
  );
}
