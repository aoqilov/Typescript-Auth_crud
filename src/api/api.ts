import axios, { InternalAxiosRequestConfig } from "axios";

// BASE
const apiClient = axios.create({
  baseURL: "http://45.138.158.137:92", // API URL manzili
  timeout: 10000, // Maksimal so'rov kutish vaqti (10 soniya)
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config.headers) {
    delete config.headers.Authorization;
  }
  return config;
});

// Generic GET-ALL
export const getData = async <T>(
  url: string,
  params: Record<string, any> = {}
): Promise<T> => {
  try {
    const response = await apiClient.get<T>(url, { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

// Generic GET-ONE
export const getDataOne = async <T>(url: string): Promise<T> => {
  try {
    const response = await apiClient.get<T>(url);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

// Generic POST
export const postData = async <T>(url: string, data: any): Promise<T> => {
  try {
    const response = await apiClient.post<T>(url, data);
    console.log(response?.data);
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.message);
    throw error;
  }
};

// POST-LOGIN
export const postDataLogin = async (
  url: string,
  data: any
): Promise<string> => {
  try {
    const response = await apiClient.post(url, data);
    localStorage.setItem("token", response?.data);
    return response?.data;
  } catch (error: any) {
    console.log(error);

    console.error("Error:", error.message);
    throw error;
  }
};

// DELETE-DATA
export const deleteData = async (url: string, id: any): Promise<any> => {
  try {
    const response = await apiClient.delete(url, { data: id });
    return response.data;
  } catch (error: any) {
    console.error("Delete Error:", error.response?.data || error.message);
    throw error;
  }
};

// EDIT-DATA
export const editData = async <T>(url: string, dataEdit: any): Promise<T> => {
  console.log(dataEdit);
  try {
    const response = await apiClient.put<T>(url, dataEdit);
    return response.data;
  } catch (error: any) {
    console.error("Edit Error:", error.response?.data || error.message);
    throw error;
  }
};
