import React, {Component} from 'react';
import '../../App.css';
import {Link} from 'react-router-dom';
import axios from 'axios';
import cookie from 'react-cookies';
import {serverUrl} from '../../config';
import { connect } from "react-redux";
import { updateUserInfo } from "../../js/actions/index";

class JobPreview extends Component {
    constructor(props){
        super(props);
        this.state = {  
            isApplyEnabled : false
            ,allResumes : [{key : " ", value : "-Select-"}]
            ,resume : null
            ,SelectedResume : null
            ,selectedResume : null
            ,isUploadNewResume : false
            ,error : null
            ,isAppliedForJob : false
        }

        this.onApplyClick = this.onApplyClick.bind(this);
        this.cancelUploadClick = this.cancelUploadClick.bind(this);
        this.onResumeUpload = this.onResumeUpload.bind(this);
        this.uploadResume = this.uploadResume.bind(this);
        this.onResumeSelect = this.onResumeSelect.bind(this);
        this.uploadNewResume = this.uploadNewResume.bind(this);
        this.cancelNewResumeUploadClick = this.cancelNewResumeUploadClick.bind(this);
        this.applyForJobClick = this.applyForJobClick.bind(this);
        this.isResumeUploadedOrSeletected = false
    }

    onApplyClick(e){
        e.preventDefault();
        let resumeList = this.props.userData.StudentDetail.ResumeList.map(resume=>{
            return {key:resume.ResumePath, value : resume.FileName}
        });
        if(!resumeList.length){
            this.setState({
                isUploadNewResume : true
            });
        } else {
            this.setState({
                isUploadNewResume : false
            });
        }
        this.setState({
            allResumes : this.state.allResumes.concat(resumeList)
            ,isApplyEnabled : true
        });
        // var data;
        // data = {
        //     token : cookie.load('cookie')
        // }
        // axios.post(serverUrl+'getUploadedResumeList',data)
        //         .then((response) => {
        //             //debugger;
        //         //update the state with the response data
        //         console.log("data " + response.data);
        //         if(response.data && response.data.length){
        //             let resumeList  = response.data[0].map(resume => {
        //                 return {key: resume.ResumePath, value : resume.FileName}
        //             });
        //             if (!resumeList.length){
        //                 this.setState({
        //                     isUploadNewResume : true
        //                 });    
        //             }else{
        //                 this.setState({
        //                     isUploadNewResume : false
        //                 });
        //             }
        //             this.setState({
        //                 allResumes : this.state.allResumes.concat(resumeList)
        //                 ,isApplyEnabled : true
        //             });
        //         }
        //     });
    }

    applyForJobClick(e){
        //debugger;
        e.preventDefault();
        if(!this.isResumeUploadedOrSeletected){
            this.setState({
                error: <label className="error">Select or Upload a Resume!!</label>
            }) 
        }else{
            var userData = this.props.userData;
            var {StudentDetail} = userData;

            var {Applications} = StudentDetail;
            
            var data;
            data = {
                JobId : this.props.jobDetails._id
                ,JobTitle : this.props.jobDetails.JobTitle
                ,CompanyName : this.props.jobDetails.CompanyName
                ,Status : "Pending"
                ,SelectedResume : this.state.SelectedResume
                ,ApplicationDeadlineDate : this.props.jobDetails.ApplicationDeadlineDate
                ,DateApplied : new Date()
            }

            Applications.push(data);

            Object.assign(StudentDetail, {Applications : Applications});
            Object.assign(userData,{StudentDetail : StudentDetail});
            this.props.updateUserInfo(userData, () => {});
            data = {
                StudentId : this.props.userData._id
                ,JobId : this.props.jobDetails._id
            }
            axios.defaults.withCredentials = true;
            axios.defaults.headers.common['authorization'] = cookie.load('jwtToken');
            axios.post(serverUrl+'applyForJob',data)
            .then((response) => {
                console.log(response);
                if(response.status === 200){
                    this.setState({
                        isUploadNewResume: false
                        , isAppliedForJob: true
                        , isApplyEnabled: false
                        , isUploadNewResume: false
                        , allResumes: [{ key: " ", value: "-Select-" }]
                    })
                }
            });
        }
    }

