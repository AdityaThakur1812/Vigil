import API from "./axios";

export const getMonitors = async() => {
    const response = await API.get("/monitors");
    return response.data;
};

export const createMonitor = async (monitorData) => {
    const respose = await API.get("/monitors" ,monitorData );
    return respose.data;
};

export const updateMonitor = async (id,monitorData) => {
    const response = await API.patch(`/monitors/${id}`,monitorData);
    return response.data;
};

export const deleteMonitor = async(id) => {
    const response = await API.delete(`/monitors/${id}`);
    return response.data;
};