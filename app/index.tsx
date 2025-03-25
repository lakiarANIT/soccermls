import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/redux';
import { db } from '@api/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { Box, Text, ScrollView, HStack, Image, Input, InputField, Pressable } from '@gluestack-ui/themed';
import { MaterialIcons } from '@expo/vector-icons';

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
    <Box flex={1} bg="$gray100" pt="$4">
      <Input mx="$5" my="$4" borderRadius="$lg" bg="$white" borderColor="$gray300">
        <InputField
          placeholder="Search by team or league..."
          value={search}
          onChangeText={setSearch}
          fontSize="$sm"
          color="$gray800"
        />
      </Input>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {filteredGames.map((game) => (
          <Box
            key={game.idEvent}
            bg="$white"
            mx="$5"
            mb="$4"
            borderRadius="$lg"
            p="$4"
            shadowColor="$gray900"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.1}
            shadowRadius={4}
            elevation={3}
          >
            <HStack alignItems="center" mb="$2">
              <Image source={{ uri: game.strLeagueBadge }} size="xs" alt={game.strLeague} mr="$2" />
              <Text fontSize="$sm" fontWeight="$semibold" color="$gray600">
                {game.strLeague}
              </Text>
            </HStack>
            <HStack alignItems="center" justifyContent="space-between" mb="$2">
              <Box alignItems="center" flex={1}>
                <Image
                  source={{ uri: game.strHomeTeamBadge }}
                  size="sm" // Changed from md to sm (24px)
                  alt={game.strHomeTeam}
                  mb="$2"
                />
                <Text fontSize="$md" fontWeight="$bold" color="$gray800" textAlign="center">
                  {game.strHomeTeam}
                </Text>
              </Box>
              <Text fontSize="$lg" fontWeight="$bold" color="$gray600" mx="$2">
                VS
              </Text>
              <Box alignItems="center" flex={1}>
                <Image
                  source={{ uri: game.strAwayTeamBadge }}
                  size="sm" // Changed from md to sm (24px)
                  alt={game.strAwayTeam}
                  mb="$2"
                />
                <Text fontSize="$md" fontWeight="$bold" color="$gray800" textAlign="center">
                  {game.strAwayTeam}
                </Text>
              </Box>
            </HStack>
            <Text fontSize="$sm" color="$gray600" textAlign="center" mb="$2">
              {formatDateTime(game.dateEvent, game.strTime)}
            </Text>
            <Text fontSize="$xs" color="$gray500" textAlign="center" mb="$2">
              {game.strVenue}
            </Text>
            <Pressable
              position="absolute"
              top="$2"
              right="$2"
              onPress={() => toggleFavorite(game.idEvent)}
              sx={{ ':pressed': { opacity: 0.8 } }}
            >
              <MaterialIcons
                name={favorites.includes(game.idEvent) ? 'star' : 'star-border'}
                size={24}
                color={favorites.includes(game.idEvent) ? '#FFD700' : '$gray300'}
              />
            </Pressable>
          </Box>
        ))}
      </ScrollView>
    </Box>
  );
}