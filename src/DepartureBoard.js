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
            offline: true,
            collectingDepartureData: false,
            departures: [],
            station_id: this.props.station_id,
            station_name: this.props.station_name,
        }
    }

    render(){
        // let the user know when the board cannot be trusted instead of showing out of date info
        let departures;
        if (this.state.offline){
            departures =
                <div>Offline...</div>;
        }
        else {
            departures =
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
                    {this.state.departures.slice(0, 9).map((item, index) => (
                        <ScheduledDeparture key={item.id} departure_time={item.departure_time}
                                            destination={item.destination} train={item.train} track={item.track}
                                            status={item.status}/>
                    ))}
                    </tbody>
                </table>;
        }

        return(
            <div id={"departure-board-" + this.props.station_id} className="container">
                <h2>{this.props.station_name} Commuter Rail Departures</h2>
                {departures}
            </div>
        );
    }

    componentDidMount() {
        // once we load in, go fetch the routes
        this.collectCommuterLineRoutes()
    }

    componentWillUnmount() {
        // clean up intervals
        clearInterval(this.departure_polling_timer);
        this.departure_polling_timer = null;
    }

    collectCommuterLineRoutes(){
        // We collect all of the commuter line routes prior to collecting the entire schedule
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
                    clearInterval(this.departure_polling_timer);
                    this.departure_polling_timer = setInterval(()=> this.collectUpcomingDepartures(), 10000);
                }
            )
            .catch((err) => {
                this.setState({offline: true});
                clearInterval(this.departure_polling_timer);
                setTimeout(this.collectCommuterLineRoutes(), 5000)
            })
    }

    collectUpcomingDepartures(){
        // make sure we are only collecting data in one request at a time
        if (!this.state.collectingDepartureData) {
            this.setState({collectingDepartureData: true});
            this.api.get('schedules', {
                filter: {
                    'direction_id': 0, //outbound per API docs
                    'stop': this.state.station_id,
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
                        collectingDepartureData: false,
                        offline: false,
                    });
            })
                .catch((err) => {
                    this.setState({
                        offline: true,
                        collectingDepartureData: false,
                    });
                })

        }
    }

    createScheduleRowFromDepartureData(scheduled_departure){
        // Gather the data we need to populate our departures table
        return({
            id: scheduled_departure.id,
            departure_time: new Date(scheduled_departure.departure_time),
            destination: scheduled_departure.trip.headsign,
            train: scheduled_departure.trip.name,
            track: DepartureBoard.tryGetTrackName(scheduled_departure),
            status: DepartureBoard.tryGetStatus(scheduled_departure)
        });
    }

    static shouldShowDeparture(scheduled_departure, current_time){
        // filter out data that is not useful for a departures table. This includes
        // 1. Schedules without a departure time
        // 2. Schedules where the departure time is in the past and we don't also have a prediction to go with it
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
        // predictions only appear when the scheduled time is close
        if ('prediction' in scheduled_departure) {
            return scheduled_departure.prediction.stop.platform_code;
        } else {
            return null;
        }
    }

    static tryGetStatus(scheduled_departure) {
        // predictions only appear when the scheduled time is close
        if ('prediction' in scheduled_departure) {
            return scheduled_departure.prediction.status;
        } else {
            return null;
        }
    }
}

export default DepartureBoard;
