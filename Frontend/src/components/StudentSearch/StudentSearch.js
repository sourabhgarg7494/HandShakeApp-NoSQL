import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import SearchResults from './SearchResults'
import SearchLoader from '../Loader/SearchLoader'
import {serverUrl} from '../../config' 
import { connect } from "react-redux";
import { updateUserInfo } from "../../js/actions/index";

class StudentSearch extends Component {
    constructor(props){
        super(props);
        this.state = { 
            searchData: []
            ,pageCount: 0
            ,currentPage : 1
            ,filterName : ""
            ,schoolNameFilter : ""
            ,majorFilter : ""
            ,skillFilter : ""
            ,rowCount : 10
            ,searchCount : null
            ,schools : []
            ,majors : []
            ,skills : []
        }

        this.filterNameChange = this.filterNameChange.bind(this);
        this.handleClickSchoolCheckBox = this.handleClickSchoolCheckBox.bind(this);
        this.handleClickMajorCheckBox = this.handleClickMajorCheckBox.bind(this);
        this.handleClickSkillCheckBox = this.handleClickSkillCheckBox.bind(this);
        this.onPrevPageBtnClick = this.onPrevPageBtnClick.bind(this);
        this.onNextPageBtnClick = this.onNextPageBtnClick.bind(this);
    }

    componentWillMount(){
        axios.get(serverUrl+'studentSearchFilter')
            .then((response) => {
                //debugger;
                //update the state with the response data
                console.log("data " + response.data);
                let allSchools  = response.data.Schools.map(school => {
                    return {Name : school.Name, checked:false}
                });
                let allmajors = response.data.Majors.map(major => {
                    return {Name : major.Name, checked : false}
                });
                let allskills = response.data.Skills.map(skill => {
                    return {Name : skill.Name, checked : false}
                });
                this.setState({
                    schools : this.state.schools.concat(allSchools)
                    ,majors : this.state.majors.concat(allmajors)
                    ,skills : this.state.skills.concat(allskills)
                });
            });
    }

    componentDidMount(){
        //debugger;
        this.searchApiCall();
    }

   searchApiCall= function (){
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['authorization'] = cookie.load('jwtToken');
        var data;
        data = {
            studentName : this.state.filterName
            ,schoolName : this.state.schoolNameFilter
            ,major : this.state.majorFilter
            ,skill : this.state.skillFilter
            ,currentPage : this.state.currentPage
            ,rowCount : this.state.rowCount
            ,token:cookie.load('cookie')
        }
        axios.post(serverUrl+'studentSearchFilter',data)
            .then((response) => {
                //debugger;
                console.log(response);
                // let outputData = response.data[0].map(studentData=>{
                //     return {
                //         fullName : studentData.FullName
                //         ,profilePicPath : studentData.ProfilePicturePath
                //         ,gradDate : studentData.GradDate
                //         ,schoolName : studentData.SchoolName
                //         ,majorName : studentData.MajorName
                //         ,companyName : studentData.CompanyName === null ?"":studentData.CompanyName
                //         ,title : studentData.Title === null ? "": studentData.Title
                //         ,emailId : studentData.EmailId
                //     }
                // })
                //update the state with the response data
                this.setState({
                    searchData : this.state.searchData.concat(response.data.allStudents)
                    ,pageCount : parseInt((response.data.studentCounts / this.state.rowCount) + 1)
                    ,searchCount : response.data.studentCounts
                });
                console.log(response);
            });

    }

    filterNameChange(e){
        this.setState({
            filterName : e.target.value
            ,searchData : []
            ,currentPage : 1
        },() => {this.searchApiCall()})
    }

    onPrevPageBtnClick(e){
        e.preventDefault();
        this.setState({
            currentPage : this.state.currentPage -1
            ,searchData : []
        },() => {this.searchApiCall()})
    }

    onNextPageBtnClick(e){
        e.preventDefault();
        this.setState({
            currentPage : this.state.currentPage +1
            ,searchData : []
        },() => {this.searchApiCall()})
    }

