import type { AxiosResponse } from "axios";

/**
 * service ทุกตัวคืน AxiosResponse ทั้งก้อน ตัว body จริงอยู่ที่ .data
 * ฝั่งเรียกใช้จึงเขียนเป็น const { data } = await getXxx()
 */
export type ApiResponse<T> = Promise<AxiosResponse<T>>;
