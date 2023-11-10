import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";
const HomeScreen = ({ navigation }) => {
  const [lists, setLists] = useState([]);
  const focus = useIsFocused();
  useEffect(() => {
    loadLists();
  }, [focus]);

  const loadLists = async () => {
    try {
      const storedLists = await AsyncStorage.getItem('LIST');
      if (storedLists !== null) {
        setLists(JSON.parse(storedLists));
      }
    } catch (e) {
      console.error('Failed to load lists.', e);
    }
  };

  const navigateToTopics = (listId)=>{
    navigation.navigate("TopicList", {listId})
  }
  const navigationToEditList = (list)=>{
    navigation.navigate("CreateList", {list})
  }
  const deleteList = async (id) => {
    console.log("funciona")
    const updatedLists = lists.filter(list => list.id !== id);
    setLists(updatedLists);
    await AsyncStorage.setItem('LIST', JSON.stringify(updatedLists));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={lists.sort((a, b) => new Date(b.created) - new Date(a.created))}
        keyExtractor={item => item.id.toString()}

        renderItem={({ item }) => (
          <View style={styles.components}>
            <Text style={styles.listTitle} onPress={() => navigateToTopics(item.id)}>{item.LISTNAME}</Text>

            <Text style={styles.listDate}>Criado em: {item.created}</Text>
            
            <View style={styles.buttonsContainer}>

              <TouchableOpacity
                style={styles.button}
                onPress={() => navigationToEditList(item)}
              >
                <Text>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() => deleteList(item.id)}
              >
                <Text>Excluir</Text>
              </TouchableOpacity>

            </View>
          </View>
        )}
      />
      <Button
        title="Criar Lista"
        onPress={() => navigation.navigate('CreateList')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    components: {
        flex: 1,
        flexDirection: 'row',
        gap: 10,
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: 1,
        width: 300,
        padding: 30,
        borderRadius: 10,

    }, 
    button: {
        width: 100,
        height: 25,
        margin: 10,
        backgroundColor: "#41B3FF",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
    },
});

export default HomeScreen;
