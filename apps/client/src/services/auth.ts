import instance from "@/config/axios.config";
import { AxiosError } from "axios";
import { IUser } from "@/types/auth";

interface LoginResponse {
  user: IUser;
  access_token: string;
}

export default class AuthService {
  static async getUser(): Promise<IUser> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }
    try {
      const response = await instance.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error("An error occurred");
      }
    }
  }

  static async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await instance.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.access_token);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw new Error("An error occurred");
      }
    }
  }
  static async logout() {
    localStorage.removeItem("token");
  }
}
