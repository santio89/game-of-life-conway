import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from "./components/Home";
import Nav from "./components/Nav";
import NotFound from "./components/NotFound";
import './styles/css/styles.css'
import { useRef } from "react";
import { Toaster } from 'sonner'

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
        <Toaster />
        <BrowserRouter>
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
