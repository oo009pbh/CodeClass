import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import "./AppLayout.css";
import { C, Java, Python, Cpp } from "../compiler/Language.jsx"
import { Layout, Menu, Drawer } from "antd";
import CodingPage from "../livecoding/";
import JoinSession from '../JoinSession.js'
import Record from "../record/Record.js";
import Chat from "../chat/Chat.js";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  TeamOutlined,
  EditOutlined,
  FileTextOutlined,
  SettingOutlined,
  VideoCameraOutlined,
  CodeOutlined
} from "@ant-design/icons";


const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

const AppLayout = ({ userName, sessionId }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectMain, setSelectMain] = useState(6);
  const [main, setMain] = useState(null);
  const [chatOpen,setChatOpen] = useState(false);
  const codingPage = <CodingPage sessionId={sessionId} />;
  const home = <JoinSession userName={userName} sessionId={sessionId} />;
  const c = <C/>;
  const java = <Java/>;
  const python = <Python/>;
  const cpp = <Cpp/>;
  const toggle = () => {
    setCollapsed(!collapsed);
    console.log(collapsed);
  };
  const onChangeChatOpen = () => {
    setChatOpen(!chatOpen);
  }
  const onChangeMain = (e) => {
    setSelectMain(e.key);
  };
  useEffect(() => {
    setMain(c);
  },[]);

  useEffect(() => {
    if (selectMain == 11){
      setMain(c);
    }else if(selectMain == 12){
      setMain(java);
    }else if(selectMain == 13){
      setMain(python);
    }else if(selectMain == 14){
      setMain(cpp);
    }else if(selectMain == 20){
      setMain(<Record sessionId={sessionId}/>);
    }else{
      setMain(null);
    }
  },[selectMain]);

  return (
    <Layout>
      <Content className="site-layout">
        <div id="site-layout-background" style={{ visibility: selectMain == 5 ? 'visible' : 'hidden' }}>
          {codingPage}
        </div>
        <div id="site-layout-background" style={{ top:"-100vh", visibility: selectMain == 6 ? 'visible' : 'hidden' }}>
          {home}
        </div>
        <div id="site-layout-background" style={{ top:"-198vh", visibility: selectMain > 10 ? 'visible' : 'hidden' }}>
          {main}
        </div>
      </Content>
      <Drawer
        placement="right"
        closable={true}
        onClose={onChangeChatOpen}
        visible={chatOpen}
        style={{position:"absolute"}}
        width="35%"
      >
        <Chat userName={userName} sessionId={sessionId}/>
      </Drawer>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        {collapsed ? <div className="logo"></div> : <div className="logo"><p>{sessionId}</p></div>}
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="-1" onClick = {toggle} icon={collapsed ? <MenuFoldOutlined/> : <MenuUnfoldOutlined/>}>
            접기
          </Menu.Item>
          <Menu.Item key="30" onClick = {onChangeChatOpen} icon={<TeamOutlined />}>
            채팅창
          </Menu.Item>
          <SubMenu key="2" icon={<FileTextOutlined />} title="웹 컴파일러">
            <Menu.Item key="11" onClick = {onChangeMain}>C</Menu.Item>
            <Menu.Item key="12" onClick = {onChangeMain}>Java</Menu.Item>
            <Menu.Item key="13" onClick = {onChangeMain}>Python</Menu.Item>
            <Menu.Item key="14" onClick = {onChangeMain}>C++</Menu.Item>
          </SubMenu>
          <Menu.Item key="20" onClick = {onChangeMain} icon={<EditOutlined />}>
            코딩기록
          </Menu.Item>
          <Menu.Item key="5" icon={<CodeOutlined />} onClick={onChangeMain}>
            라이브 코딩
          </Menu.Item>
          <Menu.Item key="6" icon={<VideoCameraOutlined />} onClick={onChangeMain}>
            화상강의
          </Menu.Item>
        </Menu>
      </Sider>
    </Layout>
  );
}

export default AppLayout;
