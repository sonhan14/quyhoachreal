// App.js
import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar.js';
import UserProfile from './UserProfile';
import EditProfile from './EditProfile';
import './Profile.scss';
import { ViewProfileUser } from '../../services/api.js';
import { notification } from 'antd';
import { useSelector } from 'react-redux';
const Profile = () => {
    const [activeView, setActiveView] = useState('view');
    const datauser = useSelector((state) => state.account.dataUser);
    const [user, setUser] = useState({});

    useEffect(() => {
        getViewProfileUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const getViewProfileUser = async () => {
        let res = await ViewProfileUser(datauser.UserID);
        res.headers = {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        };
        if (res.data) {
            const fetchProfileUser = res.data;
            setUser(fetchProfileUser);
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message,
            });
        }
    };
    return (
        <>
            <div className="profile">
                <Sidebar activeView={activeView} setActiveView={setActiveView} />
                <div className="main-content">
                    {activeView === 'view' ? <UserProfile user={user} /> : <EditProfile user={user} />}
                </div>
            </div>
        </>
    );
};

export default Profile;
