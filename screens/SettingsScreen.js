import React, { useContext, useEffect, useState } from 'react'
import { View, Text, TouchableWithoutFeedback, Keyboard, useWindowDimensions, Image, Alert } from 'react-native'
import { Card, Button, Title, Paragraph, TextInput, ActivityIndicator, Avatar } from 'react-native-paper'
import ErrorComponent from '../components/ErrorComponent'
import { AuthContext } from '../context/AuthProvider'
import axiosConfig from '../helpers/axiosConfig'
import GlobalStyles from '../utils/GlobalStyles'
import GlobalVariables from '../utils/GlobalVariables'
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';



export default function SettingsScreen({route, navigation}) {
    const {logout} = useContext(AuthContext)
    const {user, setUser} = useContext(AuthContext);

    const [userData, setUserData] = useState({});
    const [name, setName] = useState('');
    const [profile, setProfile] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [image, setImage] = useState(null);


    const { height, width } = useWindowDimensions();

    useEffect(()=>{
        getProfile();
        console.log('From UseEffect')
        console.log(userData)
    }, []);


    function getProfile(){
        setIsLoading(true)
        axiosConfig.get(`/users/${user.id}`, {headers: {'Authorization': `Bearer ${user.token}`} })
        .then(response => {
            setUserData({...response.data})
            setIsLoading(false)
        })
        .catch(error => setIsLoading(false))
    }

    async function pickImage(){
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.5,
        });
    
        if (!result.cancelled) {
          setImage(result.uri);
          console.log(result.uri);
        }
      };


    function update(){
        setIsLoading(true)
        const formData = new FormData();
        image ? formData.append("photo", {type: 'image/jpg', uri:Platform.OS === 'ios' ? image.replace('file://', '') : image, name:'uploaded.jpg'}) : formData.append('photo', null);
        formData.append('_method', 'PUT')
        const body = {...userData}
        Object.keys(body).forEach((key) => {
            formData.append(key, body[key]);
        });
        console.log(formData);

        axiosConfig.post(`/users/${user.id}`, formData, {headers: {'Content-Type': 'multipart/form-data','Authorization': `Bearer ${user.token}`} })
        .then(response => {
            // console.log({...user, ...response.data})
            console.log('arafth', response)
            setUser({...user, ...response.data});
            setError(null);
            SecureStore.setItemAsync('user', JSON.stringify({...user, ...response.data}));
            navigation.navigate('Profile Screen', {
                userId : user.id
            });
            setError(null);
            setIsLoading(false)
        })
        .catch(error => {
            console.log(error);
            setError(error);
            setIsLoading(false);
        })

    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[GlobalStyles.container, GlobalStyles.center]}>
            {isLoading ?      
                (
                    <ActivityIndicator style={{marginTop: 8}} size="large" color="gray" />
                ):(
                    <View style={{width: width - 50}}>

                        <View style={GlobalStyles.center}>
                        <Avatar.Image source={{uri: image ?? user.avatar}} size={200}/>
                        <Button onPress={pickImage} icon='camera'>Pick an image gallery</Button>
                        </View>
                        <View style={{alignItems: 'center'}}>
                            {error && <ErrorComponent error={error}/>}
                        </View>
                        <TextInput
                            label='Name'
                            style={[GlobalStyles.mt4]}
                            onChangeText={(name)=> setUserData({...userData, name: name})}
                            value={userData.name}
                        />
                        <TextInput
                            label='Profile'
                            multiline
                            style={[GlobalStyles.mt4]}
                            onChangeText={(profile)=> setUserData({...userData, profile: profile})}
                            value={userData.profile}
                        />
                        <Button
                            mode='contained'
                            icon={(props)=> <ActivityIndicator size='small' {...props} animating={isLoading} />}
                            style={[GlobalStyles.mt5]}
                            onPress={()=>update()}
                        >
                            Update
                        </Button>
                    </View>
                )
            }
            </View>
        </TouchableWithoutFeedback>


    )
}
