import Admin from "./pages/admin/index.jsx";
import Home from "./pages/home/index.jsx";
import RecognizeEmployee from "./pages/recognizeEmployee/index.jsx";
import LogingIn from "./pages/logingIn/index.jsx";



export const routes = {
    home:{
        id:'1',
        path:'/',
        element:<Home/>
    },
    recognizeEmployee:{
        id:'2',
        path:'/recognizeEmployee',
        element: <RecognizeEmployee/>
    },
    admin:{
        id:'3',
        path:'/admin',
        element: <Admin/>
    },
    logingIn:{
        id:'4',
        path:'/logingIn',
        element: <LogingIn/>
    },
    createEmployee:{
        id:'5',
        path:'/createEmployee',
        element: <Admin/>
    }
}