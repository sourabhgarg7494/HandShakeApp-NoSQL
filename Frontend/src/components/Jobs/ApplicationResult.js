import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

class ApplicationResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {

        // let currentWorking = null;
        // if(this.props.data && this.props.data.title !="" && this.props.data.companyName !=""){
        //     currentWorking = (<div class="titleAndCompanyMainDiv">
        //     <svg aria-hidden="true" data-prefix="fas" data-icon="briefcase" class="svgWorkIcon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        //         <path fill="currentColor" d="M320 336c0 8.84-7.16 16-16 16h-96c-8.84 0-16-7.16-16-16v-48H0v144c0 25.6 22.4 48 48 48h416c25.6 0 48-22.4 48-48V288H320v48zm144-208h-80V80c0-25.6-22.4-48-48-48H176c-25.6 0-48 22.4-48 48v48H48c-25.6 0-48 22.4-48 48v80h512v-80c0-25.6-22.4-48-48-48zm-144 0H192V96h128v32z">
        //         </path>
        //     </svg>
        //     {this.props.data.title + " at " + this.props.data.companyName}
        // </div>)
        // }

        // let path = "";
        // if(this.props.data && this.props.data.profilePicPath !=""){
        //     path = "url('"+this.props.data.profilePicPath+"')";
        // }

        var displayApplicationDate; 
        var displayApplicationDeadlineDate;

        if(this.props.data){
            var aDate = new Date(this.props.data.DateApplied);
            displayApplicationDate = (aDate.getUTCDate()) 
                        + "/"
                        + (aDate.getUTCMonth()+1) 
                        + "/" 
                        + (aDate.getUTCFullYear())
            aDate = new Date(this.props.data.ApplicationDeadlineDate)
            displayApplicationDeadlineDate = (aDate.getUTCDate()) 
                        + "/"
                        + (aDate.getUTCMonth()+1) 
                        + "/" 
                        + (aDate.getUTCFullYear())
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
                                            {!this.props.data?"":this.props.data.JobTitle}
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
                                        {!this.props.data?"":this.props.data.Status}
                                    </div>
                                </div>
                                <div class="experienceAndOldInstitutionDiv">
                                    <div class="titleAndCompanyOuterDiv">
                                        <div>
                                        <svg aria-hidden="true" data-prefix="fas" data-icon="check" class="svgResult" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z">
                                                </path>
                                        </svg>
                                            {/* {currentWorking} */}
                                            Applied {!this.props.data?"":displayApplicationDate} Application close {!this.props.data?"":displayApplicationDeadlineDate}
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

export default ApplicationResult;