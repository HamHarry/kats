import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as bookingServices from "../../services/bookingService";

const initialState: any = {};

const bookingSlice = createSlice({
  name: "documentInfoSlice",
  initialState,
  reducers: {},
  extraReducers() {},
});

export const createBooking = createAsyncThunk(
  "booking/create",
  async (payload: any): Promise<any> => {
    const response = await bookingServices.createBooking(payload);
    return response;
  }
);

export const getAllBookings = createAsyncThunk(
  "booking/get/all",
  async (): Promise<any> => {
    const response = await bookingServices.getAllBookings();
    return response;
  }
);

export const deleteBookingById = createAsyncThunk(
  "booking/DeleteById",
  async (bookingId: string): Promise<any> => {
    const response = await bookingServices.deleteBookingById(bookingId);
    return response;
  }
);

export default bookingSlice.reducer;
