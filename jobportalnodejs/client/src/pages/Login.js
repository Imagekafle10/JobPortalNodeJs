import React, { useState } from 'react'
import InputForm from '../components/shared/InputForm'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { hideLoading, showLoading } from '../redux/features/alertSlice'
import Spinner from '../components/shared/Spinner'
import { toast } from 'react-toastify';

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //Hooks
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //redux State
    const { loading } = useSelector(state => state.alerts)


    //Login Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(showLoading());
            const { data } = await axios.post('/api/v1/auth/login', { email, password })
            if (data.success) {
                dispatch(hideLoading());
                localStorage.setItem('token', data.token)
                toast.success('Login sucessfully');
                navigate('/dashboard')
            }

        } catch (error) {
            dispatch(hideLoading())
            toast.error("Invalid Creadential Please try again!")
            console.log(error);

        }
    }

    return (
        <>
            {(loading) ? (<Spinner />) :
                <div className="form-container">
                    <form className="card p-2 w-25 " onSubmit={handleSubmit} >
                        <img src="/assets/images/logo.png" alt="logo" height={100} width={100} className="w-20 mx-auto mb-4" />

                        <InputForm htmlFor="email"
                            labelText={"Email"}
                            type={'email'}
                            value={email}
                            name="email"
                            handleChange={(e) => setEmail(e.target.value)} />


                        <InputForm htmlFor="password"
                            labelText={"Password"}
                            type={'password'}
                            value={password}
                            name="password"
                            handleChange={(e) => setPassword(e.target.value)} />



                        {/* <div className="mb-1">
                        <label htmlFor="location"
                            className="form-label"
                        >Location</label>
                         <input type="text"
                            className="form-control"
                            name="location" 
                            value={values.location}
                              onChange={(e)=>setLocation(e.target.value)}
                            /> 
                    </div> */}

                        <div className='d-flex justify-content-between'>
                            <p>Not A User <Link to='/register'>Register</Link></p>
                            <button type="submit" className="btn btn-primary">
                                Login
                            </button>

                        </div>




                    </form>
                </div >
            }

        </>
    )
}

export default Login
