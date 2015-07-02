/**
 * Created by aldo on 6/2/15.
 */
'use strict';
// jshint: esnext: true
import React from 'react';
import classNames from 'classNames';
import shouldPureComponentUpdate from '../utils/shouldPureComponentUpdate';
import SignInOrOut from './SignInOrOut';

export default class Header extends React.Component {

  // https://github.com/jscs-dev/node-jscs/issues/1117
  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {
    return (
      <div>
        <header>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <nav className="navbar navbar-default navbar-fixed-top">
                  <div className="container">
                    <div className="navbar-header">
                      <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                      </button>
                      <a className="navbar-brand" href="/">
                        <div className="logoWrapper">
                          <img className="logo" src="assets/images/meego_light.png" />
                        </div>
                      </a>
                    </div>
                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                      <ul className="nav navbar-nav">
                        <li><a href="#" data-toggle="modal" data-target="#HowItWorksModal">How It Works</a></li>
                        <li><a href="/faq">FAQ</a></li>
                      </ul>
                    </div>
                  </div>
                </nav>
                <ul className="nav navbar-nav navbar-right">
                  <li>
                    <SignInOrOut />
                  </li>
                </ul>
                <button type="button" className="cart_btn" data-toggle="modal" data-target="#myModal">
                  <img src="assets/icons/cart_light.png" /> Cart (<span className="cart_count">0</span>)
                </button>
              </div>
            </div>
          </div>
        </header>
        <div className="featuring jumbotron"></div>
      </div>
    );
  }
}
