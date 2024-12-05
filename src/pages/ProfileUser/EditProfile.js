import React, {useRef, useState } from 'react';
import './EditProfile.scss';
import { UpdateProfileUser } from '../../services/api';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { message, notification } from 'antd';
import DatePicker from 'react-datepicker';

const EditProfile = ({ user, onUpdate }) => {
  const [editedUser, setEditedUser] = useState(user);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [base64Image, setBase64Image] = useState(null)
  const fileInputRef = useRef(null) 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prevUser => ({ ...prevUser, [name]: value }));
  };

    // Đổi định dạng theo DD/MM/YYYY
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2,'0');
      const month = String(date.getMonth() + 1).padStart(2,"0");
      const year = date.getFullYear();
      return `${year}/${month}/${day}`
    }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = {
        FullName: editedUser.FullName,
        Email: editedUser.Email,
        BirthDate: editedUser.BirthDate ? formatDate(editedUser.BirthDate) : null,
        BirthPlace: editedUser.BirthPlace,
        Gender: editedUser.Gender,
        Phone: editedUser.Phone,
        Bio: editedUser.Bio
      };

      if (base64Image) {
        formData.avatarLink = base64Image;
      }
      const response = await UpdateProfileUser(formData);
      response.headers = {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
      message.success('Updated profile successfully')
      window.location.reload()
    } catch (err) {
      notification.error({
        message:'An error occurred',
        description: err.message
    })
    } finally {
      setLoading(false);
    }
  };

  const handleFileImage = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        setFile(selectedFile);
        setBase64Image(base64String);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  const removeFile = () => {
    setFile(null);
    setBase64Image(null);
  };
  const renderFilePreview = () => {
    if (file) {
      return (
        <div className="preview-file">
          <img src={URL.createObjectURL(file)} alt={file.name} className="preview-image" />
          <span className="remove-icon" onClick={removeFile}>
            <IoMdCloseCircleOutline />
          </span>
        </div>
      );
    }
    return null;
  };
  const handleOpenFileDialog = () => {
    fileInputRef.current.click();
  };
  return (
    <>
    <div className="edit-profile-container">
      <form className="edit-profile" onSubmit={handleSubmit}>
        <h2>Edit Profile</h2>
        <div className="avatar-container" onClick={handleOpenFileDialog}>
          {file ? (
            renderFilePreview()
          ) : (
            <img src={editedUser.avatarLink} alt="User Avatar" className="avatar" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileImage}
            style={{ display: 'none' }}
            ref={fileInputRef}
          />
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="FullName"
              value={editedUser.FullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="Email"
              value={editedUser.Email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="birthDate">Birth Date</label>
            <DatePicker
              selected={editedUser.BirthDate ? new Date(editedUser.BirthDate) : null}
              onChange={(date) => handleChange({ target: { name: "BirthDate", value: formatDate(date) } })}
              placeholderText="dd/mm/yyyy"
              dateFormat="yyyy/MM/dd"
            />
          </div>
          <div className="form-group">
            <label htmlFor="birthPlace">Birth Place</label>
            <input
              type="text"
              id="birthPlace"
              name="BirthPlace"
              value={editedUser.BirthPlace}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="Gender"
              value={editedUser.Gender}
              onChange={handleChange}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="Phone"
              value={editedUser.Phone}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-group full-width">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="Bio"
            value={editedUser.Bio}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
    </>
  );
};

export default EditProfile;
