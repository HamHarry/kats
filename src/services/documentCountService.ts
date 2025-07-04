import axios from "axios";

export const getAllDocumentCounts = async (): Promise<any> => {
  const response = await axios.get(
    `${import.meta.env.VITE_BASE_SERVER_URL}/document-count`
  );

  return response;
};
