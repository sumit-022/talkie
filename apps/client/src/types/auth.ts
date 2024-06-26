import { AxiosError } from "axios";

export type IUser = {
  id: string;
  email: string;
  fullName: string;
  username: string;
};

export type AuthState = {
  user: IUser | null;
  error: AxiosError | Error | null;
  loading: boolean;
};
