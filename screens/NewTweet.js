import { NavigationRouteContext } from '@react-navigation/native'
import React, {useContext, useEffect, useState} from 'react'
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Image, Alert, useWindowDimensions, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { AuthContext } from '../context/AuthProvider'
import axiosConfig from '../helpers/axiosConfig'

import GlobalStyles from '../utils/GlobalStyles'

import { Camera } from 'expo-camera';
import { Avatar, Caption, Card, Paragraph, Title, Button, TextInput} from 'react-native-paper'
import * as Location from 'expo-location';




export default function NewTweet({navigation}) {
    const [isLoading, setIsLoading] = useState(false);
    const [tweet, setTweet] = useState('')
    const {user} = useContext(AuthContext);

    const { height, width } = useWindowDimensions();




    // const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [cam, setCam] = useState(null);
    const [image, setImage] = useState(null);
    const [location, setLocation] = useState(null);

    const title = `Character left : ${280 - tweet.length}`
  

    useEffect(() => {
        getCameraPermission();
        getLocationPermission();
        getLocation()
      }, []);


    async function getCameraPermission(){
        const { status } = await Camera.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            setErrorMessage('Permission to access camera was denied');
            return;
        }
    }

    async function takePicture(){
        if(cam){
            const data = await cam.takePictureAsync({quality: 0.5});
            setImage(data.uri);
        }
    }


    async function getLocationPermission(){
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMessage('Permission to access location was denied');
            return;
        }
    }

    async function getLocation(){
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location.coords);
        console.log(location.coords)
    }


    function takeAnother(){
        setImage(null);
    }



    async function sendTweet(){
        if(tweet.length == 0){
            Alert.alert('Please enter a tweet');
            return;
        }
        
        setIsLoading(true);
        
        const formData = new FormData();
        image ? formData.append("photo", {type: 'image/jpg', uri:Platform.OS === 'ios' ? image.replace('file://', '') : image, name:'uploaded.jpg'}) : formData.append('photo', null);
        const body = {
            body: tweet,
            latitude: location.latitude,
            longitude: location.longitude,
        }
        Object.keys(body).forEach((key) => {
            formData.append(key, body[key]);
        });

        axiosConfig.post(`/tweets`, formData, {headers: {'Content-Type': 'multipart/form-data','Authorization': `Bearer ${user.token}`} })
        .then((response) => {
            console.log(response.data)
            setIsLoading(false)
            navigation.navigate('Home', {
                newTweetAdded: response.data,
            })            
        })
        .catch(error => {
            console.log(error.response.data)
            setIsLoading(false);
        })
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[GlobalStyles.container, {justifyContent: 'space-around'}]}>               
            {location && (
                <>
                <View style={{width: width, height: width}}>
                    {
                        image ? 
                        (
                            <Image source={{uri: image}} style={GlobalStyles.fixedRatio}/>
                        ) : (
                            <Camera ref={ref => setCam(ref)} style={GlobalStyles.fixedRatio} type={type} ratio='1:1'/>
                        )
                    }
                </View>
                
                <Card>
                    <Card.Actions>
                        {
                            image ? 
                            (
                                <Button onPress={()=> takeAnother()} >Take Another</Button>
                            ) : (
                                <>
                                    <Button onPress={() => setType( type === Camera.Constants.Type.back ? Camera.Constants.Type.front: Camera.Constants.Type.back)}>Flip</Button>
                                    <Button onPress={()=> takePicture()}>Capture</Button>
                                </>
                            )
                        }
                    </Card.Actions>
                </Card>
                <Card>
                    <Card.Title style={{color: tweet.length > 250 ? 'red' : 'black'}} title={title}/>
                    <Card.Content>
                        <TextInput 
                            label='Tweet'
                            onChangeText={setTweet} 
                            value={tweet} 
                            multiline 
                            maxLength={280}
                        />
                    </Card.Content>
                    <Card.Actions style={{justifyContent: 'flex-end', marginRight: 10}}>
                            <Button
                                mode='contained'
                                icon={(props)=> isLoading ? <ActivityIndicator size='small' {...props} animating={isLoading} /> : null}
                                onPress={sendTweet}
                                disabled={isLoading}
                            >
                                Tweet
                            </Button>
                    </Card.Actions>

                </Card>
                </>
            )}
            </View>
            
        </TouchableWithoutFeedback>
    )
}
