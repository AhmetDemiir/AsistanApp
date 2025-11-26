import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { analyzeText } = require('../api/aiService');
import { getSentimentBgColor, getSentimentColor, sentimentEmoji } from '../utils/sentimentUtils';

export default function HomeScreen() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [entries, setEntries] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    loadEntries();
  }, []);

  async function loadEntries() {
    const raw = await AsyncStorage.getItem('entries');
    if (raw) setEntries(JSON.parse(raw));
  }

  async function saveEntry(item) {
    const newList = [item, ...entries];
    await AsyncStorage.setItem('entries', JSON.stringify(newList));
    setEntries(newList);
  }

  async function onAnalyze() {
    if (!text.trim()) return;
    setResult({ loading: true });
    try {
      const r = await analyzeText(text.trim());
      const entry = {
        id: Date.now().toString(),
        text: text.trim(),
        when: new Date().toISOString(),
        ai: r
      };
      await saveEntry(entry);
      setResult(r);
      setText('');
    } catch (e) {
      setResult({ error: 'Analiz sırasında hata oluştu.' });
    }
  }

  return (
    <View style={[styles.container, result && result.sentiment ? { backgroundColor: getSentimentBgColor(result.sentiment) } : {}]}>
      <View style={{ width: '100%' }}>
        <View style={styles.titleContainer}>
          <Image
            source={require('../assets/bird_character.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Akıllı Asistan</Text>
        </View>

        <TextInput
          placeholder="Bugün nasılsın?"
          value={text}
          onChangeText={setText}
          style={styles.input}
          multiline
          placeholderTextColor="#999"
        />

        <TouchableOpacity style={styles.button} onPress={onAnalyze}>
          <Text style={styles.buttonText}>Analiz Et</Text>
        </TouchableOpacity>

        {result && (
          <View style={styles.resultBox}>
            {result.loading ? (
              <Text style={styles.loadingText}>Analiz ediliyor...</Text>
            ) : result.error ? (
              <Text style={styles.errorText}>{result.error}</Text>
            ) : (
              <>
                <View style={styles.resultHeader}>
                  <Text style={[styles.sentimentBadge, { color: getSentimentColor(result.sentiment) }]}>
                    {sentimentEmoji(result.sentiment)} {result.sentiment}
                  </Text>
                </View>
                <Text style={styles.resultLine}>Özet: {result.summary}</Text>
                <Text style={styles.resultLine}>Öneri: {result.suggestion}</Text>
              </>
            )}
          </View>
        )}

        <TouchableOpacity style={styles.historyButton} onPress={() => navigation.navigate('History')}>
          <Text style={styles.historyButtonText}>📊 Geçmişi Görüntüle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#E3F2FD',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1976D2',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    minHeight: 100,
    borderWidth: 2,
    borderColor: '#90CAF9',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 16,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    backgroundColor: '#1976D2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  resultBox: {
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultHeader: {
    marginBottom: 12,
  },
  resultLine: {
    marginBottom: 10,
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
  },
  errorText: {
    textAlign: 'center',
    color: '#F44336',
    fontSize: 16,
  },
  historyButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1976D2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyButtonText: {
    color: '#1976D2',
    fontWeight: '700',
    fontSize: 16,
  },
  sentimentBadge: {
    fontWeight: '700',
    fontSize: 15,
  },
});
