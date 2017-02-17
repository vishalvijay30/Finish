import React, { Component, PropTypes } from 'react';
import {View, StyleSheet, TouchableHighlight, Text, TouchableOpacity, ScrollView, Image } from 'react-native';

import FBSDK from 'react-native-fbsdk';

import { loginWithTokens, onLoginFinished } from '../app/fb-login';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import {meteorGoogleLogin, loginWithGoogle} from '../app/google-login';

import Meteor, { createContainer } from 'react-native-meteor';

const { LoginButton, AccessToken, LoginManager } = FBSDK;

//import HomeStyles from '../styles/HomeStyles';
export default class LoginScene extends Component {

    render() {
            return (
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <Text style={{fontSize:30, color:"white", fontFamily:"Rock Salt"}}>
                        Welcome to Finish!
                    </Text>
                    <Text style={{fontSize:30, color:"white", fontFamily:"Rock Salt"}}>
                        Register to get started.
                    </Text>
                </View>
            <View style={styles.middleContainer}>
                
                <Image source={require('../app/images/logo.png')} style={{width:200, height:200}} />

                  
                    <Text/><Text/>
                    <Text/>
                    <Text/>
                <LoginButton
                    readPermissions={["public_profile", "email"]}
                    onLoginFinished={this.handleLogin.bind(this)}
                    onLogoutFinished={() => this.handleLogout()}
                    style = {{width: 306, height: 42, alignItems:"center"}}/>
                    <Text/>
                    <Text/>
                    <Text/>
                    <GoogleSigninButton
                style={{width: 312, height: 48}}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Light}
                onPress={this.googleSignIn.bind(this)}/>
            </View>
            </View>
            );
    }

    handleLogout(){
        console.log("reached logout method");
        LoginManager.logOut();
        Meteor.logout();
        GoogleSignin.signOut();
        this.setState({loggedIn: false, goneToLogin: false});
    }

    handleLogin(error, result){
        console.log("handle login");
        onLoginFinished(error, result);
        this.props.navigator.pop();
    }
     googleSignIn(){
        loginWithGoogle();
        this.props.navigator.pop();
    }
}
    const styles = StyleSheet.create({
   topContainer: {
        justifyContent:'center',
        alignItems:'center',
        height:75,
        backgroundColor: '#48C9B0',
        //backgroundColor: '#e6ffff',
        //borderWidth:1,
        //borderColor:"black"
    },
    middleContainer: {
        justifyContent:'center',
        alignItems:'center',
        height:525,
        backgroundColor: '#48C9B0',
    },
    bottomContainer: {
        justifyContent:'center',
        height:75,
        backgroundColor:'#48C9B0',
        //backgroundColor: '#e6ffff',
        flexDirection:'row',
        flex: 1,
        alignItems:'stretch',
        alignSelf: 'stretch'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#48C9B0',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        color:'white',
    },
    instructions: {
        textAlign: 'center',
        marginBottom: 5,
        color:'white',
    },

});
