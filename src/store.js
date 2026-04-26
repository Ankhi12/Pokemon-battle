

import { configureStore } from '@reduxjs/toolkit';
import pokemonReducer from './pokemonSlice';
import battleReducer from './battleSlice';

export const store = configureStore({
  reducer: {
    pokemon: pokemonReducer,
    battle: battleReducer,
  },
});
