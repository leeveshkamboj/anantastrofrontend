import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface KundliFormData {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
}

const initialState: KundliFormData = {
  name: '',
  dateOfBirth: '',
  timeOfBirth: '',
  placeOfBirth: '',
};

const kundliFormSlice = createSlice({
  name: 'kundliForm',
  initialState,
  reducers: {
    setKundliFormData: (state, action: PayloadAction<Partial<KundliFormData>>) => {
      return { ...state, ...action.payload };
    },
    clearKundliFormData: () => initialState,
  },
});

export const { setKundliFormData, clearKundliFormData } = kundliFormSlice.actions;

export const selectKundliFormData = (state: { kundliForm: KundliFormData }) =>
  state.kundliForm;

export default kundliFormSlice.reducer;
