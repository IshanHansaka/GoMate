import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavouritesState {
  stationCodes: string[];
}

const initialState: FavouritesState = {
  stationCodes: [],
};

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    addFavourite: (state, action: PayloadAction<string>) => {
      if (!state.stationCodes.includes(action.payload)) {
        state.stationCodes.push(action.payload);
      }
    },
    removeFavourite: (state, action: PayloadAction<string>) => {
      state.stationCodes = state.stationCodes.filter(
        (code) => code !== action.payload
      );
    },
  },
});

export const { addFavourite, removeFavourite } = favouritesSlice.actions;
export default favouritesSlice.reducer;
