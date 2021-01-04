import React, {Component} from 'react';
import '../../../App.css';
import {Link} from 'react-router-dom';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import JobPreviewLoader from '../../Loader/JobPreviewLoader';
import JobSearchLoader from '../../Loader/JobSearchLoader';
import EventPreviewList from './EventPreviewList'
import {serverUrl} from '../../../config';

class EventListings extends Component {
    constructor(props){
        super(props);
        this.state = {  
            eventName : ""
            ,eventData : []
            ,eventCount : null
            ,selectedEventId : 0
            ,eventPreviewList : []
        }

        this.onEventClick = this.onEventClick.bind(this);
    }

    componentWillMount(){
        //debugger;
    }

    componentDidMount(){
        this.fetchEventListing();
    }

    fetchEventListing = function(){
        //debugger;
        axios.defaults.withCredentials = true;
        var data;
        data = {
            token: cookie.load('cookie')
        }
        axios.defaults.headers.common['authorization'] = cookie.load('jwtToken');
        axios.post(serverUrl+'CompanyEventListings',data)
                .then((response) => {
                    //debugger;
                //update the state with the response data
                console.log("data " + response.data);
                let allEvents  = response.data.allEvents.map(event => {
                    return {Id : event._id
                        , eventName : event.EventName
                        , company : event.CompanyName
                        , city : event.City
                        , state : event.State
                        , eventDate : event.DateAndTime
                    }
                });
                let allEventPreview  = response.data.appliedStudentDetails.map(eve => {
                    var EventId = allEvents[0].Id;
                    return {Id : eve.Id
                        , StudentId : eve._id
                        , EmailId : eve.EmailId
                        , FullName : eve.StudentDetail.FirstName + " " + eve.StudentDetail.LastName
                    }
                });
                this.setState({
                    eventData : this.state.eventData.concat(allEvents)
                    ,eventCount : response.data.eventCount
                    ,eventPreviewList : this.state.eventPreviewList.concat(allEventPreview)
                });
            });
    }

    fetchEventDetails = function(event_Id){
        //debugger;
        axios.defaults.withCredentials = true;
        var data;
        data = {
            eventId : event_Id
            ,token : cookie.load('cookie')
        }
        axios.defaults.headers.common['authorization'] = cookie.load('jwtToken');
        axios.post(serverUrl+'CompanyEventStudentList',data)
                .then((response) => {
                    //debugger;
                //update the state with the response data
                console.log("data " + response.data);
                let allEventPreview  = response.data.appliedStudentDetails.map(eve => {
                    return {Id : event_Id
                        , StudentId : eve._id
                        , EmailId : eve.EmailId
                        , FullName : eve.StudentDetail.FirstName + " " + eve.StudentDetail.LastName
                    }
                });
                this.setState({
                    eventPreviewList : this.state.eventPreviewList.concat(allEventPreview)
                });
                console.log(response);
            });
    }

    onEventClick(e){
        //debugger;
        e.preventDefault();
        this.setState({
            eventPreviewList : []
            ,selectedEventId : e.target.dataset.value
        },() =>{this.fetchEventDetails(this.state.selectedEventId)})
    }

    render(){

        //debugger;
        let Eventlist = null;
        if(this.state.eventData.length){
            Eventlist = this.state.eventData.map(event => {
                return (<div className="borderBottom">
                    <button className="jobButton" onClick={this.onEventClick} data-value = {event.Id}>
                        <div className="jobBasicData" data-value={event.Id}>
                            <div className="jobsBasicDataInsideContainer" data-value={event.Id}>
                                <div className="jobTitle" data-value={event.Id}>
                                    {event.eventName}
                                </div>
                                <div className="jobCompanyName" data-value={event.Id}>
                                    {event.company}, {event.city}, {event.state}
                                </div>
                            </div>
                        </div>
                    </button>
                </div>)
            })
        }else if (!this.state.eventData.length && this.state.eventCount == 0){
            Eventlist = <label className="error">No Events Found!!</label>
        }else{
            Eventlist = <JobSearchLoader/>
        }

        let EventDetailsData = null;
        if(this.state.eventPreviewList.length){
            EventDetailsData = this.state.eventPreviewList.map(app => {
                return (<EventPreviewList data = {app}/>)
            }) 
        }else{
            EventDetailsData = [...Array(5)].map((e,i)=> {
                return (<JobPreviewLoader/>)
            })
        }

        let redirectVar = null;
                if(cookie.load('cookie')){
                    redirectVar = <Redirect to="/EventListings"/>
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
                                Event Search
                            </h2>
                            <div class="rightLinksSubNavBar">
                                <Link className="SubNavBarRightItem activeItem" to="/EventListings">Event Search</Link>
                                <Link className="SubNavBarRightItem" to="/PostNewEvent">Post New Event</Link>
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
                                                Total Event Count : {this.state.eventCount}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="jobListContainer">
                                        <div className="jobsListInsideDiv">
                                            <div className="jobsListMain">
                                                {Eventlist}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="rightMainData">
                                    {EventDetailsData}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default EventListings;