import 'react-native-gesture-handler';
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

// Screens
import Login from './pages/LoginScreen';
import Wallet from './pages/WalletScreen';

const App = () => {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
          />
          <Stack.Screen name="Wallet" component={Wallet} />
        </Stack.Navigator>
      </NavigationContainer>
    );
}

export default App;