import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'

function UserRoutes() {
   // get user information 
   const user = JSON.parse(localStorage.getItem('user'))
   
   return user !=null ? <Outlet/> : <Navigate to={'/login'}/>   
}

export default UserRoutes
