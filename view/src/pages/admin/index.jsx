import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import UserForm from '../../components/UserForm';
import { useToast } from '../../ToastContext.jsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import logo from '../../assets/logo2.png';

function Admin() {
    const { message, setMessage } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('adminToken');
        if (!token) {
            navigate('/logingIn'); // Redirect to the login page if no token is found
        }
    }, [navigate]);

    useEffect(() => {
        if (message) {
            toast.success(message);
            setMessage(null); // Clear the message after showing the toast
        }
    }, []);

    return (
        <>
            <div style={{ height: "100px", backgroundColor: "#C7DAE8" }} className="w-screen flex justify-center items-center shadow-sm">
                <img src={logo} width={60} alt="" />
            </div>
            <div style={{ backgroundColor: "#C7DAE8", height: "calc(100vh - 100px)" }} className="flex justify-center items-center w-screen">
                <UserForm />
            </div>
        </>
    );
}

export default Admin;
