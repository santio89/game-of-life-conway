import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import './styles/css/styles.css'
import Home from "./components/Home";
import Nav from "./components/Nav";
import Modal from "./components/Modal";
import NotFound from "./components/NotFound";
import { useRef } from "react";

function App() {
  const rootTheme = useRef()

  const Layout = () => (
    <>
      {/* <Nav /> */}
      <div className="mainContainer">
        <Outlet />
      </div>
    </>
  );

  return (
    <>
      <div ref={rootTheme} className={`root-theme`}>
        <BrowserRouter>
          <Modal />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home rootTheme={rootTheme} />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
