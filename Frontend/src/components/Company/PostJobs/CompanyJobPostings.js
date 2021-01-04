import React, {Component} from 'react';
import '../../../App.css';
import {Link} from 'react-router-dom';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import CompanyJobPreview from './CompanyJobPreview';
import SearchLoader from '../../Loader/SearchLoader';
import JobSearchLoader from '../../Loader/JobSearchLoader';
import {serverUrl} from '../../../config';
import { connect } from "react-redux";
import { updateUserInfo } from "../../../js/actions/index";

class CompanyJobPostings extends Component {
    constructor(props){
        super(props);
        this.state = {  
            jobData : []
            ,jobCount : 0
            ,jobApplications : []
            ,selectedJobId : null
            , currentPage : 1
            , RowCount : 10
            , pageCount : 0
        }

        this.onJobClick = this.onJobClick.bind(this);
        this.onPrevPageBtnClick = this.onPrevPageBtnClick.bind(this);
        this.onNextPageBtnClick = this.onNextPageBtnClick.bind(this);
    }

    componentWillMount(){
        //debugger;
    }

    componentDidMount(){
        this.fetchJobListing();
    }

    onPrevPageBtnClick(e){
        e.preventDefault();
        this.setState({
            currentPage : this.state.currentPage -1
            ,jobData : []
            ,jobApplications : []
        },() => {this.fetchJobListing()})
    } 

    onNextPageBtnClick(e){
        e.preventDefault();
        this.setState({
            currentPage : this.state.currentPage +1
            ,jobData : []
            ,jobApplications : []
        },() => {this.fetchJobListing()})
    }

    fetchJobListing = function(){
        //debugger;
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['authorization'] = cookie.load('jwtToken');
        var data;
        data = {
            type : "jobListLoad"
            ,token : cookie.load('cookie')
            , currentPage : this.state.currentPage
            , rowCount : this.state.RowCount
        }
        axios.post(serverUrl+'CompanyJobPosting',data)
                .then((response) => {
                    //debugger;
                //update the state with the response data
                console.log("data " + response.data);
                let allJobs  = response.data.allJobs.map(job => {
                    return {Id : job._id
                        , title : job.JobTitle
                        , city : job.City
                        , state : job.State
                        , jobCategory : job.JobCategory
                    }
                });
                let allJobApplications  = response.data.appliedStudentDetails.map(job => {
                    var JobId = allJobs[0].Id;
                    var StudentallApplications = job.StudentDetail.Applications;
                    var SelectedResume, Status; 
                    for (var i = 0; i< StudentallApplications.length; i++){
                        if(StudentallApplications[i].JobId === JobId){
                            SelectedResume = StudentallApplications[i].SelectedResume;
                            Status = StudentallApplications[i].Status;
                            break;
                        }
                    }
                    return {Id : JobId
                        , StudentId : job._id 
                        , EmailId : job.EmailId
                        , FullName : job.StudentDetail.FirstName + " " + job.StudentDetail.LastName
                        , ResumePath : SelectedResume.ResumePath
                        , Filename : SelectedResume.FileName
                        , ApplicationStatus : Status
                    }
                });
                this.setState({
                    jobData : this.state.jobData.concat(allJobs)
                    ,jobCount : response.data.jobCount
                    , pageCount: parseInt((response.data.jobCount / this.state.RowCount) + 1)
                    ,jobApplications : this.state.jobApplications.concat(allJobApplications)
                });
            });
    }

    fetchJobDetails = function(job_Id){
        //debugger;
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['authorization'] = cookie.load('jwtToken');
        var data;
        data = {
            type : "fetchJobApplications"
            ,jobId : job_Id
            ,token : cookie.load('cookie')
        }
        axios.post(serverUrl+'CompanyJobPosting',data)
                .then((response) => {
                    //debugger;
                //update the state with the response data
                console.log("data " + response.data);
                let allJobApplications  = response.data.appliedStudentDetails.map(job => {
                    var StudentallApplications = job.StudentDetail.Applications;
                    var SelectedResume, Status; 
                    for (var i = 0; i< StudentallApplications.length; i++){
                        if(StudentallApplications[i].JobId === job_Id){
                            SelectedResume = StudentallApplications[i].SelectedResume;
                            Status = StudentallApplications[i].Status;
                            break;
                        }
                    }
                    return {Id : job_Id
                        , StudentId : job._id 
                        , EmailId : job.EmailId
                        , FullName : job.StudentDetail.FirstName + " " + job.StudentDetail.LastName
                        , ResumePath : SelectedResume.ResumePath
                        , Filename : SelectedResume.FileName
                        , ApplicationStatus : Status
                    }
                });
                this.setState({
                    jobApplications : this.state.jobApplications.concat(allJobApplications)
                });
            });
    }

