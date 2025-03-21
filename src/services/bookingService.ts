import axios from "axios";
import { Bookings } from "../model/booking.type";

export const createBooking = async (payload: any): Promise<any> => {
  const response = await axios.post(
    `${import.meta.env.VITE_BASE_SERVER_URL}/bookings`,
    payload
  );

  return response;
};

export const getAllBookings = async (): Promise<any> => {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_SERVER_URL}/bookings`
  );

  return response;
};

export const approveBookingById = async (data: Bookings): Promise<any> => {
  const response = await axios.post(
    `${import.meta.env.VITE_BASE_SERVER_URL}/bookings/${data._id}`,
    data
  );

  return response;
};

export const deleteBookingById = async (bookingId: string): Promise<any> => {
  const response = await axios.delete(
    `${import.meta.env.VITE_BASE_SERVER_URL}/bookings/${bookingId}`
  );

  return response;
};
