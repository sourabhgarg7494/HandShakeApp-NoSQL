import { SUCCESS } from "../constants/action-types";

import { ERROR } from "../constants/action-types";

export const MESSAGESENTSUCCESS = "Message sent";
export const MESSAGESENTERROR= "Message not Sent";

const initialLoginData = {
    messageSentStatus : ""
    ,newMessage : ""
}

var messageSentReducer = (state = initialLoginData, action) => {
    debugger;
    if (action.type === MESSAGESENTSUCCESS){
        return Object.assign(state, action.payload); 
    } else if (action.type === MESSAGESENTERROR ){
        return Object.assign(state, action.payload); 
    }
    return state;
}

export default messageSentReducer;