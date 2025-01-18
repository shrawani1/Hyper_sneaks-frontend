import React, { useState, useEffect } from 'react';
import { getUserProfileApi, updateUserProfileApi } from '../apis/Api';
import { toast } from 'react-toastify';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    password: ''
  });

  useEffect(() => {
    // Fetch the user profile when the component mounts
    getUserProfileApi()
      .then((res) => {
        const data = res.data;
        setUser(data);
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phone: data.phone || '',
          password: ''
        });
      })
      .catch((error) => {
        toast.error('Failed to load profile');
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    updateUserProfileApi(formData)
      .then((res) => {
        setUser(res.data);
        setEditing(false);
        toast.success('Profile updated successfully');
      })
      .catch((error) => {
        toast.error('Error updating profile');
      });
  };

  if (!user) {
    return <div className="loading-msg">Loading profile...</div>;
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <header className="profile-header">
          <h2>My Profile</h2>
          {!editing && (
            <button onClick={() => setEditing(true)} className="btn-edit">
              Edit
            </button>
          )}
        </header>
        <div className="profile-body">
          {!editing ? (
            <div className="profile-view">
              <div className="profile-row">
                <span className="label">First Name</span>
                <span className="value">{user.firstName}</span>
              </div>
              <div className="profile-row">
                <span className="label">Last Name</span>
                <span className="value">{user.lastName}</span>
              </div>
              <div className="profile-row">
                <span className="label">Email</span>
                <span className="value">{user.email}</span>
              </div>
              <div className="profile-row">
                <span className="label">Phone</span>
                <span className="value">{user.phone}</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleProfileUpdate} className="profile-form">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password (if changing)</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current password"
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="btn btn-cancel"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-save">
                  Save
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
