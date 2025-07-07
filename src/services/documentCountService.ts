import { HttpClient } from "../shared/utils/HttpClient";

export const getAllDocumentCounts = async (): Promise<any> => {
  const response = await HttpClient.get(`/document-count`);

  return response;
};
