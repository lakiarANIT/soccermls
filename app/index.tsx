import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/redux';
import { FontAwesome } from '@expo/vector-icons';
import { db } from '@api/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

interface Game {
  idEvent: string;
  strEvent: string;
  strHomeTeam: string;
  strAwayTeam: string;
  strHomeTeamBadge: string;
  strAwayTeamBadge: string;
  strLeague: string;
  strLeagueBadge: string;
  dateEvent: string;
  strTime: string;
  strVenue: string;
}

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const { userId } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchGames = async () => {
      const response = await fetch('https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=4349');
      const data = await response.json();
      setGames(data.events || []);
    };
    fetchGames();

    const fetchFavorites = async () => {
      if (userId) {
        const q = query(collection(db, 'favorites'), where('userId', '==', userId));
        const snapshot = await getDocs(q);
        setFavorites(snapshot.docs.map((doc) => doc.data().gameId));
      }
    };
    fetchFavorites();
  }, [userId]);

  const filteredGames = games.filter(
    (game) =>
      game.strHomeTeam.toLowerCase().includes(search.toLowerCase()) ||
      game.strAwayTeam.toLowerCase().includes(search.toLowerCase()) ||
      game.strLeague.toLowerCase().includes(search.toLowerCase())
  );

  const toggleFavorite = async (gameId: string) => {
    if (favorites.includes(gameId)) {
      setFavorites(favorites.filter((id) => id !== gameId));
      // Remove from Firebase (requires additional logic)
    } else {
      setFavorites([...favorites, gameId]);
      await addDoc(collection(db, 'favorites'), { userId, gameId });
    }
  };

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
      <TextInput
        style={styles.searchInput}
        placeholder="Search by team or league..."
        value={search}
        onChangeText={setSearch}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredGames.map((game) => (
          <View key={game.idEvent} style={styles.gameCard}>
            <View style={styles.leagueContainer}>
              <Image source={{ uri: game.strLeagueBadge }} style={styles.leagueBadge} />
              <Text style={styles.leagueName}>{game.strLeague}</Text>
            </View>
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
            <Text style={styles.venue}>{game.strVenue}</Text>
            <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorite(game.idEvent)}>
              <FontAwesome
                name={favorites.includes(game.idEvent) ? 'star' : 'star-o'}
                size={24}
                color={favorites.includes(game.idEvent) ? '#FFD700' : '#ccc'}
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 10 },
  searchInput: {
    margin: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
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
  leagueContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  leagueBadge: { width: 24, height: 24, marginRight: 8 },
  leagueName: { fontSize: 14, fontWeight: '600', color: '#555' },
  teamsContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  team: { alignItems: 'center', flex: 1 },
  teamBadge: { width: 40, height: 40, marginBottom: 5 },
  teamName: { fontSize: 16, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  vsText: { fontSize: 18, fontWeight: 'bold', color: '#888', marginHorizontal: 10 },
  dateTime: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 5 },
  venue: { fontSize: 12, color: '#999', textAlign: 'center', marginBottom: 10 },
  favoriteButton: { position: 'absolute', top: 10, right: 10 },
});