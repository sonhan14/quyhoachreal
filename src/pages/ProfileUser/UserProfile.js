import React from 'react';
import './UserProfile.scss';


//avatar defaul
const iconAvatar = 'https://png.pngtree.com/png-clipart/20210608/ourlarge/pngtree-dark-gray-simple-avatar-png-image_3418404.jpg'

const UserProfile = ({user}) => {

  const formatDateHour = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2,'0');
    const month = String(date.getMonth() + 1).padStart(2,"0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}  ${day}/${month}/${year}`
  }
  
  return (
    <>
          <div className="user-profile"> 
            <div className="profile-header">
              <img src={user.avatarLink || iconAvatar} alt="User Avatar" className="avatar" />
              <h1 className="full-name">{user.FullName}</h1>
            </div>
            <div className="profile-content">
              <div className="bio">{user.Bio}</div>
              <div className="info-user">
                <InfoItem label="Email" value={user.Email} icon="📧" />
                <InfoItem label="Ngày sinh" value={formatDateHour(user.BirthDate)} icon="🎂" />
                <InfoItem label="Địa chỉ" value={user.BirthPlace} icon="🏠" />
                <InfoItem label="Giới tính" value={user.Gender} icon="⚧" />
                <InfoItem label="Điện thoại" value={user.Phone} icon="📱" />
              </div>
            </div>
          </div>
    </>
  );
};

const InfoItem = ({ label, value, icon }) => (
  <div className="info-item">
    <span className="icon">{icon}</span>
    <span className="label">{label}:</span>
    <span className="value">{value}</span>
  </div>
);

export default UserProfile;