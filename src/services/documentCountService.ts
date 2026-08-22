import { ApiResponse } from "../model/api.type";
import { DocumentCountNumber } from "../model/docmentCount.type";
import { HttpClient } from "../shared/utils/HttpClient";

export const getAllDocumentCounts = async (): ApiResponse<DocumentCountNumber> => {
  const response = await HttpClient.get<DocumentCountNumber>(`/document-count`);

  return response;
};
