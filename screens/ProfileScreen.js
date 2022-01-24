import React, { useContext, useEffect, useRef, useState } from 'react'
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Linking, ActivityIndicator, Alert } from 'react-native'
import GlobalStyles from '../utils/GlobalStyles'
import { EvilIcons } from '@expo/vector-icons';
import axiosConfig from '../helpers/axiosConfig';
import { format } from 'date-fns';
import { AuthContext } from '../context/AuthProvider';
import CardComponent from '../components/CardComponent';
import { Avatar, Button, Caption, Card, Paragraph, Title } from 'react-native-paper';


export default function ProfileScreen({navigation, route}) {

    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true);

    const [data, setData] = useState([])
    const [isLoadingTweets, setIsLoadingTweets] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [isLatPage, setIsLastPage] = useState(false)
    // const flastListRef = useRef();
    const [isFollowing, setIsFollowing] = useState(false);
    const {user: userFromContext} = useContext(AuthContext);



    useEffect(()=>{
        getUserProfile();
        getUserTweets();
    }, [page]);


    useEffect(()=>{
        getIsFollowing();
    }, []);

    function userFollow(userId){
        axiosConfig.defaults.headers.common['Authorization'] = `Bearer ${userFromContext.token}`
        axiosConfig.post(`/follow/${route.params.userId}`)
        .then((response) => {
            console.log(response.data)
            setIsFollowing(true);
            Alert.alert('You are following this user')
        })
        .catch(error => {
            console.log(error.response)
        })

    }

    function userUnfollow(userId){
        axiosConfig.defaults.headers.common['Authorization'] = `Bearer ${userFromContext.token}`
        axiosConfig.post(`/unfollow/${route.params.userId}`)
        .then((response) => {
            console.log(response.data)
            setIsFollowing(false);
            Alert.alert('You are unfollowing this user')
        })
        .catch(error => {
            console.log(error.response)
        })

    }



    function profileHeader(){
        return (
            <View style={GlobalStyles.container}>
                <Card>
                    <Card.Cover source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} style={{height: 100}} />
                    
                    <View style={styles.avatarContainer}>
                        <Avatar.Image source={{uri: user.avatar}}/>
                        {userFromContext.id != route.params.userId &&
                        (
                            <View>
                                {isFollowing ? 
                                    (
                                    <TouchableOpacity style={styles.followButton}
                                        onPress={()=> userUnfollow(route.params.userId)}
                                    >
                                        <Text style={styles.followButtonText}>Unfollow</Text>
                                    </TouchableOpacity>
                                    ) : (
                                    <TouchableOpacity style={styles.followButton}
                                        onPress={()=> userFollow(route.params.userId)}
                                    >
                                        <Text style={styles.followButtonText}>Follow</Text>
                                    </TouchableOpacity>

                                    )
                                }
                            </View>
                            )
                        }
                    </View>


                    <Card.Content>
                        <Title style={{fontWeight: 'bold'}}>{user.name}</Title>
                        <Paragraph>@{user.username}</Paragraph>
                    </Card.Content>
                    <Card.Content style={{marginTop: 10}}>
                        <Paragraph>{user.profile}</Paragraph>
                        <View style={GlobalStyles.flexRow}>
                            <EvilIcons name="calendar" size={24} color="grey"/>
                            <Caption style={GlobalStyles.textGray}>Joined {format(new Date(user.created_at), 'MMM yyyy')}</Caption>
                        </View>
                    </Card.Content>

                    <Card.Actions>
                        <Paragraph style={{fontWeight: 'bold'}}>509</Paragraph>
                        <Paragraph style={GlobalStyles.ml2}>Following</Paragraph>
                        <Paragraph style={[{fontWeight: 'bold'}, GlobalStyles.ml4]}>2,354</Paragraph>
                        <Paragraph style={GlobalStyles.ml2}>Followers</Paragraph>
                    </Card.Actions>
                </Card>
            </View>
        )
    }
    



    function getUserProfile(){
        axiosConfig.get(`/users/${route.params.userId}`)
        .then((response) => {
            setUser(response.data);
            setIsLoading(false);
        })
        .catch(error => {
            console.log(error)
            setIsLoading(false);
        })
    }


    function getIsFollowing(){
        axiosConfig.defaults.headers.common['Authorization'] = `Bearer ${userFromContext.token}`
        axiosConfig.get(`/is-following/${route.params.userId}`)
        .then((response) => {
            console.log(response.data)
            setIsFollowing(response.data);
        })
        .catch(error => {
            console.log(error.response)
        })
    }


    function handleRefresh(){
        setPage(1);
        setIsLastPage(false);
        setIsRefreshing(true);
        getUserTweets();
    }


    function handleEnd(){
        if(!isLatPage){
            setPage(page + 1);
        }
    }



    function getUserTweets(){
        axiosConfig.get(`/users/${route.params.userId}/tweets?page=${page}`)
        .then((response) => {
            if(page > 1){
                setData([...data, ...response.data.data]);
            } else {
                setData(response.data.data);
            }
            
            setIsLoadingTweets(false);
            setIsRefreshing(false);
            if(response.data.next_page_url == null){
                setIsLastPage(true)
            }
        })
        .catch(error => {
            console.log(error)
            setIsLoadingTweets(false);
            setIsRefreshing(false);
        })

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
                onRefresh={handleRefresh}
                onEndReached={handleEnd}
                onEndReachedThreshold={0}
                ListFooterComponent={()=> !isLatPage && (<ActivityIndicator
                    size="large"
                    color="gray"
                />)}

                ListHeaderComponent={profileHeader}
                ItemSeparatorComponent={() => (<View style={GlobalStyles.tweetSeparator}></View>)}
                data={data} 
                renderItem={props => <CardComponent {...props}/>}
                keyExtractor={item => item.id.toString()} 
                />
            )
        }
        </View>
        
    )
}

const styles = StyleSheet.create({
    avatarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: 10,
        marginTop: -24,
    },

    followButton: {
        backgroundColor: '#0f1418',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 24
    },
    followButtonText: {
        color: 'white',
        fontWeight: 'bold'
    },
});