    uploadResume(e){
        //debugger;
        e.preventDefault();
        axios.defaults.headers.common['authorization'] = cookie.load('jwtToken');
        const d = new FormData();
        d.append("file",this.state.resume);
        d.append("token", cookie.load('cookie'));
        console.log(d.values());
        axios.post(serverUrl+'uploadResume',d)
        .then((response) => {
            console.log(response);
            //debugger;
            if(response.status === 200 && response.data.file){
                var newResume = {key : response.data.file, value : response.data.FileName};
                var currentDate = new Date();
                var uploadedResume = {
                    ResumePath : response.data.file
                    ,FileName : response.data.FileName
                    ,DateUploaded : currentDate
                }
                var userData  = this.props.userData;
                var {StudentDetail} = userData;
                var {ResumeList} = StudentDetail;
                ResumeList.push(uploadedResume);
                Object.assign(StudentDetail, { ResumeList: ResumeList });
                Object.assign(userData, { StudentDetail: StudentDetail });
                this.props.updateUserInfo(userData, () => {
                    this.setState({
                        isUploadNewResume: false
                        , selectedResume: response.data.file
                        , SelectedResume: {
                            ResumePath: response.data.file
                            , FileName: response.data.FileName
                        }
                        , allResumes: this.state.allResumes.concat(newResume)
                    });
                    this.isResumeUploadedOrSeletected = true;
                })
            }
        });
    }

    uploadNewResume(e){
        e.preventDefault();
        this.setState({
            isUploadNewResume : true
        })
    }

    onResumeSelect(e){
        //debugger;
        var resume = {
            ResumePath : e.target.value
            ,FileName : e.target.selectedOptions[0].label
        }
        this.setState({
            selectedResume : e.target.value === " " ? "": e.target.value
            ,SelectedResume : e.target.value === " "? null: resume
        });
        this.isResumeUploadedOrSeletected = true;
    }

    cancelUploadClick(e){
        e.preventDefault();
        this.setState({
            isApplyEnabled : false
            ,isUploadNewResume : false
            ,allResumes : [{key : " ", value : "-Select-"}]
        })
    }

    cancelNewResumeUploadClick(e){
        e.preventDefault();
        this.setState({
            isUploadNewResume : false
        })
    }

    onResumeUpload(e){
        this.setState({
            resume : e.target.files[0]
        });
    }

