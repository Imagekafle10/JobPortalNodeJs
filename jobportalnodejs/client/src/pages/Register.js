import React, { useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'
import InputForm from '../components/shared/InputForm';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../redux/features/alertSlice';
import axios from 'axios'
import Spinner from '../components/shared/Spinner';
import { toast } from 'react-toastify';


const Register = () => {
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const [location, setLocation] = useState("");

    //Redux state
    const { loading } = useSelector(state => state.alerts)




    //hooks
    const dispatch = useDispatch();
    const navigate = useNavigate();
    //Form Function
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            if (!name || !lastName || !email || !password) {
                return toast.error('Please Provide All Fields');
            }

            dispatch(showLoading());

            const { data } = await axios.post('/api/v1/auth/register', { name, lastName, email, password });
            dispatch(hideLoading())

            if (data.success) {
                toast.success("Register Sucessfull")
                navigate('/login')
            }

        } catch (error) {
            dispatch(hideLoading());
            toast.error('Invalid Form Details Please Try Again')
            console.log(error);

        }

    }

    return (
        <>
            {loading ? (<Spinner />) :
                <div className="form-container">
                    <form className="card p-2 w-25 " onSubmit={handleSubmit} >
                        <img src="/assets/images/logo.png" alt="logo" height={100} width={100} className="w-20 mx-auto mb-4" />


                        <InputForm htmlFor="name"
                            labelText={"Name"}
                            type={'text'}
                            value={name}
                            name="name"
                            handleChange={(e) => setName(e.target.value)} />

                        <InputForm htmlFor="llastName"
                            labelText={"LastName"}
                            type={'text'}
                            value={lastName}
                            name="lastName"
                            handleChange={(e) => setLastName(e.target.value)} />


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
                            <p>Already Register <Link to='/login'>Login</Link></p>
                            <button type="submit" className="btn btn-primary">
                                Register
                            </button>

                        </div>




                    </form>
                </div >
            }
        </>
    )
}

export default Register
