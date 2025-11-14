import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { resumeService } from '../../services/resume.service';
import type { Resume, ResumeContent } from '../../types/resume.types';

interface ResumeState {
  items: Record<number, Resume>;
  currentId: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: ResumeState = {
  items: {},
  currentId: null,
  loading: false,
  error: null,
};

export const fetchResumes = createAsyncThunk('resumes/list', async () => {
  return resumeService.list();
});

export const fetchResumeById = createAsyncThunk(
  'resumes/detail',
  async (resumeId: number) => {
    return resumeService.get(resumeId);
  },
);

const resumeSlice = createSlice({
  name: 'resumes',
  initialState,
  reducers: {
    setCurrentResume(state, action: PayloadAction<number | null>) {
      state.currentId = action.payload;
    },
    updateResumeContent(
      state,
      action: PayloadAction<{ id: number; content: ResumeContent }>,
    ) {
      const resume = state.items[action.payload.id];
      if (resume) {
        resume.content = action.payload.content;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResumes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResumes.fulfilled, (state, action) => {
        state.loading = false;
        action.payload.forEach((resume) => {
          state.items[resume.id] = resume;
        });
      })
      .addCase(fetchResumes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Unable to load resumes';
      })
      .addCase(fetchResumeById.fulfilled, (state, action) => {
        state.items[action.payload.id] = action.payload;
        state.currentId = action.payload.id;
      });
  },
});

export const { setCurrentResume, updateResumeContent } = resumeSlice.actions;
export default resumeSlice.reducer;

