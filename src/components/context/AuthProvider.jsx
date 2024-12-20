import { useState, useContext, createContext, useEffect } from "react";
//import { useJwt } from "react-jwt";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const initialState = {
    email: "",
    token: localStorage.getItem("token") ?? "",
    role: "", 
};

export const AuthProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState(initialState);

    useEffect(() => {

        if (userProfile.token){
            const role = jwtDecode(localStorage.getItem("token"))?.[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ];

            setUserProfile((prevProfile) => ({
                ...prevProfile,
                role
            }));
        }

    }, [])
    

    const handleLogin = (email, token) => {
        const TokenInfo = jwtDecode(token);
        const role = TokenInfo?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "";

        setUserProfile({
            email,
            token,
            role, // Guardar el rol en el perfil de usuario
        });
        localStorage.setItem("token", token);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUserProfile(initialState);
        //navigate("/", { replace: true });
    };

    return (
        <AuthContext.Provider value={{ userProfile, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    return useContext(AuthContext);
};
