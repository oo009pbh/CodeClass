import React, { Component } from 'react';

export default class OpenViduVideoComponent extends Component {

    constructor(props) {
        super(props);
        this.videoRef = React.createRef();
    }

    componentDidUpdate(props) {
        console.log(this.props.screenFullClick)
        if (props && !!this.videoRef) {
            this.props.streamManager.addVideoElement(this.videoRef.current);
        }
    }

    componentDidMount() {
        
        if (this.props && !!this.videoRef) {
            this.props.streamManager.addVideoElement(this.videoRef.current);
        }
    }

    render() {
        return (
            <>
                { this.props.screenFullClick ? <video class="f" autoPlay={true} ref={this.videoRef} />
                    : <video autoPlay={true} ref={this.videoRef} />}
            </>
        );
    }
}
//{this.props.screenFullClick ? "f" : ""}