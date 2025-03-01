import { Text, View, FlatList, StyleSheet, Button, TextInput, Pressable, StatusBar } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { data } from "@/data/todos";
import { useState } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Poppins_500Medium, useFonts } from "@expo-google-fonts/poppins"

type ItemProps = {
  id: number;
  title: string;
  completed: boolean;
}

export default function Index() {

  const [todos, setTodos] = useState<{id: number, title: string, completed: boolean}[]>(data);
  const [input, setInput] = useState<string>("");

  const [loaded, error] = useFonts({
    Poppins_500Medium
  });

  if (!loaded && !error) {
    return null;
  }

  // Add a new todo, from a text input after a button click

  function addTodo() {
    if (input.length > 0) {
      // use a different strategy for id generation
      setTodos([{id: todos.length + 1 
        , title: input, completed: false}, ...todos]);
      setInput("");
    }
  }

  function toggleCompleted(id: number| undefined) {
    setTodos(prevData =>
      prevData.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  function deleteTodo(id: number | undefined) {
    // remove a todo from the the array based on the id
    setTodos(prevData => prevData.filter(todo => todo.id !==
    id));
  }

  const Item = ({ title, completed, id }: ItemProps) => (
    <View style={completed? styles.completedItem : styles.pendingItem}>
      <Text style={completed? styles.completed : styles.title} onPress={() => toggleCompleted(id)}>{title}</Text>
      <Pressable onPress={() => deleteTodo(id)}>
      <Ionicons name="trash-bin" size={24} color="black" />
      </Pressable>
    </View>
  )

  return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
        <StatusBar
          animated={true}
          barStyle={"light-content"}
          backgroundColor="#f9c2f0"
          hidden={false}
        />
          <View style={styles.inputRow}>
            <TextInput 
              style={styles.input}
              placeholder="Enter a new todo"
              onChangeText={newTodo => setInput(newTodo)}
              defaultValue={input}
            />
            <Text style={styles.button} onPress={addTodo}>Add Todo</Text>
          </View>
          <FlatList
            data={todos}
            renderItem={({item}) => <Item id={item.id} title={item.title} completed={item.completed} />}
            keyExtractor={item => item.id.toString()}
          />
        </SafeAreaView>
      </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  pendingItem: {
    padding: 20,
    marginVertical: 8,
    backgroundColor: '#f9c2ff',
    borderRadius: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  completedItem: {
    padding: 20,
    marginVertical: 8,
    backgroundColor: '#f9c2ff',
    opacity: 0.5,
    borderRadius: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium'
  },
  completed: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    fontFamily: 'Poppins_500Medium'
  },
  button: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    backgroundColor: '#f9c2f0',
    padding: 8,
    marginVertical: 8,
    borderRadius: 10
  },
  input: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    backgroundColor: '#f9c2f0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginVertical: 8,
    borderRadius: 10,
    flexGrow: 1
  },
  inputRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10
  }
})