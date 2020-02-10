/**
 * Created by dsaari on 2/8/20.
 */

import React, {Component} from 'react'
import './ScheduledDeparture.css'

class ScheduledDeparture extends Component {
    constructor(props){
        super(props);
        this.displayTrackName = this.displayTrackName.bind(this);
        this.displayStatus = this.displayStatus.bind(this);
        this.displayDepartureTime = this.displayDepartureTime.bind(this);
    }
    render(){
        return(
          <tr>
              <td className="departure_time">{this.displayDepartureTime()}</td>
              <td className="destination">{this.props.destination}</td>
              <td className="train_number">{this.props.train}</td>
              <td className="track_number">{this.displayTrackName()}</td>
              <td className="status">{this.displayStatus()}</td>
          </tr>
        );
    }

    displayTrackName(){
        if(this.props.track){
            return this.props.track;
        }
        else {
            return "TBD";
        }
    }

    displayStatus(){
        // assuming a train is on time if we aren't hearing otherwise
        if(this.props.status){
            return this.props.status;
        } else {
            return 'On time';
        }
    }

    displayDepartureTime(){
        return this.props.departure_time.toTimeString().slice(0,5);
    }

}

export default ScheduledDeparture;
