import React, { useState } from 'react';
import firebase from './firebase';
import AppLayout from './layout/AppLayout.js'
import { Button } from 'antd';
import { PlusSquareOutlined, LoginOutlined } from '@ant-design/icons';


const App = () => {
    const [isClass, setIsClass] = useState(false);
    const [sessionId, setSessionId] = useState("sessionA");
    const [userName, setUserName] = useState("userName");
    const [num, setNum] = useState(null);
    const onChangeSessionId = (e) => {
        setSessionId(e.target.value);
    }
    const onChangeUserName = (e) => {
        setUserName(e.target.value);
    }
    const changeIsClassCreate = () => {
        setIsClass(!isClass);
        console.log(isClass);
        firebase.database()
            .ref("code-sessions")
            .on("value", s => {
                setNum(s.numChildren())
            });
        firebase.database()
            .ref("code-sessions/" + sessionId)
            .set({
                content: "coding here"
            });
    }
    const changeIsClassJoin = () => {
        setIsClass(!isClass);
    }
    return (
        <>
            {isClass ? <AppLayout userName={userName} sessionId={sessionId} isClass={isClass} /> : (

                <div className="container">
                    <img className="logo_image" src="./resources/images/logo2.png" style={{marginTop:"80px"}} />
                    <div id="join-dialog" className="jumbotron vertical-center" style={{backgroundColor:"#94ddde"}}>

                        <p>
                            <label>NICKNAME: </label>
                            <input
                                className="form-control"
                                type="text"
                                id="userName"
                                value={userName}
                                onChange={onChangeUserName}
                                style={{borderColor : "#0088aa"}}
                                required
                            />
                        </p>
                        <p>
                            <label> ROOM NAME: </label>
                            <input
                                className="form-control"
                                type="text"
                                id="sessionId"
                                value={sessionId}
                                onChange={onChangeSessionId}
                                style={{borderColor : "#0088aa"}}
                                required
                            />
                        </p>
                        <p className="text-center">
                            <Button type="primary" icon={<PlusSquareOutlined />} onClick={changeIsClassCreate } style={{borderColor : "#0088aa", marginRight:"5px"}}>방만들기</Button>
                            <Button type="primary" icon={<LoginOutlined />} onClick={changeIsClassJoin} style={{borderColor : "#0088aa", marginLeft:"5px"}}>입장하기</Button>
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}

export default App;