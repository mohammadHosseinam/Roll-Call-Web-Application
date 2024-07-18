import React, { useEffect, useState } from 'react';
import { SignJWT } from 'jose';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import {useToast} from '../../ToastContext.jsx'

function LogingIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const secretKey = new TextEncoder().encode('your-secret-key'); // Replace this with your own secret key
    const { setMessage } = useToast();
    const generateToken = async (payload) => {
        const token = await new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('1m')
            .sign(secretKey);
        return token;
    }; 
   
    useEffect(() => {
        const token = Cookies.get('adminToken');
        if (token) {
            setMessage('Login successful!');
            navigate('/createEmployee'); // Redirect to home page if token exists
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Define the specific email and password
        const specificEmail = 'admin@gmail.com';
        const specificPassword = '1234';

        if (email === specificEmail && password === specificPassword) {
            // Handle successful login (e.g., store token in cookie)
            const token = await generateToken({ email, password });
            Cookies.set('adminToken', token, { expires: 1, secure: true, sameSite: 'strict' });
            // Redirect or show success message
            setError('');
            setMessage('Login successful!');
            console.log('Login successful!', token);
            navigate('/createEmployee')
        } else {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div style={{ backgroundColor: "#C7DAE8" }} className="flex justify-center items-center w-screen h-screen">
            <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <h5 className="text-xl font-medium text-gray-900">Log in as admin</h5>
                    {error && <div className="text-red-500">{error}</div>}
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="name@company.com"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Your password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div className="flex items-start">
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input id="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" />
                            </div>
                            <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900">Remember me</label>
                        </div>
                        <a href="#" className="ms-auto text-sm text-blue-700 hover:underline">Lost Password?</a>
                    </div>
                    <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Login to your account</button>
                    <div className="text-sm font-medium text-gray-500">
                        Not registered? <a href="#" className="text-blue-700 hover:underline">Create account</a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LogingIn;


