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
      setTopicName(route.params.topic.TOPICNAME);
      setTopicId(route.params.topic.id);
      setIsEdit(true);
    }
  }, [route.params?.topic]);

  const handleSave = async () => {
    if (!topicName.trim()) {
      alert('Por favor, insira um nome para o tópico.');
      return;
    }

    try {
        const storedTopics = await AsyncStorage.getItem(`topics_${listId}`);
        let topics = storedTopics ? JSON.parse(storedTopics) : [];
  
        if (isEdit) {
          topics = topics.map(item => item.id === topicId ? { ...item, TOPICNAME: topicName, created: new Date().toLocaleString()} : item);

        } else {
          const newTopic = { id: Date.now(), TOPICNAME: topicName, created: new Date().toLocaleString()};
          topics.push(newTopic);
        }
  
        await AsyncStorage.setItem(`topics_${listId}`, JSON.stringify(topics));
        navigation.goBack();
      } catch (e) {
        alert('Erro ao salvar tópico', e);
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
