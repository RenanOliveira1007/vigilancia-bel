// navigation.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../../App'; // Importa o componente HomeScreen do arquivo App.tsx
import RegistrarRonda from '../screens/RegistrarRonda';
import Vigilantes from '../screens/Vigilantes';
import HistoricoRondas from '../screens/HistoricoRondas';

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="RegistrarRonda" component={RegistrarRonda} />
        <Stack.Screen name="Vigilantes" component={Vigilantes} />
        <Stack.Screen name="HistoricoRondas" component={HistoricoRondas} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
