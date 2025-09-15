// Importaciones principales de React y librerías necesarias
import { NavigationContainer } from '@react-navigation/native'; // Manejo de la navegación
import { createStackNavigator } from '@react-navigation/stack'; // Navegación tipo "stack"

// Importar el AuthProvider y el contexto desde el archivo centralizado
import { AuthProvider, useAuth } from './context/AuthContext';

// Importar pantallas del proyecto
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import RoutineDetailScreen from './screens/RoutineDetailScreen';
import RoutinesScreen from './screens/RoutinesScreen';

// Crear el stack de autenticación (pantallas de login/registro)
const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// Crear el stack de la app principal (cuando el usuario está autenticado)
const AppStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
    <Stack.Screen name="Routines" component={RoutinesScreen} options={{ title: 'Rutinas Disponibles' }} />
    <Stack.Screen name="RoutineDetail" component={RoutineDetailScreen} options={{ title: 'Detalle de Rutina' }} />
  </Stack.Navigator>
);

// Componente principal de la aplicación
const App = () => {
  return (
    <AuthProvider> 
      {/* NavigationContainer envuelve toda la navegación */}
      <NavigationContainer>
        {/* Componente que decide qué stack mostrar */}
        <AuthChecker />
      </NavigationContainer>
    </AuthProvider>
  );
};

// Verifica si el usuario está autenticado o no
const AuthChecker = () => {
  const { user, loading } = useAuth(); // Usamos el hook del contexto centralizado

  if (loading) {
    return null; // Mientras carga Firebase, no muestra nada (se puede poner un spinner aquí)
  }

  // Si hay usuario → AppStack, si no hay → AuthStack
  return user ? <AppStack /> : <AuthStack />;
};

export default App;