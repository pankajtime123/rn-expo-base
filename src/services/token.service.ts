import { getSecureItem, removeSecureItem, saveSecureItem } from "../utils/storages/SecuredStorage/SecuredStorage";

export const ACCESS_TOKEN_KEY = "__at";
export const REFRESH_TOKEN_KEY = "__rt";
export const USER_KEY = "__c_user";

export const getSecureAccessToken = () => getSecureItem(ACCESS_TOKEN_KEY);
export const getSecureRefreshToken = () => getSecureItem(REFRESH_TOKEN_KEY);

export const saveTokens = async (user: any) => {
    if (user) {
        if (user.token) {
            await saveSecureItem(ACCESS_TOKEN_KEY, user.token);
        }
        if (user.refresh) {
            await saveSecureItem(REFRESH_TOKEN_KEY, user.refresh);
        }
    }
};

export const saveUser = (user: any) => {
    const { token, tokenExpiry, refresh, refreshExpiry, ...payload } = user;
    return saveSecureItem(USER_KEY, JSON.stringify(payload));
};

export const getTokens = async () => {
    let accessToken;
    let refreshToken;
    let user;
    try {
        accessToken = await getSecureAccessToken();
        refreshToken = await getSecureRefreshToken();
        user = JSON.parse((await getSecureItem(USER_KEY)) as string);
        if (user && typeof user === "object" && user.token) {
            delete user.token;
        }
        if (user && typeof user === "object" && user.refresh) {
            delete user.refreshToken;
        }
        if (user && typeof user === "object" && user.tokenExpiry) {
            delete user.tokenExpiry;
        }
        if (user && typeof user === "object" && user.refreshExpiry) {
            delete user.refreshExpiry;
        }
    } catch (e) { }
    return {
        accessToken,
        refreshToken,
        user,
    };
};

export const clearSecureEntries = async () => {
    console.error("Clearing secure entries");
    await removeSecureItem(ACCESS_TOKEN_KEY);
    await removeSecureItem(REFRESH_TOKEN_KEY);
    await removeSecureItem(USER_KEY);
};
