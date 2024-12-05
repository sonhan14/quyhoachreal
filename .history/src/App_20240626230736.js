import Header from "./components/Header/Header";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import { useEffect } from "react";
import Home from "./components/Home/Home";
import News from "./components/Auth/News/News";
import Auction from "./components/Auction/Auction";
import Search from "./components/Search/Search";
import AdminPage from "./pages/Admin/Dashboard";
import NotFound from "./components/NotFound";
import LayoutAdmin from "./pages/Admin/LayoutAdmin";
import Login from "./components/Auth/Login/Login";
import Register from "./components/Auth/Register/Register";
import ForgotPassword from "./components/Auth/ForgotPassword/ForgotPassword";
import TableBox from "./pages/Admin/ListBox";
import TableGroup from "./pages/Admin/ListGroup";



const Layout = () => {
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
  );
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
          path: '/news',
          element: <News/>
        },
        {
          path: '/auction',
          element: <Auction/>
        },
        {
          path: '/search',
          element: <Search/>
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
          path: '/admin/listbox',
          element: <TableBox/>
        },
        {
          path: '/admin/listgroup',
          element: <TableGroup/>
        },
        // {
        //   path: 'book',
        //   element: <BookTable/>
        // },
        
      ]
    },
    // {
    //   path: "/history",
    //   element: <HistoryOrder/>,
    // },
    {
      path: "/login",
      element: <Login/>,
    },
    {
      path: "/register",
      element: <Register/>,
    },

    {
      path: "/forgotPassword",
      element: <ForgotPassword/>,
    },
  ]);

  return (
    <>
      {
        <RouterProvider router={router} /> 
      }
      
    </>
  );
}

export default App;
