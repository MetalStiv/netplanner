import { setAuthTokens, clearAuthTokens } from "axios-jwt";
import { userCleanMicroservice } from "./axiosMicroservices";
import IUser from "../model/IUser";
import jwt_decode from "jwt-decode";

export interface ISignInForm {
    email: string,
    password: string,
}

interface IJwtData {
  Id: string,
  Email: string,
  Name: string,
}

interface ILoginResponse {
  accessToken: string,
  refreshToken: string,
  email: string,
  name: string,
  avatarBase64: string,
  timeZone: number
}

export const login = async (params: ISignInForm): Promise<IUser> => {
  const response = await userCleanMicroservice.post<ILoginResponse>('login', params)
  if (response.status !== 200){
    throw new Error(response.status.toString())
  }

  setAuthTokens({
    accessToken: response.data.accessToken,
    refreshToken: response.data.refreshToken
  })

  let decoded: IJwtData = jwt_decode(response.data.accessToken);
  let user: IUser = {
    id: decoded.Id,
    email: response.data.email,
    name: response.data.name,
    avatarBase64: response.data.avatarBase64,
    timeZoneId: response.data.timeZone,
  };
  return user;
}

export const logout = () => {
  clearAuthTokens();
}