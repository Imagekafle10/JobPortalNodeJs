import React, { use, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { hideLoading, showLoading } from '../../redux/features/alertSlice';
import axios from 'axios'
import { setUser } from '../../redux/features/auth/authSlice';
import { Navigate } from 'react-router-dom'
const PrivateRoute = ({ children }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth)


    dispatch(hideLoading())
    const getUser = async () => {
        try {
            dispatch(showLoading())
            const { data } = await axios.post('api/v1/user/getUser',
                { token: localStorage.getItem('token') }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }

            })



            dispatch(hideLoading())
            if (data.success) {
                dispatch(setUser(data.data))

            } else {
                localStorage.clear();
                <Navigate to='/login' />


            }

        } catch (error) {
            localStorage.clear()
            dispatch(hideLoading())
            console.log(error);

        }
    }
    useEffect(() => {
        if (!user) {
            getUser()
        }
    })

    if (localStorage.getItem('token')) {

        return children;

    } else {
        return <Navigate to='/login' />
    }
}



export default PrivateRoute
