import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Admin from './components/Admin';
import User from './components/User';
import Home from './components/Home/Home';
import Login from './components/Auth/Login/Login';
import Register from './components/Auth/Register/Register';
import { Provider } from 'react-redux';
import {store, persistor} from './redux/store'
import { PersistGate } from 'redux-persist/integration/react';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}/> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} >
            <Route path="admins" element={<Admin />} />
            <Route path="users" element={<User />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    {/* <PersistGate/>
    </Provider> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
