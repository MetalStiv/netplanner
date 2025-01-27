import axios from "axios";
import { IAuthTokens, TokenRefreshRequest, applyAuthTokenInterceptor, getAccessToken } from "axios-jwt";

const USER_BASE_URL = "http://localhost:5108/";
const PROJECT_BASE_URL = "http://localhost:5109/";

// const USER_BASE_URL = "http://d829aea8686a.vps.myjino.ru:49275/";
// const PROJECT_BASE_URL = "http://d829aea8686a.vps.myjino.ru:49297/";

export const userCleanMicroservice = axios.create({
    baseURL: USER_BASE_URL,
    timeout: 2000,
    validateStatus: () => true
});

export const userMicroservice = axios.create({
    baseURL: USER_BASE_URL,
    timeout: 2000,
    headers: {"Access-Control-Allow-Origin": "*"},
    validateStatus: () => true
});

export const projectMicroservice = axios.create({
    baseURL: PROJECT_BASE_URL,
    timeout: 2000,
    headers: {"Access-Control-Allow-Origin": "*"},
    validateStatus: () => true
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

applyAuthTokenInterceptor(projectMicroservice, {
    requestRefresh,
    header: "Authorization",
    headerPrefix: "Bearer "
})