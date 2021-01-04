import { INSERTSUCCESS
    , INSERTERROR
    , UPDATESUCCESS
    , UPDATEERROR
    , UPDATEJOBSTATUSSSUCCESS 
    , UPDATEJOBSTATUSSERROR 
    , MESSAGESENTSUCCESS 
    , MESSAGESENTERROR 
} from "../constants/action-types";

import axios from 'axios';
import { serverUrl } from "../../config";
import cookie from 'react-cookies';

function inserterror(error) {
    return {
        type: INSERTERROR
        , payload: error
    };
}

function insertsuccess(response) {
    console.log("Response : ", response);
    console.log("Status Code : ", response.status);
    var loginInfo;
    if (response.status === 200) {
        if (response.data.loginStatus === "Invalid Credentials") {
            loginInfo = {
                UserData: {}
                , loginStatus: response.data.loginStatus
                , updateStatus: ""
            };

        } else {
            loginInfo = {
                UserData: response.data.results
                , loginStatus: response.data.loginStatus
                , updateStatus: ""
            };
        }
    }
    return {
        type: INSERTSUCCESS
        , payload: loginInfo
    };
}

function updatesuccess(success) {
    console.log("response : ", success);
    var outputData;
    if (success.status === 200) {
        if (success.data.status === "Data Updated") {
            outputData = {
                UserData: success.data.userData
                , updateStatus: success.data.status
            }
            //return Object.assign(state, action.payload); 
        }
        else {
            outputData = {
                updateStatus: success.data.status
            }
            //return Object.assign(state, action.payload); 
        }
    }
    return {
        type: UPDATESUCCESS
        , payload: outputData
    };
}

function updateerror(response) {
    return {
        type: UPDATEERROR
        , payload: response
    };
}

function jobstatusupdatesuccess(success) {
    var outputData = {
        updateStatus: success.data
    }
    return {
        type: UPDATEJOBSTATUSSSUCCESS
        , payload: outputData
    };
}

function jobstatusupdateerror(res) {
    var outputData = {
        updateStatus: "error Occured"
        ,error : res
    }
    return {
        type: UPDATEJOBSTATUSSERROR
        , payload: outputData
    };
}

function messageSentSuccess(success) {
    var outputData = {
        messageSentStatus: success.data.status
        ,newMessage : success.data.newMessage
    }
    return {
        type: MESSAGESENTSUCCESS
        , payload: outputData
    };
}

function messageSentError(res) {
    var outputData = {
        messageSentStatus: "error Occured"
        ,error : res
    }
    return {
        type: MESSAGESENTERROR
        , payload: outputData
    };
}

export function updateUserInfo(payload, callback) {
    //debugger;
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['authorization'] = cookie.load('jwtToken');
    return function (dispatch) {
        return axios.post(serverUrl + 'updateUserData', payload)
            .then(response => {
                //debugger;
                dispatch(updatesuccess(response));
                callback();
            }).catch(error => {
                dispatch(updateerror(error))
                callback();
            })
    }
}

export function updateLoginInfo(payload, callback) {
    //debugger;
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['authorization'] = cookie.load('jwtToken');
    //make a post request with the user data
    return function (dispatch) {

        return axios.post(serverUrl + 'login', payload)
            .then(response => {
                dispatch(insertsuccess(response))
                callback();
            }).catch(error => {
                dispatch(inserterror(error))
                callback(false);
            });
    }
}

export function updateJobStatus(payload, callback) {
    debugger;
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['authorization'] = cookie.load('jwtToken');
    //make a post request with the user data
    return function (dispatch) {

        return axios.post(serverUrl + 'updateStatus', payload)
            .then(response => {
                dispatch(jobstatusupdatesuccess(response))
                callback();
            }).catch(error => {
                dispatch(jobstatusupdateerror(error))
                callback(false);
            });
    }
}

export function sendMessage(payload, callback) {
    debugger;
    //make a post request with the user data
    return function (dispatch) {

        return axios.post(serverUrl + 'sendNewMessage', payload)
            .then(response => {
                dispatch(messageSentSuccess(response))
                callback(response);
            }).catch(error => {
                dispatch(messageSentError(error))
                callback(false);
            });
    }
}

