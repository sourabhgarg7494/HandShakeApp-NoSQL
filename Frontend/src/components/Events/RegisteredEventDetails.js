import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

class RegisteredEventDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {

        var eventDate; 
        var eventTime;

        if (this.props.data) {
            var aDate = new Date(this.props.data.DateAndTime);
            eventDate = (aDate.getUTCDate())
                + "/"
                + (aDate.getUTCMonth() + 1)
                + "/"
                + (aDate.getUTCFullYear())
            eventTime = (aDate.getUTCHours().toString().length === 1? "0"+aDate.getUTCHours().toString() : aDate.getUTCHours())
                + ":"
                + (aDate.getUTCMinutes().toString().length === 1?"0"+aDate.getUTCMinutes().toString():aDate.getUTCMinutes())
        }

        return (
            <div className="dataCard">   
                <div>
                    <div class="cardDivWithPadding">
                        <div class="dataDivOutsideFlex">
                            <div class="studentDetailsContent">
                                <div class="studentAndSchoolNameOuterDiv">
                                    <div class="studentAndSchoolNameInsideDiv">
                                        <h2 class="studentNameHeading">
                                            {!this.props.data?"":this.props.data.EventName}
                                        </h2>
                                        <div class="schoolNameDiv">
                                            {!this.props.data?"":this.props.data.CompanyName}
                                        </div>
                                    </div>
                                    {/* Add Messaging Content Here */}
                                </div>
                                <div class="gradDateAndMajorOuterDiv">
                                    <div class="gradDateDiv">
                                    <svg aria-hidden="true" data-prefix="fas" data-icon="info" class="svgResult" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512">
                                        <path fill="currentColor" d="M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z">
                                        </path>
                                    </svg>
                                        Event Date : {!this.props.data?"":eventDate}
                                    </div>
                                </div>
                                <div class="gradDateAndMajorOuterDiv">
                                    <div class="gradDateDiv">
                                    <svg aria-hidden="true" data-prefix="fas" data-icon="info" class="svgResult" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512">
                                        <path fill="currentColor" d="M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z">
                                        </path>
                                    </svg>
                                         Event Time : {!this.props.data?"":eventTime}
                                    </div>
                                </div>
                                <div class="experienceAndOldInstitutionDiv">
                                    <div class="titleAndCompanyOuterDiv">
                                        <div>
                                        <svg aria-hidden="true" data-prefix="fas" data-icon="check" class="svgResult" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z">
                                                </path>
                                        </svg>
                                            Location : {!this.props.data?"":this.props.data.Address + ", "
                                                                            +this.props.data.City + ", "
                                                                            +this.props.data.State}
                                        </div>
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

export default RegisteredEventDetails;