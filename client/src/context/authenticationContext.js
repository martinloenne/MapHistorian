import {createContext, useEffect, useState, useContext } from "react";
import axios from 'axios';
import setAuthToken from './setAuthToken';


// Context we want to pass through the tree..
const AuthContext = createContext({});

// Provider used to wrap the application
const AuthProvider = props => {
    const initialState = {
        token: localStorage.getItem('token'),
        user: null,
        id: null,
        loading: false,
      };

    // Auth state
    const [authentication, setAuthentication] = useState(initialState);
    
    useEffect(() => {
        getData();
    }, []);


    const getData = async () => {
        // Get saved logid in from localstorage...
        if(localStorage.token){
            setAuthToken(localStorage.token);
            await axios.post('/auth/verify')
            .then(res => {  
                const { email, _id } = res.data.user;
                setAuthentication({...authentication, user: email, isAuthenticated: true, id: _id });  
            })  
            .catch(err => {
              setAuthentication({...authentication, isAuthenticated: false});  
            });  
        } 
        else {
            setAuthentication({...authentication, isAuthenticated: false});  
        }
        
      }  


    // Login User
    const login = async formData => {
        const config = {
        headers: {
            'Content-Type': 'application/json'
            }
        };
        
        try {
            const res = await axios.post('/auth/login', formData, config);  
            localStorage.setItem('token', res.data.token);
            getData();
            const result = {res: true, msg: ""}
            return result;

        } catch (err) {
            // Error
            const result = {res: false, msg: "Some error happend!"}
            return result;
        }
    };

    // Login User
    const register = async formData => {
        const config = {
        headers: {
            'Content-Type': 'application/json'
            }
        };
        
        try {
            const res = await axios.post('/auth/register', formData, config);  
            localStorage.setItem('token', res.data.token);
            getData();
            return {res: true, msg: ""}
        } catch (err) {
            // Error
            return {res: false, msg: "Some error happend!"}
        }
    };


    // Reset password
    const forgotPassword = async formData => {
        const config = {
        headers: {
            'Content-Type': 'application/json'
            }
        };
        
        try {
            const res = await axios.post('/auth/requestReset', formData, config);  
            return {res: true, msg: ""}
        } catch (err) {
            // Error
            const result = {res: false, msg: "Some error happend!"}
            return result;
        }
    };



    // Logout functionality
    const logout = () => {
        localStorage.removeItem('token');
        setAuthentication({
            ...authentication,
          token: null,
          isAuthenticated: false,
          loading: false,
          user: null
        });
    }

    // Can be optimized in order to not re-render when this is called
    // Values we pass through the context
    const AuthContextValue = {
        login,
        authentication,
        logout,
        register,
        forgotPassword
    };

    // The value is what to share from the context, props is all the other compoents through the tree having access to this context
    return <AuthContext.Provider value={AuthContextValue} {...props} />;
};

// Helper method we use inside the wrapped application
const useAuthentication = () => useContext(AuthContext); 
export { AuthProvider, useAuthentication }