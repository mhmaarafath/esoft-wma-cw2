import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Button, TextInput, FlatList, StyleSheet, Text, View, Alert, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons, AntDesign, Entypo } from '@expo/vector-icons';
import react, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';


import HomeScreen from './screens/HomeScreen';
import NewTweet from './screens/NewTweet';
import ProfileScreen from './screens/ProfileScreen';
import TweetScreen from './screens/TweetScreen';
import SettingsScreen from './screens/SettingsScreen';
import SearchScreen from './screens/SearchScreen';
import { AuthContext } from './context/AuthProvider';
import LoginScreen from './screens/Auth/LoginScreen';
import RegisterScreen from './screens/Auth/RegisterScreen';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { Appbar, Colors, DarkTheme, DefaultTheme, Menu, useTheme } from 'react-native-paper';
import { RotateOutUpLeft } from 'react-native-reanimated';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MapScreen from './screens/MapScreen';


const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const Drawer = createDrawerNavigator();

function CustomNavigationBar(props){

  const [visible, setVisible] = useState(true);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const {user, logout} = useContext(AuthContext);

  return (
    <Appbar.Header>
      {props.back ? <Appbar.BackAction onPress={props.navigation.goBack} /> : null}
      <Appbar.Content title={props.options.title ?? props.route.name} />
      {!props.back &&
        (
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <Appbar.Action icon="menu" color="white" onPress={openMenu} />
            }>
            <Menu.Item onPress={() => {closeMenu(); props.navigation.navigate('Settings')}} title="Settings" />
            <Menu.Item onPress={() => logout()} title="Logout" />
          </Menu>
        )
      }
      
    </Appbar.Header>
  )
}


function HomeStackNavigator(){

  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <CustomNavigationBar {...props}/>,
      }}

    >
      <Stack.Screen name="Tab" options={{ title: 'Tweets' }} component={TabNavigator} />
      <Stack.Screen  name="New Tweet" component={NewTweet} />
      <Stack.Screen  name="Tweet Screen" component={TweetScreen} />
      <Stack.Screen  name="Profile Screen" component={ProfileScreen} />
      <Stack.Screen  name="Settings" component={SettingsScreen} />
    </Stack.Navigator>

  )
}

function AuthStackNavigator(){
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen  name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  )
}


function TabNavigator(){
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} 
        options={{
          tabBarIcon: ({color, size}) => (
            <AntDesign name="home" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen name="Search" component={SearchScreen} 
          options={{
            tabBarIcon: ({color, size}) => (
              <AntDesign name="search1" size={size} color={color} />
            )
          }}
      />
      <Tab.Screen name="Map" component={MapScreen} 
          options={{
            tabBarIcon: ({color, size}) => (
              <Entypo name="map" size={size} color={color} />
            )
          }}
      />
    </Tab.Navigator>
  )
}


export default function Root({theme}) {
  const [isLoading, setIsLoading] = useState(true);
  const {user, setUser} = useContext(AuthContext)


  useEffect(()=>{
    SecureStore.getItemAsync('user')
    .then(userString => {
      if(userString){
        setUser(JSON.parse(userString))
      }
      setIsLoading(false);
    })
    .catch(error => {
      console.log(error)
      setIsLoading(false);
    })
  }, []);

  if(isLoading){
    return (
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <ActivityIndicator size="large" color="gray"/>
      </View>
    )
  }


  return (
    <>
    { user ?
      (
        
        <NavigationContainer theme={theme}>      
          <HomeStackNavigator/>
        </NavigationContainer>

      ) : (
        <NavigationContainer>
          <AuthStackNavigator/>
        </NavigationContainer>
      )
    }
    </>
  );
}
