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
      alert('Erro ao carregar lista', e);
    }
  };

  const navigateToTopics = (listId)=>{
    navigation.navigate("TopicList", {listId})
  }
  const navigationToEditList = (list)=>{
    navigation.navigate("CreateList", {list})
  }
  const deleteList = async (id) => {
    const updatedLists = lists.filter(list => list.id !== id);
    setLists(updatedLists);
    await AsyncStorage.setItem('LIST', JSON.stringify(updatedLists));
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
      style={styles.createButton}
        onPress={() => navigation.navigate('CreateList')}
      >
      <Text>Criar lista</Text>
      </TouchableOpacity>

      <FlatList
        data={lists.sort((a, b) => {
          if(b.created >= a.created){
            return 1;
          }else{
            return -1
          }
        })}
        
        keyExtractor={item => item.id.toString()}

        renderItem={({ item }) => (
          <View style={styles.components}>
            <Text style={styles.listTitle} onPress={() => navigateToTopics(item.id)}>{item.LISTNAME}</Text>
            {console.log(item)}
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
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#eee"
  },
    components: {
      backgroundColor: '#fff',
      padding: 20,
      marginVertical: 8,
      borderRadius: 10,

    }, 
    listTitle:{
      fontSize: 18,
    },
    listDate:{
      fontSize: 14,
      color: 'gray',
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 10,
    },
    button: {
      padding: 10,
      backgroundColor: '#ddd',
      borderRadius: 5,
    },
    createButton:{
      height: 50,
      margin: 10,
      backgroundColor: "#41B3FF",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10
    }
});

export default HomeScreen;
