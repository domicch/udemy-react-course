import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    }
}

export const authFailed = (error) => {
    return {
        type: actionTypes.AUTH_FAILED,
        error: error
    }
}

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expAtMillisec');
    localStorage.removeItem('userId');
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

export const checkAuthTimeout = (exp) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, exp*1000);
    }
}

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
}

export const auth = (email, password, isRegister) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        }

        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+process.env.REACT_APP_API_KEY;

        if(!isRegister){
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+process.env.REACT_APP_API_KEY
        }

        axios.post(url,
            authData)
            .then(response => {
                console.log(response);
                const expAtMillisec = new Date().getTime() + response.data.expiresIn * 1000;

                localStorage.setItem('token', response.data.idToken);
                localStorage.setItem('expAtMillisec', expAtMillisec);
                localStorage.setItem('userId', response.data.localId);
                dispatch(authSuccess(response.data.idToken, response.data.localId));
                dispatch(checkAuthTimeout(response.data.expiresIn));
            })
            .catch(err => {
                console.log(err);
                dispatch(authFailed(err.response.data.error));
            });
    }
}

// for automatically login if a valid token exists in local storage (e.g. page refresh)
export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if(!token){
            dispatch(logout());
        }else{
            const expAtMillisec = localStorage.getItem('expAtMillisec');
            if(expAtMillisec > new Date().getTime()){
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess(token, userId));
                dispatch(checkAuthTimeout((expAtMillisec - new Date().getTime())/1000));
            }else{
                dispatch(logout());
            }
        }
    }
}