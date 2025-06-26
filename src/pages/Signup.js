import { FormikProvider, useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { handleSuccess, handleError } from './utils';
import { ToastContainer } from 'react-toastify'
import axios from "axios";
import { config } from "../CommonApi/CommonApis";


const Signup = () => {
    //mycode
    const navigate = useNavigate();

   
    const submitDetails = async (values) => {


        try {

            const requestData = { ...values, password: values.password };

            const response = await axios.post(config.url.test,'user-register', requestData)
            if (response.data.code === "01") {

                console.log("karthik", values)
                handleSuccess(response.data.message);
                setTimeout(() => {
                    navigate('/login')
                }, 1000);


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
            name: "",
            email: "",
            password: "",
            role: "",

        },
        // validationSchema: userValidationSchema,
        onSubmit: submitDetails,
    });















    ///////////////
    //   const [signupInfo, setSignupInfo] = useState({
    //     name: "",
    //     email: "",
    //     password: "",
    //     role: "", // Store role as string first, convert to number later
    //   });

    //   const baseUrl = "https://shreyansh1807.bsite.net/api";

    //   // Redirect logged-in users
    //   useEffect(() => {
    //     const token = localStorage.getItem("token");
    //     const role = localStorage.getItem("role");
    //     const tokenExp = localStorage.getItem("tokenExp");
    //     const currentTime = Date.now();

    //     if (token && role && tokenExp && currentTime < tokenExp) {
    //       switch (role) {
    //         case "Admin":
    //           navigate("/admin/dashboard");
    //           break;
    //         case "Employer":
    //           navigate("/employer/dashboard");
    //           break;
    //         case "Jobseeker":
    //           navigate("/jobseeker/dashboard");
    //           break;
    //         default:
    //           navigate("/");
    //       }
    //     }
    //   }, [navigate]);

    //   // Handle input change
    //   const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setSignupInfo({ ...signupInfo, [name]: value });
    //   };

    //   // Handle form submission
    //   const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     // Validate inputs
    //     if (!signupInfo.name || !signupInfo.email || !signupInfo.password || signupInfo.role === "") {
    //     //   handleError("Please fill all fields including role.");
    //       return;
    //     }

    //     const roleValue = signupInfo.role === "Employer" ? 0 : 1; // Convert role to number

    //     const requestBody = {
    //       name: signupInfo.name,
    //       email: signupInfo.email,
    //       password: signupInfo.password,
    //       role: roleValue,
    //     };

    //     try {
    //       const response = await fetch(`${baseUrl}/auth/register`, {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(requestBody),
    //       });
    //       const result = await response.json();
    //       const {message} = result;
    //       if (response.ok) {
    //         // handleSuccess(message);
    //         console.log(message);
    //         setTimeout(()=>{
    //           navigate('/login')
    //       },1000);
    //       } else {
    //         // handleError(message);
    //       }
    //     } catch (error) {
    //       console.error("Error during signup:", error);
    //     //   handleError("An error occurred. Please try again.");
    //     }
    //   };

    return (
        <div className="main-container">
            <div className="login-container">
                <h2>Signup</h2>
                <FormikProvider value={formIk}>

                    <form onChange={formIk.handleChange}
                        onSubmit={formIk.handleSubmit}  >
                        <input
                            type="text"
                            autoFocus
                            placeholder="Name"
                            name="name"
                            className="input"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            className="input"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            className="input"
                        />
                        {/* Role Selection */}
                        <select name="role" className="round" >
                            <option value="">Select Role</option>
                            <option value="1">Employer</option>
                            <option value="2">Job Seeker</option>
                        </select>

                        <button type="submit" className="button-50">
                            Signup
                        </button>
                    </form>
                </FormikProvider>
                <p>
                    Already a user? <Link to="/login" className="link">Login</Link>
                </p>
                <ToastContainer />
            </div>
        </div>
    );
};

export default Signup;
