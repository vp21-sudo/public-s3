"use client"
import { createContext, useContext, useState } from "react";


interface AuthContext {
    isLoggendIn: boolean;
    authToken: string;
    setAuthToken: (token: string) => void;
    setIsLoggendIn: (isLoggendIn: boolean) => void
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

const useAuth = ():AuthContext => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context
}

const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {

    const [isLoggendIn, setIsLoggendIn] = useState<boolean>(false)
    const [authToken, setAuthToken] = useState<string>('')


    return (
        <AuthContext.Provider value={{isLoggendIn, authToken, setAuthToken, setIsLoggendIn}}>
            {children}
        </AuthContext.Provider>
    )
}

export {
    useAuth,
    AuthProvider
}