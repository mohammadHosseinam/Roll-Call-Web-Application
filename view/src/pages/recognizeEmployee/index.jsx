import React, { useEffect } from 'react'
import CameraCapture from '../../components/CameraCapture'
import Logo from '../../assets/logo2.png'
import { useNavigate } from 'react-router-dom';

function RecognizeEmployee() {
  const navigate = useNavigate();
  return (
    <div style={{backgroundColor:"#C7DAE8"}} className='w-screen h-screen'>
        <div style={{backgroundColor:"#C7DAE8"}} className='mx-24 pt-5 h-28 flex justify-between items-center'>
            <img width={60} src={Logo} alt="Logo" />
            <button className='px-4 py-2 border rounded-lg bg-slate-700 text-slate-50 border-slate-50 shadow-md' onClick={()=>{ navigate("/logingIn")}}>loggin</button>
        </div>
        <div style={{height : "calc(100vh - 112px)"}} className='w-screen flex items-center justify-center'>
            <CameraCapture/>
        </div>
        
    </div>
  )
}

export default RecognizeEmployee