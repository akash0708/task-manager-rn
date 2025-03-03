import { useLocalSearchParams } from "expo-router";
import { Button, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";

import { Poppins_500Medium, useFonts } from "@expo-google-fonts/poppins";
import Ionicons from '@expo/vector-icons/Ionicons';

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function EditScreen() {
    const { id } = useLocalSearchParams();
    const [todo, setTodo] = useState<{id: number, title: string, completed: boolean}>({id: 0, title: '', completed: false});
    
    const router = useRouter();

    const [loaded, error] = useFonts({
        Poppins_500Medium,
    });

    useEffect(() => {
        const fetchTodo = async (id: string) => {
            try {
                const todos = await AsyncStorage.getItem('todos');
                const storageTodos = todos != null ? JSON.parse(todos) : null;

                if (storageTodos && storageTodos.length > 0) {
                    const myTodo = storageTodos.find((todo: {id: number, title: string, completed: boolean}) => todo.id.toString() === id);
                    setTodo(myTodo);
                }
            }
            catch (e) {
                console.error(e);
            }
        }

        fetchTodo(id as string);
    }, []);

    if (!loaded && ! error) {
        return null;
    }

    const handleSave = async () => {
        try {
            const savedTodo = {...todo, title: todo.title};
            
            const jsonValue = await AsyncStorage.getItem('todos');
            const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null;

            if (storageTodos && storageTodos.length > 0) {
                const otherTodos = storageTodos.filter((todo: {id: number, title: string, completed: boolean}) => todo.id !== savedTodo.id);
                const allTodos = [...otherTodos, savedTodo];
                await AsyncStorage.setItem('todos', JSON.stringify(allTodos));
            } else {
                await AsyncStorage.setItem('todos', JSON.stringify([savedTodo]));
            }
             router.push('/');
        } catch (e) {
            console.error('Error saving todo');
        }
    }

    return (
        <SafeAreaView>
            <StatusBar barStyle="dark-content" />
            <View style={styles.container}>
                <View style={{width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Pressable onPress={() => router.push('/')} style={{position: 'absolute', left: -10, top: 16, padding: 10}}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </Pressable>
                <Text style={{fontFamily: 'Poppins_500Medium', fontSize: 24, textAlign: 'center', marginTop: 20}}>Edit Todo</Text>
                </View>
                <Text style={styles.inputTitle}>Title</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={text => setTodo({...todo, title: text})}
                    value={todo?.title}
                />
                <Pressable onPress={handleSave} style={styles.button}>
                    <Text>Save</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
        height: '100%',
        paddingHorizontal: 20,
        paddingVertical: 8
    },
    inputTitle: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 16,
        marginTop: 20,
        width: '100%',
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginTop: 8,
        fontFamily: 'Poppins_500Medium'
    },
    button: {
        backgroundColor: '#f9c2ff',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        width: '100%',
        alignItems: 'center'
    }
})