    render(){
        //debugger;

        var isStudentAlreadyApplied;
        if(this.props.userData && this.props.jobDetails){
            var jobId = this.props.jobDetails._id;
            var StudentAppliedJobs = this.props.userData.StudentDetail.Applications;
            StudentAppliedJobs.filter(app =>{
                if(app.JobId === jobId){
                    isStudentAlreadyApplied = true;
                    return;
                }
            })
        }


        var displayPostingDate; 
        var applicationDeadLineDate;

        if(this.props.jobDetails){
            var aDate = new Date(this.props.jobDetails.PostingDate);
            displayPostingDate = (aDate.getUTCDate()) 
                        + "/"
                        + (aDate.getUTCMonth()+1) 
                        + "/" 
                        + (aDate.getUTCFullYear())
            aDate = new Date(this.props.jobDetails.ApplicationDeadlineDate)
            applicationDeadLineDate = (aDate.getUTCDate()) 
                        + "/"
                        + (aDate.getUTCMonth()+1) 
                        + "/" 
                        + (aDate.getUTCFullYear())
        }

        let btnApply = null;
        if (this.props.jobDetails && isStudentAlreadyApplied === true) {
            btnApply = (<div class="applyBtnOuterDiv">
                <button class="applyButton" title="" type="button">
                    <svg aria-hidden="true" data-prefix="fas" data-icon="external-link" class="svgApply" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                        <path fill="currentColor" d="M448 279.196V464c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h248a24 24 0 0 1 16.97 7.029l16 16C344.09 102.149 333.382 128 312 128H64v320h320V295.196c0-6.365 2.529-12.47 7.029-16.971l16-16C422.148 247.106 448 257.814 448 279.196zM576 37.333C576 16.715 559.285 0 538.667 0H380c-15.464 0-28 12.536-28 28v17.885c0 15.766 13.011 28.424 28.772 27.989l67.203-1.906L199.09 319.09c-9.429 9.363-9.457 24.605-.061 34.001l23.879 23.879c9.396 9.396 24.639 9.369 34.001-.06l247.122-248.885-1.906 67.203c-.434 15.76 12.224 28.772 27.99 28.772H548c15.464 0 28-12.536 28-28V37.333z">
                        </path>
                    </svg>
                    Applied
            </button>
            </div>)
        }else if(this.state.isAppliedForJob){
            btnApply = (<div class="applyBtnOuterDiv">
                <button class="applyButton" title="" type="button">
                    <svg aria-hidden="true" data-prefix="fas" data-icon="external-link" class="svgApply" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                        <path fill="currentColor" d="M448 279.196V464c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h248a24 24 0 0 1 16.97 7.029l16 16C344.09 102.149 333.382 128 312 128H64v320h320V295.196c0-6.365 2.529-12.47 7.029-16.971l16-16C422.148 247.106 448 257.814 448 279.196zM576 37.333C576 16.715 559.285 0 538.667 0H380c-15.464 0-28 12.536-28 28v17.885c0 15.766 13.011 28.424 28.772 27.989l67.203-1.906L199.09 319.09c-9.429 9.363-9.457 24.605-.061 34.001l23.879 23.879c9.396 9.396 24.639 9.369 34.001-.06l247.122-248.885-1.906 67.203c-.434 15.76 12.224 28.772 27.99 28.772H548c15.464 0 28-12.536 28-28V37.333z">
                        </path>
                    </svg>
                    Applied
            </button>
            </div>)
        }
         else {
            btnApply = (<div class="applyBtnOuterDiv">
                            <button class="applyButton" onClick={this.onApplyClick} title="" type="button">
                                <svg aria-hidden="true" data-prefix="fas" data-icon="external-link" class="svgApply" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                    <path fill="currentColor" d="M448 279.196V464c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h248a24 24 0 0 1 16.97 7.029l16 16C344.09 102.149 333.382 128 312 128H64v320h320V295.196c0-6.365 2.529-12.47 7.029-16.971l16-16C422.148 247.106 448 257.814 448 279.196zM576 37.333C576 16.715 559.285 0 538.667 0H380c-15.464 0-28 12.536-28 28v17.885c0 15.766 13.011 28.424 28.772 27.989l67.203-1.906L199.09 319.09c-9.429 9.363-9.457 24.605-.061 34.001l23.879 23.879c9.396 9.396 24.639 9.369 34.001-.06l247.122-248.885-1.906 67.203c-.434 15.76 12.224 28.772 27.99 28.772H548c15.464 0 28-12.536 28-28V37.333z">
                                    </path>
                                </svg>
                                Apply
                            </button>
                        </div>)
        }

        let resumeUpload = null;
        if(this.state.isUploadNewResume){
            resumeUpload = (<div>
                <div className="row">
                    <div className="col-md-12">
                        <input type="file" id="resume" name="resume" accept="application/pdf" onChange={this.onResumeUpload}>
                        </input>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <div className="divSaveButton">
                                <div className="divButtonWrapper">
                                    <button type="button" className="saveButton" onClick={this.uploadResume}>
                                        <span>Upload</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <div className="divCancelButton">
                                <div className="divButtonWrapper">
                                    <button type="button" className="cancelButton" onClick={this.cancelNewResumeUploadClick}>
                                        <span>Cancel</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div></div>)
        }
        let resumeDropDown = null;
        if (this.state.allResumes && this.state.allResumes.length > 1) {
            resumeDropDown = (<div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <select className="form-control" value={this.state.selectedResume} onChange={this.onResumeSelect}>
                            {this.state.allResumes.map((resume) => <option className="Dropdown-menu" key={resume.key} value={resume.key}>{resume.value}</option>)}
                        </select>
                    </div></div>
            </div>)
        }

        let apply = null;
        if (this.state.isApplyEnabled && this.state.allResumes && this.state.allResumes.length > 1) {
            apply = (<div>
                    {resumeDropDown}
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <div className="divSaveButton">
                                    <div className="divButtonWrapper">
                                        <button type="button" className="saveButton" onClick={this.uploadNewResume}>
                                            <span>Upload New Resume</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <div className="divCancelButton">
                                    <div className="divButtonWrapper">
                                        <button type="button" className="cancelButton" onClick={this.cancelUploadClick}>
                                            <span>Cancel</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {resumeUpload}
                    <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <div className="divSaveButton">
                                        <div className="divButtonWrapper">
                                            <button type="button" className="saveButton" onClick={this.applyForJobClick}>
                                                <span>Apply</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group">
                                {this.state.error}
                            </div>
                        </div>
                    </div>
                </div>)
        }else if (this.state.isApplyEnabled && this.state.allResumes && this.state.allResumes.length == 1){
            apply = (<div>
                        {resumeUpload}
                        <div className="row">
                            <div className="col-md-4">
                                <div className="divSaveButton">
                                    <div className="divButtonWrapper">
                                        <button type="button" className="saveButton" onClick={this.applyForJobClick}>
                                            <span>Apply</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>)
        }

        var CompanyId;
        if(this.props.jobDetails){
            CompanyId = this.props.jobDetails.CompanyId
        }
//debugger;
        return(
            <div>
                <div className="jobPreviewBasicData">
                    <div className="jobPreviewMainHeading">
                        <div className="jobHeadingInnerDiv">
                            <h1 class="jobHeadingH">
                                {this.props.jobDetails?this.props.jobDetails.JobTitle:""}
                            </h1>
                            <div class="headingCompanyName">
                            <Link className="linkClass" to={{
                                                            pathname: "/CompanyProfile",
                                                            state: { isReadOnly: true, companyId : CompanyId }
                                                        }}>
                                    {this.props.jobDetails?this.props.jobDetails.CompanyName:""}
                            </Link>
                            </div>
                        </div>
                    </div>
                    <div className="jobSubHeadings">
                        <div className="jobSubInsideDiv">
                            <svg aria-hidden="true" data-prefix="far" data-icon="briefcase" class="svgSubHeadingTop" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path fill="currentColor" d="M464 128h-80V80c0-26.51-21.49-48-48-48H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v256c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V176c0-26.51-21.49-48-48-48zM176 80h160v48H176V80zM54 176h404c3.31 0 6 2.69 6 6v74H48v-74c0-3.31 2.69-6 6-6zm404 256H54c-3.31 0-6-2.69-6-6V304h144v24c0 13.25 10.75 24 24 24h80c13.25 0 24-10.75 24-24v-24h144v122c0 3.31-2.69 6-6 6z">
                                </path>
                            </svg>
                            {this.props.jobDetails?this.props.jobDetails.JobCategory:""}
                        </div>
                    </div>
                    <div className="jobSubHeadings">
                        <div className="jobSubInsideDiv">
                        <svg aria-hidden="true" data-prefix="far" data-icon="map-marker-alt" class="svgSubHeadingTop" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                            <path fill="currentColor" d="M192 0C85.903 0 0 86.014 0 192c0 71.117 23.991 93.341 151.271 297.424 18.785 30.119 62.694 30.083 81.457 0C360.075 285.234 384 263.103 384 192 384 85.903 297.986 0 192 0zm0 464C64.576 259.686 48 246.788 48 192c0-79.529 64.471-144 144-144s144 64.471 144 144c0 54.553-15.166 65.425-144 272zm-80-272c0-44.183 35.817-80 80-80s80 35.817 80 80-35.817 80-80 80-80-35.817-80-80z">
                            </path>
                        </svg>
                            {this.props.jobDetails?this.props.jobDetails.City+", "+this.props.jobDetails.State:""}
                        </div>
                    </div>
                    <div className="jobSubHeadings">
                        <div className="jobSubInsideDiv">
                        <svg aria-hidden="true" data-prefix="far" data-icon="money-bill-alt" class="svgSubHeadingTop" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                            <path fill="currentColor" d="M320 144c-53.02 0-96 50.14-96 112 0 61.85 42.98 112 96 112 53 0 96-50.13 96-112 0-61.86-42.98-112-96-112zm40 168c0 4.42-3.58 8-8 8h-64c-4.42 0-8-3.58-8-8v-16c0-4.42 3.58-8 8-8h16v-55.44l-.47.31a7.992 7.992 0 0 1-11.09-2.22l-8.88-13.31a7.992 7.992 0 0 1 2.22-11.09l15.33-10.22a23.99 23.99 0 0 1 13.31-4.03H328c4.42 0 8 3.58 8 8v88h16c4.42 0 8 3.58 8 8v16zM608 64H32C14.33 64 0 78.33 0 96v320c0 17.67 14.33 32 32 32h576c17.67 0 32-14.33 32-32V96c0-17.67-14.33-32-32-32zm-16 272c-35.35 0-64 28.65-64 64H112c0-35.35-28.65-64-64-64V176c35.35 0 64-28.65 64-64h416c0 35.35 28.65 64 64 64v160z">
                            </path>
                        </svg>
                            {this.props.jobDetails? "$"+this.props.jobDetails.Salary+" per hour":""}
                        </div>
                    </div>
                    <div className="jobSubHeadings">
                        <div className="jobSubInsideDiv">
                        <svg aria-hidden="true" data-prefix="far" data-icon="clock" class="svgSubHeadingTop" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm61.8-104.4l-84.9-61.7c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v141.7l66.8 48.6c5.4 3.9 6.5 11.4 2.6 16.8L334.6 349c-3.9 5.3-11.4 6.5-16.8 2.6z">
                            </path>
                        </svg>
                            {this.props.jobDetails?"Posted "+displayPostingDate:""}
                        </div>
                    </div>
                </div>
                <div className="applicationLastDateAndApplyButton">
                    <div className="applicationLastDateAndApplyOuterDiv">
                        <div className="applicationDateOuterDiv">
                            <div className="applicationDateMainDiv">
                                {this.props.jobDetails?"Application Closes on "+applicationDeadLineDate:""}
                            </div>
                        </div>
                        {btnApply}
                    </div>
                    {apply}
                </div>
                <div className="jobDescriptionAndData">
                    <div className="jobDescInnerDiv">
                        <div>Job Title : <strong>{this.props.jobDetails?this.props.jobDetails.JobTitle:""}</strong></div>
                        <div>Posting Date : {this.props.jobDetails?displayPostingDate:""}</div>
                        <div>Location : {this.props.jobDetails?this.props.jobDetails.Address+", "
                                        +this.props.jobDetails.City+", "
                                        +this.props.jobDetails.State+", "
                                        +this.props.jobDetails.Country:""}</div>
                        <div>Salary : {this.props.jobDetails?"$ "+this.props.jobDetails.Salary:""}</div>
                        <br/>
                        <br/>
                        <h3>Job Decription</h3>
                        <div>{this.props.jobDetails?this.props.jobDetails.JobDescription:""}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(JobPreview);