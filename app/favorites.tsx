import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/redux';
import { db } from '@api/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface Game {
  idEvent: string;
  strEvent: string;
  strHomeTeam: string;
  strAwayTeam: string;
  strHomeTeamBadge: string;
  strAwayTeamBadge: string;
  dateEvent: string;
  strTime: string;
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<Game[]>([]);
  const { userId } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (userId) {
        const q = query(collection(db, 'favorites'), where('userId', '==', userId));
        const snapshot = await getDocs(q);
        const gameIds = snapshot.docs.map((doc) => doc.data().gameId);
        const response = await fetch('https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=4349');
        const data = await response.json();
        setFavorites(data.events.filter((game: Game) => gameIds.includes(game.idEvent)));
      }
    };
    fetchFavorites();
  }, [userId]);

  const formatDateTime = (date: string, time: string) =>
    new Date(`${date}T${time}Z`).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Favorites</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {favorites.map((game) => (
          <View key={game.idEvent} style={styles.gameCard}>
            <View style={styles.teamsContainer}>
              <View style={styles.team}>
                <Image source={{ uri: game.strHomeTeamBadge }} style={styles.teamBadge} />
                <Text style={styles.teamName}>{game.strHomeTeam}</Text>
              </View>
              <Text style={styles.vsText}>VS</Text>
              <View style={styles.team}>
                <Image source={{ uri: game.strAwayTeamBadge }} style={styles.teamBadge} />
                <Text style={styles.teamName}>{game.strAwayTeam}</Text>
              </View>
            </View>
            <Text style={styles.dateTime}>{formatDateTime(game.dateEvent, game.strTime)}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 10 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  scrollContent: { paddingBottom: 20 },
  gameCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  teamsContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  team: { alignItems: 'center', flex: 1 },
  teamBadge: { width: 40, height: 40, marginBottom: 5 },
  teamName: { fontSize: 16, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  vsText: { fontSize: 18, fontWeight: 'bold', color: '#888', marginHorizontal: 10 },
  dateTime: { fontSize: 14, color: '#666', textAlign: 'center' },
});