import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TopicScreen = ({ navigation, route }) => {
  const [topicName, setTopicName] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [topicId, setTopicId] = useState(null);
  const listId = route.params?.listId;

  useEffect(() => {
    if (route.params?.topic) {
      setTopicName(route.params.topic.name);
      setTopicId(route.params.topic.id);
      setIsEdit(true);
    }
  }, [route.params?.topic]);

  const handleSave = async () => {
    if (!topicName.trim()) {
      Alert.alert('Erro', 'Por favor, insira um nome para o tópico.');
      return;
    }

    try {
        const storedTopics = await AsyncStorage.getItem(`topics_${listId}`);
        let topics = storedTopics ? JSON.parse(storedTopics) : [];
  
        const newTopic = {
          id: Date.now(),
          TOPICNAME: topicName, // Usando a chave TOPICNAME conforme definido no JSON
          LISTID: listId       // Associando o tópico à lista
        };
  
        if (isEdit) {
          topics = topics.map(t => t.id === topicId ? newTopic : t);
        } else {
          topics.push(newTopic);
        }
  
        await AsyncStorage.setItem(`topics_${listId}`, JSON.stringify(topics));
        navigation.goBack();
      } catch (e) {
        console.error('Failed to save the topic.', e);
      }
    
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nome do Tópico"
        value={topicName}
        onChangeText={setTopicName}
      />
      <Button
        title={isEdit ? "Salvar Alterações" : "Adicionar Tópico"}
        onPress={handleSave}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default TopicScreen;
