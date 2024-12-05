// Sidebar.js
import React, { useState } from 'react';
import { UserOutlined, EditOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import './Sidebar.scss';

const Sidebar = ({ activeView, setActiveView }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-content">
        <button
          className={activeView === 'view' ? 'active' : ''}
          onClick={() => setActiveView('view')}
        >
          <UserOutlined className="icon" />
          <span className="text">View Profile</span>
        </button>
        <button
          className={activeView === 'edit' ? 'active' : ''}
          onClick={() => setActiveView('edit')}
        >
          <EditOutlined className="icon" />
          <span className="text">Edit Profile</span>
        </button>
      </div>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isExpanded ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
      </button>
    </div>
  );
};

export default Sidebar;