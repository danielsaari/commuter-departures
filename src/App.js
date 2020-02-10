import React, { Component } from 'react';
import './App.css';

import DepartureBoard from './DepartureBoard'

class App extends Component {
  render(){
    return(
        <div>
          <DepartureBoard station_id='place-north' station_name='North Station'/>
          <DepartureBoard station_id='place-sstat' station_name='South Station'/>
        </div>
    );
  }
}

export default App;
