import { SUCCESS } from "../constants/action-types";

import { ERROR } from "../constants/action-types";

export const UPDATEJOBSTATUSSSUCCESS = "Job Status Updated";
export const UPDATEJOBSTATUSSERROR= "Job Status Update Failed";

const initialLoginData = {
    updateStatus : ""
}

var userInfoReducer = (state = initialLoginData, action) => {
    debugger;
    if (action.type === UPDATEJOBSTATUSSSUCCESS){
        return Object.assign(state, action.payload); 
    } else if (action.type === UPDATEJOBSTATUSSERROR ){
        return Object.assign(state, action.payload); 
    }
    return state;
}

export default userInfoReducer;