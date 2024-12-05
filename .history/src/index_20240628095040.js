import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from './components/Home/Home';
import Login from './components/Auth/Login/Login';
import Register from './components/Auth/Register/Register';
import { Provider } from 'react-redux';
import {store, persistor} from './redux/store'
import { PersistGate } from 'redux-persist/integration/react';
import ForgotPassword from './components/Auth/ForgotPassword/ForgotPassword';
import Auction from './components/Auction/Auction';
import Search from './components/Search/Search';
import LayoutAdmin from './pages/Admin/LayoutAdmin';
import App from './App';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App/>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
