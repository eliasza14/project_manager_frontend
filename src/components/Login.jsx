import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LoginUser, reset } from '../features/authSlice';
import pm_logo from '../Images/logoproject.png';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
// import '../login.css';
import logo from "../logocmt.png";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isError, isSuccess, isLoading, message } = useSelector(state => state.auth);

    const Auth = e => {
        e.preventDefault();
        dispatch(LoginUser({ email, password }));
    };

    useEffect(() => {
        if (user && isSuccess) {
            navigate('/dashboard');
        }
        dispatch(reset());
    }, [user, isSuccess, dispatch, navigate]);

    return (
        // <div className="login-page-container">
        //     <div className="login-form-section">
        //         <div className="login-box">
        //             <div className="text-center mb-5">
        //                 <img src={pm_logo} alt="pm Logo" height={130} className="mb-3" />
                      
        //             </div>
        //             <form onSubmit={Auth}>
        //                 <div className="form-group">
        //                     <label htmlFor="email" style={{ color: 'white',fontSize:'16px' }}>Email</label>
        //                     <InputText type="text" className="w-full mb-3" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        //                 </div>
        //                 <div className="form-group">
        //                     <label htmlFor="password" style={{ color: 'white',fontSize:'16px' }}>Κωδικός Πρόσβασης</label>
        //                     <InputText type="password" className="w-full mb-3" value={password} onChange={e => setPassword(e.target.value)} placeholder="Κωδικός Πρόσβασης" />
        //                 </div>
        //                 <Button type="submit" label={isLoading ? "Loading..." : "Είσοδος"} icon="pi pi-sign-in" className="w-full" />
                       
        //             </form>
        //             <h6 style={{ color: 'white' ,paddingTop:'10px'}}>Powered by</h6>
        //             <img src={logo} alt="cmt Logo" height={45} className="mb-3" />
        //             {isError && <p className="error-message">{message}</p>}
                    
        //         </div>
        //     </div>
        //     <div className="login-gif-section visible-gif">
        //     </div>
        // </div>


    <div id="login-screen" class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 p-4">
        <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
            <div class="text-center mb-6">
                <div className="text-center mb-5">
                    <img src={pm_logo} alt="pm Logo" height={10} className="mb-3" />
                      
               </div>
                <h1 class="text-3xl font-bold text-gray-800">Executive Dashboard</h1>
                <p class="text-gray-600 mt-2">Sign in to access your project analytics</p>
            </div>
                

            <form onSubmit={Auth} id="login-form" class="space-y-6">
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" id="email" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required/>
                {/* <InputText type="text" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" /> */}

                </div>
                
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input type="password" id="password" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={password} onChange={e => setPassword(e.target.value)} placeholder="Κωδικός Πρόσβασης" required/>
                 {/* <InputText type="password"class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"  value={password} onChange={e => setPassword(e.target.value)} placeholder="Κωδικός Πρόσβασης" /> */}

                </div>
                
                <div>
                    <button style={{backgroundColor:"#143b68"}} type="submit"className="w-full text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out" >
                        Sign In
                    </button>
                </div>
                
            </form>
               <h6 style={{ color: 'black' ,paddingTop:'5px'}} className='text-center mb-5 text-xs text-gray-500 mt-1'>Powered by</h6>
                <img src={logo} alt="cmt Logo" height={10} className="text-center mb-5" /> 
        </div>
    </div>



    );
};

export default Login;
