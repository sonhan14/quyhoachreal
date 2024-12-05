import Header from "./components/Header/Header";
import { Outlet } from "react-router-dom";
import "./index.css";
import { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./components/Home/Home";
import User from "./components/User";
import NotFound from "./components/NotFound";
import LayoutAdmin from "./pages/Admin/LayoutAdmin";
import Register from "../src/components/Auth/Register/Register"

const Layout = () => {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <div className="App">
      <div className='app-header'>
        <Header />
      </div>
      <div className='app-content'>
        <Outlet />
        {/* app content */}
      </div>
    </div>
  )
}
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout/>,
      errorElement: <NotFound/>,
      children: [
        {
          index: true,
          element: <Home/>
        },
        {
          path: 'users',
          element: <User/>
        },
      ]
    },

    {
      path: "/admin",
      element: <LayoutAdmin/>,
      errorElement: <NotFound/>,
      children: [
        {
          index: true,
          element: <AdminPage/>
        },
        {
          path: 'user',
          element: <ContactPage/>
        },
        {
          path: 'book',
          element: <BookTable/>
        },
        
      ]
    },
  
    {
      path: "/register",
      element: <Register/>,
    },
  ]);


  return (
    <><RouterProvider router={router} /></>
  );










  
}

export default App;
