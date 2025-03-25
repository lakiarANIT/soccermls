import React from 'react';
import { Pressable, Text } from '@gluestack-ui/themed';

interface ButtonProps {
  title: string;
  onPress: () => void;
  bg?: string; 
}

export default function Button({ title, onPress, bg = '$primary500' }: ButtonProps) {
  return (
    <Pressable
      bg={bg}
      py="$3"
      px="$6"
      borderRadius="$lg"
      onPress={onPress}
      sx={{ ':pressed': { opacity: 0.7 } }}
    >
      <Text fontSize="$md" fontWeight="$bold" color="$white" textAlign="center">
        {title}
      </Text>
    </Pressable>
  );
}