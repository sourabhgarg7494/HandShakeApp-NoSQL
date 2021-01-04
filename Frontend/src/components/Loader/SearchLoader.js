import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';

class SearchLoader extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div className="dataCard">   
                <div>
                    <div class="cardDivWithPadding">
                        <div class="dataDivOutsideFlex">
                            <div class="studentPicOutSide">
                                <div class="studentPicCircleDivLoader">
                                </div>
                            </div>
                            <div class="studentDetailsContent">
                                <div class="loaderDiv animatior">
                                </div>
                                <div class="loaderDiv animatior margin-top extra">
                                </div>
                                <div class="loaderDiv animatior margin-top extra">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SearchLoader;