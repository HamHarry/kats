import { BookingData } from "../model/booking.type";
import { DeleteStatus } from "../model/delete.type";
import { HttpClient } from "../shared/utils/HttpClient";

export const createBooking = async (payload: any): Promise<any> => {
  const response = await HttpClient.post(`/bookings`, payload);

  return response;
};

export const approveBookingById = async (data: BookingData): Promise<any> => {
  const response = await HttpClient.post(`/bookings/approve/${data._id}`, data);

  return response;
};

export const cancelBookingById = async (data: BookingData): Promise<any> => {
  const response = await HttpClient.post(`/bookings/cancel/${data._id}`, data);

  return response;
};

export const getAllBookings = async (delet = DeleteStatus.ISNOTDELETE): Promise<any> => {
  const response = await HttpClient.get(`/bookings?delete=${delet}`);

  return response;
};

// todo ถ้ามีหลายสาขาให้เพิ่ม body และส่ง companyName เช้ามาแทน
export const getAllBookingForPreview = async (delet = DeleteStatus.ISNOTDELETE): Promise<any> => {
  const response = await HttpClient.get(`/bookings/preview?delete=${delet}&companyName=${"KATS_LadKrabang"}`);

  return response;
};

export const getAllBookingPaginations = async (query: any): Promise<any> => {
  const response = await HttpClient.get(`/bookings/pagination`, { params: query });

  return response;
};

export const getBookingById = async (bookingId: string): Promise<any> => {
  const response = await HttpClient.get(`/bookings/${bookingId}`);

  return response;
};

export const updateBookingById = async (body: any): Promise<any> => {
  const response = await HttpClient.put(`/bookings/${body.bookingId}`, body.data);

  return response;
};

export const updateGuaranteeByBookingId = async (body: any): Promise<any> => {
  const response = await HttpClient.put(`/bookings/updateGuarantee/${body.bookingId}`, body.data);

  return response;
};

export const isDeleteBookingById = async (body: any): Promise<any> => {
  const response = await HttpClient.post(`/bookings/selectDelete/${body._id}`, body);

  return response;
};

export const deleteBookingById = async (bookingId: string): Promise<any> => {
  const response = await HttpClient.delete(`/bookings/${bookingId}`);

  return response;
};
