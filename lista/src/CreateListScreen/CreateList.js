import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateListScreen = ({ navigation, route }) => {
  const [listName, setListName] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [listId, setListId] = useState(null);

  useEffect(() => {
    if (route.params?.list) {
      setListName(route.params.list.LISTNAME);
      setListId(route.params.list.id);
      setIsEdit(true);
    }
  }, [route.params?.list]);

  const handleSave = async () => {
    if (!listName.trim()) {
      Alert.alert('Erro', 'Por favor, insira um nome para a lista.');
      return;
    }

    try {
      const storedLists = await AsyncStorage.getItem('LIST');
      let lists = storedLists ? JSON.parse(storedLists) : [];

      if (isEdit) {
        lists = lists.map(list => list.id === listId ? { ...list, LISTNAME: listName } : list);
      } else {
        const newList = { id: Date.now(), LISTNAME: listName, created: new Date().toISOString() };
        lists.push(newList);
      }

      await AsyncStorage.setItem('LIST', JSON.stringify(lists));
      navigation.goBack();
    } catch (e) {
      console.error('Failed to save the list.', e);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nome da Lista"
        value={listName}
        onChangeText={setListName}
      />
      <Button
        title={isEdit ? "Salvar Alterações" : "Criar Lista"}
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

export default CreateListScreen;