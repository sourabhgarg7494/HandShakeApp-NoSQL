import React, { Component } from 'react';
import '../../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import {serverUrl} from '../../../config';
import { connect } from "react-redux";
import { updateJobStatus } from "../../../js/actions/index";

class CompanyJobPreview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentApplicationStatus : ''
            ,isStatusUpdated : false
        }

        this.updateStatus = this.updateStatus.bind(this);
    }

    updateStatus(e){
        e.preventDefault();
        var status = e.target.value;
        //debugger;
        var data = {
            status: status
            ,JobId : this.props.data.Id
            ,StudentId : this.props.data.StudentId
        }

        this.props.updateJobStatus(data,()=>{
            this.setState({
                currentApplicationStatus : status
                ,isStatusUpdated : true
            }); 
        })
        // axios.defaults.withCredentials = true;
        // axios.defaults.headers.common['authorization'] = cookie.load('jwtToken');
        // axios.post(serverUrl+'updateStatus',data)
        //         .then((response) => {
        //         //update the state with the response data
        //         //debugger;
        //         console.log(response);
        //         if(response.status === 200){
        //             this.setState({
        //                 currentApplicationStatus : status
        //                 ,isStatusUpdated : true
        //             });   
        //         }else{
        //             this.setState({
        //                 currentApplicationStatus : this.props.data.ApplicationStatus
        //                 ,isStatusUpdated : false
        //             });
        //         }
        //     });
    }

    render() {
        var applicationStatus = null
        if(this.state.isStatusUpdated){
            applicationStatus = this.state.currentApplicationStatus
        }else {
            applicationStatus = !this.props.data?"":this.props.data.ApplicationStatus
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
                                            <Link className="linkClass" to={{
                                                                pathname: "/StudentProfile",
                                                                state: { isReadOnly: true, profileEmail : (!this.props.data?"":this.props.data.EmailId) }
                                                            }}>
                                                {!this.props.data?"":this.props.data.FullName}</Link>
                                        </h2>
                                        <div class="schoolNameDiv">
                                            {/* {!this.props.data?"":this.props.data.CompanyName} */}
                                                        <a href={serverUrl+(!this.props.data?"":this.props.data.ResumePath)} target="_blank">
                                                            {!this.props.data?"":this.props.data.Filename}
                                                        </a>
                                        </div>
                                        <div class="schoolNameDiv">
                                            {/* {!this.props.data?"":this.props.data.ApplicationStatus} */}
                                            {applicationStatus}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                        <div className="divSaveButton">
                                            <div className="divButtonWrapper">
                                                <button type="button" className="saveButton" value="Pending" onClick={this.updateStatus}>
                                                    Update Status to Pending
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="divSaveButton">
                                            <div className="divButtonWrapper">
                                                <button type="button" className="saveButton" value="Reviewed" onClick={this.updateStatus}>
                                                    Update Status to Reviewed
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="divSaveButton">
                                            <div className="divButtonWrapper">
                                                <button type="button" className="saveButton" value="Declined" onClick={this.updateStatus}>
                                                    Update Status to Declined
                                                </button>
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

const mapStateToProps = state => {
    return {
        userData: state.loginInfo.UserData
        , loginStatus: state.loginInfo.loginStatus
        , updateStatus: state.loginInfo.updateStatus
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateJobStatus: (userInfo, callback) => { dispatch(updateJobStatus(userInfo, callback)); }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyJobPreview);
//export default CompanyJobPreview;