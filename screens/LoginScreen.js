import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebaseConfig';

// Pantalla de Login
const LoginScreen = ({ navigation }) => {
  // Estados para guardar el correo, la contraseña y si está cargando
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Función para manejar el inicio de sesión
  const handleLogin = async () => {
    // Validación simple: verificar si los campos están llenos
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }

    setLoading(true); // Activar "cargando..."
    try {
      // Llamada a Firebase Auth para iniciar sesión
      await signInWithEmailAndPassword(auth, email, password);
      // La navegación a Home la maneja el AuthContext (no aquí)
    } catch (error) {
      // Si hay error, lo mostramos en consola y con un Alert
      console.error("Error de inicio de sesión:", error.code, error.message);
      Alert.alert("Error", "Credenciales incorrectas. Por favor, verifica tu correo y contraseña.");
    } finally {
      setLoading(false); // Desactivar "cargando..."
    }
  };

  return (
    <View style={styles.container}>
      {/* Título de la app */}
      <Text style={styles.title}>Entrenador Personal Virtual</Text>
      <Text style={styles.subtitle}>Iniciar Sesión</Text>
      
      {/* Input para el correo */}
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      {/* Input para la contraseña */}
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      {/* Botón para iniciar sesión */}
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleLogin}
        disabled={loading} // Se desactiva mientras carga
      >
        <Text style={styles.buttonText}>
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Text>
      </TouchableOpacity>
      
      {/* Botón para ir a la pantalla de registro */}
      <TouchableOpacity 
        style={styles.linkButton}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.linkText}>
          ¿No tienes cuenta? Regístrate aquí
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    paddingVertical: 10,
  },
  linkText: {
    color: '#007AFF',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default LoginScreen;
