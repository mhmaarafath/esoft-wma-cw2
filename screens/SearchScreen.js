import React, { useContext, useEffect, useRef, useState } from 'react'
import { View, Text, Button, StyleSheet, FlatList, Image, TouchableOpacity, Platform, ActivityIndicator } from 'react-native'
import { EvilIcons, AntDesign } from '@expo/vector-icons';
import GlobalStyles from '../utils/GlobalStyles';

import axiosConfig from '../helpers/axiosConfig';
import CardComponent from '../components/CardComponent';
import { AuthContext } from '../context/AuthProvider';


export default function SearchScreen({navigation, route}) {

    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [isLatPage, setIsLastPage] = useState(false)
    const flastListRef = useRef();

    const {user} = useContext(AuthContext);


    useEffect(()=>{
        getAllTweets();
    }, [page]);



    useEffect(()=>{
        if(route.params?.newTweetAdded){
            getAllTweetRefresh();
            flastListRef.current.scrollToOffset({
                offset: 0
            })
        }
    }, [route.params?.newTweetAdded]);

    function handleRefresh(){
        setPage(1);
        setIsLastPage(false);
        setIsRefreshing(true);
        getAllTweets();
    }

    function getAllTweets(){
        axiosConfig.get(`/tweets_all?page=${page}`)
        .then((response) => {
            
            if(page > 1){
                setData([...data, ...response.data.data]);
            } else {
                setData(response.data.data);
            }
            
            setIsLoading(false);
            setIsRefreshing(false);
            if(response.data.next_page_url == null){
                setIsLastPage(true)
            }
        })
        .catch(error => {
            console.log(error)
            setIsLoading(false);
            setIsRefreshing(false);
        })

    }

    function getAllTweetRefresh(){
        setPage(1);
        setIsLastPage(false);
        setIsRefreshing(false);
        axiosConfig.get(`/tweets_all`)
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
        if(!isLatPage){
            setPage(page + 1);
        }
    }
    


    return (
        <View style={GlobalStyles.container}>
            {console.log('Test')}
            {isLoading ?      
            (
            <ActivityIndicator
                style={{marginTop: 8}}
            size="large" color="gray" />
            ):
            (
            <FlatList 
                refreshing={isRefreshing}
                ref={flastListRef}
                onRefresh={handleRefresh}
                onEndReached={handleEnd}
                onEndReachedThreshold={0}
                ListFooterComponent={()=> !isLatPage && (<ActivityIndicator
                    size="large"
                    color="gray"
                />)}
                ItemSeparatorComponent={() => (<View style={GlobalStyles.tweetSeparator}></View>)}
                data={data} 
                renderItem={props => <CardComponent {...props}/>} 
                keyExtractor={item => item.id.toString()} 
            />
            )
            }
            <TouchableOpacity
                style={styles.floatingButton}
                onPress={goToNewTweet}
            >
                <AntDesign name='plus' size={26} color="white"/>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    floatingButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1d9bf1',
        position: 'absolute',
        bottom: 20,
        right: 12
    }
});