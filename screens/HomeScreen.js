import React, { useContext, useEffect, useRef, useState } from 'react'
import { View, Text, Button, StyleSheet, FlatList, Image, TouchableOpacity, Platform, ActivityIndicator } from 'react-native'
import { EvilIcons, AntDesign } from '@expo/vector-icons';
import GlobalStyles from '../utils/GlobalStyles';

import axiosConfig from '../helpers/axiosConfig';
import CardComponent from '../components/CardComponent';
import { AuthContext } from '../context/AuthProvider';
import {DefaultTheme, FAB } from 'react-native-paper';

import AsyncStorage from '@react-native-async-storage/async-storage';


export default function HomeScreen({navigation, route}) {

    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [isLastPage, setIsLastPage] = useState(false)
    const flastListRef = useRef();

    const {user} = useContext(AuthContext);

    useEffect(()=>{
        getAllTweets();
    }, [page, user]);



    useEffect(()=>{
        if(route.params?.newTweetAdded || route.params?.tweetDeleted){
            getAllTweetRefresh();
            flastListRef.current.scrollToOffset({
                offset: 0
            })
        }
    }, [route.params?.newTweetAdded, route.params?.tweetDeleted,]);

    async function storeLocal(){
        await AsyncStorage.setItem('data', JSON.stringify(data));
    }
    async function getLocal(){
        const resopnse = await AsyncStorage.getItem('data');
        setData(JSON.parse(resopnse));
    }

    function handleRefresh(){
        setPage(1);
        setIsLastPage(false);
        setIsRefreshing(true);
        getAllTweets();
    }

    function getAllTweets(){
        axiosConfig.get(`/tweets?page=${page}`, {headers: {'Authorization': `Bearer ${user.token}`} })
        .then((response) => {
            (page > 1) ? setData([...data, ...response.data.data]) : setData(response.data.data)  
            storeLocal();      
            setIsLoading(false);
            setIsRefreshing(false);
            if(response.data.next_page_url == null){
                setIsLastPage(true)
            }
        })
        .catch(error => {
            getLocal();
            console.log(error)
            setIsLoading(false);
            setIsRefreshing(false);
        })
    }

    function getAllTweetRefresh(){
        setPage(1);
        setIsLastPage(false);
        setIsRefreshing(false);
        axiosConfig.get(`/tweets`, {headers: {'Authorization': `Bearer ${user.token}`} })
        .then((response) => {
            setData(response.data.data);
            setIsLoading(false);
            setIsRefreshing(false);
        })
        .catch(error => {
            console.log(error)
            setIsLoading(false);
            setIsRefreshing(false);
        })

    }

    function goToNewTweet(){
        navigation.navigate('New Tweet');
    }

    function handleEnd(){
        if(!isLastPage){
            setPage(page + 1);
        }
    }
    


    return (
        <View style={GlobalStyles.container}>
            {isLoading ?      
            (
                <ActivityIndicator style={{marginTop: 8}} size="large" color="gray" />
            ):
            (
                <FlatList 
                    refreshing={isRefreshing}
                    ref={flastListRef}
                    onRefresh={handleRefresh}
                    onEndReached={handleEnd}
                    onEndReachedThreshold={0}
                    ListFooterComponent={()=> !isLastPage && (<ActivityIndicator size="large" color="gray" />)}
                    data={data} 
                    renderItem={props => <CardComponent {...props}/>} 
                    keyExtractor={item => item.id.toString()} 
                />
            )
            }
                <FAB
                    style={{position: 'absolute',margin: 16,right: 0,bottom: 0}}
                    icon="plus"
                    onPress={goToNewTweet}
                />
        </View>
    )
}
