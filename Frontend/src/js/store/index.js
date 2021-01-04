import { createStore, applyMiddleware, compose} from "redux";
import finalReducers from "../reducers/";
import thunk from "redux-thunk";
import logger from "redux-logger";

let middleware = [thunk, logger];

let reduxTool = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
const store = createStore(
    finalReducers,
      reduxTool(applyMiddleware(...middleware))   
    );
    
export default store;