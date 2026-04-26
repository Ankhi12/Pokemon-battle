
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const fetchPokemon = createAsyncThunk(
  'pokemon/fetch',
  async () => {
     const response = await fetch('https://pokeapi.co/api/v2/pokemon');
     const data = await response.json();

     return data.results.map((p, index) => ({
       name: p.name,
       image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`
     }));
    }

);

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState: 
  { list: [], 
   status: 'idle' 
  },   
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemon.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchPokemon.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchPokemon.rejected, (state) => { state.status = 'failed'; });
  }
});

export default pokemonSlice.reducer;

