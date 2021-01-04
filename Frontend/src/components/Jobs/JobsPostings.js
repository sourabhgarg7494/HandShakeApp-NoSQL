import React, { Component } from 'react';
import '../../App.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import JobPreview from './JobsPreview';
import JobPreviewLoader from '../Loader/JobPreviewLoader';
import JobSearchLoader from '../Loader/JobSearchLoader';
import { serverUrl } from '../../config';

var SortColumns = [
    {Name : "Application DeadLine", ColumnName : "ApplicationDeadlineDate"}
    ,{Name : "Location", ColumnName : "State"}
    ,{Name :"Posting Date", ColumnName : "PostingDate"}]

var SortOrders = [
    {Name : "Ascending", Value : "1"}
    ,{Name : "Descending", Value : "-1"}]

class JobsPostings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            city: ""
            , jobTitle: ""
            , company: ""
            , jobCategoryFilter: ""
            , jobData: []
            , jobCount: null
            , jobDetails: null
            , jobCategories: []
            , selectedJobId: 0
            , sortColumn : "ApplicationDeadlineDate"
            , sortOrderValue : "1"
            , selectedColumn : "Application DeadLine"
            , selectedOrder : "Ascending"
            , currentPage : 1
            , RowCount : 10
            , pageCount : 0
        }

        this.onJobClick = this.onJobClick.bind(this);
        this.onCategoryFilterClick = this.onCategoryFilterClick.bind(this);
        this.onTitleInput = this.onTitleInput.bind(this);
        this.onNameInput = this.onNameInput.bind(this);
        this.onCityInput = this.onCityInput.bind(this);
        this.onSortColumnSelect = this.onSortColumnSelect.bind(this);
        this.onSortOrderSelect = this.onSortOrderSelect.bind(this);
        this.onPrevPageBtnClick = this.onPrevPageBtnClick.bind(this);
        this.onNextPageBtnClick = this.onNextPageBtnClick.bind(this);
    }

    componentWillMount() {
        //debugger;
        axios.defaults.withCredentials = true;
        axios.get(serverUrl + 'jobPosting')
            .then((response) => {
                //debugger;
                //update the state with the response data
                console.log("data " + response.data);
                let allJobCategories = response.data[0].map(cat => {
                    return { Name: cat.Name }
                });
                this.setState({
                    jobCategories: this.state.jobCategories.concat(allJobCategories)
                });
            });
    }

    onPrevPageBtnClick(e){
        e.preventDefault();
        this.setState({
            currentPage : this.state.currentPage -1
            ,jobData : []
        },() => {this.fetchJobListing()})
    } 

    onNextPageBtnClick(e){
        e.preventDefault();
        this.setState({
            currentPage : this.state.currentPage +1
            ,jobData : []
        },() => {this.fetchJobListing()})
    }

    onSortColumnSelect(e){
        //debugger;
        this.setState({
            sortColumn : e.target.value
            ,selectedColumn : e.target.selectedOptions[0].text
            , jobData: []
            , currentPage : 1
        },() => { this.fetchJobListing() });
    }

    onSortOrderSelect(e){
        //debugger;
        this.setState({
            sortOrderValue : e.target.value
            ,selectedOrder : e.target.selectedOptions[0].text
            ,jobData: []
            ,currentPage : 1
        },() => { this.fetchJobListing() });
    }

    componentDidMount() {
        this.fetchJobListing();
    }

    fetchJobListing = function () {
        //debugger;
        axios.defaults.withCredentials = true;

        var data;
        data = {
            type: "jobListLoad"
            , city: this.state.city
            , jobTitle: this.state.jobTitle
            , company: this.state.company
            , jobCategoryFilter: this.state.jobCategoryFilter
            , sortOrderValue : this.state.sortOrderValue
            , sortColumn : this.state.sortColumn
            , currentPage : this.state.currentPage
            , rowCount : this.state.RowCount
            , token: cookie.load('cookie')
        }
        axios.defaults.headers.common['authorization'] = cookie.load('jwtToken');
        axios.post(serverUrl + 'jobPosting', data)
            .then((response) => {
                //debugger;
                //update the state with the response data
                console.log("data " + response.data);
                // let allJobs  = response.data[0].map(job => {
                //     return {
                //         Id : job._id
                //         , title : job.JobTitle
                //         , company : job.CompanyName
                //         , city : job.City
                //         , state : job.State
                //         , jobCategory : job.JobCategory
                //     }
                // });
                this.setState({
                    jobData: this.state.jobData.concat(response.data.allJobs)
                    , jobCount: response.data.jobCount
                    , pageCount: parseInt((response.data.jobCount / this.state.RowCount) + 1)
                    , jobDetails: response.data.allJobs[0]
                });
            });
    }

    fetchJobDetails = function (job_Id) {
        //debugger;
        var selectedJob;
        this.state.jobData.filter(job => {
            if (job._id === job_Id) {
                selectedJob = job;
                return;
            }
        })
        this.setState({
            jobDetails: selectedJob
        });
    }

    onTitleInput(e) {
        this.setState({
            jobTitle: e.target.value
            , jobData: []
            ,currentPage : 1
        }, () => { this.fetchJobListing() })
    }

    onNameInput(e) {
        this.setState({
            company: e.target.value
            , jobData: []
            , currentPage : 1
        }, () => { this.fetchJobListing() })
    }

    onCityInput(e) {
        this.setState({
            city: e.target.value
            , jobData: []
            , currentPage : 1
        }, () => { this.fetchJobListing() })
    }

    onJobClick(e) {
        //debugger;
        e.preventDefault();
        this.setState({
            jobDetails: null
            , selectedJobId: e.target.dataset.value
        }, () => { this.fetchJobDetails(this.state.selectedJobId) })
    }

    onCategoryFilterClick(e) {
        //debugger;
        e.preventDefault();
        var jobcatfilter = this.state.jobCategoryFilter;

        if (jobcatfilter.includes(e.target.title)) {
            jobcatfilter = jobcatfilter.replace(',' + e.target.title, '');
            e.target.classList.remove("ovalFilterButtonSelected");
        } else {
            jobcatfilter += "," + e.target.title;
            e.target.classList.add("ovalFilterButtonSelected");
        }

        this.setState({
            jobCategoryFilter: jobcatfilter
            , jobData: []
            , currentPage : 1
        }, () => { this.fetchJobListing() })
    }

    render() {

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

        let JobCategoryfilters = null;
        //debugger;
        if (this.state.jobCategories.length) {
            JobCategoryfilters = this.state.jobCategories.map(category => {
                return (
                    <button class="ovalFilterButton" onClick={this.onCategoryFilterClick} title={category.Name} type="button">
                        {category.Name}
                    </button>
                )
            })
        }

        let buttonColor = null;

        let Joblist = null;
        if (this.state.jobData.length) {
            Joblist = this.state.jobData.map(job => {
                return (<div className="borderBottom">
                    <button className="jobButton" onClick={this.onJobClick} data-value={job._id}>
                        <div className="jobBasicData" data-value={job._id}>
                            <div className="jobsBasicDataInsideContainer" data-value={job._id}>
                                <div className="jobTitle" data-value={job._id}>
                                    {job.JobTitle}
                                </div>
                                <div className="jobCompanyName" data-value={job._id}>
                                    {job.CompanyName}, {job.City}, {job.State}
                                </div>
                                <div className="jobCategory" data-value={job._id}>
                                    {job.JobCategory}
                                </div>
                            </div>
                        </div>
                    </button>
                </div>)
            })
        } else if (!this.state.jobData.length && this.state.jobCount == 0) {
            Joblist = <label className="error">No Jobs Found!!</label>
        } else {
            Joblist = <JobSearchLoader />
        }

        //debugger;

        let JobDetailsData = null;
        if (this.state.jobDetails) {
            JobDetailsData = <JobPreview jobDetails={this.state.jobDetails}></JobPreview>
        } else {
            JobDetailsData = <JobPreviewLoader />
        }

        let redirectVar = null;
        if (cookie.load('cookie')) {
            redirectVar = <Redirect to="/StudentJobPostings" />
        } else {
            redirectVar = <Redirect to="/login" />
        }
        return (
            <div className="JobsPostingMainDiv">
                {redirectVar}
                <div className="innerNav">
                    <div className="innerContainer">
                        <div className="innerNavBar">
                            <h2 className="innerNavBarHeading jobs">
                                Job Search
                            </h2>
                            <div class="rightLinksSubNavBar">
                                <Link className="SubNavBarRightItem activeItem" to="/StudentJobPostings">Job Search</Link>
                                <Link className="SubNavBarRightItem" to="/StudentApplications">Applications</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="jobFilterAndDataContainer">
                    <div className="jobMainFilters">
                        <div className="dataCard">
                            <div className="insideDataCard">
                                <div className="searchInputContainers">
                                    <div class="inputContainers">
                                        <svg aria-hidden="true" data-prefix="fas" data-icon="search" class="svgJobFilter" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z">
                                            </path>
                                        </svg>
                                        <div>
                                            <div class="titleFilter form-group">
                                                <input name="titleInput" onChange={this.onTitleInput} placeholder="Job titles" type="text" id="titleInput" class="form-control titleInput" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="searchSeperator"></div>
                                    <div class="inputContainers">
                                        <svg aria-hidden="true" data-prefix="fas" data-icon="search" class="svgJobFilter" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z">
                                            </path>
                                        </svg>
                                        <div>
                                            <div class="titleFilter form-group">
                                                <input name="companyNameInput" onChange={this.onNameInput} placeholder="Company names" type="text" id="companyNameInput" class="form-control titleInput" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="searchSeperator"></div>
                                    <div class="inputContainers">
                                        <svg aria-hidden="true" data-prefix="fas" data-icon="map-marker-alt" class="svgJobFilter" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                            <path fill="currentColor" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z">
                                            </path>
                                        </svg>
                                        <div>
                                            <div class="titleFilter form-group">
                                                <input name="cityInput" onChange={this.onCityInput} placeholder="City" type="text" id="cityInput" class="form-control titleInput" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="categoryFilterMainOuterDiv">
                                    <div class="categoryFilterContainerDiv">
                                        <div class="categoryFilterInsideDiv">
                                            <div>
                                                {JobCategoryfilters}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <select className="form-control" value={this.state.sortColumn} onChange={this.onSortColumnSelect}>
                                                        {SortColumns.map((column) => <option className="Dropdown-menu" key={column.ColumnName} value={column.ColumnName}>{column.Name}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <select className="form-control" value={this.state.sortOrderValue} onChange={this.onSortOrderSelect}>
                                                        {SortOrders.map((order) => <option className="Dropdown-menu" key={order.Value} value={order.Value}>{order.Name}</option>)}
                                                    </select>
                                                </div>
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

export default JobsPostings;