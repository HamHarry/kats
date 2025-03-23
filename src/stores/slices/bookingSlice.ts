import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as bookingServices from "../../services/bookingService";
import { BookingData } from "../../model/booking.type";

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

export const approveBookingById = createAsyncThunk(
  "booking/approveById",
  async (data: BookingData): Promise<any> => {
    const response = await bookingServices.approveBookingById(data);
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

export const getBookingById = createAsyncThunk(
  "booking/get/id",
  async (bookingId: string): Promise<any> => {
    const response = await bookingServices.getBookingById(bookingId);
    return response;
  }
);

export const updateBookingById = createAsyncThunk(
  "booking/update/id",
  async (body: any): Promise<any> => {
    const response = await bookingServices.updateBookingById(body);
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
