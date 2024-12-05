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
          element: <ProtectedRoute><AdminPage/></ProtectedRoute>
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
      path: "/history",
      element: <HistoryOrder/>,
    },
    {
      path: "/login",
      element: <LoginPage/>,
    },
    {
      path: "/register",
      element: <RegisterPage/>,
    },
  ]);


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

export default App;
