// import { jwtDecode } from 'jwt-decode'
import './Login.css'
import { useNavigate } from "react-router-dom";
// import { handleSuccess, handleError } from './utils';
import { ToastContainer } from 'react-toastify'
import { FormikProvider, useFormik } from 'formik';
import { handleSuccess, handleError } from './utils';
import axios from 'axios';
import { config } from '../CommonApi/CommonApis';
import { useEffect } from 'react';


const Login = () => {
    const navigate = useNavigate();

    // const [loginInfo, setLoginInfo] = useState({
    //     email:'',
    //     password:''
    // })
    const submitDetails = async (values) => {
        console.log("karthik", values)


        try {

            const requestData = { ...values, password: values.password };

            const response = await axios.post(config.url.test + 'user-login', requestData)
            //const response = await axios.post('http://localhost:8080/test/user-login', requestData)

            if (response.data.code === "01") {

                console.log("karthik", values)
                handleSuccess(response.data.message);
                setTimeout(() => {
                }, 1000);
                navigate('/employe-dashboard')

                // localStorage.setItem("token",response.data.token)
                // localStorage.setItem("refreshToken", response.data.refreshtoken)

                // localStorage.setItem("email", JSON.stringify(decoded.data.empId))
                // localStorage.setItem('userData', JSON.stringify(decoded.data))
                // localStorage.setItem('userName', decoded.data.userId)
                // localStorage.setItem('lastlogin', decoded.data.lastlogin_time)
            }
            else {
                handleError(response.data.message);
            }
        }
        catch (e) {
            console.error("Error during signup:", e);
            handleError("An error occurred. Please try again.");
        }


    }

    const formIk = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        // validationSchema: userValidationSchema,
        onSubmit: submitDetails,
    });


















    // Check if user is already logged in and redirect
    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        const tokenExp = localStorage.getItem("tokenExp");
        const currentTime = Date.now();
        console.log('ssss', 1)

        if (token && role && tokenExp) {
            console.log('ssss', 2)
            if (currentTime < tokenExp) {
                console.log('ssss', 3)

                // Redirect to respective dashboard based on role
                switch (role) {
                    case "Admin":
                        navigate("/admin/dashboard");
                        break;
                    case "Employer":
                        navigate("/employer/dashboard");
                        break;
                    case "Jobseeker":
                        navigate("/jobseeker/dashboard");
                        break;
                    default:
                        navigate("/");
                }
            }
        }
    }, [navigate]);


    // const handleChange=(e)=>{
    //     const {name,value}=e.target;
    //     const copyLoginInfo = {...loginInfo}
    //     copyLoginInfo[name]=value;
    //     setLoginInfo(copyLoginInfo);
    // }


    //const baseUrl="https://shreyansh1807.bsite.net/api"


    // const handleSubmit = async (e)=>{
    //     e.preventDefault()
    //     //  const{email,password}=loginInfo;
    //     // console.log("karthik",loginInfo)

    //     // if(!email || !password){
    //     //     handleError("All fields are required")
    //     //     return;
    //     // } 
    //     try{
    //     // const response = await fetch(`${baseUrl}/Auth/login`, {
    //     //     method: 'POST',
    //     //     body: JSON.stringify(loginInfo),
    //     //     headers: {
    //     //         'Content-type': 'application/json'
    //     //     }
    //     // })
    //     // const result = await response.json();
    //     // const {token,message,name}=result;
    //     // if (response.ok) {
    //     //     localStorage.setItem("token", token);
    //     //     localStorage.setItem("loggedInUser", name);
    //     //     handleSuccess(message);
    //     //     const decoded = jwtDecode(token);
    //     //     const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    //     //     const tokenExp = decoded.exp * 1000;
    //     //     localStorage.setItem("tokenExp", tokenExp);
    //     //     localStorage.setItem("role",role);
    //     //     console.log("login successful")
    //     //     setTimeout(()=>{
    //     //         navigate('/')
    //     //     },1000);
    //     // } else {
    //     //     handleError(message);
    //     // }
    // }catch(err){
    //     //handleError(err.message);
    //     console.log(err.message);
    // }
    // }
    return (

        <div className='main-container'>

            <div className="login-container">
                <h2>Login</h2>
                <FormikProvider value={formIk}>

                    <form onChange={formIk.handleChange}
                        onSubmit={formIk.handleSubmit}                    >
                        <input type="email" placeholder="Email" name='email' className="input"
                        //   onChange={handleChange}
                        />
                        <input type="password" placeholder="Password" name='password' className="input"
                        //   onChange={handleChange}
                        />

                        <button type="submit" className="button-50">Login</button>
                    </form>
                </FormikProvider>
                <p className="p">Don't have an account?<p onClick={() => navigate('/signup')} className="link">Sign Up</p></p>
                <ToastContainer />
            </div>
        </div>
    )
}

export default Login