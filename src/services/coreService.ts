import { HttpClient } from "../shared/utils/HttpClient";

export interface UploadFileRequestOptionData {
  isUseOrginalName?: boolean;
}

export interface SplitFileChunkData {
  name: string;
  type: string;
  size: number;
  results: string[];
}

export interface UploadFileRequestData {
  session_id: string;
  original_name: string;
  content: string;
  index: number;
  total: number;
  is_use_orginal_name?: boolean;
}

export interface ResultError<T> {
  value: T;
  errorCode: string;
}

export interface Response<T> {
  success: boolean;
  data: T;
  message?: string;
  total?: number;
  startDate?: string;
  endDate?: string;
  errorCode?: string;
  resultError: ResultError<T>[];
}

const MAX_SIZE_PER_ITEM = 50000;

export const splitFileToChunk = (file: File, maxSize = 5242880): Promise<SplitFileChunkData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const blob = file;
    reader.onload = (e) => {
      if (file.size > maxSize) return reject(new Error("ไฟล์มีขนาดใหญ่เกินกำหนด (10MB)"));
      if (!e.target?.result) return reject(new Error("ไม่สามารถอ่านไฟล์ได้"));
      const results: string[] = [];
      const totalPage = Math.ceil(String(e.target.result).length / MAX_SIZE_PER_ITEM);
      const itemPerPage = Math.ceil(String(e.target.result).length / totalPage);
      for (let index = 0; index < totalPage; index++) {
        const start = index * itemPerPage;
        results.push(String(e.target.result.slice(start, start + itemPerPage)));
      }
      resolve({ name: file.name, size: file.size, type: file.type, results });
    };
    reader.readAsDataURL(blob);
  });
};

export const getUUID = () => {
  // Public Domain/MIT
  let d = new Date().getTime(); //Timestamp
  let d2 = (typeof performance !== "undefined" && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
};

export const uploadFile = async (file: File, options?: UploadFileRequestOptionData): Promise<string> => {
  const data = await splitFileToChunk(file);

  const uniqueKey = getUUID();
  let result = "";
  for (let index = 0; index < data.results.length; index++) {
    const body: UploadFileRequestData = {
      session_id: uniqueKey,
      content: data.results[index],
      original_name: data.name,
      total: data.results.length,
      index,
      is_use_orginal_name: options?.isUseOrginalName,
    };
    const { data: response } = await HttpClient.post<string>("/core/upload-file", body);
    result = response || "";
  }
  
  return result;
};
