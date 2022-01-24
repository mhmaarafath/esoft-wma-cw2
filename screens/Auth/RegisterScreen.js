import React, { useContext, useState } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView, useWindowDimensions } from 'react-native'

import { AuthContext } from '../../context/AuthProvider';
import axiosConfig from '../../helpers/axiosConfig';
import GlobalStyles from '../../utils/GlobalStyles'
import { TextInput, Button, Colors, ActivityIndicator, Title, Caption, Headline, Paragraph, Subheading, HelperText } from 'react-native-paper';
import GlobalVariables from '../../utils/GlobalVariables';
import ErrorComponent from '../../components/ErrorComponent';

export default function RegisterScreen({navigation}) {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);


    const { height, width } = useWindowDimensions();

    function register(name, email, username, password, confirmPassword){
        setIsLoading(true);
        axiosConfig.post('/register', {
            name,
            email,
            username,
            password,
            password_confirmation: confirmPassword,
        })
        .then(response => {
            Alert.alert('User created. Please login');
            navigation.navigate('Login');
            setError(null);
            setIsLoading(false)
        })
        .catch(error => {
            console.log(error.response.data.message);
            setError(error.response.data.message);
            setIsLoading(false);
        })

    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[GlobalStyles.container, GlobalStyles.center, GlobalStyles.bgWhite]}>
                <View style={{width: width - 100}}>
                    <View style={{alignItems: 'center'}}>
                        <Image style={GlobalStyles.authImage} source={GlobalVariables.authImage} />
                        {error && <ErrorComponent error={error}/>}
                    </View>
                    <TextInput
                        label='Name'
                        style={[GlobalStyles.mt4]}
                        onChangeText={setName}
                        value={name}
                    />
                    <TextInput
                        label='Email'
                        style={[GlobalStyles.mt4]}
                        onChangeText={setEmail}
                        value={email}
                        textContentType='emailAddress'
                        keyboardType='email-address'
                        autoCapitalize='none'
                    />
                    <TextInput
                        label='Username'
                        style={[GlobalStyles.mt4]}
                        onChangeText={setUsername}
                        value={username}
                        autoCapitalize='none'
                    />
                    <TextInput
                        label='Password'
                        style={[GlobalStyles.mt4]}
                        onChangeText={setPassword}
                        value={password}
                        autoCapitalize='none'
                        secureTextEntry={true}
                    />
                    <TextInput
                        label='Confirm Password'
                        style={[GlobalStyles.mt4]}
                        onChangeText={setConfirmPassword}
                        value={confirmPassword}
                        autoCapitalize='none'
                        secureTextEntry={true}
                    />

                    <Button
                        mode='contained'
                        icon={(props)=> <ActivityIndicator size='small' {...props} animating={isLoading} />}
                        style={[GlobalStyles.mt5]}
                        onPress={()=>register(name, email, username, password, confirmPassword)}
                    >
                        Register
                    </Button>
                    <View style={[GlobalStyles.mt4, GlobalStyles.flexRow, GlobalStyles.center]}>    
                        <Paragraph>Already have an account ?</Paragraph>
                        <Button
                            mode='text'
                            onPress={()=>navigation.navigate('Login')}
                        >
                            Login
                        </Button>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>

    )
}
