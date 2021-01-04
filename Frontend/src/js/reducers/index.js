import loginInfoReducer from "./logininfo";
import userInfoReducer from "./userInfo";
import messageSentReducer from "./message";

import {combineReducers} from 'redux';

const finalReducers = combineReducers({
    loginInfo : loginInfoReducer
    ,jobStatus : userInfoReducer
    ,messageSentStatus : messageSentReducer
})

export default finalReducers;