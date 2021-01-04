import React, { Component } from 'react';
import '../../App.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { serverUrl } from '../../config';
import SearchLoader from '../Loader/SearchLoader';
import ApplicationResult from './ApplicationResult';
import { connect } from "react-redux";
import { updateUserInfo } from "../../js/actions/index";


class Applications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allJobStatus: [{
                Name : "Pending"
                ,checked : false
            },{
                Name : "Reviewd"
                ,checked : false
            },{
                Name : "Declined"
                ,checked : false
            }]
            ,jobStatusFilter : ""
            ,searchData : []
            ,jobCount : null
        }

        this.handleClickStatusCheckBox = this.handleClickStatusCheckBox.bind(this);
    }

    componentWillMount() {
        // //debugger;
        // var data;
        // data = {
        //     token : cookie.load('cookie')
        // }
        // axios.post(serverUrl + 'application',data)
        //     .then((response) => {
        //         //debugger;
        //         //update the state with the response data
        //         console.log("data " + response.data);
        //         let statuses = response.data[0].map(status => {
        //             return { Name: status.Name, checked: false }
        //         });
        //         this.setState({
        //             allJobStatus: this.state.allJobStatus.concat(statuses)
        //         });
        //     });
    }

    componentDidMount(){
        //debugger;
        this.searchApiCall();
    }

    searchApiCall = function(){
        var userData = this.props.userData;
        var { StudentDetail } = userData;
        var { Applications } = StudentDetail;
        
        var filteredApplications = Applications.filter(app=>{
            if(this.state.jobStatusFilter !== ""){
                if(this.state.jobStatusFilter.includes(app.Status)){
                    return app;
                }
            }else{
                return app;
            }
        });

        this.setState({
            searchData: this.state.searchData.concat(filteredApplications)
            , jobCount: filteredApplications.length
        });

        // axios.defaults.withCredentials = true;
        // var data;
        // data ={
        //     token : cookie.load('cookie')
        //     ,jobStatusFilter : this.state.jobStatusFilter
        // }
        // axios.post(serverUrl+'applicationsSearch',data)
        //     .then((response) => {
        //         //debugger;
        //         console.log(response);
        //         let outputData = response.data[0].map(applicationData=>{
        //             return {
        //                 JobTitle : applicationData.JobTitle
        //                 ,CompanyName : applicationData.CompanyName
        //                 ,ApplicationStatus : applicationData.ApplicationStatus
        //                 ,ApplicationDate : applicationData.ApplicationDate
        //                 ,ApplicationDeadLineDate : applicationData.ApplicationDeadLineDate
        //             }
        //         })
        //         //update the state with the response data
        //         this.setState({
        //             searchData : this.state.searchData.concat(outputData)
        //             ,jobCount : response.data[1][0].JobCount
        //         });
        //         console.log(response);
        //     });
    }

    handleClickStatusCheckBox(e){
        //debugger;
        var allStatus = this.state.allJobStatus;
        allStatus.filter( status =>{
            if(status.Name === e.target.value)
                status.checked = e.target.checked
        })
        var StatusFilter = this.state.jobStatusFilter
        if(e.target.checked)
            StatusFilter+= "," + e.target.value;
        else{
            StatusFilter = StatusFilter.replace(","+e.target.value,"")
        }
        this.setState({
            allJobStatus : allStatus
            ,jobStatusFilter : StatusFilter
            ,searchData : []
        },() => {this.searchApiCall()})
    }

    render() {

        let value = null;
        let cbJobStatus = this.state.allJobStatus.map(status => {
            return (
                <div className="schoolCheclBoxDiv">
                    <input name="schoolCheckBox" className="form-control inputSchoolCheckBox" checked={!!status.checked} onClick={this.handleClickStatusCheckBox} value={status.Name} type="checkbox" id="schoolCheckBox" />
                    <label className="control-label schoolsLabel"><div> {status.Name}</div></label>
                </div>
            )
        })

        let applicationSearchData = null;
        if(this.state.searchData.length){
            applicationSearchData = this.state.searchData.map(applicationData => {
                return (<ApplicationResult data = {applicationData}/>)
            }) 
        }else if(!this.state.searchData.length && this.state.jobCount == 0){
            applicationSearchData = <label className="error">No Data Found!!</label>
        }else{
            applicationSearchData = [...Array(this.state.rowCount)].map((e,i)=> {
                return (<SearchLoader/>)
            })
        }
        return (
            <div className="JobsPostingMainDiv">
                <div className="innerNav">
                    <div className="innerContainer">
                        <div className="innerNavBar">
                            <h2 className="innerNavBarHeading jobs">
                                Applications
                            </h2>
                            <div class="rightLinksSubNavBar">
                                <Link className="SubNavBarRightItem" to="/StudentJobPostings">Job Search</Link>
                                <Link className="SubNavBarRightItem activeItem" to="/StudentApplications">Applications</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="StudentSearchMain">
                    <div className="StudentSearchDiv">
                        <div className="row">
                            <div className="col-md-3">
                                <div className="dataCard" style={{ pointerEvents: value }}>
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
                                            <h5 className="filterHeading">School</h5>
                                        </div>
                                        <div className="filterInputHide" style={{ overflow: 'visible' }}>
                                            <div className="divInsideHide">
                                                <div>
                                                    {cbJobStatus}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-9">
                                {/* {searchResultsComponent} */}
                                {/* <SearchLoader/> */}
                                {applicationSearchData}
                                {/* <ApplicationResult/> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(Applications);