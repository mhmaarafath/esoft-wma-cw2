import React, { useContext, useState } from 'react'
import { View, Text, Image, useWindowDimensions, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { TextInput, Button, ActivityIndicator, Paragraph } from 'react-native-paper';
import ErrorComponent from '../../components/ErrorComponent';
import Error from '../../components/ErrorComponent';
import { AuthContext } from '../../context/AuthProvider';
import GlobalStyles from '../../utils/GlobalStyles'
import GlobalVariables from '../../utils/GlobalVariables';





export default function LoginScreen({navigation}) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {login, error, isLoading} = useContext(AuthContext);
    const { height, width } = useWindowDimensions();

    return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[GlobalStyles.container, GlobalStyles.center, GlobalStyles.bgWhite]}>
            <View style={{width: width - 100}}>
                <View style={{alignItems: 'center'}}>
                    <Image style={GlobalStyles.authImage} source={GlobalVariables.authImage} />
                    {error && <ErrorComponent error={error}/>}
                </View>
                <TextInput
                    label='Email'
                    style={GlobalStyles.mt4}
                    onChangeText={setEmail}
                    value={email}
                    textContentType='emailAddress'
                    keyboardType='email-address'
                    autoCapitalize='none'
                />

                <TextInput
                    label="Password"
                    style={GlobalStyles.mt4}
                    onChangeText={setPassword}
                    value={password}
                    secureTextEntry
                    autoCapitalize='none'
                    // right={<TextInput.Icon name="eye" />}
                />

                <Button
                    mode='contained'
                    icon={(props)=> <ActivityIndicator size='small' {...props} animating={isLoading} />}
                    style={[GlobalStyles.mt5]}
                    onPress={()=>login(email, password)}
                >
                    Login
                </Button>

                <View style={[GlobalStyles.mt4, GlobalStyles.flexRow, GlobalStyles.center]}>    
                    <Paragraph>Don't have an account ?</Paragraph>
                    <Button
                        mode='text'
                        onPress={()=>navigation.navigate('Register')}
                    >
                        Register
                    </Button>
                </View>
            </View>
        </View>
    </TouchableWithoutFeedback>
    )
}

