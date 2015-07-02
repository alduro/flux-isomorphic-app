'use strict';

import React from 'react';
import { RouteHandler } from 'react-router';
import Header from './Header';

class App extends React.Component {
  render() {
    return (
      <div>
        <Header/>
        <RouteHandler {...this.props} key={this.props.pathname} />
      </div>
    );
  }
}

export default App;
