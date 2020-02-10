/**
 * Created by dsaari on 2/8/20.
 */
import React, {Component} from 'react';
import Kitsu from 'kitsu'
import ScheduledDeparture from './ScheduledDeparture'

class DepartureBoard extends Component{
    constructor(props){
        super(props);

        this.collectCommuterLineRoutes = this.collectCommuterLineRoutes.bind(this);
        this.collectUpcomingDepartures = this.collectUpcomingDepartures.bind(this);

        this.api = new Kitsu({
          baseURL: 'https://api-v3.mbta.com/'
        });
        this.state = {
            collectingDepartureData: false,
            departures: [],
            station_id: this.props.station_id,
            station_name: this.props.station_name,
        }
    }

    render(){
        return(
            <div className="container">
                <h2>{this.props.station_name} Commuter Rail Departures</h2>
                <table className="table table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>Departure Time</th>
                            <th>Destination</th>
                            <th>Train #</th>
                            <th>Track #</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.departures.slice(0,9).map((item, index) => (
                        <ScheduledDeparture key={item.id} departure_time={item.departure_time} destination={item.destination} train={item.train} track={item.track} status={item.status}/>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    }

    componentDidMount() {
        this.collectCommuterLineRoutes()
    }

    componentWillUnmount() {
        clearInterval(this.timer);
        this.timer = null;
    }

    collectCommuterLineRoutes(){
        this.api.get('routes', {
            fields: {
                'route': 'id'
            },
            filter: {
                'type': 2,
            }
        })
            .then(
                ({ data }) => {
                    this.setState({routes: data.map((route) => route.id)});
                    this.collectUpcomingDepartures();
                    this.timer = setInterval(()=> this.collectUpcomingDepartures(), 10000);
                }
            )
    }

    collectUpcomingDepartures(){
        if (!this.state.collectingDepartureData) {
            this.setState({'collectingDepartureData': true});
            console.log('polling API');
            this.api.get('schedules', {
                filter: {
                    'direction_id': 0, //outbound per API docs
                    'stop': this.state.station_id,
                    'max_time': '24:00',
                    'route': this.state.routes.toString()
                },
                include: 'prediction,trip,prediction.stop',
                sort: 'departure_time',
            }).then(({data}) => {
                    const now = new Date();
                    this.setState({
                        departures: data
                            .filter((scheduled_departure) => (DepartureBoard.shouldShowDeparture(scheduled_departure, now)))
                            .map((scheduled_departure) => this.createScheduleRowFromDepartureData(scheduled_departure)),
                    });
                    this.setState({'collectingDepartureData': false});
                }
            )
        }
    }

    createScheduleRowFromDepartureData(scheduled_departure){
        return({
            'id': scheduled_departure.id,
            'departure_time': new Date(scheduled_departure.departure_time),
            'destination': scheduled_departure.trip.headsign,
            'train': scheduled_departure.trip.name,
            'track': DepartureBoard.tryGetTrackName(scheduled_departure),
            'status': DepartureBoard.tryGetStatus(scheduled_departure)
        });
    }

    static shouldShowDeparture(scheduled_departure, current_time){
        if(
            !scheduled_departure.departure_time
            || (
                // It looks like the way to tell that a scheduled departure went ok is that it was in the past
                // and has no prediction
                current_time > new Date(scheduled_departure.departure_time)
                && !DepartureBoard.tryGetStatus(scheduled_departure)
            )
        ){
            return false;
        } else {
            return true;
        }
    }

    static tryGetTrackName(scheduled_departure) {
        if ('prediction' in scheduled_departure) {
            return scheduled_departure.prediction.stop.platform_code;
        } else {
            return null;
        }
    }

    static tryGetStatus(scheduled_departure) {
        if ('prediction' in scheduled_departure) {
            return scheduled_departure.prediction.status;
        } else {
            return null;
        }
    }
}

export default DepartureBoard;
