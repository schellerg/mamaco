import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

const Login = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputView}>
        <Text style={styles.logo}>Mamaco</Text>
        <Input
          label='Usuário'
          leftIcon={
            <Icon
              name='user'
              size={20}
            />
          }
          placeholder='Ex: kingkong'
        />
        <Input
          label='Senha'
          leftIcon={
            <Icon
              name='lock'
              size={20}
            />
          }
          placeholder='Digite a sua senha'
          secureTextEntry
        />
        <Button title='Entrar'/>
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