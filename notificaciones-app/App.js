import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  
const [contador, setContador] = useState(0); //declara el contador


useEffect(() => {
    guardarContador(contador);
  }, [contador]);

useEffect(() => {
    cargarContador();
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
      });
    }
    pedirPermiso();
  }, []);

  const incrementar = async () => {
    const nuevoValor = contador + 1;
    await enviarNotificacion(nuevoValor);
    setContador(nuevoValor);
  };

  const guardarContador = async (valor) => {
    try {
      await AsyncStorage.setItem("contador", JSON.stringify(valor));
    } catch (e) {
      console.log("Error guardando");
    }
  };
const cargarContador = async () => {
    try {
      const data = await AsyncStorage.getItem("contador");
      if (data !== null) {
        setContador(JSON.parse(data));
      }
    } catch (e) {
      console.log("Error cargando");
    }
  };
  return (
    
    <View style={styles.container}>
      <Text>Notificaciones</Text>

      <Button title="Pedir permiso" onPress={pedirPermiso} />
      <Button title="Enviar notificación" onPress={() => enviarNotificacion(contador)} />
       <Text style={{ fontSize: 20 }}>
        Contador: {contador}
      </Text>

      <Button title="Incrementar" onPress={incrementar} />
    </View>

    
  );
}

const pedirPermiso = async () => {
  await Notifications.requestPermissionsAsync();
};

const enviarNotificacion = async (contadorActual) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Hola, mundo 🌍",
      body: `Esta es tu primera notificación, el contador esta en ${contadorActual}`,
    },
    trigger: null, // Este trigger lo puedes modificar para darle unos segundos de delay, ejemplo: trigger{ seconds: 5 }
  });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
