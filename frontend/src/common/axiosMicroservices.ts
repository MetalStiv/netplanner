import axios from "axios";
import { IAuthTokens, TokenRefreshRequest, applyAuthTokenInterceptor, getAccessToken } from "axios-jwt";

const USER_BASE_URL = "http://localhost:5108/";

export const userCleanMicroservice = axios.create({
    baseURL: USER_BASE_URL,
    timeout: 2000
});

export const userMicroservice = axios.create({
    baseURL: USER_BASE_URL,
    timeout: 2000
});

const requestRefresh: TokenRefreshRequest = async (refreshToken: string): Promise<IAuthTokens | string> => {
    const response = await axios.post(`${USER_BASE_URL}refreshToken`, { 
        refreshToken: refreshToken, 
        accessToken: getAccessToken() 
    })
  
    return {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken
    }
}

applyAuthTokenInterceptor(userMicroservice, {
    requestRefresh,
    header: "Authorization",
    headerPrefix: "Bearer "
})