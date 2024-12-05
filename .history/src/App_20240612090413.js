import Header from "./components/Header/Header";
import { Outlet } from "react-router-dom";
import "./index.css";

function App() {
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
