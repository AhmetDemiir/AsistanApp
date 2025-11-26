import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { groupByDay, getDailyStats, getSentimentColor, getSentimentBgColor, sentimentEmoji } from '../utils/sentimentUtils';

export default function DailySummaryScreen() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    loadEntries();
  }, []);

  async function loadEntries() {
    const raw = await AsyncStorage.getItem('entries');
    if (raw) setEntries(JSON.parse(raw));
  }

  const dailyGroups = groupByDay(entries);
  const dailyArray = Object.entries(dailyGroups).sort((a, b) => new Date(b[0]) - new Date(a[0]));

  return (
    <ScrollView style={styles.scrollView}>
      {dailyArray.length === 0 ? (
        <Text style={styles.emptyText}>Henüz kayıt yok.</Text>
      ) : (
        dailyArray.map(([date, dayEntries]) => {
          const stats = getDailyStats(dayEntries);
          return (
            <View key={date} style={styles.summaryCard}>
              <Text style={styles.dateTitle}>{date}</Text>
              <View style={styles.statsRow}>
                <View style={[styles.statBadge, { backgroundColor: '#E8F5E9' }]}>
                  <Text style={[styles.statText, { color: '#4CAF50' }]}>😊 {stats.positive || 0}</Text>
                </View>
                <View style={[styles.statBadge, { backgroundColor: '#FFEBEE' }]}>
                  <Text style={[styles.statText, { color: '#F44336' }]}>😔 {stats.negative || 0}</Text>
                </View>
                <View style={[styles.statBadge, { backgroundColor: '#F5F5F5' }]}>
                  <Text style={[styles.statText, { color: '#9E9E9E' }]}>😐 {stats.nötr || 0}</Text>
                </View>
              </View>
              <FlatList
                data={dayEntries}
                scrollEnabled={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={[styles.entry, { borderLeftColor: getSentimentColor(item.ai?.sentiment), backgroundColor: getSentimentBgColor(item.ai?.sentiment) }]}>
                    <Text style={styles.entryText}>{item.text}</Text>
                    <View style={styles.entryMeta}>
                      <Text style={[styles.sentimentBadge, { color: getSentimentColor(item.ai?.sentiment) }]}>
                        {sentimentEmoji(item.ai?.sentiment)} {item.ai?.sentiment}
                      </Text>
                      <Text style={styles.timeText}>{new Date(item.when).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</Text>
                    </View>
                  </View>
                )}
              />
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  dateTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1976D2',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statBadge: {
    padding: 12,
    borderRadius: 12,
    minWidth: 90,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statText: {
    fontSize: 16,
    fontWeight: '700',
  },
  entry: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  entryText: {
    marginBottom: 10,
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  entryMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sentimentBadge: {
    fontWeight: '700',
    fontSize: 15,
  },
  timeText: {
    color: '#666',
    fontSize: 13,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 60,
    fontSize: 18,
  },
});
