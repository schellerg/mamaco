import React, { useState } from 'react';
import { Keyboard } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import api from '../services/api';

import Constants from 'expo-constants';
const {  manifest } = Constants;
const uri = `http://${manifest.debuggerHost}`;
console.log(uri);

const Login = ({ navigation }) => {
  const [ enteredUser, setEnteredUser ] = useState([]);
  const [ enteredPass, setEnteredPass] = useState([]);

  async function handleSubmit() {
    try {
      const res = await api.post('/login', {
        username: enteredUser,
        password: enteredPass
      });
      console.log(res);
      // navigation.navigate('Wallet');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputView}>
        <Text style={styles.logo}>Mamaco</Text>
        <Input
          blurOnSubmit
          label='Usuário'
          leftIcon={
            <Icon
              name='user'
              size={20}
              />
            }
            placeholder='Ex: kingkong'
            onChangeText={enteredUser => setEnteredUser(enteredUser.toLowerCase())}
        />
        <Input
          blurOnSubmit
          label='Senha'
          leftIcon={
            <Icon
              name='lock'
              size={20}
              />
          }
          placeholder='Digite a sua senha'
          secureTextEntry
          onBlur={Keyboard.dismiss}
          onChangeText={enteredPass => setEnteredPass(enteredPass)}
        />
        <Button
          onPress={() => handleSubmit() }
          title='Entrar'
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 30,
    color: 'black',
    textAlign: 'center',
    marginBottom: 40
  },
  inputView: {
    width: '80%',
  }
});

export default Login;