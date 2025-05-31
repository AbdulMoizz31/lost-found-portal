import Login  from "../pages/login"
import SignUp from "../pages/signup"
import  Home from "../pages/home/home"
import ClaimItemForm from "../pages/claimItem"
import ClaimRequests from "../pages/claimItems"
import AddItemForm from "../pages/addItem"
import ChatSystem from "../pages/chat"


const allRoutes = [
  
  { path: "/", component: <Home/> },
   { path: "/add-item", component: <AddItemForm/> },
  { path: "/claim/:id", component: <ClaimItemForm/> },
  { path: "/claim-requests", component: <ClaimRequests/> },
  { path: "/chat", component: <ChatSystem/> },
]
const nonAuthRoutes = [
  { path: "/login", component: <Login/> },
  { path: "/sign-up", component: <SignUp/> }
]



export {allRoutes, nonAuthRoutes}