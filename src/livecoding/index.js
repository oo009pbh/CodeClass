import { Layout, Button } from "antd";
import React from "react";
import firebase from '../firebase';
import CodeMirror from "react-codemirror";

import { DownloadOutlined } from "@ant-design/icons";

import 'codemirror/addon/hint/show-hint.css';  
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/javascript-hint.js';    

require("codemirror/lib/codemirror.css");
require("codemirror/mode/javascript/javascript");
require("codemirror/theme/dracula.css");



const { Header } = Layout;

export default class CodingPage extends React.Component {
  state = {
    code: "Loading...",
    cursorPosition: {
      line: 0,
      ch: 0
    }
  };

  componentDidMount = () => {
    let self = this;
    firebase.database()
      .ref("/code-sessions/" + this.props.sessionId)//수정필요
      .once("value")
      .then(snapshot => {
        self.setState({ code: snapshot.val().content + ""}, () => {
          let content = snapshot.val().content;
          console.log(this.codemirror.getCodeMirror());

          self.codemirror.getCodeMirror().setValue(content);
        });
        this.codeRef = firebase.database().ref("/code-sessions/" + this.props.sessionId);
        this.codeRef.on("value", function (snapshot) {
          self.setState({
            code: snapshot.val().content
          });
          var currentCursorPos = self.state.cursorPosition;
          self.codemirror.getCodeMirror().setValue(snapshot.val().content);
          self.setState({ cursorPosition: currentCursorPos });
          self.changeCursorPos();
        });
      })
      .catch(e => {
        self.codemirror.getCodeMirror().setValue("No Sessions Found!");
      });
  };
  changeCursorPos = () => {
    const { line, ch } = this.state.cursorPosition;
    this.codemirror.getCodeMirror().doc.setCursor(line, ch);
  };
  onChange = (newVal, change) => {
    // console.log(newVal, change);
    this.setState(
      {
        cursorPosition: {
          line: this.codemirror.getCodeMirror().doc.getCursor().line,
          ch: this.codemirror.getCodeMirror().doc.getCursor().ch
        }
      },
      () => { }
    );
    this.codeRef.child("content").set(newVal);
  };

  onRecordCode = () => {
    let today = new Date();   
    let hours = today.getHours(); 
    let minutes = today.getMinutes();  
    let seconds = today.getSeconds();  
    firebase.database().ref("code-sessions/" + this.props.sessionId + "/record/" + hours + '시 ' + minutes + '분 ' + seconds + '초').set({
      code: this.state.code,
    });
  };
  
  render() {
    return (
      <React.Fragment>
        <Header style ={{borderTopLeftRadius: "20px", borderTopRightRadius: "20px"}}>
          <Button float = "right" icon = {<DownloadOutlined />} onClick = {this.onRecordCode}>코드기록</Button>
        </Header>
        <div className="coding-page">
          <CodeMirror
            ref={r => (this.codemirror = r)}
            className="code-mirror-container"
            value={this.state.code}
            onChange={this.onChange}
            options={{
              lineNumbers: true,
              readOnly: false,
              mode: "javascript",
              extraKeys: {"Ctrl": "autocomplete"}, 
            }}
          />
        </div>
      </React.Fragment>
    );
  }
}