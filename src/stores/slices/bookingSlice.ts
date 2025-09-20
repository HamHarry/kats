import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as bookingServices from "../../services/bookingService";
import { BookingData } from "../../model/booking.type";
import { DeleteStatus } from "../../model/delete.type";

export interface BookingImageUpdateForm {
  imageName?: string;
}

export interface BookingState {
  bookingUpdateImg?: BookingImageUpdateForm;
}

const initialState: BookingState = {};

const bookingSlice = createSlice({
  name: "documentInfoSlice",
  initialState,
  reducers: {
    setBookingUpdateImg: (state, action: PayloadAction<BookingImageUpdateForm | undefined>) => {
      state.bookingUpdateImg = action.payload;
    },
  },
  extraReducers() {},
});

export const createBooking = createAsyncThunk("booking/create", async (payload: any): Promise<any> => {
  const response = await bookingServices.createBooking(payload);
  return response;
});

export const approveBookingById = createAsyncThunk("booking/approveById", async (data: BookingData): Promise<any> => {
  const response = await bookingServices.approveBookingById(data);
  return response;
});

export const cancelBookingById = createAsyncThunk("booking/cencelById", async (data: BookingData): Promise<any> => {
  const response = await bookingServices.cancelBookingById(data);
  return response;
});

export const getAllBookings = createAsyncThunk("booking/get/all", async (delet?: DeleteStatus): Promise<any> => {
  const response = await bookingServices.getAllBookings(delet);
  return response;
});

export const getAllBookingForPreview = createAsyncThunk("booking/get/all/preview", async (delet?: DeleteStatus): Promise<any> => {
  const response = await bookingServices.getAllBookingForPreview(delet);
  return response;
});

export const getAllBookingPaginations = createAsyncThunk("booking/get/all/Pagination", async (query: any): Promise<any> => {
  const response = await bookingServices.getAllBookingPaginations(query);
  return response;
});

export const getBookingById = createAsyncThunk("booking/get/id", async (bookingId: string): Promise<any> => {
  const response = await bookingServices.getBookingById(bookingId);
  return response;
});

export const updateBookingById = createAsyncThunk("booking/update/id", async (body: any): Promise<any> => {
  const response = await bookingServices.updateBookingById(body);
  return response;
});

export const updateGuaranteeByBookingId = createAsyncThunk("guarantee/update/id", async (body: any): Promise<any> => {
  const response = await bookingServices.updateGuaranteeByBookingId(body);
  return response;
});

export const isDeleteBookingById = createAsyncThunk("booking/updatestatusDelete/id", async (body: any): Promise<any> => {
  const response = await bookingServices.isDeleteBookingById(body);
  return response;
});

export const deleteBookingById = createAsyncThunk("booking/deleteById", async (bookingId: string): Promise<any> => {
  const response = await bookingServices.deleteBookingById(bookingId);
  return response;
});

export const getLastBookingNumber = createAsyncThunk("booking/getLastBookingNumber", async (): Promise<any> => {
  const response = await bookingServices.getLastBookingNumber();
  return response;
});

export const { setBookingUpdateImg } = bookingSlice.actions;

export default bookingSlice.reducer;
