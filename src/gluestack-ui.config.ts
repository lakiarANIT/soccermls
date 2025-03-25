import { config as defaultConfig } from '@gluestack-ui/config';
import { createConfig, createComponents } from '@gluestack-ui/themed';

const customConfig = createConfig({
  ...defaultConfig,
  tokens: {
    ...defaultConfig.tokens,
    colors: {
      ...defaultConfig.tokens.colors,
      primary900: '#6A1B9A', 
      primary700: '#8E24AA', 
      primary500: '#AB47BC', 
      primary300: '#B39DDB', 
      primary100: '#E1BEE7', 
    },
  },
});

export const config = customConfig;