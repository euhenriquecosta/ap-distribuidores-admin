import axios from "axios";
import { api } from "./api";

interface SignInData {
  EMAIL: string;
  PASSWORD: string;
}

interface SignInResponse {
  token: string;
  id: string;
}


export async function signIn(data: SignInData): Promise<SignInResponse> {
  try {
    const response = await api.post<SignInResponse>("/signin", data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Erro vindo do Axios (request, response, status, etc.)
      throw new Error(error.response?.data?.message || "Erro ao fazer login");
    } else if (error instanceof Error) {
      // Outro erro genérico (ex.: erro de sintaxe)
      throw new Error(error.message);
    } else {
      // Caso extremo (erro desconhecido)
      throw new Error("Erro inesperado");
    }
  }
}