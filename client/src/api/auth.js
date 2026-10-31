import API from "./axios";

export const registerUser = async (userData) => {
    const response = await API.post("/auth/register",userData);
    return response.data;
};

export const loginUser = async (userData) => {
    const response = await API.post("/auth/login",userData);
    return response.data;
};

export const getCurrentUser = async(token) =>{
    const response = await API.get("/auth/me", {
        headers : {
            Authorization : `Bearer ${token}`,
        },
    });
    return response.data;
};

