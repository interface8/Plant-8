import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { MarketplaceListing } from '@prisma/client';

interface MarketplaceState {
  listings: MarketplaceListing[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: MarketplaceState = {
  listings: [],
  status: 'idle',
  error: null,
};

export const fetchListings = createAsyncThunk('marketplace/fetchListings', async () => {
  const response = await axios.get('/api/marketplace/listings');
  return response.data;
});

const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {
    addListing: (state, action) => {
      state.listings.unshift(action.payload);
    },
    updateListing: (state, action) => {
      const index = state.listings.findIndex((l) => l.id === action.payload.id);
      if (index !== -1) {
        state.listings[index] = action.payload;
      }
    },
    removeListing: (state, action) => {
      state.listings = state.listings.filter((l) => l.id !== action.payload.id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.listings = action.payload;
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export const { addListing, updateListing, removeListing } = marketplaceSlice.actions;

export default marketplaceSlice.reducer;
