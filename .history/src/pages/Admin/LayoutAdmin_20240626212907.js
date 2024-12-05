import React, { useEffect, useState } from "react";
import {
  AppstoreAddOutlined,
  ExceptionOutlined,
  HeartTwoTone,
  TeamOutlined,
  UserOutlined,
  DollarCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Dropdown, Space, message, Tree } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./LayoutAdmin.scss";
import { useDispatch, useSelector } from "react-redux";
const { Content, Footer, Sider } = Layout;

const LayoutAdmin = () => {
  const listBoxs = useSelector((state) => state.listbox.list);
  console.log("res listBoxs", listBoxs);

  const generateTreeData = () => {
    return listBoxs.map((box) => ({
      title: box.BoxName,
      key: `box-${box.id}`,
      children: box.groups.map((group) => ({
        title: group.GroupName,
        key: `group-${group.id}`,
        children: group.posts.map((post) => ({
          title: post.PostTitle,
          key: `post-${post.id}`,
        })),
      })),
    }));
  };

  const treeData = generateTreeData();

  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const items = [
    {
      label: <Link to="/admin">Dashboard</Link>,
      key: "dashboard",
      icon: <AppstoreAddOutlined />,
    },
    {
      label: "Quản lý Box",
      key: "boxes",
      icon: <ExceptionOutlined />,
      children: treeData,
    },
  ];

  const itemsDropdown = [
    {
      label: (
        <label style={{ cursor: "pointer" }}>
          Quản lý tài khoản
        </label>
      ),
      key: "account",
    },
    {
      label: (
        <label style={{ cursor: "pointer" }}>
          Đăng xuất
        </label>
      ),
      key: "logout",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }} className="layout-admin">
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => {
          setCollapsed(value);
        }}
      >
        <div style={{ height: 32, margin: 16, textAlign: "center" }}>
          Admin
        </div>
        <Menu
          selectedKeys={[activeMenu]}
          mode="inline"
          items={items}
          onClick={(e) => setActiveMenu(e.key)}
        />
      </Sider>
      <Layout>
        <div className="admin-header">
          <span>
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: () => setCollapsed(!collapsed),
              }
            )}
          </span>

          <Dropdown menu={{ items: itemsDropdown }} trigger={["click"]}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
        <Content>
          <Tree
            treeData={treeData}
            defaultExpandAll
            onSelect={(keys, info) => {
              console.log('Selected: ', keys, info);
            }}
          />
          <Outlet />
        </Content>
        {/* <Footer style={{ padding: 0 }}>
          &copy; 2023. Made with <HeartTwoTone />
        </Footer> */}
      </Layout>
    </Layout>
  );
};
export default LayoutAdmin;
