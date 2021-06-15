import React, { useState, useEffect } from 'react'
import moment from 'moment';
import "./chat.css"
const Message = ({ message, user }) => {

    const timeFromNow = timestamp => moment(timestamp).fromNow();
    const [align, setAlign] = useState("");
    useEffect(() => {
        if (user == message.user) {
            setAlign("media-body pad-hor speech-right");
        }else{
            setAlign("media-body pad-hor");
        }
    }, [])

    return (
        <div class={align}>
            <div class="speech">
                <a href="#" class="media-heading">{message.user}</a>
                <p>{message.content}</p>
                <p class="speech-time">
                    <i class="fa fa-clock-o fa-fw"></i> {timeFromNow(message.timestamp)}
                </p>
            </div>
        </div>
    )
}

export default Message