import { signOut } from 'firebase/auth'; // Función de Firebase para cerrar sesión
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // Componentes de interfaz de React Native
import { auth } from '../firebaseConfig'; // Configuración de Firebase (objeto auth)

// Componente principal de la pantalla de inicio
const HomeScreen = ({ navigation }) => {
  // Función para manejar el cierre de sesión
  const handleLogout = async () => {
    try {
      await signOut(auth); // Llama a Firebase para cerrar sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error); // Captura posibles errores
    }
  };

  return (
    <View style={styles.container}>
      {/* Título principal de la app */}
      <Text style={styles.title}>Entrenador Personal Virtual</Text>
      <Text style={styles.welcome}>¡Bienvenido!</Text>
      
      {/* Botón para navegar a la pantalla de Rutinas */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Routines')} // Navega a "Routines"
      >
        <Text style={styles.buttonText}>Ver Rutinas</Text>
      </TouchableOpacity>
      
      {/* Botón para cerrar sesión */}
      <TouchableOpacity 
        style={[styles.button, styles.logoutButton]} // Combina estilos (azul base + rojo para logout)
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

// Estilos de la pantalla
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Centra verticalmente
    padding: 20,
    backgroundColor: '#f5f5f5', // Fondo gris claro
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333', // Texto oscuro
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666', // Gris medio
  },
  button: {
    backgroundColor: '#007AFF', // Azul para botones
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  logoutButton: {
    backgroundColor: '#FF3B30', // Rojo específico para cerrar sesión
  },
  buttonText: {
    color: 'white', // Texto blanco
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
