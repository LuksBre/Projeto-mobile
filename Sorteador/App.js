import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";

export default function App() {
  const [itemInput, setItemInput] = useState('');
  const [items, setItems] = useState([]);
  const [sorteio, setSorteio] = useState(null);
  const [messageSorteio, setMessageSorteio] = useState("Adicione itens para sortear");
  const [textButton, setTextButton] = useState("Sortear");

  function adicionarItem() {
    if (itemInput.trim() !== '') {
      if (items.includes(itemInput)) {
        Alert.alert("Item já adicionado", "Este item já foi adicionado ao sorteio.");
        setItemInput('');
        return;
      }
      setItems([...items, itemInput]);
      setItemInput('');
      setMessageSorteio("Itens adicionados! Agora, clique em Sortear.");
    }
  }

  function sortearItem() {
    if (items.length > 0) {
      const itemAleatorio = items[Math.floor(Math.random() * items.length)];
      setSorteio(itemAleatorio);
      setTextButton("Sortear Novamente");
    } else {
      setSorteio(null);
      setMessageSorteio("Adicione itens antes de sortear");
      setTextButton("Sortear");
    }
  }

  function removerItem(item) {
    Alert.alert(
      "Remover item",
      `Você tem certeza que deseja remover "${item}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Remover", onPress: () => setItems(items.filter(i => i !== item)) }
      ]
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titlecontainer}>
        <Text style={styles.title}>Gallo's Sorteador</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.subtitle}>Adicione itens para sorteio</Text>

        <TextInput
          style={styles.input}
          value={itemInput}
          onChangeText={setItemInput}
          placeholder="Exemplo: Nome João, Número 5, Símbolo @"
          placeholderTextColor="#bbb"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={adicionarItem}
        >
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.text}>Adicionar</Text>
        </TouchableOpacity>

        <View style={styles.itemsListContainer}>
          <Text style={styles.itemsListTitle}>Itens adicionados:</Text>
          <ScrollView style={styles.itemsList}>
            {items.map((item, index) => (
              <View key={index} style={styles.itemContainer}>
                <Text style={styles.itemText}>{item}</Text>
                <TouchableOpacity onPress={() => removerItem(item)}>
                  <Ionicons name="trash-bin-outline" size={20} color="#bbb" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={sortearItem}
        >
          <Ionicons name="shuffle-sharp" size={24} color="#fff" />
          <Text style={styles.text}>{textButton}</Text>
        </TouchableOpacity>

        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{messageSorteio}</Text>
          <Text style={styles.result}>{sorteio}</Text>
        </View>

      </View>
      <StatusBar style='dark' />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a', 
  },
  titlecontainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 90
    ,
    backgroundColor: '#333333', 
  },
  title: {
    color: '#fff', 
    fontSize: 26,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1a1a1a', 
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 22,
    color: '#ccc', 
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '100%',
    fontSize: 16,
    borderColor: '#444',
    borderBottomWidth: 1,
    marginBottom: 20,
    color: '#fff', 
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#444', 
    borderRadius: 25,
    marginTop: 10,
    marginBottom: 10,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  resultText: {
    fontSize: 16,
    color: '#bbb', 
    fontWeight: 'normal',
  },
  result: {
    fontSize: 36,
    color: '#D90429', 
    fontWeight: 'bold',
  },
  itemsListContainer: {
    marginTop: 20,
    paddingVertical: 10,
    backgroundColor: '#333', 
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
  },
  itemsListTitle: {
    fontSize: 16,
    color: '#ccc', 
    textAlign: 'center',
    marginBottom: 10,
  },
  itemsList: {
    maxHeight: 150,
  },
  itemText: {
    fontSize: 16,
    color: '#fff', 
    paddingVertical: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
});
