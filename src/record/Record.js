import React, { useEffect, useState } from 'react';
import firebase from '../firebase';
import 'antd/dist/antd.css';
import '../App.css';

import { Menu, Card, Layout } from 'antd';

const { Sider, Content } = Layout;

const Record = ({ sessionId }) => {
    const [time_arr, setTime_arr] = useState([]);
    const [content, setContent] = useState(null);
    const [title, setTitle] = useState(null);

    const onSearchDatabase = (e) => {
        console.log(e.key);
        const dbRef = firebase.database().ref();
        dbRef.child("code-sessions").child(sessionId).child("record").child(e.key).child("code").get().then((snapshot) => {
            if (snapshot.exists()) {
                setContent(snapshot.val());
                setTitle(e.key);
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    }
    const codelist = () => {
        return time_arr.map((time) => {
            return (
                <Menu.Item key={time} onClick={onSearchDatabase}>
                    {time}
                </Menu.Item>
            );
        });
    }
    useEffect(() => {
        console.log("코딩기록");
        const dbRef = firebase.database().ref();
        dbRef.child("code-sessions").child(sessionId).child("record").get().then((snapshot) => {
            if (snapshot.exists()) {

                let temp = []
                for (const i in snapshot.val()) {
                    temp.push(i)
                }
                console.log(temp);
                setTime_arr(temp);
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    }, []);

    return (
        <Layout style={{ backgroundColor: "#cef4fa" ,borderRadius: "20px" , height:"100%"}}>
            <Sider theme="light" style={{ marginLeft: "0%", backgroundColor: "#fff" ,borderRadius: "20px"}}  >
                <Menu style={{ border: "2px solid #69c0ff", borderRadius: "10px" }}>
                    {codelist()}
                </Menu>
            </Sider>
            <Card title={"코딩 기록 시간: " + title} style={{
                display: 'inline-block', marginLeft: "1%", width: "94%", border: "2px solid #69c0ff", borderRadius: "10px"
            }} headStyle={{ textDecoration: "underline", fontWeight: "bold" }}>
                <p>코드</p>
                <pre>{content}</pre>
            </Card>
        </Layout>
    );
}

export default Record;