import React, { Component } from 'react';
import '../../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import {serverUrl} from '../../../config';

class EventPreviewList extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div className="dataCard">   
                <div>
                    <div class="cardDivWithPadding">
                        <div class="dataDivOutsideFlex">
                            <div class="studentDetailsContent">
                                <div class="studentAndSchoolNameOuterDiv">
                                    <div class="studentAndSchoolNameInsideDiv">
                                        <h2 class="studentNameHeading">
                                            <Link className="linkClass" to={{
                                                                pathname: "/StudentProfile",
                                                                state: { isReadOnly: true, profileEmail : (!this.props.data?"":this.props.data.EmailId) }
                                                            }}>
                                                {!this.props.data?"":this.props.data.FullName}</Link>
                                        </h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default EventPreviewList;