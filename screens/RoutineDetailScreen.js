import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebaseConfig';

// Pantalla que muestra el detalle de una rutina y permite marcar ejercicios como completados
const RoutineDetailScreen = ({ route }) => {
  // Obtenemos la rutina pasada como parámetro desde la navegación
  const { routine } = route.params;

  // Usuario actual desde el contexto de autenticación
  const { user, loading: authLoading } = useAuth();

  // Estados locales
  const [exercises, setExercises] = useState([]);            // Lista de ejercicios de la rutina
  const [completedExercises, setCompletedExercises] = useState([]); // Ejercicios completados por el usuario
  const [loading, setLoading] = useState(true);              // Estado de carga

  // Se ejecuta al montar el componente
 useEffect(() => {
  loadExercises();
  if (!authLoading && user && user.uid) {
    loadUserProgress();
  }
}, [user, authLoading]);

  // Función para cargar ejercicios
  const loadExercises = async () => {
    try {
      // Si la rutina ya tiene ejercicios definidos, los usamos
      if (routine.exercises && routine.exercises.length > 0) {
        setExercises(routine.exercises);
      } else {
        // Si no, mostramos algunos de ejemplo
        const exampleExercises = [
          {
            id: '1',
            name: 'Flexiones',
            sets: 3,
            reps: 15,
            description: 'Flexiones de pecho tradicionales'
          },
          {
            id: '2',
            name: 'Sentadillas',
            sets: 3,
            reps: 20,
            description: 'Sentadillas con peso corporal'
          },
          {
            id: '3',
            name: 'Plancha',
            sets: 3,
            reps: '30 seg',
            description: 'Mantener posición de plancha'
          }
        ];
        setExercises(exampleExercises);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los ejercicios');
      console.error('Error loading exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar el progreso del usuario desde Firestore
  const loadUserProgress = async () => {
    try {
      console.log('Usuario en loadUserProgress:', user);
      if (!user || !user.uid) {
        console.warn('Usuario no autenticado, no se puede cargar progreso');
        return;
      }
      // Consulta a la colección "progress" filtrando por usuario y rutina
      const progressQuery = query(
        collection(db, 'progress'),
        where('userId', '==', user.uid),
        where('routineId', '==', routine.id)
      );
      const progressSnapshot = await getDocs(progressQuery);

      // Guardamos los IDs de los ejercicios ya completados
      const completedIds = progressSnapshot.docs.map(doc => doc.data().exerciseId);
      setCompletedExercises(completedIds);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  // Marcar un ejercicio como completado
  const markExerciseCompleted = async (exerciseId) => {
    try {
      
      if (!user || !user.uid) {
        Alert.alert('Error', 'Usuario no autenticado');
        return;
      }

      // Si ya está completado, mostramos aviso
      if (completedExercises.includes(exerciseId)) {
        Alert.alert('Info', 'Este ejercicio ya está marcado como completado');
        return;
      }

      // Guardamos en Firestore el progreso
      await addDoc(collection(db, 'progress'), {
        userId: user.uid,
        routineId: routine.id,
        exerciseId: exerciseId,
        completedAt: new Date(), // Fecha de completado
      });

      // Actualizamos el estado local
      setCompletedExercises([...completedExercises, exerciseId]);
      Alert.alert('¡Excelente!', 'Ejercicio marcado como completado');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el progreso');
      console.error('Error saving progress:', error);
    }
  }

  // Renderiza cada tarjeta de ejercicio
  const renderExerciseItem = ({ item }) => {
    const isCompleted = completedExercises.includes(item.id); // Verifica si ya fue completado
    
    return (
      <View style={[styles.exerciseCard, isCompleted && styles.completedCard]}>
        <View style={styles.exerciseInfo}>
          <Text style={[styles.exerciseName, isCompleted && styles.completedText]}>
            {item.name}
          </Text>
          <Text style={styles.exerciseDescription}>{item.description}</Text>
          <Text style={styles.exerciseDetails}>
            {item.sets} series x {item.reps} repeticiones
          </Text>
        </View>
        {/* Botón para marcar el ejercicio */}
        <TouchableOpacity 
          style={[
            styles.completeButton, 
            isCompleted && styles.completedButton
          ]}
          onPress={() => markExerciseCompleted(item.id)}
          disabled={isCompleted}
        >
          <Text style={[
            styles.completeButtonText,
            isCompleted && styles.completedButtonText
          ]}>
            {isCompleted ? '✓ Completado' : 'Marcar'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Pantalla de carga
  if (loading || authLoading) {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Cargando ejercicios...</Text>
    </View>
  );
}

  // Calculamos el progreso de la rutina
  const completedCount = completedExercises.length;
  const totalCount = exercises.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <View style={styles.container}>
      {/* Encabezado con información de la rutina */}
      <View style={styles.header}>
        <Text style={styles.routineTitle}>{routine.name}</Text>
        <Text style={styles.routineDescription}>{routine.description}</Text>
        
        {/* Barra de progreso */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Progreso: {completedCount}/{totalCount} ({Math.round(progressPercentage)}%)
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[styles.progressFill, { width: `${progressPercentage}%` }]} 
            />
          </View>
        </View>
      </View>

      {/* Lista de ejercicios */}
      <FlatList
        data={exercises}
        renderItem={renderExerciseItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

// Estilos de la pantalla
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10,
  },
  routineTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  routineDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
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
    padding: 20,
    paddingTop: 0,
  },
  exerciseCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  completedCard: {
    backgroundColor: '#f0f8ff',
    borderColor: '#007AFF',
    borderWidth: 1,
  },
  exerciseInfo: {
    flex: 1,
    marginRight: 15,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  completedText: {
    color: '#007AFF',
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  exerciseDetails: {
    fontSize: 12,
    color: '#999',
  },
  completeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  completedButton: {
    backgroundColor: '#28a745',
  },
  completeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  completedButtonText: {
    color: 'white',
  },
});

export default RoutineDetailScreen;
