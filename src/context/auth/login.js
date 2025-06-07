import { createContext, useState } from "react";
import axios from "axios";

const LoginContext = createContext();

function LoginProvider(props){
    const {children} = props;

    const handleLogin = async (username, password) => {
        try {
        const response = await axios.post('/api/users/login', { username, password });
        if (response.data.success) {
            alert('Giriş başarılı!');
        } else {
            alert('Hatalı kullanıcı adı veya şifre.');
        }
        } catch (error) {
            alert('Giriş başarısız: ' + error.response.data.message);
        }
    };



    const sharedValuesAndMethods = {
        handleLogin
    };

    return (
        <LoginContext.Provider value={sharedValuesAndMethods}>
            {children}
        </LoginContext.Provider>
    );
};

export {LoginProvider};
export default LoginContext;