import { useCallback, useEffect, useState } from "react";
import { getMonitors, createMonitor, updateMonitor, deleteMonitor } from "../api/monitors";

const useMonitors = () => {
    const [monitors, setMonitors] = useState([]);
    const [loading,setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadMonitors = useCallback(async() => {
        try{
            setError("");
            const data = await getMonitors();
            setMonitors(data.monitors);
        }catch(err){
            setError(err.response?.data?.message || "Failed to load monitors.");
        }finally{
            setLoading(false);
        }
    },[]);

    const addMonitor = async (monitorData) => {
        try{
            setError("");
            const data = await createMonitor(monitorData);
            setMonitors((prev) => [data.monitor, ...prev]);
            return data.monitor;
        }catch(err){
            setError(err.response?.data?.message || "Failed to create monitor.");
            throw err;
        }
    };

    const editMonitor = async (id, monitorData)=> {
        try {
            setError("");
            const data= await updateMonitor(id,monitorData);
            setMonitors((prev) => 
                prev.map((monitor) => 
                monitor._id === id? data.monitor : monitor
            )
        );
        return data.monitor;
        }catch(err){
            setError(
                err.response?.data?.message || "Failed to update monitor."
            );
            throw err;
        }
    };

    const removeMonitor= async(id) => {
        try{
            setError("");
            await deleteMonitor(id);
            setMonitors((prev) => 
            prev.filter((monitor) => monitor._id !== id));
        }catch(err){
            setError(err.response?.data?.message || "Failed to delete monitor.");
            throw err;
        }
    };

    useEffect(() => {
        loadMonitors();
    },[loadMonitors]);

    return {
        monitors,loading,error,loadMonitors,addMonitor,editMonitor,deleteMonitor
    };
};

export default useMonitors;