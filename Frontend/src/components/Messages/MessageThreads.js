import React, { Component } from 'react';
import '../../App.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import MessagePreview from './MessagePreview';
import JobPreviewLoader from '../Loader/JobPreviewLoader';
import JobSearchLoader from '../Loader/JobSearchLoader';
import { serverUrl } from '../../config';
import { connect } from "react-redux";
import { updateUserInfo } from "../../js/actions/index";


var SortColumns = [
    {Name : "Application DeadLine", ColumnName : "ApplicationDeadlineDate"}
    ,{Name : "Location", ColumnName : "State"}
    ,{Name :"Posting Date", ColumnName : "PostingDate"}]

var SortOrders = [
    {Name : "Ascending", Value : "1"}
    ,{Name : "Descending", Value : "-1"}]

class MessageThreads extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageData: []
            , messagesCount: null
            , messagesDetails: null
            , selectedMessageThread: ""
        }

        this.onMessageThreadClick = this.onMessageThreadClick.bind(this);
        // this.onCategoryFilterClick = this.onCategoryFilterClick.bind(this);
        // this.onTitleInput = this.onTitleInput.bind(this);
        // this.onNameInput = this.onNameInput.bind(this);
        // this.onCityInput = this.onCityInput.bind(this);
        // this.onSortColumnSelect = this.onSortColumnSelect.bind(this);
        // this.onSortOrderSelect = this.onSortOrderSelect.bind(this);
        // this.onPrevPageBtnClick = this.onPrevPageBtnClick.bind(this);
        // this.onNextPageBtnClick = this.onNextPageBtnClick.bind(this);
    }

    componentWillMount() {
        //debugger;
    }

    componentDidMount() {
        this.fetchMessageListing();
    }

    fetchMessageListing = function () {
        debugger;
        axios.defaults.withCredentials = true;

        var data;
        data = {
            token: cookie.load('cookie')
        }
        axios.defaults.headers.common['authorization'] = cookie.load('jwtToken');
        axios.post(serverUrl + 'fetchMessageThreads', data)
            .then((response) => {
                //debugger;
                //update the state with the response data
                console.log("data " + response.data);
                this.setState({
                    messageData: this.state.messageData.concat(response.data.messageThreads)
                    // , jobCount: response.data.jobCount
                });
            });
    }

    fetchMessageDetails = function (messageThreadId) {
        debugger;
        var selectedMessageThread;
        this.state.messageData.filter(message => {
            if (message._id === messageThreadId) {
                selectedMessageThread = message;
                return;
            }
        })
        this.setState({
            messagesDetails: selectedMessageThread
        });
    }

    onMessageThreadClick(e) {
        //debugger;
        e.preventDefault();
        this.setState({
            messagesDetails: null
            , selectedMessageThread: e.target.dataset.value
        }, () => { this.fetchMessageDetails(this.state.selectedMessageThread) })
    }

    render() {

        var CurrentUserId = "";
        if(this.props.userData){
            CurrentUserId = this.props.userData._id;
        }
        let MessageList = null;
        if (this.state.messageData.length) {
            MessageList = this.state.messageData.map(message => {
                var latestMessageDisplay = message.Messages.slice(-1)[0].Message.slice(0,30)+" ...";
                return (<div className="borderBottom">
                    <button className="jobButton" onClick={this.onMessageThreadClick} data-value={message._id}>
                        <div className="jobBasicData" data-value={message._id}>
                            <div className="jobsBasicDataInsideContainer" data-value={message._id}>
                                <div className="jobTitle" data-value={message._id}>
                                    {message.User1===CurrentUserId?message.User2Name:message.User1Name}
                                </div>
                                <div className="jobCategory" data-value={message._id}>
                                    {message.Messages.slice(-1)[0].FromUserId === message.User1?message.User1Name: message.User2Name} : {latestMessageDisplay}
                                </div>
                            </div>
                        </div>
                    </button>
                </div>)
            })
        // } else if (!this.state.messageData.length && this.state.jobCount == 0) {
        //     MessageList = <label className="error">No Jobs Found!!</label>
        } else {
            MessageList = <JobSearchLoader />
        }

        debugger;

        let messageThreadDetails = null;
        if(this.state.selectedMessageThread === ""){
            messageThreadDetails = <div className="messageNoConvDiv"><p className="messageserror">No Conversation selected.</p></div>
        } else {
            if (this.state.messagesDetails) {
                messageThreadDetails = <MessagePreview messagesDetails={this.state.messagesDetails}></MessagePreview>
             } else {
                 messageThreadDetails = (<div className="rightMainData"><JobPreviewLoader /></div>)
             }
        }

        let redirectVar = null;
        if (cookie.load('cookie')) {
            redirectVar = <Redirect to="/MessageThreads" />
        } else {
            redirectVar = <Redirect to="/login" />
        }
        return (
            <div className="JobsPostingMainDiv">
                {redirectVar}
                {/* <div className="innerNav">
                    <div className="innerContainer">
                        <div className="innerNavBar">
                            <h2 className="innerNavBarHeading jobs">
                                Message Inbox
                            </h2>
                            <div class="rightLinksSubNavBar">
                                <Link className="SubNavBarRightItem activeItem" to="/MessageThreads">Messages</Link>
                            </div>
                        </div>
                    </div>
                </div> */}
                <div className="jobFilterAndDataContainer">
                    {/* <div className="jobMainFilters">
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
                    </div> */}
                    <div className="jobsMainData">
                        <div className="dataCard">
                            <div className="messagesDataInnerDiv">
                                <div className="leftListingJobs">
                                    <div className="jobsCount">
                                        <div className="jobCountData">
                                            <div className = "messageThreadLeftHeading">
                                                <h2 className ="messageHeading">Messages</h2>
                                            </div>
                                        </div>
                                        {/* <div className="row">
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
                                        </div> */}
                                        {/* <div className="row">
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
                                        </div> */}
                                    </div>
                                    <div className="jobListContainer">
                                        <div className="jobsListInsideDiv">
                                            <div className="jobsListMain">
                                                {MessageList}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                    {messageThreadDetails}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { userData: state.loginInfo.UserData
        ,loginStatus : state.loginInfo.loginStatus };
};

const mapDispatchToProps = dispatch => {
    return {
        updateUserInfo: (userInfo, callback) => {dispatch(updateUserInfo(userInfo, callback));}
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(MessageThreads);