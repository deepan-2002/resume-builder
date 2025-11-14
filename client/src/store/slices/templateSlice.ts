import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { templateService } from '../../services/resume.service';
import type { TemplateSummary } from '../../types/resume.types';

interface TemplateState {
  items: TemplateSummary[];
  categories: string[];
  loading: boolean;
}

const initialState: TemplateState = {
  items: [],
  categories: [],
  loading: false,
};

export const fetchTemplates = createAsyncThunk(
  'templates/list',
  async () => templateService.list(),
);

export const fetchTemplateCategories = createAsyncThunk(
  'templates/categories',
  async () => templateService.categories(),
);

const templateSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTemplates.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchTemplateCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export default templateSlice.reducer;

