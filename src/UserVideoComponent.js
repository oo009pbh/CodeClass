import React from 'react';
import OpenViduVideoComponent from './OvVideo';
import './UserVideo.css';

const UserVideoComponent = ({streamManager , screenFullClick}) => {

    const getNicknameTag = () => {
        // Gets the nickName of the user
        return JSON.parse(streamManager.stream.connection.data).clientData;
    }

    return (
        <div>
            {streamManager !== undefined ? (
                <div className="streamcomponent">
                    <OpenViduVideoComponent screenFullClick={screenFullClick} streamManager={streamManager} />
                    <div><p>{getNicknameTag()}</p></div>
                </div>
            ) : null}
        </div>
    );

};
export default UserVideoComponent;


// import React, { Component } from 'react';
// import OpenViduVideoComponent from './OvVideo';
// import './UserVideo.css';

// export default class UserVideoComponent extends Component {

//     getNicknameTag() {
//         // Gets the nickName of the user
//         return JSON.parse(this.props.streamManager.stream.connection.data).clientData;
//     }

//     render() {
//         return (
//             <div>
//                 {this.props.streamManager !== undefined ? (
//                     <div className="streamcomponent">
//                         <OpenViduVideoComponent streamManager={this.props.streamManager} />
//                         <div><p>{this.getNicknameTag()}</p></div>
//                         {this.props.toolBar()}
//                     </div>
//                 ) : null}
//             </div>
//         );
//     }
// }
