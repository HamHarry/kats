import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as bookingServices from "../../services/bookingService";
import { Bookings } from "../../model/booking.type";

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

export const approveBookingById = createAsyncThunk(
  "booking/approveById",
  async (data: Bookings): Promise<any> => {
    const response = await bookingServices.approveBookingById(data);
    return response;
  }
);

export const deleteBookingById = createAsyncThunk(
  "booking/deleteById",
  async (bookingId: string): Promise<any> => {
    const response = await bookingServices.deleteBookingById(bookingId);
    return response;
  }
);

export default bookingSlice.reducer;
