import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { serverUrl } from "../../config";
import { connect } from "react-redux";
import { updateUserInfo } from "../../js/actions/index";

class Skills extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditSkillsActive: false
            , skill: ""
            , error: null
        }

        this.editSkillsData = this.editSkillsData.bind(this);
        this.deleteSkill = this.deleteSkill.bind(this);
        this.cancelEditSkill = this.cancelEditSkill.bind(this);
        this.skillAddDelete = this.skillAddDelete.bind(this);
        this.addSkillsData = this.addSkillsData.bind(this);
    }

    addSkillsData(e) {
        e.preventDefault();
        //debugger;
        var isSkillPresent = false;
        var skillsData = this.props.userData.StudentDetail.Skills;
        if (skillsData.includes(this.state.skill)) {
            isSkillPresent = true;
        }
        if (!isSkillPresent) {
            //debugger;
            axios.defaults.withCredentials = true;
            axios.defaults.headers.common['authorization'] = cookie.load('jwtToken');
            var data = {
                skill : this.state.skill
            }
            axios.post(serverUrl + 'updateSkill', data)
                .then((response) => {
                    //debugger;
                    console.log(response);
                    if (response.status === 200) {           
                    }
                });
            skillsData.push(this.state.skill);
            var userData = this.props.userData;
            var {StudentDetail} = userData;
            Object.assign(StudentDetail,{Skills : skillsData});
            Object.assign(userData,{StudentDetail : StudentDetail});
            this.props.updateUserInfo(userData,()=>{
                if(this.props.userData.StudentDetail.Skills.includes(this.state.skill)){
                    this.setState({
                        isEditSkillsActive: false
                        , skill: ""
                        , error: null
                    });
                }else {
                    this.setState({
                        error : <label className="error">Skill Not Updated Try Again!!</label>
                    });
                }
            })
        } else {
            this.setState({
                error : <label className="error">Skill Already Present!!</label>
            });
        }

        // this.props.skillsData.filter(skill => {
        //     if (skill.Name === this.state.skill) {
        //         isSkillPresent = true;
        //     }
        // })
        // if (!isSkillPresent) {
        //     //debugger;
        //     this.props.skillsData.push({Name : this.state.skill });
        //     var data = {
        //         skill: this.state.skill
        //         , userId: this.props.email
        //         ,token :cookie.load('cookie')
        //         , type : "AddUserSkill"
        //     };
        //     axios.post(serverUrl + 'updateSkill', data)
        //         .then((response) => {
        //             console.log(response);
        //             if (response.status === 200) {
        //                 this.setState({
        //                     isEditSkillsActive: false
        //                     , skill: ""
        //                     , error : null
        //                 });
        //             }
        //         });
        // } else {
        //     this.setState({
        //         error : <label className="error">Skill Already Present!!</label>
        //     });
        // }

    }

    skillAddDelete(e) {
        this.setState({
            skill: e.target.value
        })
    }

    cancelEditSkill(e) {
        e.preventDefault();
        this.setState({
            isEditSkillsActive: false
        })
    }

    editSkillsData(e) {
        e.preventDefault();
        this.setState({
            isEditSkillsActive: true
        })
    }

    deleteSkill(e) {
        e.preventDefault();
        //debugger;
        var deletedSkill = this.state.skill;
        var isSkillPresent;

        var skillsData = this.props.userData.StudentDetail.Skills;

        var index = skillsData.indexOf(deletedSkill);

        if(index > -1){
            skillsData.splice(index,1);
            var userData = this.props.userData;
            var {StudentDetail} = userData;
            Object.assign(StudentDetail,{Skills : skillsData});
            Object.assign(userData,{StudentDetail:StudentDetail});
            this.props.updateUserInfo(userData, ()=>{
                if(!this.props.userData.StudentDetail.Skills.includes(deletedSkill)){
                    this.setState({
                        isEditSkillsActive: false
                        , skill: ""
                        , error: null
                    });
                } else {
                    this.setState({
                        error: <label className="error">Skill Not Deleted!!</label>
                    });
                }
            })
        } else {
            this.setState({
                error: <label className="error">Skill Not Found!!</label>
            });
        }
        // this.props.skillsData.filter(skill => {
        //     if (skill.Name === deletedSkill) {
        //         let index = this.props.skillsData.indexOf(skill);
        //         this.props.skillsData.splice(index, 1);
        //         isSkillPresent = true;
        //     }
        // });
        // if (isSkillPresent) {
        //     var data = {
        //         skill: deletedSkill
        //         , userId: this.props.email
        //         , token: cookie.load('cookie')
        //         , type : "DeleteUserSkill"
        //     };
        //     axios.post(serverUrl + 'updateSkill', data)
        //         .then((response) => {
        //             console.log(response);
        //             if (response.status === 200) {
        //                 this.setState({
        //                     isEditSkillsActive: false
        //                     , skill: ""
        //                     , error : null
        //                 });
        //             }
        //         });
        // } else{
        //     this.setState({
        //         error : <label className="error">Skill Not Found!!</label>
        //     });
            
        // }
    }

    render() {

        var editButton = null;
        if(!this.props.isReadOnly){
            editButton = (<button type="button" className="saveButton" onClick={this.editSkillsData}>
                            <span>Edit</span>
                         </button>)
        }

        var allSkills;
        //debugger;
        var skillsData;
        if(this.props.isReadOnly){
            if(this.props.userProfileData){
                skillsData = this.props.userProfileData.StudentDetail.Skills;
                allSkills = skillsData.map(skillsDat => {
                    return (
                        <tr>
                            <td>=></td>
                            <td>{skillsDat}</td>
                        </tr>
                    )
                })
            }
        } else {
            if(this.props.userData){
                skillsData = this.props.userData.StudentDetail.Skills;
                allSkills = skillsData.map(skillsDat => {
                    return (
                        <tr>
                            <td>=></td>
                            <td>{skillsDat}</td>
                        </tr>
                    )
                })
            }    
        }
                // if (this.props.skillsData) {
        //     allSkills = this.props.skillsData.map(skillsData => {
        //         return (
        //             <tr>
        //                 <td>=></td>
        //                 <td>{skillsData.Name}</td>
        //             </tr>
        //         )
        //     })
        // }

        var buttons
        if (this.state.isEditSkillsActive) {
            buttons = (<div><div className="row">
                <label >Skill Name</label>
                <div className="form-group">
                    <input type="text" onChange={this.skillAddDelete} className="form-control" name="txtSkill" placeholder="Add/Delete Skill" />
                </div>
            </div>
                <div className="row">
                    <div className="col-md-4">
                        <div className="divSaveButton">
                            <div className="divButtonWrapper">
                                <button type="button" className="saveButton" onClick={this.addSkillsData}>
                                    <span>Add</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="divCancelButton">
                            <div className="divButtonWrapper">
                                <button type="button" className="cancelButton" onClick={this.deleteSkill}>
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    </div><div className="col-md-4">
                        <div className="divSaveButton">
                            <div className="divButtonWrapper">
                                <button type="button" className="saveButton" onClick={this.cancelEditSkill}>
                                    <span>Cancel</span>
                                </button>
                            </div>
                        </div>
                    </div></div></div>);
        } else if (!this.state.isEditSkillsActive) {
            buttons = (<div className ="row"><div className="col-md-6">
                <div className="divSaveButton">
                    <div className="divButtonWrapper">
                        {editButton}
                    </div>
                </div>
            </div></div>);
        }


        return (
            <div className="dataCard">
                <div className="itemsmain">
                    <div>
                        <h2 className="CardHeading">Skills</h2>
                        <table className="skillTable">
                            <thead>
                                <tr>
                                    <th> No. </th>
                                    <th> Skill Name </th>
                                </tr>
                            </thead>
                            <tbody>
                                {allSkills}
                            </tbody>
                        </table>
                        {buttons}
                        {this.state.error}
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

export default connect(mapStateToProps,mapDispatchToProps)(Skills);