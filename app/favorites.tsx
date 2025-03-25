import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/redux';
import { db } from '@api/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Box, Text, ScrollView, HStack, Image } from '@gluestack-ui/themed';

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
    <Box flex={1} bg="$gray100" pt="$4">
      <Text fontSize="$2xl" fontWeight="$bold" color="$primary900" textAlign="center" mb="$6">
        Favorites
      </Text>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {favorites.map((game) => (
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
            <Text fontSize="$sm" color="$gray600" textAlign="center">
              {formatDateTime(game.dateEvent, game.strTime)}
            </Text>
          </Box>
        ))}
      </ScrollView>
    </Box>
  );
}