import React, {Component} from 'react';
import '../../App.css';
import {Link} from 'react-router-dom';
import axios from 'axios';
import cookie from 'react-cookies';
import {serverUrl} from '../../config';
import { connect } from "react-redux";
import { updateUserInfo } from "../../js/actions/index";

class EventPreview extends Component {
    constructor(props){
        super(props);
        this.state = {  
            error : null
            ,isRegisteredForEvent : false
        }

        this.onRegisterClick = this.onRegisterClick.bind(this);
    }

    onRegisterClick(e){
        //debugger;
        e.preventDefault();
        var isStudentEligible;
        if(this.props.eventDetails && this.props.currStudentMajor){
            if(this.props.eventDetails.EligibleMajors.includes(this.props.currStudentMajor)){
                isStudentEligible = true;
            }
        }
        if(isStudentEligible){
            var userData = this.props.userData;
            var {StudentDetail} = userData;
            var {RegisteredEvents} = StudentDetail;

            var data = {
                EventId : this.props.eventDetails._id
                ,EventName : this.props.eventDetails.EventName
                ,CompanyName : this.props.eventDetails.CompanyName
                ,DateAndTime : this.props.eventDetails.DateAndTime
                ,Address : this.props.eventDetails.Address
                ,State : this.props.eventDetails.State
                ,City : this.props.eventDetails.City
            }

            RegisteredEvents.push(data);
            Object.assign(StudentDetail, {RegisteredEvents : RegisteredEvents});
            Object.assign(userData,{StudentDetail : StudentDetail});
            this.props.updateUserInfo(userData, () => {});

            var data;

            data = {
                eventId : this.props.eventDetails._id
                ,studentId : this.props.userData._id
            }

            axios.defaults.withCredentials = true;
            axios.defaults.headers.common['authorization'] = cookie.load('jwtToken');
            axios.post(serverUrl + 'registerForEvent', data)
                .then((response) => {
                    //debugger;
                    //update the state with the response data
                    console.log("data " + response.data);
                    if (response.status === 200 && response.data) {
                        this.setState({
                            isRegisteredForEvent: true
                        });
                    }
                });
            // var data;
            // data = {
            //     token : cookie.load('cookie')
            //     ,eventId : this.props.eventDetails.Id
            // }
            // axios.post(serverUrl+'registerForEvent',data)
            //         .then((response) => {
            //             //debugger;
            //         //update the state with the response data
            //         console.log("data " + response.data);
            //         if(response.status === 200 && response.data){
            //             this.setState({
            //                 isRegisteredForEvent : true
            //             });
            //         }
            //     });
        }else{
            this.setState({
                error : <label className="error">Cannot Register!! Not eligible for the event!!</label>
            })
        }
    }

