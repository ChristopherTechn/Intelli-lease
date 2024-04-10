import React, { createContext, useContext, useState} from 'react';


const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null)

    const login = (userData, userRole) => {
        setUser(userData)
        setRole(userRole)
    }

    const logout = () => {
        setUser(null);
        setRole(null);
    }

    return (
        <AuthContext.Provider value={{user, role, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}