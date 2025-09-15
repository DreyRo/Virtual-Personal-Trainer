import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../firebaseConfig';

const RoutinesScreen = ({ navigation }) => {
  // Estado para guardar las rutinas
  const [routines, setRoutines] = useState([]);
  // Estado para mostrar indicador de carga
  const [loading, setLoading] = useState(true);

  // Se ejecuta al montar el componente
  useEffect(() => {
    loadRoutines();
  }, []);

  // Función para cargar rutinas desde Firestore
  const loadRoutines = async () => {
    try {
      const routinesCollection = collection(db, 'routines'); // referencia a la colección "routines"
      const routinesSnapshot = await getDocs(routinesCollection); // obtiene todos los documentos
      // Convertimos cada documento a objeto con su ID y datos
      const routinesData = routinesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRoutines(routinesData); // guardamos las rutinas en el estado
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las rutinas');
      console.error('Error loading routines:', error);
    } finally {
      setLoading(false); // quitamos el estado de carga
    }
  };

  // Renderiza cada rutina como tarjeta
  const renderRoutineItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.routineCard}
      // Navega a la pantalla de detalle, enviando la rutina como parámetro
      onPress={() => navigation.navigate('RoutineDetail', { routine: item })}
    >
      <Text style={styles.routineTitle}>{item.name}</Text>
      <Text style={styles.routineDescription}>{item.description}</Text>
      <Text style={styles.routineInfo}>
        Duración: {item.duration} min | Nivel: {item.level}
      </Text>
    </TouchableOpacity>
  );

  // Si todavía está cargando, muestra mensaje
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando rutinas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rutinas Disponibles</Text>
      {routines.length === 0 ? ( // Si no hay rutinas, muestra mensaje
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay rutinas disponibles</Text>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={loadRoutines} // Botón para recargar rutinas
          >
            <Text style={styles.refreshButtonText}>Actualizar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Lista de rutinas
        <FlatList
          data={routines}
          renderItem={renderRoutineItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  listContainer: {
    paddingBottom: 20,
  },
  routineCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  routineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  routineDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  routineInfo: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RoutinesScreen;
