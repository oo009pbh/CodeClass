import React, { Component } from 'react'
import Message from './Message';
import MessageForm from './MessageForm';
import firebase from '../firebase';
import ScrollToBottom from 'react-scroll-to-bottom';
import "./chat.css"

export class Chat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mySessionId: this.props.sessionId,
            myUserName: this.props.userName,
            messages: [],
            messagesRef: firebase.database().ref("code-sessions"),
            messagesLoading: true,
            searchTerm: "",
            searchResults: [],
            searchLoading: false
        }
    }

    componentDidMount() {
        this.scrollToBottom();
        this.addMessagesListeners(this.state.mySessionId);
    }
    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom = () => {
        const { messageList } = this.refs;
        messageList.scrollIntoView({behavior: "smooth", block: "end"});
    }

    handleSearchMessages = () => {
        const chatRoomMessages = [...this.state.messages];
        const regex = new RegExp(this.state.searchTerm, "gi");
        const searchResults = chatRoomMessages.reduce((acc, message) => {
            if (
                (message.content && message.content.match(regex)) ||
                message.user.name.match(regex)
            ) {
                acc.push(message)
            }
            return acc;
        }, [])
        this.setState({ searchResults })
    }

    handleSearchChange = event => {
        this.setState({
            searchTerm: event.target.value,
            searchLoading: true
        },
            () => this.handleSearchMessages()
        )
    }

    addMessagesListeners = (chatRoomId) => {
        let messagesArray = [];
        //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 방 이름 여기서 정해 줘야댐 (room) @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        this.state.messagesRef.child(chatRoomId).child("messages").on("child_added", DataSnapshot => {
            messagesArray.push(DataSnapshot.val());
            console.log('messageAre', messagesArray)
            this.setState({
                messages: messagesArray,
                messagesLoading: false
            })
        })
    }

    renderMessages = (messages) =>
        messages.length > 0 &&
        messages.map(message => (
            <li class="mar-btm">
                <Message
                    key={message.timestamp}
                    message={message}
                    user={this.state.myUserName}
                />
            </li>
        ))

    messagesEnd;
    render() {

        const { messages, searchTerm, searchResults } = this.state;

        console.log('searchTerm', searchTerm)
        return (
            <div style={{ padding: '2rem 2rem 0 2rem' }}>
                <div style={{
                    width: '100%',
                    height: '75vh',
                    border: '.2rem solid #ececec',
                    borderRadius: '4px',
                    padding: '1rem',
                    marginBottom: '4rem',
                    overflowY: 'auto',
                }}
                >
                    <ul class="list-unstyled media-block" ref="messageList">
                        {searchTerm ?
                            this.renderMessages(searchResults)
                            :
                            this.renderMessages(messages)
                        }
                    </ul>
                </div>
                <MessageForm userName={this.state.myUserName} sessionId={this.state.mySessionId} />
            </div>
        )
    }
}


export default Chat;
