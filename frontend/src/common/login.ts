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

export const login = async (params: ISignInForm): Promise<IUser> => {
  const response = await userCleanMicroservice.post('login', params)

  setAuthTokens({
    accessToken: response.data.accessToken,
    refreshToken: response.data.refreshToken
  })

  let decoded: IJwtData = jwt_decode(response.data.accessToken);
  let user: IUser = {
    id: decoded.Id,
    email: decoded.Email,
    name: decoded.Name
  };
  return user;
}

export const logout = () => clearAuthTokens()