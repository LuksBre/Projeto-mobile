import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  Platform,
  Vibration,
  Appearance,
  useColorScheme
} from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

export default function App() {
  const [itemInput, setItemInput] = useState('');
  const [items, setItems] = useState([]);
  const [sorteio, setSorteio] = useState(null);
  const [messageSorteio, setMessageSorteio] = useState("Adicione itens para sortear");
  const [textButton, setTextButton] = useState("Sortear");
  const [sound, setSound] = useState();
  const systemColorScheme = useColorScheme();
  const [manualTheme, setManualTheme] = useState(null);
  const colorScheme = manualTheme || systemColorScheme;

  
  useEffect(() => {
    const loadData = async () => {
      try {
        const [savedItems, savedTheme] = await Promise.all([
          AsyncStorage.getItem('@sorteio_items'),
          AsyncStorage.getItem('@sorteio_theme')
        ]);
        
        if (savedItems) {
          setItems(JSON.parse(savedItems));
          if (JSON.parse(savedItems).length > 0) {
            setMessageSorteio("Itens carregados! Clique em Sortear.");
          }
        }
        
        if (savedTheme) setManualTheme(savedTheme);
        
        
        const { sound } = await Audio.Sound.createAsync(require('./assets/success.mp3'));
        setSound(sound);
      } catch (e) {
        console.error('Erro ao carregar dados:', e);
      }
    };
    
    loadData();
    
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, []);

  
  const toggleTheme = () => {
    const newTheme = colorScheme === 'dark' ? 'light' : 'dark';
    setManualTheme(newTheme);
    AsyncStorage.setItem('@sorteio_theme', newTheme);
    Vibration.vibrate(50);
  };

  const adicionarItem = () => {
    if (!itemInput.trim()) return;
    
    if (items.includes(itemInput)) {
      Alert.alert("Item já existe", "Este item já foi adicionado.");
      return;
    }
    
    const newItems = [...items, itemInput];
    setItems(newItems);
    AsyncStorage.setItem('@sorteio_items', JSON.stringify(newItems));
    setItemInput('');
    setMessageSorteio("Itens adicionados! Clique em Sortear.");
    Vibration.vibrate(50);
  };

  const sortearItem = async () => {
    if (items.length === 0) {
      setMessageSorteio("Adicione itens antes de sortear");
      Vibration.vibrate(200);
      return;
    }
    
    const itemAleatorio = items[Math.floor(Math.random() * items.length)];
    setSorteio(itemAleatorio);
    setTextButton("Sortear Novamente");
    
    Vibration.vibrate([100, 50, 100]);
    try {
      await sound?.replayAsync();
    } catch (error) {
      console.log('Erro ao reproduzir som:', error);
    }
  };

  const removerItem = (item) => {
    Alert.alert(
      "Remover item",
      `Remover "${item}" da lista?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Remover", 
          onPress: () => {
            const newItems = items.filter(i => i !== item);
            setItems(newItems);
            AsyncStorage.setItem('@sorteio_items', JSON.stringify(newItems));
            Vibration.vibrate(10);
          }
        }
      ]
    );
  };

  const limparTudo = () => {
    Alert.alert(
      "Limpar tudo",
      "Tem certeza que deseja limpar todos os itens?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Limpar", 
          onPress: () => {
            setItems([]);
            setSorteio(null);
            setMessageSorteio("Adicione itens para sortear");
            setTextButton("Sortear");
            AsyncStorage.setItem('@sorteio_items', JSON.stringify([]));
            Vibration.vibrate(100);
          }
        }
      ]
    );
  };

  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorScheme === 'dark' ? '#121212' : '#f8f9fa',
    },
    
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 24,
      paddingTop: Platform.OS === 'ios' ? 60 : 40,  
      backgroundColor: colorScheme === 'dark' ? '#1F1F1F' : '#6200EE',
      borderBottomWidth: 1,
      borderBottomColor: colorScheme === 'dark' ? '#333' : '#5E00D1',
      elevation: 3,
      paddingBottom: 20,  
    },
    headerTitle: {
      color: '#FFF',
      fontSize: 35,
      fontWeight: '700',
    },
    themeButton: {
      padding: 10,
      borderRadius: 10,
      backgroundColor: colorScheme === 'dark' ? '#333' : '#7C4DFF',
    },
    content: {
      flex: 1,
      padding: 24,
      paddingTop: 60,  
    },
    inputContainer: {
      marginBottom: 20,
    },
    input: {
      height: 50,
      backgroundColor: colorScheme === 'dark' ? '#1F1F1F' : '#FFF',
      borderWidth: 1,
      borderColor: colorScheme === 'dark' ? '#333' : '#E0E0E0',
      borderRadius: 12,
      padding: 14,
      fontSize: 16,
      color: colorScheme === 'dark' ? '#FFF' : '#333',
      elevation: 1,
    },
    button: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
      borderRadius: 12,
      backgroundColor: colorScheme === 'dark' ? '#333' : '#6200EE',
      marginVertical: 8,
      elevation: 2,
    },
    buttonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 10,
    },
    clearButton: {
      backgroundColor: '#D32F2F',
    },
    drawButton: {
      backgroundColor: '#388E3C',
    },
    listContainer: {
      backgroundColor: colorScheme === 'dark' ? '#1F1F1F' : '#FFF',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      elevation: 2,
    },
    listTitle: {
      color: colorScheme === 'dark' ? '#AAA' : '#666',
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 12,
    },
    item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 12,
      backgroundColor: colorScheme === 'dark' ? '#252525' : '#F5F5F5',
      borderRadius: 8,
      marginBottom: 8,
    },
    itemText: {
      color: colorScheme === 'dark' ? '#FFF' : '#333',
      fontSize: 16,
    },
    resultContainer: {
      backgroundColor: colorScheme === 'dark' ? '#1F1F1F' : '#FFF',
      borderRadius: 12,
      padding: 24,
      alignItems: 'center',
      elevation: 2,
    },
    resultMessage: {
      color: colorScheme === 'dark' ? '#AAA' : '#666',
      fontSize: 16,
      marginBottom: 8,
      textAlign: 'center',
    },
    resultText: {
      color: '#D32F2F',
      fontSize: 32,
      fontWeight: '700',
      marginTop: 8,
    },
    emptyList: {
      color: colorScheme === 'dark' ? '#666' : '#999',
      textAlign: 'center',
      fontStyle: 'italic',
      padding: 16,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gallo's Sorteador</Text>
        <TouchableOpacity 
          style={styles.themeButton} 
          onPress={toggleTheme}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={colorScheme === 'dark' ? 'sunny' : 'moon'} 
            size={20} 
            color="#FFF" 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={itemInput}
            onChangeText={setItemInput}
            placeholder="Digite um item..."
            placeholderTextColor={colorScheme === 'dark' ? '#666' : '#999'}
            onSubmitEditing={adicionarItem}
          />
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={adicionarItem}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Adicionar Item</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>
            Itens para Sorteio ({items.length})
          </Text>
          
          <ScrollView style={{ maxHeight: 150 }}>
            {items.length > 0 ? (
              items.map((item, index) => (
                <View key={index} style={styles.item}>
                  <Text style={styles.itemText}>{item}</Text>
                  <TouchableOpacity 
                    onPress={() => removerItem(item)}
                    activeOpacity={0.7}
                  >
                    <Ionicons 
                      name="trash" 
                      size={18} 
                      color={colorScheme === 'dark' ? '#AAA' : '#888'} 
                    />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.emptyList}>Nenhum item adicionado</Text>
            )}
          </ScrollView>
        </View>

        <TouchableOpacity 
          style={[styles.button, styles.drawButton]}
          onPress={sortearItem}
          activeOpacity={0.7}
        >
          <Ionicons name="shuffle" size={20} color="#FFF" />
          <Text style={styles.buttonText}>{textButton}</Text>
        </TouchableOpacity>

        {items.length > 0 && (
          <TouchableOpacity 
            style={[styles.button, styles.clearButton]}
            onPress={limparTudo}
            activeOpacity={0.7}
          >
            <Ionicons name="trash" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Limpar Todos</Text>
          </TouchableOpacity>
        )}

        <View style={styles.resultContainer}>
          <Text style={styles.resultMessage}>{messageSorteio}</Text>
          {sorteio && <Text style={styles.resultText}>{sorteio}</Text>}
        </View>
      </View>
      
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}