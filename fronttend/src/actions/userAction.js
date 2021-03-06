import axios from "axios"
import { CLEAR_ERRORS, LOGIN_FAIL, LOGIN_REQUEST, LOGIN_SUCCESS, REGISTER_USER_FAIL, REGISTER_USER_REQUEST, REGISTER_USER_SUCCESS, LOAD_USER_REQUEST, LOAD_USER_FAIL, LOAD_USER_SUCCESS, LOGOUT_SUCCESS, LOGOUT_FAIL, UPDATE_USER_FAIL, UPDATE_USER_REQUEST, UPDATE_USER_SUCCESS, UPDATE_PASSWORD_REQUEST, UPDATE_PASSWORD_FAIL, FORGOT_PASSWORD_REQUEST, FORGOT_PASSWORD_SUCCESS, FORGOT_PASSWORD_FAIL, ALL_USERS_REQUEST, ALL_USERS_SUCCESS, ALL_USERS_FAIL, USER_DETAILS_REQUEST, USER_DETAILS_SUCCESS, USER_DETAILS_FAIL, DELETE_USER_REQUEST, DELETE_USER_SUCCESS, DELETE_USER_FAIL, UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_SUCCESS, UPDATE_PROFILE_FAIL } from "../constants/userConstants"

//action for login
export const login = (email, password) => async (dispatch) => {
        try {
            dispatch({type: LOGIN_REQUEST})

            const config = { headers : {"Content-Type": "application/json"}}
            const {data} = await axios.post("/login", {email, password}, config)
            dispatch({type: LOGIN_SUCCESS, payload: data.user})
        } catch (error) {
            dispatch({type: LOGIN_FAIL, payload: error.response.data.message})
        }
}

//action for register
export const register = (userData) => async (dispatch) => {
    try {
        dispatch({type: REGISTER_USER_REQUEST})
        const config = { headers : {"Content-Type": "multipart/form-data"}}
        const {data} = await axios.post("/register",  userData, config)
        dispatch({type: REGISTER_USER_SUCCESS, payload: data.user})
    } catch (error) {
        dispatch({type: REGISTER_USER_FAIL, payload: error.response.data.message})
    }
}

//action for load user data
export const loadUSer = () => async (dispatch) => {
    try {
        dispatch({type: LOAD_USER_REQUEST })
        const {data} = await axios.get("/me")
        dispatch({type: LOAD_USER_SUCCESS, payload: data.user})

    } catch (error) {
        dispatch({type: LOAD_USER_FAIL, payload: error.response.data.message})
    }
}

// action for update profile
export const updateProfile = (userData) => async (dispatch) => {
    try {
        dispatch({type: UPDATE_PROFILE_REQUEST})
        const config = { headers : {"Content-Type": "multipart/form-data"}}
        const {data} = await axios.put("/me/update", userData, config)
        dispatch({type: UPDATE_PROFILE_SUCCESS, payload: data.success})
    } catch (error) {
        dispatch({type: UPDATE_PROFILE_FAIL, payload: error.response.data.message})
    }
}

//action for update password
export const updatePassword = (passwords) => async (dispatch) => {
    try {
        dispatch({type: UPDATE_PASSWORD_REQUEST})
        const config = { headers : {"Content-Type": "application/json"}}
        const {data} = await axios.put("/password/update", passwords, config)
        dispatch({type: UPDATE_USER_SUCCESS, payload: data.success})
    } catch (error) {
        dispatch({type: UPDATE_PASSWORD_FAIL, payload: error.response.data.message})
    }
}


//action for logout user
export const logout = () => async (dispatch) => {
    try {
       await axios.get("/logout")
        dispatch({ type: LOGOUT_SUCCESS })
    } catch (error) {
        dispatch({type: LOGOUT_FAIL, payload: error.response.data.message})
    }
}

//action for forgot password
export const forgotPassword = (email) => async (dispatch) => {
    try {
        dispatch({type: FORGOT_PASSWORD_REQUEST})

        const config = { headers : {"Content-Type": "application/json"}}
        const {data} = await axios.post("/password/forgot",  email, config)
        dispatch({type: FORGOT_PASSWORD_SUCCESS, payload: data.message})
    } catch (error) {
        dispatch({type: FORGOT_PASSWORD_FAIL, payload: error.response.data.message})
    }
}

//action for Reset password
export const resetPassword = (token, passwords) => async (dispatch) => {
    try {
        dispatch({type: FORGOT_PASSWORD_REQUEST})

        const config = { headers : {"Content-Type": "application/json"}}
        const {data} = await axios.put(`/password/reset/${token}`,  passwords, config)
        dispatch({type: FORGOT_PASSWORD_SUCCESS, payload: data.success})
    } catch (error) {
        dispatch({type: FORGOT_PASSWORD_FAIL, payload: error.response.data.message})
    }
}

//action for get all users
export const getAllUsers =  () => async (dispatch) => {
    try {
        dispatch({type: ALL_USERS_REQUEST})
        const {data} = await axios.get("/admin/users" )
        dispatch({type: ALL_USERS_SUCCESS, payload: data.users})
    } catch (error) {
        dispatch({type: ALL_USERS_FAIL, payload: error.response.data.message})
    }
}

//action for get user details
export const getUsersDetails = (id) => async (dispatch) => {
    try {
        dispatch({type: USER_DETAILS_REQUEST})
        const {data} = await axios.get(`/admin/user/${id}` )
        dispatch({type: USER_DETAILS_SUCCESS, payload: data.user})
    } catch (error) {
        dispatch({type: USER_DETAILS_FAIL, payload: error.response.data.message})
    }
}

//action for update user
export const updateUser = (id, userData) => async (dispatch) => {
    try {
        dispatch({type: UPDATE_USER_REQUEST})
        const config = { headers : {"Content-Type": "application/json"}}
        const {data} = await axios.put(`/admin/user/${id}`, userData, config)
        dispatch({type: UPDATE_USER_SUCCESS, payload: data.success})
    } catch (error) {
        dispatch({type: UPDATE_USER_FAIL, payload: error.response.data.message})
    }
}

//action for Delete user
export const deleteUser = (id) => async (dispatch) => {
    try {
        dispatch({type:DELETE_USER_REQUEST})
        
        const {data} = await axios.delete(`/admin/user/${id}`)
        dispatch({type: DELETE_USER_SUCCESS, payload: data})
    } catch (error) {
        dispatch({type: DELETE_USER_FAIL, payload: error.response.data.message})
    }
}

//clear errors
export const clearErrors = () => async (dispatch) => {
    dispatch({type: CLEAR_ERRORS})
}
