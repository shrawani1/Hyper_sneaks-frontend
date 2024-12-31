import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import AdminNavbar from '../components/AdminNavbar';

const NavbarSwitch = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admindashboard');
  
  return isAdminRoute ? <AdminNavbar /> : <Navbar />;
};

export default NavbarSwitch;
