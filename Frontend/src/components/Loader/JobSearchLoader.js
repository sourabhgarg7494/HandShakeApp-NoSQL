import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';

class JobSearchLoader extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (<div>
            <div className="borderBottom">
                <button className="jobButton">
                    <div className="jobBasicData">
                        <div className="jobsBasicDataInsideContainer">
                            <div className="loaderDiv animatior">

                            </div>
                            <div className="loaderDiv animatior margin-top" >

                            </div>
                            <div className="loaderDiv animatior margin-top">

                            </div>
                        </div>
                    </div>
                </button>
            </div>
            <div className="borderBottom">
                <button className="jobButton">
                    <div className="jobBasicData">
                        <div className="jobsBasicDataInsideContainer">
                            <div className="loaderDiv animatior">

                            </div>
                            <div className="loaderDiv animatior margin-top" >

                            </div>
                            <div className="loaderDiv animatior margin-top">

                            </div>
                        </div>
                    </div>
                </button>
            </div>
        </div>
        )
    }
}

export default JobSearchLoader;