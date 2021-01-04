import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';

class JobPreviewLoader extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div>
                <div className="jobPreviewBasicData">
                    <div className="jobPreviewMainHeading">
                        <div className="jobHeadingInnerDiv">
                            <h1 class="loaderDiv animatior margin-top ">

                            </h1>
                            <div class="loaderDiv animatior margin-top ">

                            </div>
                        </div>
                    </div>
                    <div className="jobSubHeadings">
                        <div className="loaderDiv animatior margin-top ">
                        </div>
                    </div>
                    <div className="jobSubHeadings">
                        <div className="loaderDiv animatior margin-top ">
                           
                        </div>
                    </div>
                    <div className="jobSubHeadings">
                        <div className="loaderDiv animatior margin-top ">
                        </div>
                    </div>
                    <div className="jobSubHeadings">
                        <div className="loaderDiv animatior margin-top ">

                        </div>
                    </div>
                </div>
                <div className="loaderDiv animatior margin-top">
                    <div className="applicationLastDateAndApplyOuterDiv">
                        <div className="applicationDateOuterDiv">
                            <div className="applicationDateMainDiv">

                            </div>
                        </div>
                        <div class="applyBtnOuterDiv">

                        </div>
                    </div>
                </div>
                <div className="jobDescriptionAndData">
                    <div className="jobDescInnerDiv">
                        <div className="loaderDiv animatior margin-top"></div>
                        <div className="loaderDiv animatior margin-top "></div>
                        <div className="loaderDiv animatior margin-top "></div>
                        <div className="loaderDiv animatior margin-top "></div>
                        <br />
                        <br />
                        <h3 className="loaderDiv animatior margin-top "></h3>
                        <div className="loaderDiv animatior margin-top "></div>
                    </div>
                </div>
            </div>

        )
    }
}

export default JobPreviewLoader;