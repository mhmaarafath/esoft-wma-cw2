import React, { useContext, useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Image, Dimensions, ScrollView } from 'react-native'
import GlobalStyles from '../utils/GlobalStyles'
import { Entypo, AntDesign, EvilIcons } from '@expo/vector-icons'; 
import axiosConfig from '../helpers/axiosConfig';
import { Avatar, Button, Card, Title, Paragraph, Caption, Banner, IconButton, Snackbar } from 'react-native-paper';

import { format } from 'date-fns';
import { Modalize } from 'react-native-modalize';
import { AuthContext } from '../context/AuthProvider';
import GlobalVariables from '../utils/GlobalVariables';
import CardComponent from '../components/CardComponent';
import { GlobalContext } from '../context/GlobalProvider';



export default function TweetScreen({navigation, route}) {
    const modalizeRef = useRef(null);
    const [tweet, setTweet] = useState(null);
    const [isLoading, setisLoading] = useState(true);
    const {user} = useContext(AuthContext);
    

    const {visible, setVisible} = useContext(GlobalContext);

    useEffect(()=>{
        getTweet();
    }, []);


    function getTweet(){
        axiosConfig.get(`/tweets/${route.params.tweetId}`)
        .then(response => {
            setTweet(response.data)
            console.log(response.data);
            setisLoading(false)
        })
        .catch(error => setisLoading(false))
    }

    function showAlert(){
        Alert.alert('Delete this tweet ?', null, [
            {
                text: 'Cancel',
                onPress: ()=> {
                    console.log('canceled');
                },
                style: 'cancel'
            },
            {
                text: 'OK',
                onPress: () => deleteTweet(),
                style: 'default'
            }
        ])
    }

    function deleteTweet(){
        axiosConfig.delete(`/tweets/${route.params.tweetId}`, {headers: {'Authorization': `Bearer ${user.token}`} })
        .then((response) => {
            Alert.alert('Tweet deleted successfully')
            modalizeRef.current?.close()
            navigation.navigate('Home', {
                tweetDeleted : true
            })

        })
        .catch(error => {
            console.log(error.response)
        })
    }


    return(
        <View style={GlobalStyles.container}>
            {isLoading ?      
                (
                    <ActivityIndicator style={{marginTop: 8}} size="large" color="gray" />
                ):(
                    <>
    
                        <CardComponent item={tweet} page='Tweet'/>

                        <Snackbar
                            style={{marginTop: 20}}
                            visible={visible}
                            onDismiss={()=> setVisible(false)}
                            action={{
                                label: 'Delete',
                                onPress: () => showAlert()
                            }}>
                            Delete Tweet
                        </Snackbar>

                    </>
                )
            }
        </View>
    )

}