    handleClickSchoolCheckBox(e){
        //debugger;
        var allSchools = this.state.schools;
        allSchools.filter( school =>{
            if(school.Name === e.target.value)
                school.checked = e.target.checked
        })
        var schoolFilter = this.state.schoolNameFilter
        if(e.target.checked)
            schoolFilter+= "," + e.target.value;
        else{
            schoolFilter = schoolFilter.replace(","+e.target.value,"")
        }
        this.setState({
            schools : allSchools
            ,schoolNameFilter : schoolFilter
            ,searchData : []
            ,currentPage : 1
        },() => {this.searchApiCall()})
    }


    handleClickMajorCheckBox(e){
        //debugger;
        var allMajors = this.state.majors;
        allMajors.filter( major =>{
            if(major.Name === e.target.value)
                major.checked = e.target.checked
        })
        var majordataFilter = this.state.majorFilter
        if(e.target.checked)
            majordataFilter+= "," + e.target.value;
        else{
            majordataFilter = majordataFilter.replace(","+e.target.value,"")
        }
        this.setState({
            majors : allMajors
            ,majorFilter : majordataFilter
            ,searchData : []
            ,currentPage : 1
        },() => {this.searchApiCall()})
    }

    handleClickSkillCheckBox(e){
        //debugger;
        var allSkills = this.state.skills;
        allSkills.filter( skill =>{
            if(skill.Name === e.target.value)
                skill.checked = e.target.checked
        })
        var skilldatafilter = this.state.skillFilter
        if(e.target.checked)
            skilldatafilter+= "," + e.target.value;
        else{
            skilldatafilter = skilldatafilter.replace(","+e.target.value,"")
        }
        this.setState({
            skills : allSkills
            ,skillFilter : skilldatafilter
            ,searchData : []
            ,currentPage : 1
        },() => {this.searchApiCall()})
    }

