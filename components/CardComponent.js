import React, { useContext } from 'react'
import { View, Text, Image, TouchableOpacity, Platform, StyleSheet } from 'react-native'
import { EvilIcons, Entypo } from '@expo/vector-icons';


import { format, formatDistanceToNowStrict } from 'date-fns';
import GlobalStyles from '../utils/GlobalStyles';
import { useNavigation } from '@react-navigation/native';
import { Avatar, Card, IconButton, Button, Paragraph, Caption, Title } from 'react-native-paper';
import GlobalVariables from '../utils/GlobalVariables';
import { GlobalContext } from '../context/GlobalProvider';
import { AuthContext } from '../context/AuthProvider';


export default function CardComponent({ item, page = null }) {

    const navigation = useNavigation();
    const {visible, setVisible} = useContext(GlobalContext);
    const {user} = useContext(AuthContext);

    function goToProfile(userId){
        navigation.navigate('Profile Screen', {
            userId: userId
        });
    }

    function goToTweetScreen(tweetId){
        navigation.navigate('Tweet Screen', {
            tweetId : tweetId
        });
    }


    return (
        <Card style={{margin: 10,}} onPress={() => goToTweetScreen(item.id)}>
            <View style={{padding: 10, flexDirection: 'row', alignItems: 'center'}}>
                <Avatar.Image source={{uri: item.user.avatar}} />
                <View style={{padding: 10}}>
                    <View>
                        <Title onPress={()=> goToProfile(item.user.id)}>{item.user.name}</Title>
                        <Text>@{item.user.username}</Text>
                    </View>
                    <Caption>{formatDistanceToNowStrict(new Date(item.created_at))}</Caption>
                </View>

            </View>
            <Card.Content>
                <Paragraph>{item.body}</Paragraph>
            </Card.Content>
            { (item.photo && page != 'Tweet')  &&
                <Card.Cover  source={{uri: `${GlobalVariables.tweetImageURL}/${item.photo}`}}/>
            }

            
            <Card.Actions style={{justifyContent: 'flex-end'}}>
                {/* <Button onPress={()=> alert('Test')} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <EvilIcons name="heart" size={34} color={GlobalVariables.iconColor}/>
                </Button>
                <Caption>0 Likes</Caption> */}
                <View style={GlobalStyles.flexRow}>
                    <Caption>{format(new Date(item.created_at), 'h:mm a')}</Caption>
                    <Caption>&middot;</Caption>
                    <Caption>{format(new Date(item.created_at), 'd MMM.yy')}</Caption>
                </View>

                {(page == 'Tweet' && user.id == item.user.id) && (                    
                    <Button onPress={()=> setVisible(!visible)} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <Entypo name="dots-three-vertical" size={24} color="gray" />
                    </Button>
                    )
                }
            </Card.Actions>
            { (item.photo && page == 'Tweet') &&
                (<View style={{flex: 1, flexDirection: 'row'}}>
                <Image style={{flex: 1, aspectRatio: 1}} source={{uri: `${GlobalVariables.tweetImageURL}/${item.photo}`}}/>
                </View>)
            }
        </Card>
    )
}

