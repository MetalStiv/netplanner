import { setAuthTokens, clearAuthTokens, getAccessToken } from "axios-jwt";
import { userCleanMicroservice } from "./axiosMicroservices";
import IUser from "../model/IUser";
import jwt_decode from "jwt-decode";
import { Exception } from "sass";

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
  timeZone: number,
  appVersion: number,
  updates?: string[],
}

interface ILoginResult {
  user: IUser,
  updates: string[],
}

export const login = async (params: ISignInForm): Promise<ILoginResult> => {
  const response = await userCleanMicroservice.post<ILoginResponse>('login', params)
  if (response.status !== 200){
    // window.location.reload();
    throw response.status;
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
    appVersion: response.data.appVersion,
  };
  let updates: string[] = response.data.updates!;
  return {user, updates};
}

export const getUserId = () => {
  let decoded: IJwtData = jwt_decode(getAccessToken()!);
  return decoded.Id;
}

export const logout = () => {
  clearAuthTokens();
}