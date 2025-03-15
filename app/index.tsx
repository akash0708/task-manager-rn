import { Text, View, StyleSheet, TextInput, Pressable, StatusBar } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { data } from "@/data/todos";
import { useState, useEffect } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Poppins_500Medium, useFonts } from "@expo-google-fonts/poppins";
import DraggableFlatList from 'react-native-draggable-flatlist';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

type ItemProps = {
  id: number;
  title: string;
  completed: boolean;
};

export default function Index() {
  const [todos, setTodos] = useState<ItemProps[]>([]);
  const [input, setInput] = useState<string>("");
  const router = useRouter();

  const [loaded, error] = useFonts({
    Poppins_500Medium,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('todos');
        const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null;

        if (storageTodos && storageTodos.length > 0) {
          setTodos(storageTodos.sort((a: ItemProps, b: ItemProps) => b.id - a.id));
        } else {
          setTodos(data.sort((a: ItemProps, b: ItemProps) => b.id - a.id));
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const storeData = async () => {
      try {
        const jsonValue = JSON.stringify(todos);
        await AsyncStorage.setItem('todos', jsonValue);
      } catch (e) {
        console.error(e);
      }
    };
    storeData();
  }, [todos]);

  if (!loaded && !error) {
    return null;
  }

  function addTodo() {
    if (input.length > 0) {
      setTodos([{ id: todos.length + 1, title: input, completed: false }, ...todos]);
      setInput("");
    }
  }

  function toggleCompleted(id: number) {
    setTodos((prevData) =>
      prevData.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  function deleteTodo(id: number) {
    setTodos((prevData) => prevData.filter((todo) => todo.id !== id));
  }

  function handlePress(id: number) {
    router.push(`/todos/${id}`);
  }

  const Item = ({ title, completed, id, drag, isActive }: ItemProps & { drag: () => void; isActive: boolean }) => (
    <Pressable
      onLongPress={drag}
      onPress={() => handlePress(id)}
      style={[
        completed ? styles.completedItem : styles.pendingItem,
        isActive && { opacity: 0.8 },
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <Text style={completed ? styles.completed : styles.title} ellipsizeMode="tail" numberOfLines={1}>
          {title}
        </Text>
        <Pressable onPress={() => deleteTodo(id)}>
          <Ionicons name="trash-bin" size={24} color="black" />
        </Pressable>
      </View>
    </Pressable>
  );

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
        <DraggableFlatList
          data={todos}
          renderItem={({ item, drag, isActive }) => (
            <Item
              id={item.id}
              title={item.title}
              completed={item.completed}
              drag={drag}
              isActive={isActive}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          onDragEnd={({ data }) => setTodos(data)}
          activationDistance={10}
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
    paddingVertical: 8,
  },
  pendingItem: {
    padding: 20,
    marginVertical: 8,
    backgroundColor: '#f9c2ff',
    borderRadius: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    paddingRight: 20,
  },
  completed: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    fontFamily: 'Poppins_500Medium',
    paddingRight: 20,
  },
  button: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    backgroundColor: '#f9c2f0',
    padding: 8,
    marginVertical: 8,
    borderRadius: 10,
    width: 100,
    textAlign: 'center',
  },
  input: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    backgroundColor: '#f9c2f0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginVertical: 8,
    borderRadius: 10,
    flex: 1,
    overflow: 'hidden',
  },
  inputRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
});