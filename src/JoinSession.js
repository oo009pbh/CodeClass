import axios from 'axios';
import { OpenVidu } from 'openvidu-browser';
import React, { Component } from 'react';
import './App.css';
import UserVideoComponent from './UserVideoComponent';
import UserModel from './models/user-model';
import 'antd/dist/antd.css';
import { List, Row, Col, Tooltip } from 'antd';
import {
    AudioTwoTone,
    FullscreenOutlined,
    DesktopOutlined,
    VideoCameraTwoTone,
    ExpandAltOutlined,
    UserOutlined,
} from "@ant-design/icons";

const OPENVIDU_SERVER_URL = 'https://192.168.0.36:4443';
//const OPENVIDU_SERVER_URL = 'https://' + window.location.hostname + ':4443';
const OPENVIDU_SERVER_SECRET = 'MY_SECRET';

var localUser = new UserModel();

class JoinSession extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mySessionId: this.props.sessionId,
            myUserName: this.props.userName,
            session: undefined,
            mainStreamManager: undefined,
            localUser: undefined,
            publisher: undefined,
            subscribers: [],
            collapsed: true,
            videoClick: true,
            screenShareClick: "notshare",
            screenSizeClick: "small",
            audioClick: true,
            screenFullClick: false,
            myScreen: "myscreen",
        };

        this.joinSession = this.joinSession.bind(this);
        this.leaveSession = this.leaveSession.bind(this);
        this.handleChangeSessionId = this.handleChangeSessionId.bind(this);
        this.handleChangeUserName = this.handleChangeUserName.bind(this);
        this.handleMainVideoStream = this.handleMainVideoStream.bind(this);
        this.onbeforeunload = this.onbeforeunload.bind(this); 
        //
        this.toolBar = this.toolBar.bind(this);
        //

        //////////////////////////////////
        this.screenShare = this.screenShare.bind(this);
        this.stopScreenShare = this.stopScreenShare.bind(this);
        this.muteVideo = this.muteVideo.bind(this);
        this.muteAudio = this.muteAudio.bind(this);
        this.toggle = this.toggle.bind(this);
        this.turnMe = this.turnMe.bind(this);
        this.exitHandler = this.exitHandler.bind(this);
        ////////////////////////////////////
    }
    
    componentDidMount() {
        this.joinSession();
        window.addEventListener('beforeunload', this.onbeforeunload);
        document.addEventListener('fullscreenchange', this.exitHandler);
        document.addEventListener('webkitfullscreenchange', this.exitHandler);
        document.addEventListener('mozfullscreenchange', this.exitHandler);
        document.addEventListener('MSFullscreenChange', this.exitHandler);
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.onbeforeunload);
    }

    onbeforeunload(event) {
        this.leaveSession();
    }

    exitHandler() {
        if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
            this.setState({
                screenFullClick: false
            });
        }
    } 
    handleChangeSessionId(e) {
        this.setState({
            mySessionId: e.target.value,
        });
    }

    handleChangeUserName(e) {
        this.setState({
            myUserName: e.target.value,
        });
    }

    handleMainVideoStream(stream) {
        if (this.state.mainStreamManager !== stream) {
            this.setState({
                mainStreamManager: stream,
                myScreen : "noymyscreen"
            });
        }
    }

    deleteSubscriber(streamManager) {
        let subscribers = this.state.subscribers;
        let index = subscribers.indexOf(streamManager, 0);
        if (index > -1) {
            subscribers.splice(index, 1);
            this.setState({
                subscribers: subscribers,
            });
        }
    }
    toggle() {
        let temp = this.state.collapsed;
        this.setState({
            collapsed: !temp,
        });

        if (this.state.screenSizeClick == "small") {
            this.setState({
                screenSizeClick: "big"
            })
        }
        else {
            this.setState({
                screenSizeClick: "small"
            })
        }
    }
    joinSession() {
        this.OV = new OpenVidu();

        this.setState(
            {
                session: this.OV.initSession(),
            },
            () => {
                this.subscribeToStreamCreated();
                //this.subscribeToStreamDestroyed();
                this.connectToSession();
            },
        );
    }
    connectToSession() {
        this.getToken().then((token) => {
            this.connect(token);
        });
    }
    connect(token) {
        this.state.session
            .connect(
                token,
                { clientData: this.state.myUserName },
            )
            .then(() => {
                this.connectWebCam();
            })
            .catch((error) => {
                console.log('There was an error connecting to the session:', error.code, error.message);
            });
    }
    connectWebCam() {
        let publisher = this.OV.initPublisher(undefined, {
            audioSource: undefined, // The source of audio. If undefined default microphone
            videoSource: undefined, // The source of video. If undefined default webcam
            publishAudio: localUser.isAudioActive(), // Whether you want to start publishing with your audio unmuted or not
            publishVideo: localUser.isVideoActive(), // Whether you want to start publishing with your video enabled or not
            resolution: '640x480', // The resolution of your video
            frameRate: 30, // The frame rate of your video
            insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
            mirror: false, // Whether to mirror your local video or not
        });

        this.state.session.publish(publisher);

        localUser.setNickname(this.state.myUserName);
        localUser.setConnectionId(this.state.session.connection.connectionId);
        localUser.setScreenShareActive(false);
        //localUser.setStreamManager(publisher);

        this.subscribeToStreamDestroyed();

        this.setState({
            mainStreamManager: publisher,
            publisher: publisher,
        });
    }
    leaveSession() {
        const mySession = this.state.session;

        if (mySession) {
            mySession.disconnect();
        }

        this.OV = null;
        this.setState({
            session: undefined,
            subscribers: [],
            mySessionId: 'CodeClassA',
            myUserName: 'CodeClass_User' + Math.floor(Math.random() * 100),
            mainStreamManager: undefined,
            publisher: undefined
        });
    }
    subscribeToStreamCreated() {
        this.state.session.on('streamCreated', (event) => {
            var subscriber = this.state.session.subscribe(event.stream, undefined);
            var subscribers = this.state.subscribers;
            subscribers.push(subscriber);
            this.setState({
                subscribers: subscribers,
            });
        });
    }
    subscribeToStreamDestroyed() {
        this.state.session.on('streamDestroyed', (event) => {
            this.deleteSubscriber(event.stream.streamManager);
        });
    }
    sendSignalUserChanged(data) {
        const signalOptions = {
            data: JSON.stringify(data),
            type: 'userChanged',
        };
        this.state.session.signal(signalOptions);
    }
    screenShare() {
        var subscribers = this.state.subscribers;
        var sub_length = 0;

        this.OV = new OpenVidu();
        ////////
        if (this.state.session) {
            while ((this.state.subscribers.length) != 0) {

                this.state.subscribers.pop();
            }

            this.state.session.disconnect();

        }
        ////////
        this.setState(
            {
                session: this.OV.initSession(),
            }, () => {
                var mySession = this.state.session;

                this.state.session.on('streamCreated', (event) => {
                    var subscriber = this.state.session.subscribe(event.stream, undefined);
                    subscribers.push(subscriber);
                    this.setState({
                        subscribers: [],
                    });
                });

                this.getToken().then((token) => {
                    mySession.connect(
                        token,
                        { clientData: this.state.myUserName },
                    ).then(() => {
                        let publisher = this.OV.initPublisher(undefined, {
                            videoSource: "screen",
                            audioSource: true,
                            publishAudio: localUser.isAudioActive(),
                            publishVideo: localUser.isVideoActive(),
                            resolution: '640x480',
                            frameRate: 30,
                            insertMode: 'APPEND',
                            mirror: false,
                        });


                        publisher.once('accessAllowed', () => {
                            publisher.stream.getMediaStream().getVideoTracks()[0].addEventListener('ended', () => {
                                console.log('User pressed the "Stop sharing" button');

                            });

                            this.state.session.unpublish(this.state.publisher);
                            mySession.publish(publisher);

                            this.setState({
                                mainStreamManager: publisher,
                                publisher: publisher,
                                subscribers: subscribers,
                            });
                            this.setState({ localUser: localUser }, () => {
                                this.sendSignalUserChanged({ isScreenShareActive: localUser.isScreenShareActive() });
                            });

                        });

                        publisher.once('accessDenied', () => {
                            console.warn('ScreenShare: Access Denied');
                        });

                    }).catch((error => {
                        console.warn('There was an error connecting to the session:', error.code, error.message);

                    }));
                });
            },
        );


        console.log("startScreenShare");
    }


    muteVideo() {
        if (localUser.isVideoActive() == true) {
            this.state.publisher.publishVideo(false);
            localUser.setVideoActive(false);
            this.setState({
                videoClick: false
            });
        }
        else {
            this.state.publisher.publishVideo(true);
            localUser.setVideoActive(true);
            this.setState({
                videoClick: true
            });
        }
    }


    muteAudio() {
        if (localUser.isAudioActive() == true) {
            this.state.publisher.publishAudio(false);
            localUser.setAudioActive(false);
            this.setState({
                audioClick: false
            });
        }
        else {
            this.state.publisher.publishAudio(true);
            localUser.setAudioActive(true);
            this.setState({
                audioClick: true
            });
        }
    }

    stopScreenShare() {
        this.state.session.unpublish(this.state.publisher);
        //this.deleteSubscriber(this.state.publisher.subscriber)
        this.connectWebCam();
        console.log("stopScreenShare");

    }


    turnMe(){
        if(this.state.mainStreamManager != this.state.publisher){
            this.setState({
                mainStreamManager : this.state.publisher,
                myScreen : "myscreen"
            });
        }
    }

    changeScreen = (value) => {
        if (this.state.screenShareClick == "notshare") {
            this.screenShare()
            this.setState({
                screenShareClick: "share"
            });
        } else {
            this.stopScreenShare()
            this.setState({
                screenShareClick: "notshare"
            });
        }
    };

    toggleFullscreen = () => {
        var doc = window.document;
        var docEl = doc.getElementById('main-video');
        var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
            this.setState({
                screenFullClick: true
            });
            requestFullScreen.call(docEl);           
        }
        else {
            this.setState({
                screenFullClick: false
            });
            cancelFullScreen.call(doc);    
        }
    }
    toolBar = () => {
        return (
            <div className="space-align-container" style={{marginTop:"20px"}} >
                <div className="space-align-block">
                    <Tooltip title="화면 on/off"><VideoCameraTwoTone twoToneColor={this.state.videoClick ? "#40a9ff" : "#595959"} onClick={this.muteVideo} style={{ marginLeft: "15px", marginRight: "10px" }} /></Tooltip>
                    <Tooltip title="음성 on/off"><AudioTwoTone twoToneColor={this.state.audioClick ? "#40a9ff" : "#595959"} onClick={this.muteAudio} style={{ marginLeft: "10px", marginRight: "10px" }} /></Tooltip>
                    <Tooltip title="화면 공유 on/off"><DesktopOutlined id={this.state.screenShareClick} onClick={this.changeScreen} style={{ marginLeft: "10px", marginRight: "10px" }} /></Tooltip>
                    <Tooltip title="메인 화면 확대/축소"><ExpandAltOutlined id={this.state.screenSizeClick} onClick={this.toggle} style={{ marginLeft: "10px", marginRight: "10px" }} /></Tooltip>
                    <Tooltip title="전체 화면"><FullscreenOutlined onClick={this.toggleFullscreen} style={{ marginLeft: "10px", marginRight: "15px" }} /></Tooltip>
                    <Tooltip title="메인 화면을 자신의 화면으로 변경 "><UserOutlined id={this.state.myScreen} onClick={this.turnMe} style={{ marginLeft: "10px", marginRight: "15px" }}/></Tooltip>
                </div>
            </div>
        );
    }
    subList = () => {
        return (
            <>
                <List
                    bordered={true}
                    itemLayout="vertical"
                    grid={{
                        column: 2,
                        gutter: 16,
                    }}
                    pagination={{
                        onChange: (page) => {
                            console.log(page);
                        },
                        pageSize: 6
                    }}
                    dataSource={this.state.subscribers}
                    renderItem={(item, i) => (
                        <List.Item>
                            <div key={i} onClick={() => this.handleMainVideoStream(item)}>
                                <UserVideoComponent streamManager={item} />
                            </div>
                        </List.Item>
                    )}
                    style={{margin : "0 auto", backgroundColor:"#fff"}}
                /> 
            </>
        );
    }
    render() {
        const mySessionId = this.state.mySessionId;
        const myUserName = this.state.myUserName;
        return (
            //overflow:'scroll', 
            <>
                {this.toolBar()}
                {this.state.collapsed ? 
                <div>
                    <Row justify="space-around" align="middle" gutter={[16, "auto"]}>
                        {this.state.mainStreamManager !== undefined ?
                            <Col id="main-video" span={11} >
                                <UserVideoComponent streamManager={this.state.mainStreamManager} screenFullClick={this.state.screenFullClick} />
                            </Col>
                            : null}
                        <Col id="video-container" span={11}>
                            {this.subList()}
                        </Col>
                    </Row>
                </div> : 
                <div id="main-video" style={{margin: "0 16%"}}>
                    <UserVideoComponent streamManager={this.state.mainStreamManager} screenFullClick={this.state.screenFullClick} />
                </div>}
            </>
        );
    }

    getToken() {
        return this.createSession(this.state.mySessionId).then((sessionId) => this.createToken(sessionId));
    }

    createSession(sessionId) {
        return new Promise((resolve, reject) => {
            var data = JSON.stringify({ customSessionId: sessionId });
            console.log(sessionId);
            axios
                .post(OPENVIDU_SERVER_URL + '/openvidu/api/sessions', data, {
                    headers: {
                        Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
                        'Content-Type': 'application/json',
                    },
                })
                .then((response) => {
                    console.log('CREATE SESION', response);
                    resolve(response.data.id);
                })
                .catch((response) => {
                    var error = Object.assign({}, response);
                    if (error.response.status === 409) {
                        resolve(sessionId);
                    } else {
                        console.log(error);
                        console.warn(
                            'No connection to OpenVidu Server. This may be a certificate error at ' +
                            OPENVIDU_SERVER_URL,
                        );
                        if (
                            window.confirm(
                                'No connection to OpenVidu Server. This may be a certificate error at "' +
                                OPENVIDU_SERVER_URL +
                                '"\n\nClick OK to navigate and accept it. ' +
                                'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                                OPENVIDU_SERVER_URL +
                                '"',
                            )
                        ) {
                            window.location.assign(OPENVIDU_SERVER_URL + '/accept-certificate');
                        }
                    }
                });
        });
    }

    createToken(sessionId) {
        return new Promise((resolve, reject) => {
            var data = {};
            axios
                .post(OPENVIDU_SERVER_URL + "/openvidu/api/sessions/" + sessionId + "/connection", data, {
                    headers: {
                        Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
                        'Content-Type': 'application/json',
                    },
                })
                .then((response) => {
                    console.log('TOKEN', response);
                    resolve(response.data.token);
                })
                .catch((error) => reject(error));
        });

    }
}

export default JoinSession;