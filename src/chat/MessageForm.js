import React, { useState, useRef } from 'react'
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import firebase from '../firebase';
import { Row, Col, Button } from 'antd';
import {
    SendOutlined,
} from "@ant-design/icons";

function MessageForm({ userName, sessionId }) {
    const [chatRoom, setChatRoom] = useState(sessionId)
    const [user, setUser] = useState(userName)
    const [content, setContent] = useState("")
    const [errors, setErrors] = useState([])
    const [loading, setLoading] = useState(false)
    const [percentage, setPercentage] = useState(0)
    const messagesRef = firebase.database().ref("code-sessions")

    const handleChange = (event) => {
        setContent(event.target.value)
    }

    const createMessage = (fileUrl = null) => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 여기 로그인된 회원 이름 넣어줘야댐@@@@@@@@@@@@@@@
            user: user,
        }

        if (fileUrl !== null) {
            message["image"] = fileUrl;
        } else {
            message["content"] = content;
        }
        return message;
    }

    const handleSubmit = async () => {
        if (!content) {
            setErrors(prev => prev.concat("Type contents first"))
            return;
        }
        setLoading(true);
        //firebase에 메시지를 저장하는 부분 
        try {
            //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 방 이름 여기서 정해 줘야댐 (room) @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
            await messagesRef.child(chatRoom).child("messages").push().set(createMessage())
            setLoading(false)
            setContent("")
            setErrors([])
        } catch (error) {
            setErrors(pre => pre.concat(error.message))
            setLoading(false)
            setTimeout(() => {
                setErrors([])
            }, 5000);
        }
    }

    return (
        <div>
            <Row gutter={16}>
                <Col span={20}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Control
                                value={content}
                                onChange={handleChange}
                                as="textarea"
                                rows={3} />
                        </Form.Group>
                    </Form>
                    {
                        !(percentage === 0 || percentage === 100) &&
                        <ProgressBar variant="warning" label={`${percentage}%`} now={percentage} />
                    }
                    <div>
                        {errors.map(errorMsg => <p style={{ color: 'red' }} key={errorMsg}>
                            {errorMsg}
                        </p>)}
                    </div>
                </Col>
                <Col span={4}>
                    <Button
                        style={{marginTop : "20px"}}
                        icon={<SendOutlined />}
                        onClick={handleSubmit}
                        disabled={loading ? true : false}>
                        전송
                    </Button>
                </Col>
            </Row>

        </div>
    )
}

export default MessageForm
