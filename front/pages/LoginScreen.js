import React, { useState } from 'react';
import { Keyboard } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { Button, Input, Layout, Text } from '@ui-kitten/components';
import api from '../services/api';

const Login = ({ navigation }) => {
  const [ enteredUser, setEnteredUser ] = useState([]);
  const [ enteredPass, setEnteredPass] = useState([]);
  const [ isValid, setIsValid] = useState(true);
  const [ errMessage, setErrMessage ] = useState('');

  async function handleSubmit() {
      try {
        if (!enteredUser.length || !enteredPass.length) {
          setIsValid(false);
          setErrMessage('Preencha os campos corretamente');
          return;
        }

        const res = await api.post('/login', {
          username: enteredUser,
          password: enteredPass
        });

        navigation.navigate('Wallet');
      } catch (error) {
        setIsValid(false);
        setErrMessage(error.response.data.message);
      }
  }

  return (
    <Layout style={styles.container}>
      <Layout style={styles.inputView}>
        <Text category='h1' style={styles.logo}>MAMACO</Text>
        <Input
          style={styles.input}
          blurOnSubmit
          label='Usuário'
          placeholder='Ex: kingkong'
          onChangeText={enteredUser => setEnteredUser(enteredUser.toLowerCase())}
        />
        <Input
          style={styles.input}
          blurOnSubmit
          label='Senha'
          placeholder='Digite a sua senha'
          secureTextEntry
          onBlur={Keyboard.dismiss}
          onChangeText={enteredPass => setEnteredPass(enteredPass)}
        />
        { !isValid ? (
          <View>
            <Text style={styles.error}>{errMessage}</Text>
          </View>) : null}
        <Button status='primary' style={styles.button} onPress={() => handleSubmit() }>ENTRAR</Button>
      </Layout>
    </Layout>
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
    color: 'black',
    textAlign: 'center',
    marginBottom: 40
  },
  inputView: {
    width: '80%',
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
});

export default Login;