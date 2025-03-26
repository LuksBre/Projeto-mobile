import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, Keyboard, ScrollView } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";

export default function App() {
  const [itemInput, setItemInput] = useState('');
  const [items, setItems] = useState([]);
  const [sorteio, setSorteio] = useState(null);
  const [messageSorteio, setMessageSorteio] = useState("Adicione itens para sortear");
  const [textButton, setTextButton] = useState("Sortear");

  // Função para adicionar o item à lista
  function adicionarItem() {
    if (itemInput.trim() !== '') {
      setItems([...items, itemInput]);
      setItemInput('');  // Limpa o campo de input
      setMessageSorteio("Itens adicionados! Agora, clique em Sortear.");
    }
  }

  // Função para realizar o sorteio
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titlecontainer}>
        <Text style={styles.title}>Silvinha Sorteador</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.subtitle}>Adicione itens para sorteio</Text>

        <TextInput
          style={styles.input}
          value={itemInput}
          onChangeText={setItemInput}
          placeholder="Exemplo: Nome João, Número 5, Símbolo @"
        />
        
        <TouchableOpacity
          style={styles.button}
          onPress={adicionarItem}
        >
          <Ionicons name="add-circle-outline" size={24} color="#edf2f4" />
          <Text style={styles.text}>Adicionar Item</Text>
        </TouchableOpacity>

        {/* Exibe a lista de itens adicionados com uma "caixinha" */}
        <View style={styles.itemsListContainer}>
          <Text style={styles.itemsListTitle}>Itens adicionados:</Text>
          <ScrollView style={styles.itemsList}>
            {items.map((item, index) => (
              <Text key={index} style={styles.itemText}>{item}</Text>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={sortearItem}
        >
          <Ionicons name="shuffle-sharp" size={24} color="#edf2f4" />
          <Text style={styles.text}>{textButton}</Text>
        </TouchableOpacity>

        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{messageSorteio}</Text>
          <Text style={styles.result}>{sorteio}</Text>
        </View>

      </View>
      <StatusBar style='light' />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF2F4',
  },
  titlecontainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 130,
    backgroundColor: '#D90429',
    borderBottomStartRadius: 25,
    borderBottomEndRadius: 25,
  },
  title: {
    color: '#EDF2F4',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  content: {
    flex: 1,
    padding: 40,
    width: '100%',
    backgroundColor: 'EDF2F4'
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 24,
    color: '#D90429',
    fontWeight: 'bold',
    marginBottom: 40,
  },
  input: {
    height: 45,
    width: '100%',
    fontSize: 18,
    borderColor: '#D90429',
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ef233c',
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  text: {
    color: '#edf2f4',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  resultText: {
    fontSize: 18,
    color: '#ef233c',
    fontWeight: 'bold',
  },
  result: {
    fontSize: 48,
    color: '#ef233c',
    fontWeight: 'bold',
  },
  itemsListContainer: {
    marginTop: 20,
    paddingVertical: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#D90429',
  },
  itemsListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D90429',
    textAlign: 'center',
    marginBottom: 10,
  },
  itemsList: {
    maxHeight: 150, // Limita a altura para rolamento
  },
  itemText: {
    fontSize: 18,
    color: '#333',
    paddingVertical: 5,
  },
});
