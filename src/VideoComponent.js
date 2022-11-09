import React from "react";
import Ably from "ably";
import ReactSpeedometer from "react-d3-speedometer"
import ProgressBar from "@ramonak/react-progress-bar";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.client = new Ably.Realtime({ key: process.env.REACT_APP_ABLY_KEY })
        this.channel = this.client.channels.get('f1-telemetry', {
            params: { rewind: '1' }
        });

        this.state = {
            speed: 0,
            engineRPM: 0,
            gear: 0,
            throttlePercentage: 0,
            brakePercentage: 0,
            steering: 0
        };

        this.channel.subscribe('playerCarTelemetry', (msg) => {
            console.log(msg.data);
            let speed = msg.data.m_speed;

            if  (speed) {
                this.setState({speed})
            }

            let engineRPM = msg.data.m_engineRPM;

            if (engineRPM) {
                this.setState({engineRPM})
            }
            
            let gear = msg.data.m_gear;
            if (gear) {
                this.setState({gear})
            }

            let throttle = msg.data.m_throttle;
            let throttlePercentage = (throttle * 100).toFixed(0)
            this.setState({throttlePercentage})

            let brake = msg.data.m_brake;
            let brakePercentage = (brake * 100).toFixed(0)
            this.setState({brakePercentage})

            let steering = msg.data.m_steer.toFixed(3);
            
            this.setState({steering})

        });
    }
    render() {
        return(
            <div id="component" className="container mx-medium mx-auto">
                <h2>Driver Dashboard</h2>
                <div className="grid grid-flow-col grid-rows-2 grid-cols2">
                    <div>
                        <h2>Speed: {this.state.speed} KPH</h2>
                        <ReactSpeedometer 
                            value={this.state.speed} 
                            maxValue={400} 
                            currentValueText=""
                            segments={1}
                            needleTransitionDuration={100}
                        />
                    </div>
                    <div>
                        <h2>Engine RPM: {this.state.engineRPM}</h2>
                        <ReactSpeedometer 
                            value={this.state.engineRPM}
                            maxValue={14000}
                            currentValueText=""
                            segments={1}
                            needleTransitionDuration={100}
                        />
                        <h2>Gear: {this.state.gear}</h2>
                    </div>
                    <div>                   
                        <h2>Throttle Percentage</h2>
                        <ProgressBar
                            completed={this.state.throttlePercentage} 
                            transitionDuration={100}
                        />
                        <h2>Brake Percentage</h2>
                        <ProgressBar
                            completed={this.state.brakePercentage}
                            transitionDuration={100}
                        />
                    </div> 
                    <div>
                        <h2>Steering: {this.state.steering}</h2>
                        <ReactSpeedometer 
                            value={this.state.steering}
                            minValue={-1}
                            maxValue={1}
                            currentValueText=""
                            segments={1}
                            needleTransitionDuration={100}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default Dashboard