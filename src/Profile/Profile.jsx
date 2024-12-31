import React, { useState, useEffect } from 'react';
import { getUserProfileApi, updateUserProfileApi } from '../apis/Api';
import { toast } from 'react-toastify';
import './Profile.css'; // Ensure you have this file for custom styles


const Profile = () => {
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    getUserProfileApi()
      .then((res) => {
        setUser(res.data);
        setFirstName(res.data.firstName);
        setLastName(res.data.lastName);
        setPhone(res.data.phone);
      })
      .catch((error) => {
        toast.error('Error fetching user data');
      });
  }, []);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    updateUserProfileApi({ firstName, lastName, phone, password })
      .then((res) => {
        toast.success('Profile updated successfully');
        setUser(res.data);
        setEditMode(false);
      })
      .catch((error) => {
        toast.error('Error updating profile');
      });
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img
            src="../assets/images/logo.png"
            alt="Company Logo"
          />
          <h1>User Profile</h1>
        </div>
        {!editMode ? (
          <div className="profile-info">
            <div className="profile-row">
              <label>First Name:</label>
              <p>{user.firstName}</p>
            </div>
            <div className="profile-row">
              <label>Last Name:</label>
              <p>{user.lastName}</p>
            </div>
            <div className="profile-row">
              <label>Email:</label>
              <p>{user.email}</p>
            </div>
            <div className="profile-row">
              <label>Phone:</label>
              <p>{user.phone}</p>
            </div>
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdateProfile} className="edit-profile-form">
            <div className="form-group mb-4">
              <label>First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="form-group mb-4">
              <label>Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="form-group mb-4">
              <label>Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="form-group mb-4">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white py-2 px-4 rounded"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
      
    </div>
  );
};

export default Profile;
