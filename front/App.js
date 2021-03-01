import 'react-native-gesture-handler';
import React from 'react';

import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

// Screens
import Login from './pages/LoginScreen';
import Wallet from './pages/WalletScreen';

const App = () => {
    return (
      <ApplicationProvider {...eva} theme={eva.light}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{headerShown:false}}
            />
            <Stack.Screen name="Wallet" component={Wallet} />
          </Stack.Navigator>
        </NavigationContainer>
      </ApplicationProvider>
    );
}

export default App;