    render(){

        let cbschools = this.state.schools.map(school => {
            return (
                <div className="schoolCheclBoxDiv">
                    <input name="schoolCheckBox" className="form-control inputSchoolCheckBox" checked={!!school.checked} onClick={this.handleClickSchoolCheckBox} value={school.Name} type="checkbox" id="schoolCheckBox"/>
                    <label className="control-label schoolsLabel"><div> {school.Name}</div></label>
                </div>
            )
        })

        let cbmajors = this.state.majors.map(major => {
            return (
                <div className="schoolCheclBoxDiv">
                    <input name="schoolCheckBox" className="form-control inputSchoolCheckBox" checked={!!major.checked} onClick={this.handleClickMajorCheckBox} value={major.Name} type="checkbox" id="schoolCheckBox"/>
                    <label className="control-label schoolsLabel"><div> {major.Name}</div></label>
                </div>
            )
        })

        let cbSkills = this.state.skills.map(skill =>{
            return (
                <div className="schoolCheclBoxDiv">
                    <input name="schoolCheckBox" className="form-control inputSchoolCheckBox" checked={!!skill.checked} onClick={this.handleClickSkillCheckBox} value={skill.Name} type="checkbox" id="schoolCheckBox"/>
                    <label className="control-label schoolsLabel"><div> {skill.Name}</div></label>
                </div>
            )
        })

        //debugger;
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

        let value = "";
        let searchResultsComponent = null;
        if(this.state.searchData.length){
            searchResultsComponent = this.state.searchData.map(studentData=> {
                return (<SearchResults data = {studentData}/>)
            })
            value = "";
        }else if(!this.state.searchData.length && this.state.searchCount === 0){
            searchResultsComponent = <label className="error">No Data Found!!</label>
            value = "";
        }
        else{
            searchResultsComponent = [...Array(this.state.rowCount)].map(()=> {
                return (<SearchLoader/>)
            })
            value = "none";
        }

        return(
            <div className="StudentSearchOuter">
                <div>
                    <div className="innerNav">
                        <div className="innerContainer">
                            <div className="innerNavBar">
                                <h2 className="innerNavBarHeading">
                                    Explore Students
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="StudentSearchMain">
                    <div className="StudentSearchDiv">
                        <div className="row">
                            <div className="col-md-3">
                                <div className="dataCard" style={{pointerEvents:value}}>
                                    <div class="insideDataCard">
                                        <div class="headingOutsideDiv">
                                            <div class="headingDiv">
                                                <h3 class="studentSearchHeading">Filters</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="allFiltersDiv">
                                        <div className="filterSeparator"></div>
                                        <div className="studentFilterTypediv">
                                            <svg aria-hidden="true" data-prefix="far" data-icon="chevron-up" className="filterSvg" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                                <path fill="currentColor" d="M6.101 359.293L25.9 379.092c4.686 4.686 12.284 4.686 16.971 0L224 198.393l181.13 180.698c4.686 4.686 12.284 4.686 16.971 0l19.799-19.799c4.686-4.686 4.686-12.284 0-16.971L232.485 132.908c-4.686-4.686-12.284-4.686-16.971 0L6.101 342.322c-4.687 4.687-4.687 12.285 0 16.971z">
                                                </path>
                                            </svg>
                                            <h5 className="filterHeading">Name</h5>
                                        </div>
                                        <div className="filterInputHide" style={{maxHeight: 48+'px', overflow: 'visible'}}>
                                            <div className="divInsideHide">
                                                <div>
                                                    <div className="nameInputDiv">
                                                        <input name="nameFilter" onChange={this.filterNameChange} placeholder="Enter Student" autocomplete="off" type="text" id="nameFilter" class="form-control" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="filterSeparator"></div>
                                        <div className="studentFilterTypediv">
                                            <svg aria-hidden="true" data-prefix="far" data-icon="chevron-up" className="filterSvg" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                                <path fill="currentColor" d="M6.101 359.293L25.9 379.092c4.686 4.686 12.284 4.686 16.971 0L224 198.393l181.13 180.698c4.686 4.686 12.284 4.686 16.971 0l19.799-19.799c4.686-4.686 4.686-12.284 0-16.971L232.485 132.908c-4.686-4.686-12.284-4.686-16.971 0L6.101 342.322c-4.687 4.687-4.687 12.285 0 16.971z">
                                                </path>
                                            </svg>
                                            <h5 className="filterHeading">School</h5>
                                        </div>
                                        <div className="filterInputHide" style={{overflow: 'visible'}}>
                                            <div className="divInsideHide">
                                                <div>
                                                    {cbschools}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="filterSeparator"></div>
                                        <div className="studentFilterTypediv">
                                            <svg aria-hidden="true" data-prefix="far" data-icon="chevron-up" className="filterSvg" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                                <path fill="currentColor" d="M6.101 359.293L25.9 379.092c4.686 4.686 12.284 4.686 16.971 0L224 198.393l181.13 180.698c4.686 4.686 12.284 4.686 16.971 0l19.799-19.799c4.686-4.686 4.686-12.284 0-16.971L232.485 132.908c-4.686-4.686-12.284-4.686-16.971 0L6.101 342.322c-4.687 4.687-4.687 12.285 0 16.971z">
                                                </path>
                                            </svg>
                                            <h5 className="filterHeading">Major</h5>
                                        </div>
                                        <div className="filterInputHide" style={{overflow: 'visible'}}>
                                            <div className="divInsideHide">
                                                <div>
                                                    {cbmajors}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="filterSeparator"></div>
                                        <div className="studentFilterTypediv">
                                            <svg aria-hidden="true" data-prefix="far" data-icon="chevron-up" className="filterSvg" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                                <path fill="currentColor" d="M6.101 359.293L25.9 379.092c4.686 4.686 12.284 4.686 16.971 0L224 198.393l181.13 180.698c4.686 4.686 12.284 4.686 16.971 0l19.799-19.799c4.686-4.686 4.686-12.284 0-16.971L232.485 132.908c-4.686-4.686-12.284-4.686-16.971 0L6.101 342.322c-4.687 4.687-4.687 12.285 0 16.971z">
                                                </path>
                                            </svg>
                                            <h5 className="filterHeading">Skills</h5>
                                        </div>
                                        <div className="filterInputHide" style={{overflow: 'visible'}}>
                                            <div className="divInsideHide">
                                                <div>
                                                    {cbSkills}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-9">
                                {/* <SearchResults/>
                                <SearchLoader/> */}
                                {searchResultsComponent}
                                <div class="margin-bottom-24">
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

export default connect(mapStateToProps, mapDispatchToProps)(StudentSearch);