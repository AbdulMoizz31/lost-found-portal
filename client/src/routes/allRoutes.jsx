import Login  from "../pages/login"
import SignUp from "../pages/signup"
import  Home from "../pages/home/home"


const allRoutes = [
  { path: "/login", component: <Login/> },
  { path: "/sign-up", component: <SignUp/> },
  { path: "/", component: <Home/> },
]



export {allRoutes}