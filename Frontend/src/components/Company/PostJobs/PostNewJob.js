import React, {Component} from 'react';
import '../../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import { connect } from "react-redux";
import { serverUrl } from "../../../config";
import {Link} from 'react-router-dom';

class PostNewJob extends Component {
    constructor(props){
        super(props);
        //debugger;
        this.state = {  
            type : "FirstTimeLoad"
            ,allCountries: ""
            ,allCities : ""
            ,allStates : ""
            ,allJobCategory : []
            ,isValueUpdated : false
            ,error : null
            ,selectedJobCats : ""
            ,jobData : { JobTitle : ""
                        ,ApplicationDeadLineDate : ""
                        ,Country : ""
                        ,State : ""
                        ,City : ""
                        ,Address : ""
                        ,Salary : ""
                        ,JobDescription : ""
                }
        }

        this.jobTitleChangeHandler = this.jobTitleChangeHandler.bind(this);
        this.deadLineDateChange = this.deadLineDateChange.bind(this);
        this.onCountryChange = this.onCountryChange.bind(this);
        this.onStateChange = this.onStateChange.bind(this);
        this.onCityChange = this.onCityChange.bind(this);
        this.onAddressChange = this.onAddressChange.bind(this);
        this.onSalaryChange = this.onSalaryChange.bind(this);
        this.onDescriptionChange = this.onDescriptionChange.bind(this);
        this.handleClickJobCategoryCheckBox = this.handleClickJobCategoryCheckBox.bind(this);
        this.saveData = this.saveData.bind(this);
    }

    componentWillMount(){
        //debugger;
        axios.defaults.withCredentials = true;
        var data;
        if(cookie.load('cookie')){
            data = {
                userId:this.state.email
                ,token:cookie.load('cookie')
                ,type : this.state.type
            }
        }
        axios.get(serverUrl+'fetchJobMasterData')
                .then((response) => {
                    //debugger;
                console.log(response);
                if(response.status === 200 && response.data){
                    var jobCategories = response.data[3].map(jobCategory =>{
                        return {Name : jobCategory.Name, checked : false}
                    });
                    this.setState({
                        allCountries : response.data[0][0].Countries
                        ,allStates : response.data[1][0].States
                        ,allCities : response.data[2][0].cities
                        ,allJobCategory : this.state.allJobCategory.concat(jobCategories)
                    })
                }
            });
    }
    componentDidMount(){
        //debugger;
    }

    handleClickJobCategoryCheckBox(e){
        //debugger;
        var jobCategories = this.state.allJobCategory;
        jobCategories.filter( cat =>{
            if(cat.Name === e.target.value)
                cat.checked = e.target.checked
        })
        var selectedJobCat = this.state.selectedJobCats
        if(e.target.checked)
            selectedJobCat+= "," + e.target.value;
        else{
            selectedJobCat = selectedJobCat.replace(","+e.target.value,"")
        }
        this.setState({
            allJobCategory : jobCategories
            ,selectedJobCats : selectedJobCat
        })
    }

    jobTitleChangeHandler(e){
        //debugger;
        var job_Data = this.state.jobData;
        job_Data.JobTitle = e.target.value;
        this.setState({
            jobData : job_Data
        })
    }

    deadLineDateChange(e){
        //debugger;
        var job_Data = this.state.jobData;
        job_Data.ApplicationDeadLineDate = e.target.value;
        this.setState({
            jobData : job_Data
        })
    }
    
    onCountryChange(e){
        //debugger;
        var job_Data = this.state.jobData;
        job_Data.Country = e.target.value;
        this.setState({
            jobData : job_Data
        })
    }

    onStateChange(e){
        //debugger;
        var job_Data = this.state.jobData;
        job_Data.State = e.target.value;
        this.setState({
            jobData : job_Data
        })
    }

    onCityChange(e){
        //debugger;
        var job_Data = this.state.jobData;
        job_Data.City = e.target.value;
        this.setState({
            jobData : job_Data
        })
    }

    onAddressChange(e){
        //debugger;
        var job_Data = this.state.jobData;
        job_Data.Address = e.target.value;
        this.setState({
            jobData : job_Data
        })
    }

    onSalaryChange(e){
        //debugger;
        var job_Data = this.state.jobData;
        job_Data.Salary = e.target.value;
        this.setState({
            jobData : job_Data
        })
    }

    onDescriptionChange(e){
        //debugger;
        var job_Data = this.state.jobData;
        job_Data.JobDescription = e.target.value;
        this.setState({
            jobData : job_Data
        })
    }

    saveData(e){
        e.preventDefault();
        //debugger;
        var isValidData = true;

        if(!this.state.allCities.includes(this.state.jobData.City)){
            isValidData = false;
        }else if(!this.state.allStates.includes(this.state.jobData.State)){
            isValidData = false;
        }else if(!this.state.allCountries.includes(this.state.jobData.Country)){
            isValidData = false;
        }else if(isNaN(this.state.jobData.Salary)){
            isValidData = false;
        }

        if(isValidData){
            axios.defaults.withCredentials = true;
            axios.defaults.headers.common['authorization'] = cookie.load('jwtToken');
            var data;
            if(cookie.load('cookie')){
                data = {
                    token:cookie.load('cookie')
                    ,JobTitle : this.state.jobData.JobTitle
                    ,ApplicationDeadLineDate : this.state.jobData.ApplicationDeadLineDate
                    ,Country : this.state.jobData.Country
                    ,State : this.state.jobData.State
                    ,City : this.state.jobData.City
                    ,Address : this.state.jobData.Address
                    ,Salary : this.state.jobData.Salary
                    ,JobDescription : this.state.jobData.JobDescription
                    ,jobCategories : this.state.selectedJobCats
                }
                axios.post(serverUrl+'postNewJob',data)
                    .then((response) => {
                        //debugger;
                    console.log(response);
                    if(response.status === 200 && response.data === "Job Created"){
                        this.setState({
                            isValueUpdated : true
                            ,error : <label className="error">Job Posted !!</label>
                        })
                    }
                });
            } else {
                this.setState({
                    error : <label className="error">User Logged Out Login Again!!</label>
                })
            }
        }else{
            this.setState({
                error : <label className="error">Enter Valid Data!!</label>
            }) 
        }
    }

    render(){
        let redirectVar = null;
        if(!cookie.load('cookie')){
            redirectVar = <Redirect to= "/login"/>
        }

        let cbJobCategories = this.state.allJobCategory.map(cat => {
            return (
                <div className="schoolCheclBoxDiv">
                    <input name="jobCategoryCheckBox" className="form-control inputSchoolCheckBox" checked={!!cat.checked} onClick={this.handleClickJobCategoryCheckBox} value={cat.Name} type="checkbox" id="jobCategoryCheckBox"/>
                    <label className="control-label schoolsLabel"><div> {cat.Name}</div></label>
                </div>
            )
        })

        return(
            <div className="JobsPostingMainDiv">
                {redirectVar}
                <div className="innerNav">
                    <div className="innerContainer">
                        <div className="innerNavBar">
                            <h2 className="innerNavBarHeading jobs">
                                Post New Job
                            </h2>
                            <div class="rightLinksSubNavBar">
                                <Link className="SubNavBarRightItem" to="/CompanyJobPostings">Job Search</Link>
                                <Link className="SubNavBarRightItem activeItem" to="/PostNewJob">Post New Job</Link>
                            </div>
                        </div>
                    </div>
                </div>
            <div>
                <div className="container profileContainer">
                    <div className="row">
                        <div className="col-md-6">
                                <h2>Fill Details below to Post a job</h2>
                                <label>Job Title</label>
                                    <div className="form-group">
                                    <input type="text" onChange={this.jobTitleChangeHandler} className="form-control" placeholder="Job Title"/>
                                </div>
                                <label>Application Deadline Date</label>
                                    <div className="form-group">
                                    <input type="text" className="form-control" onChange={this.deadLineDateChange} placeholder="dd-MMM-YYYY" />
                                </div>
                                <label>Country</label>
                                    <div className="form-group">
                                    <input type="text"  className="form-control" onChange={this.onCountryChange} placeholder="Country" />
                                </div>
                                <label>State</label>
                                    <div className="form-group">
                                    <input type="text" onChange={this.onStateChange} className="form-control" placeholder="State" />
                                </div>
                                <label>City</label>
                                    <div className="form-group">
                                    <input type="text" onChange={this.onCityChange} className="form-control" placeholder="City" />
                                </div>
                                <label>Address</label>
                                    <div className="form-group">
                                    <input type="text" onChange={this.onAddressChange} className="form-control" placeholder="Address" />
                                </div>
                                <label>Salary</label>
                                    <div className="form-group">
                                    <input type="text" onChange={this.onSalaryChange} className="form-control" placeholder="Salary" />
                                </div>
                                <label>Job Description</label>
                                    <div className="form-group">
                                    <input type="text" onChange={this.onDescriptionChange} className="form-control" placeholder="Job Description" />
                                </div>
                                <label>Job Category</label>
                                    <div className="form-group">
                                    {cbJobCategories}
                                </div>
                                <div className="form-group">
                                    {this.state.error}
                                </div>
                                <div className="col-md-6">
                                    <button type="button" className="saveButton" onClick={this.saveData}>
                                        <span>Save</span>
                                    </button>
                                </div>
                        </div>
                    </div>
                    <div className="margin-bottom-24"></div>
                </div> 
            </div> 
            </div>
        )
    }
}


export default PostNewJob;