    render(){
        //debugger;

        var eligibleMajorsString ="";
        if(this.props.eventDetails){
            for(let i = 0; i < this.props.eventDetails.EligibleMajors.length; i++){
                if(i === this.props.eventDetails.EligibleMajors.length -1){
                    eligibleMajorsString += this.props.eventDetails.EligibleMajors[i];
                } else {
                    eligibleMajorsString += this.props.eventDetails.EligibleMajors[i] + ", ";
                }
            }
        }

        var isStudentAlreadyApplied;
        if(this.props.userData && this.props.eventDetails){
            var eventId = this.props.eventDetails._id;
            var StudentRegisteredEvents = this.props.userData.StudentDetail.RegisteredEvents;
            StudentRegisteredEvents.filter(eve =>{
                if(eve.EventId === eventId){
                    isStudentAlreadyApplied = true;
                    return;
                }
            })
        }

        var eventDate; 
        var eventTime;

        if (this.props.eventDetails) {
            var aDate = new Date(this.props.eventDetails.DateAndTime);
            eventDate = (aDate.getUTCDate())
                + "/"
                + (aDate.getUTCMonth() + 1)
                + "/"
                + (aDate.getUTCFullYear())
            eventTime = (aDate.getUTCHours().toString().length === 1? "0"+aDate.getUTCHours().toString() : aDate.getUTCHours())
                + ":"
                + (aDate.getUTCMinutes().toString().length === 1?"0"+aDate.getUTCMinutes().toString():aDate.getUTCMinutes())
        }

        let btnApply = null;
        if (this.props.eventDetails && isStudentAlreadyApplied === true) {
            btnApply = (<div class="applyBtnOuterDiv">
                <button class="applyButton" title="" type="button" style={{marginRight:"5px"}}>
                    <svg aria-hidden="true" data-prefix="fas" data-icon="check" class="svgRegistered" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z">
                        </path>
                    </svg>
                    Registered
            </button>
            </div>)
        }else if(this.state.isRegisteredForEvent){
            btnApply = (<div class="applyBtnOuterDiv">
                <button class="applyButton" title="" type="button" style={{marginRight:"5px"}}>
                    <svg aria-hidden="true" data-prefix="fas" data-icon="check" class="svgRegistered" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z">
                        </path>
                    </svg>
                    Registered
            </button>
            </div>)
        }
         else {
            btnApply = (<div class="applyBtnOuterDiv">
                            <button class="applyButton" onClick={this.onRegisterClick} title="" type="button">
                                <svg aria-hidden="true" data-prefix="fas" data-icon="external-link" class="svgApply" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                    <path fill="currentColor" d="M448 279.196V464c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h248a24 24 0 0 1 16.97 7.029l16 16C344.09 102.149 333.382 128 312 128H64v320h320V295.196c0-6.365 2.529-12.47 7.029-16.971l16-16C422.148 247.106 448 257.814 448 279.196zM576 37.333C576 16.715 559.285 0 538.667 0H380c-15.464 0-28 12.536-28 28v17.885c0 15.766 13.011 28.424 28.772 27.989l67.203-1.906L199.09 319.09c-9.429 9.363-9.457 24.605-.061 34.001l23.879 23.879c9.396 9.396 24.639 9.369 34.001-.06l247.122-248.885-1.906 67.203c-.434 15.76 12.224 28.772 27.99 28.772H548c15.464 0 28-12.536 28-28V37.333z">
                                    </path>
                                </svg>
                                Register
                            </button>
                        </div>)
        }

        return(
            <div>
                <div className="jobPreviewBasicData">
                    <div className="jobPreviewMainHeading">
                        <div className="jobHeadingInnerDiv">
                            <h1 class="jobHeadingH">
                                {this.props.eventDetails?this.props.eventDetails.EventName:""}
                            </h1>
                            <div class="headingCompanyName">
                                {this.props.eventDetails?this.props.eventDetails.CompanyName:""}
                            </div>
                        </div>
                    </div>
                    <div className="jobSubHeadings">
                        <div className="jobSubInsideDiv">
                        <svg aria-hidden="true" data-prefix="far" data-icon="map-marker-alt" class="svgSubHeadingTop" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                            <path fill="currentColor" d="M192 0C85.903 0 0 86.014 0 192c0 71.117 23.991 93.341 151.271 297.424 18.785 30.119 62.694 30.083 81.457 0C360.075 285.234 384 263.103 384 192 384 85.903 297.986 0 192 0zm0 464C64.576 259.686 48 246.788 48 192c0-79.529 64.471-144 144-144s144 64.471 144 144c0 54.553-15.166 65.425-144 272zm-80-272c0-44.183 35.817-80 80-80s80 35.817 80 80-35.817 80-80 80-80-35.817-80-80z">
                            </path>
                        </svg>
                            {this.props.eventDetails?this.props.eventDetails.City + ", " + this.props.eventDetails.State:""}
                        </div>
                    </div>
                </div>
                <div className="applicationLastDateAndApplyButton">
                    <div className="applicationLastDateAndApplyOuterDiv">
                        <div className="applicationDateOuterDiv">
                            <div className="applicationDateMainDiv">
                                {/* {this.props.jobDetails?"Posted "+"Application Closes on "+this.props.jobDetails.ApplicationDeadLineDate:""} */}
                                {this.props.eventDetails?"Event Date and Time: "+ eventDate + ", " + eventTime:""}
                            </div>
                        </div>
                        {btnApply}
                    </div>
                    {this.state.error}
                    {/* {apply} */}
                </div>
                <div className="jobDescriptionAndData">
                    <div className="jobDescInnerDiv">
                        <div>Event Name : <strong>{this.props.eventDetails?this.props.eventDetails.EventName:""}</strong></div>
                        <div>CompanyName : {this.props.eventDetails?this.props.eventDetails.CompanyName:""}</div>
                        <div>Location : {this.props.eventDetails?this.props.eventDetails.Address + ", "
                                                                +this.props.eventDetails.City + ", "
                                                                +this.props.eventDetails.State:""}</div>
                        <div>Eligible Majors : {eligibleMajorsString}</div>
                        <br/>
                        <br/>
                        <h3>Event Decription</h3>
                        <div>{this.props.eventDetails?this.props.eventDetails.Description:""}</div>
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        userData: state.loginInfo.UserData
        , loginStatus: state.loginInfo.loginStatus
        , updateStatus: state.loginInfo.updateStatus
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateUserInfo: (userInfo, callback) => { dispatch(updateUserInfo(userInfo, callback)); }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventPreview);