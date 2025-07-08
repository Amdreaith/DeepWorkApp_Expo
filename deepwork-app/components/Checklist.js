// screens/ChecklistScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  KeyboardAvoidingView, 
  Platform, 
  ImageBackground, 
  StatusBar, 
  ScrollView, 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { Ionicons } from '@expo/vector-icons'; 
import { colors } from '../styles/globalStyles'; 


import checklistBackgroundImg from '../assets/images/checklist.png'; 

export default function ChecklistScreen() {
  const [tasks, setTasks] = useState([]);
  const [historyTasks, setHistoryTasks] = useState([]); 
  const [newTask, setNewTask] = useState('');
  const [showHistory, setShowHistory] = useState(false); 


  const addTask = () => {
    if (newTask.trim().length > 0) { 
      const newId = Date.now().toString();
      setTasks(prevTasks => {
        const updatedTasks = [
          ...prevTasks,
          { id: newId, text: newTask.trim(), completed: false, movedToHistoryAt: null }
        ];
        console.log('--- ADD TASK ---');
        console.log('New Task Added:', { id: newId, text: newTask.trim() });
        console.log('Current Tasks after add:', updatedTasks);
        return updatedTasks;
      });
      setNewTask('');
    } else {
      Alert.alert('Empty Task', 'Please enter a task before adding.');
    }
  };


  const toggleComplete = (id) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      console.log('--- TOGGLE COMPLETE ---');
      console.log('Task ID Toggled:', id);
      console.log('Current Tasks after toggle:', updatedTasks);
      return updatedTasks;
    });
  };

  
  const moveToHistory = (id) => {
    console.log('--- ATTEMPTING MOVE TO HISTORY ---');
    console.log('Attempting to move task with ID:', id);

    Alert.alert(
      'Move to History',
      'Are you sure you want to move this task to history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Move',
          onPress: () => {
            setTasks(prevTasks => {
              const taskToMove = prevTasks.find(task => task.id === id);
              if (taskToMove) {
              
                const updatedTasks = prevTasks.filter(task => task.id !== id);
                console.log('Tasks filtered (removed ID ' + id + '):', updatedTasks);

       
                setHistoryTasks(prevHistory => {
                  const newHistoryItem = { ...taskToMove, movedToHistoryAt: Date.now() };
                  const updatedHistory = [...prevHistory, newHistoryItem];
                  console.log('History Tasks after add:', updatedHistory);
                  return updatedHistory;
                });
                return updatedTasks; 
              }
              console.log('Task with ID ' + id + ' not found in current tasks.');
              return prevTasks; 
            });
            console.log('Alert "Move" pressed - state update initiated.');
          },
          style: 'default'
        },
      ],
      { cancelable: true }
    );
  };


  const deleteFromHistory = (id) => {
    console.log('--- ATTEMPTING DELETE FROM HISTORY ---');
    console.log('Attempting to delete task from history with ID:', id);
    Alert.alert(
      'Delete Permanently',
      'Are you sure you want to permanently delete this task from history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            setHistoryTasks(prevHistory => {
              const updatedHistory = prevHistory.filter(task => task.id !== id);
              console.log('History Tasks AFTER permanent delete:', updatedHistory);
              return updatedHistory;
            });
            console.log('Alert "Delete" from history pressed - state update initiated.');
          },
          style: 'destructive'
        },
      ],
      { cancelable: true }
    );
  };


  const renderTaskItem = ({ item }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity onPress={() => toggleComplete(item.id)} style={styles.taskCheckbox}>
        <Ionicons
          name={item.completed ? 'checkbox-outline' : 'square-outline'}
          size={24}
          color={item.completed ? colors.accent : colors.textPrimary}
        />
      </TouchableOpacity>
      <Text style={[styles.taskText, item.completed && styles.completedTaskText]}>
        {item.text}
      </Text>
      <TouchableOpacity onPress={() => moveToHistory(item.id)} style={styles.actionButton}> {/* Changed style name */}
        <Ionicons name="archive-outline" size={24} color={colors.buttonPrimary} /> {/* Archive icon */}
      </TouchableOpacity>
    </View>
  );


  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <Text style={styles.historyTaskText}>{item.text}</Text>
      {item.movedToHistoryAt && (
        <Text style={styles.historyDate}>
          Moved: {new Date(item.movedToHistoryAt).toLocaleDateString()}
        </Text>
      )}
      <TouchableOpacity onPress={() => deleteFromHistory(item.id)} style={styles.actionButton}> {/* Changed style name */}
        <Ionicons name="trash-outline" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground
      source={checklistBackgroundImg}
      style={styles.fullScreenBackground}
      resizeMode="cover"
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <View style={styles.container}>
            <Text style={styles.header}>{showHistory ? 'Task History' : 'My To-Do List'}</Text>

            {!showHistory && (
              <>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Add a new task..."
                    placeholderTextColor={colors.textSecondary}
                    value={newTask}
                    onChangeText={setNewTask}
                    onSubmitEditing={addTask} 
                  />
                  <TouchableOpacity style={styles.addButton} onPress={addTask}>
                    <Ionicons name="add-circle-outline" size={30} color={colors.buttonText} />
                  </TouchableOpacity>
                </View>

                {tasks.length === 0 ? (
                  <Text style={styles.emptyListText}>No tasks yet! Add some above.</Text>
                ) : (
                  <FlatList
                    data={tasks}
                    renderItem={renderTaskItem} 
                    keyExtractor={item => item.id}
                    style={styles.taskList}
                    contentContainerStyle={styles.flatListContent}
                  />
                )}
              </>
            )}

            {showHistory && (
              <>
                {historyTasks.length === 0 ? (
                  <Text style={styles.emptyListText}>No tasks in history yet.</Text>
                ) : (
                  <FlatList
                    data={historyTasks}
                    renderItem={renderHistoryItem} 
                    keyExtractor={item => item.id}
                    style={styles.taskList}
                    contentContainerStyle={styles.flatListContent}
                  />
                )}
              </>
            )}

        
            <TouchableOpacity
              style={styles.toggleHistoryButton}
              onPress={() => {
                setShowHistory(prev => !prev);
                console.log('--- TOGGLE HISTORY ---');
                console.log('Now showing history:', !showHistory);
              }}
            >
              <Text style={styles.toggleHistoryButtonText}>
                {showHistory ? 'Back to To-Do List' : 'View History'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fullScreenBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  header: {
    fontSize: 40,
    fontFamily: 'MadimiOne_400Regular',
    color: '#333333',
    marginBottom: 30,
    marginTop: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(255, 255, 255, 0.9)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 18,
    color: colors.textPrimary,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: colors.buttonPrimary,
    borderRadius: 10,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskList: {
    width: '100%',
    flex: 1, 
  },
  flatListContent: {
    paddingBottom: 80, 
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  taskCheckbox: {
    marginRight: 15,
    padding: 5,
  },
  taskText: {
    flex: 1,
    fontSize: 18,
    color: colors.textPrimary,
    fontFamily: 'MadimiOne_400Regular',
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  actionButton: { 
    marginLeft: 15,
    padding: 5,
  },
  emptyListText: {
    fontSize: 18,
    color: '#333333',
    textShadowColor: 'rgba(255, 255, 255, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
    marginTop: 50,
    fontFamily: 'MadimiOne_400Regular',
  },

  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(200, 200, 200, 0.95)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  historyTaskText: {
    flex: 1,
    fontSize: 16,
    color: '#555555', 
    fontFamily: 'MadimiOne_400Regular',
    fontStyle: 'italic',
  },
  historyDate: {
    fontSize: 12,
    color: '#777777',
    marginLeft: 10,
  },
  toggleHistoryButton: {
    backgroundColor: colors.buttonSecondary, 
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 10, 
    alignSelf: 'center', 
  },
  toggleHistoryButtonText: {
    color: colors.buttonText, 
    fontSize: 16,
    fontFamily: 'MadimiOne_400Regular',
  }
});