    onJobClick(e){
        //debugger;
        e.preventDefault();
        this.setState({
            jobApplications : []
            ,selectedJobId : e.target.dataset.value
        },() =>{this.fetchJobDetails(this.state.selectedJobId)})
    }

    render(){

        let paginationPrevBtnClass = ""
        let disabledPrev = ''
        if(this.state.currentPage == 1){
            paginationPrevBtnClass = "btnDisabled"
            disabledPrev = 'true'
        }
        else{
            paginationPrevBtnClass = "btnPagination"
            disabledPrev = ''
        }
        let paginationNextBtnClass = ""
        //debugger;
        let disabledNext = ''
        if(this.state.currentPage == this.state.pageCount){
            paginationNextBtnClass = "btnDisabled"
            disabledNext = 'true'
        }
        else{
            paginationNextBtnClass = "btnPagination"
            disabledNext = ''
        }

        let Joblist = null;
        if(this.state.jobData.length){
            Joblist = this.state.jobData.map(job => {
                return (<div className="borderBottom">
                    <button className="jobButton" onClick={this.onJobClick} data-value = {job.Id}>
                        <div className="jobBasicData" data-value={job.Id}>
                            <div className="jobsBasicDataInsideContainer" data-value={job.Id}>
                                <div className="jobTitle" data-value={job.Id}>
                                    {job.title}
                                </div>
                                <div className="jobCompanyName" data-value={job.Id}>
                                    {job.city}, {job.state}
                                </div>
                                <div className="jobCategory" data-value={job.Id}>
                                    {job.jobCategory}
                                </div>
                            </div>
                        </div>
                    </button>
                </div>)
            })
        }else{
            Joblist = <JobSearchLoader/>
        }

        let JobDetailsData = null;
        if (this.state.jobApplications.length) {
            JobDetailsData = this.state.jobApplications.map(app => {
                return (<CompanyJobPreview data={app} />)
            })
        } else {
            JobDetailsData = [...Array(5)].map((e, i) => {
                return (<SearchLoader />)
            })
        }

        let redirectVar = null;
                if(cookie.load('cookie')){
                    redirectVar = <Redirect to="/CompanyJobPostings"/>
        }else{
            redirectVar = <Redirect to="/login"/>
        }
        return(
            <div className="JobsPostingMainDiv">
                {redirectVar}
                <div className="innerNav">
                    <div className="innerContainer">
                        <div className="innerNavBar">
                            <h2 className="innerNavBarHeading jobs">
                                Jobs Posted
                            </h2>
                            <div class="rightLinksSubNavBar">
                                <Link className="SubNavBarRightItem activeItem" to="/CompanyJobPostings">Job Search</Link>
                                <Link className="SubNavBarRightItem" to="/PostNewJob">Post New Job</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="jobFilterAndDataContainer">
                    <div className="jobsMainData">
                        <div className="dataCard">
                            <div className="jobsDataInnerDiv">
                                <div className="leftListingJobs">
                                    <div className="jobsCount">
                                        <div className="jobCountData">
                                            <div className="jobCountItem">
                                                Total Job Count : {this.state.jobCount}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div class="center-aligned">
                                                <button class={paginationPrevBtnClass} disabled={disabledPrev} onClick={this.onPrevPageBtnClick}>
                                                    <svg aria-hidden="true" data-prefix="fas" data-icon="chevron-left" class="paginationsvg" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                                        <path fill="currentColor" d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z">
                                                        </path>
                                                    </svg>
                                                    <span></span>
                                                </button>
                                                <div class="divPageNumber">{this.state.currentPage}/{this.state.pageCount}</div>
                                                <button class={paginationNextBtnClass} disabled={disabledNext} onClick={this.onNextPageBtnClick}>
                                                    <svg aria-hidden="true" data-prefix="fas" data-icon="chevron-right" class="paginationsvg" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                                        <path fill="currentColor" d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z">
                                                        </path>
                                                    </svg>
                                                    <span></span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="jobListContainer">
                                        <div className="jobsListInsideDiv">
                                            <div className="jobsListMain">
                                                {Joblist}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="rightMainData">
                                    {JobDetailsData}
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
        updateUserInfo: (userInfo, callback) => { dispatch(updateUserInfo(userInfo, callback)); }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyJobPostings);