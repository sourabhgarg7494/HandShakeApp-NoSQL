
import {UPDATE_LOGIN_INFO} from "../constants/action-types";
import {INSERTSUCCESS, INSERTERROR, UPDATESUCCESS, UPDATEERROR} from "../constants/action-types";

 var merge = require('merge-deep');
//import merge from 'merge-deep'

const initialLoginData = {
    UserData : null
    ,loginStatus:""
}

var loginInfoReducer = (state = initialLoginData, action) => {
    //debugger;

    switch (action.type){
        case INSERTSUCCESS:
            //return merge(state,action.payload);
            return Object.assign(state,action.payload);
        case INSERTERROR:
            return Object.assign(state,{error: action.payload, loginStatus : "Login Failed Due to Error"});
        case UPDATESUCCESS:
            return Object.assign(state, action.payload);
        case UPDATEERROR:
            return Object.assign(state,{error : action.payload, updateStatus : "Update Failed Due to Error"});
    }
    return state;
}

export default loginInfoReducer;