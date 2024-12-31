import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'

function UserRoutes() {
   // get user information 
   const user = JSON.parse(localStorage.getItem('user'))
   // check user
   //check isAdmin= true
   //if true: Access all the route of Admin(outlet)
   //if false: Navigate to Login 
   
   return user !=null ? <Outlet/> : <Navigate to={'/login'}/>   
}

export default UserRoutes
