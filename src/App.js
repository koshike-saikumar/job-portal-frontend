import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
// import AdminDashboard from './pages/admin/AdminDashboard'
// import User from './pages/admin/User';
// import JobSeekerDashboard from './pages/jobseeker/JobseekerDashboard'
// import EmployerDashboard from './pages/employer/EmployerDashboard'
// import Unauthorized from './pages/Unauthorized';
// import ProtectedRoute from './pages/protected/ProtectedRoute';
import Signup from './pages/Signup';
import EmployeDashboard from './pages/employe/EmployeDashboard';
import YourProfile from './Components/YourProfile';
import PostJob from './pages/employe/PostJob';
import Job from './pages/employe/Job';
import JobseekerDashboard from './pages/jobseeker/JobseekerDashboard';
import SearchResults from './pages/jobseeker/SearchResults';
import SearchComponent from './pages/jobseeker/component/SearchComponent';
// import JobDetailsPage from './pages/jobseeker/JobDetailsPage';
import { ToastContainer } from 'react-toastify';
import MyApplications from './pages/jobseeker/MyApplications';
// import Jobs from './pages/admin/Jobs';
// import Companies from './pages/admin/Companies';
// import AddAdmin from './pages/admin/AddAdmin';
// import YourProfile from './components/YourProfile';
// import PostJob from './pages/employer/PostJob';
// import Job from './pages/employer/Job';
// import NotFound from './pages/notfound/NotFound';
// import JobsPage from './pages/jobseeker/JobsPage';
// import JobDetailsPage from './pages/jobseeker/JobDetailsPage';
// import SearchResults from './pages/jobseeker/SearchResults';
// import { SpeedInsights } from "@vercel/speed-insights/react"

function App() {
  return (
    <>
     <ToastContainer /> 
      <Router>
        <Routes>
           
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}

          {/* Protected Routes */}
          {/* <Route element={<ProtectedRoute allowedRoles={["JobSeeker"]} />}> */}
          <Route path="/jobseeker-dashboard" element={<JobseekerDashboard />} />
          <Route path="/jobseeker-Search-Jobs" element={<SearchComponent />} />

          <Route path="/jobseeker-applications" element={<MyApplications />} />
          {/* <Route path="/jobseeker-jobs" element={<JobDetailsPage />} /> */}
          <Route path="/jobseeker/search-results" element={<SearchResults />} />
          {/* </Route> */}

          {/* <Route element={<ProtectedRoute allowedRoles={["JobSeeker","Employer","Admin"]} />}> */}
          <Route path="/profile" element={<YourProfile />} />
          {/* </Route> */}

          {/* <Route element={<ProtectedRoute allowedRoles={["Employer"]} />}> */}
          <Route path="/employe-dashboard" element={<EmployeDashboard />} />
          <Route path="/employe-postjob" element={<PostJob />} />
          <Route path="/employe-job" element={<Job />} />
          {/* </Route> */}

          {/* <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<User />} />
            <Route path="/admin/jobs" element={<Jobs />} />
            <Route path="/admin/companies" element={<Companies />} />
            <Route path="/admin/add-admin" element={<AddAdmin />} /> */}
          {/* </Routes></Route> */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Router>
      {/* <SpeedInsights /> */}
    </>
  );
}

export default App;
