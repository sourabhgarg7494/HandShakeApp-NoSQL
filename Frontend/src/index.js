import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import store from './js/store/index';
import { Provider } from 'react-redux';
import cookie from 'react-cookies';
import { updateLoginInfo } from "./js/actions/index";

//render App component on the root element
const Application = (<Provider store ={store}>
    <App />
</Provider>)

const renderApp = () => {
    ReactDOM.render(
        Application
       , document.getElementById('root')
   );
}

//renderApp();
if (cookie.load('cookie')){
    //debugger;
    var data = {
        token : cookie.load('cookie')
    }
    store.dispatch(updateLoginInfo(data,renderApp));
}else{
    renderApp();
}


serviceWorker.unregister();
//registerServiceWorker();
