import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";
const TopicsListScreen = ({ navigation, route }) => {
  const [topics, setTopics] = useState([]);
  const listId = route.params?.listId;
  const focus = useIsFocused();

  useEffect(() => {
    loadTopics();
  }, [focus]);

  const loadTopics = async () => {
    try {
      const storedTopics = await AsyncStorage.getItem(`topics_${listId}`);

      if (storedTopics !== null) {
        setTopics(JSON.parse(storedTopics));
      }
    } catch (e) {
      console.error('erro ao carregar tópicos.', e);
    }
  };

 const navigateToEditTopic = (topic) => {
    navigation.navigate('CreateTopic', { listId, topic });
  };

  const deleteTopic = async (topicId) => {
    console.log(topicId)
    const updatedTopics = topics.filter(topic => topic.id !== topicId);
    await AsyncStorage.setItem(`topics_${listId}`, JSON.stringify(updatedTopics));
    setTopics(updatedTopics);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={topics.sort((a, b) => {
          if(b.created >= a.created){
            return 1;
          }else{
            return -1
          }
        })}
        keyExtractor={item => item?.id?.toString() ?? 'default-key'}

        renderItem={({ item }) => (
          <View style={styles.topicItem}>
            <Text style={styles.topicName}>{item.TOPICNAME}</Text>
            <Text style={styles.topicDate}>Criado em: {item.created}</Text>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.button} onPress={() => navigateToEditTopic(item)}>
                <Text>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={() => deleteTopic(item.id)}>
                <Text>Excluir</Text>
              </TouchableOpacity>

            </View>
          </View>
        )}
      />
      <Button title="Criar Tópico" onPress={() => navigation.navigate('CreateTopic', { listId })} />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    topicItem: {
      backgroundColor: '#fff',
      padding: 20,
      marginVertical: 8,
      borderRadius: 5,
    },
    topicName: {
      fontSize: 18,
    },
    topicDate: {
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
  });

export default TopicsListScreen;