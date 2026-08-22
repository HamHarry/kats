import { ApiResponse } from "../model/api.type";
import { BookingData } from "../model/booking.type";
import { DeleteStatus } from "../model/delete.type";
import { HttpClient } from "../shared/utils/HttpClient";

export interface BookingQuery {
  term?: string;
  receiptBookNo?: string;
  productName?: string;
}

export interface BookingUpdateBody {
  bookingId: string;
  data: BookingData;
}

export const createBooking = async (payload: BookingData): ApiResponse<BookingData> => {
  const response = await HttpClient.post<BookingData>(`/bookings`, payload);

  return response;
};

export const approveBookingById = async (data: BookingData): ApiResponse<BookingData> => {
  const response = await HttpClient.post<BookingData>(`/bookings/approve/${data._id}`, data);

  return response;
};

export const cancelBookingById = async (data: BookingData): ApiResponse<BookingData> => {
  const response = await HttpClient.post<BookingData>(`/bookings/cancel/${data._id}`, data);

  return response;
};

export const getAllBookings = async (delet = DeleteStatus.ISNOTDELETE): ApiResponse<BookingData[]> => {
  const response = await HttpClient.get<BookingData[]>(`/bookings?delete=${delet}`);

  return response;
};

// todo ถ้ามีหลายสาขาให้เพิ่ม body และส่ง companyName เช้ามาแทน
export const getAllBookingForPreview = async (delet = DeleteStatus.ISNOTDELETE): ApiResponse<BookingData[]> => {
  const response = await HttpClient.get<BookingData[]>(
    `/bookings/preview?delete=${delet}&companyName=${"KATS_LadKrabang"}`
  );

  return response;
};

export const getAllBookingPaginations = async (query: BookingQuery): ApiResponse<BookingData[]> => {
  const response = await HttpClient.get<BookingData[]>(`/bookings/pagination`, { params: query });

  return response;
};

export const getBookingById = async (bookingId: string): ApiResponse<BookingData> => {
  const response = await HttpClient.get<BookingData>(`/bookings/${bookingId}`);

  return response;
};

export const updateBookingById = async (body: BookingUpdateBody): ApiResponse<BookingData> => {
  const response = await HttpClient.put<BookingData>(`/bookings/${body.bookingId}`, body.data);

  return response;
};

export const updateGuaranteeByBookingId = async (body: BookingUpdateBody): ApiResponse<BookingData> => {
  const response = await HttpClient.put<BookingData>(
    `/bookings/updateGuarantee/${body.bookingId}`,
    body.data
  );

  return response;
};

export const isDeleteBookingById = async (body: BookingData): ApiResponse<BookingData> => {
  const response = await HttpClient.post<BookingData>(`/bookings/selectDelete/${body._id}`, body);

  return response;
};

export const deleteBookingById = async (bookingId: string): ApiResponse<BookingData> => {
  const response = await HttpClient.delete<BookingData>(`/bookings/${bookingId}`);

  return response;
};

export const getLastBookingNumber = async (): ApiResponse<string> => {
  const response = await HttpClient.get<string>(`/bookings/last-booking-number`);

  return response;
};
