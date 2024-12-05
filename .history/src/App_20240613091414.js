import Header from "./components/Header/Header";
import { Outlet } from "react-router-dom";
import "./index.css";
import { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./components/Home/Home";
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
          path: 'user',
          element: <ContactPage/>
        },
        {
          path: 'book/:slug',
          element: <BookPage/>
        },
        {
          path: '/cart',
          element: <ProtectedRoute><OrderPage/></ProtectedRoute>
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
