import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../api/auth";

const AuthContext = createContext();
//here we create a empty box where data will be stored and shared among different components


export const AuthProvider = ({ children }) => {
    const [user,setUser] = useState();
    const [token,setToken] = useState(
        ()=> localStorage.getItem("token")
    );

    const [loading,setLoading] = useState(true);

    useEffect(() => {
        const verifyUser = async () => {
            if(!token){
                setLoading(false);
                return;
            }
            try{
                const data = await getCurrentUser(token) ;
                setUser(data.user);
            }catch(error){
                localStorage.removeItem("token");
                setToken(null);
                setUser(null);
            }finally{
                setLoading(false);
            }
        } ;
        verifyUser();
    },[token]);

    const login = (userData, accessToken) => {
        localStorage.setItem("token" , accessToken);
        setToken(accessToken);
        setUser(userData);
    }

    const logout = () =>{
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    return(
        <AuthContext.Provider
        value ={{
            user,
            token,
            loading,
            isAuthenticated : Boolean(user && token),
            login,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
};
 
export const useAuth = () =>{
    return useContext(AuthContext);
};