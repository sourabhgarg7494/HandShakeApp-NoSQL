import React, {Component} from 'react';
import '../../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import { connect } from "react-redux";
import { serverUrl } from "../../../config";
import {Link} from 'react-router-dom';

class PostNewEvent extends Component {
    constructor(props){
        super(props);
        //debugger;
        this.state = {  
            type : "FirstTimeLoad"
            ,allCountries: ""
            ,allCities : ""
            ,allStates : ""
            ,allMajors : []
            ,isValueUpdated : false
            ,error : null
            ,selectedMajors : ""
            ,EventData : { EventName : ""
                        ,DateAndTime : ""
                        ,Country : ""
                        ,State : ""
                        ,City : ""
                        ,Address : ""
                        ,EventDescription : ""
                }
        }

        this.EventNameChangeHandler = this.EventNameChangeHandler.bind(this);
        this.DateAndTimeChange = this.DateAndTimeChange.bind(this);
        this.onCountryChange = this.onCountryChange.bind(this);
        this.onStateChange = this.onStateChange.bind(this);
        this.onCityChange = this.onCityChange.bind(this);
        this.onAddressChange = this.onAddressChange.bind(this);
        this.onDescriptionChange = this.onDescriptionChange.bind(this);
        this.handleClickMajorCheckBox = this.handleClickMajorCheckBox.bind(this);
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
        axios.get(serverUrl+'fetchEventPostMasterData')
                .then((response) => {
                    //debugger;
                console.log(response);
                if(response.status === 200 && response.data){
                    var Majors = response.data[3].map(major =>{
                        return {Name : major.Name, checked : false}
                    });
                    this.setState({
                        allCountries : response.data[0][0].Countries
                        ,allStates : response.data[1][0].States
                        ,allCities : response.data[2][0].cities
                        ,allMajors : this.state.allMajors.concat(Majors)
                    })
                }
            });
    }
    componentDidMount(){
        //debugger;
    }

    handleClickMajorCheckBox(e){
        //debugger;
        var majors = this.state.allMajors;
        majors.filter( major =>{
            if(major.Name === e.target.value)
                major.checked = e.target.checked
        })
        var selectedMajor = this.state.selectedMajors
        if(e.target.checked)
            selectedMajor+= "," + e.target.value;
        else{
            selectedMajor = selectedMajor.replace(","+e.target.value,"")
        }
        this.setState({
            allMajors : majors
            ,selectedMajors : selectedMajor
        })
    }

    EventNameChangeHandler(e){
        //debugger;
        var event_data = this.state.EventData;
        event_data.EventName = e.target.value;
        this.setState({
            EventData : event_data
        })
    }

    DateAndTimeChange(e){
        //debugger;
        var event_data = this.state.EventData;
        event_data.DateAndTime = e.target.value;
        this.setState({
            EventData : event_data
        })
    }
    
    onCountryChange(e){
        //debugger;
        var event_data = this.state.EventData;
        event_data.Country = e.target.value;
        this.setState({
            EventData : event_data
        })
    }

    onStateChange(e){
        //debugger;
        var event_data = this.state.EventData;
        event_data.State = e.target.value;
        this.setState({
            EventData : event_data
        })
    }

    onCityChange(e){
        //debugger;
        var event_data = this.state.EventData;
        event_data.City = e.target.value;
        this.setState({
            EventData : event_data
        })
    }

    onAddressChange(e){
        //debugger;
        var event_data = this.state.EventData;
        event_data.Address = e.target.value;
        this.setState({
            EventData : event_data
        })
    }

    onDescriptionChange(e){
        //debugger;
        var event_data = this.state.EventData;
        event_data.EventDescription = e.target.value;
        this.setState({
            EventData : event_data
        })
    }

    saveData(e){
        e.preventDefault();
        //debugger;
        var isValidData = true;

        if(!this.state.allCities.includes(this.state.EventData.City)){
            isValidData = false;
        }else if(!this.state.allStates.includes(this.state.EventData.State)){
            isValidData = false;
        }else if(!this.state.allCountries.includes(this.state.EventData.Country)){
            isValidData = false;
        }

        if(isValidData){
            axios.defaults.withCredentials = true;
            axios.defaults.headers.common['authorization'] = cookie.load('jwtToken');
            var data;
            if(cookie.load('cookie')){
                data = {
                    token:cookie.load('cookie')
                    ,EventName : this.state.EventData.EventName
                    ,DateAndTime : this.state.EventData.DateAndTime
                    ,Country : this.state.EventData.Country
                    ,State : this.state.EventData.State
                    ,City : this.state.EventData.City
                    ,Address : this.state.EventData.Address
                    ,EventDescription : this.state.EventData.EventDescription
                    ,majors : this.state.selectedMajors
                }
                axios.post(serverUrl+'postNewEvent',data)
                    .then((response) => {
                        //debugger;
                    console.log(response);
                    if(response.status === 200 && response.data === "Event Created"){
                        this.setState({
                            isValueUpdated : true
                            ,error : <label className="error">Event Posted !!</label>
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

        let cbEligibleMajors = this.state.allMajors.map(major => {
            return (
                <div className="schoolCheclBoxDiv">
                    <input name="majorCheckBox" className="form-control inputSchoolCheckBox" checked={!!major.checked} onClick={this.handleClickMajorCheckBox} value={major.Name} type="checkbox" id="majorCheckBox"/>
                    <label className="control-label schoolsLabel"><div> {major.Name}</div></label>
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
                                Post New Event
                            </h2>
                            <div class="rightLinksSubNavBar">
                                <Link className="SubNavBarRightItem" to="/EventListings">Event List</Link>
                                <Link className="SubNavBarRightItem activeItem" to="/PostNewEvent">Post New Event</Link>
                            </div>
                        </div>
                    </div>
                </div>
            <div>
                <div className="container profileContainer">
                    <div className="row">
                        <div className="col-md-7">
                                <h2>Fill Details below to Post an Event</h2>
                                <label>Event Name</label>
                                    <div className="form-group">
                                    <input type="text" onChange={this.EventNameChangeHandler} className="form-control" placeholder="Event Name"/>
                                </div>
                                <label>Date And Time</label>
                                    <div className="form-group">
                                    <input type="text" className="form-control" onChange={this.DateAndTimeChange} placeholder="dd-MMM-YYYY: hh:mm" />
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
                                <label>Event Description</label>
                                    <div className="form-group">
                                    <input type="text" onChange={this.onDescriptionChange} className="form-control" placeholder="Event Description" />
                                </div>
                                <label>Eligible Majors</label>
                                    <div className="form-group">
                                    {cbEligibleMajors}
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


export default PostNewEvent;