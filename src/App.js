import Header from './components/Header/Header';
import { Outlet, RouterProvider, createBrowserRouter, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './index.css';
import './App.scss';
import './styles/map.scss';
import './styles/boudingboxDataList.scss';
import Home from './components/Home/Home';
import News from './components/News/News';
import Auction from './components/Auction/Auction';
import Search from './components/Search/Search';
import AdminPage from './pages/Admin/Dashboard';
import NotFound from './components/NotFound';
import LayoutAdmin from './pages/Admin/LayoutAdmin';
import Login from './components/Auth/Login/Login';
import Register from './components/Auth/Register/Register';
import ForgotPassword from './components/Auth/ForgotPassword/ForgotPassword';
import TableBox from './pages/Admin/ListBox';
import TableGroup from './pages/Admin/ListGroup';
import TablePost from './pages/Admin/ListPost';
import PostPage from './components/News/PostPage';
import TableUser from './pages/Admin/ListUser';
import Profile from './pages/ProfileUser/Profile';
import { useSelector } from 'react-redux';
import Notification from './components/Notification/Notification';
import AuctionInfor from './components/Auction/AuctionInfor';
import LatestNews from './components/News/categorizeNews/LatestNews';
import HotNews from './components/News/categorizeNews/HotNews';
import useWindowSize from './hooks/useWindowSise.js';
import { pageView } from './index';

const Layout = () => {
    const windowSize = useWindowSize();
    return (
        <div className="App" style={{}}>
            <div className="app-header" style={{ maxHeight: windowSize.windowWidth > 768 ? '60px' : '30%' }}>
                <Header />
            </div>
            <div className="app-content">
                <Outlet />
                {/* app content */}
            </div>
        </div>
    );
};

function App() {
    const location = useLocation();
    useEffect(() => {
        pageView(location.pathname + location.search);
    }, [location]);
    const datauser = useSelector((state) => state.account.dataUser);
    const item = [
        {
            path: '/',
            element: <Layout />,
            // errorElement: <NotFound />,
            children: [
                {
                    index: true,
                    element: <Home />,
                },
                {
                    path: '/:name',
                    element: <Home />,
                },
                {
                    path: '/notifications',
                    element: <Notification />,
                },
                {
                    path: '/news',
                    element: <News />,
                },
                {
                    path: 'news/:slug',
                    element: <PostPage />,
                },
                {
                    path: 'news/latest',
                    element: <LatestNews />,
                },
                {
                    path: 'news/hot',
                    element: <HotNews />,
                },
                {
                    path: '/auctions',
                    element: <Auction />,
                },
                {
                    path: 'auctions/information/:LandAuctionID',
                    element: <AuctionInfor />,
                },
                {
                    path: '/search',
                    element: <Search />,
                },
                {
                    path: '/userprofile',
                    element: <Profile />,
                },
            ],
        },
        {
            path: '/login',
            element: <Login />,
        },
        {
            path: '/register',
            element: <Register />,
        },

        {
            path: '/forgotPassword',
            element: <ForgotPassword />,
        },
    ];

    if (datauser?.role === true) {
        item.unshift({
            path: '/admin',
            element: <LayoutAdmin />,
            errorElement: <NotFound />,
            children: [
                {
                    index: true,
                    element: <AdminPage />,
                },
                {
                    path: '/admin/listbox',
                    element: <TableBox />,
                },
                {
                    path: '/admin/listgroup',
                    element: <TableGroup />,
                },
                {
                    path: '/admin/listpost',
                    element: <TablePost />,
                },
                {
                    path: '/admin/listuser',
                    element: <TableUser />,
                },
            ],
        });
    }

    const router = createBrowserRouter(item);
    return <>{<RouterProvider router={router} />}</>;
}

export default App;
