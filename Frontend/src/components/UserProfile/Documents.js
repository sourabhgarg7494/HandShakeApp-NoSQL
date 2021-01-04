import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

class Documents extends Component {
    constructor(){
        super();
        this.state = {  
            books : []
        }
    }  

    render(){
        return(
            <div className="dataCard">
                <div className="itemsmain">
                    <h2 className="CardHeading">Documents</h2>
                </div>
            </div>
        )
    }
}

export default Documents;