import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
import { Outlet } from "react-router-dom";
import { TbWorldPin } from "react-icons/tb";
import Image from "react-bootstrap/Image";
import Background from "./components/background";
import "./css/navbar.css";
import { PAGES_NAMES_AND_COMPONENT } from "./config";
import {
  REACT_APP_BACKEND_URL,
  SIDE_NAVBAR_PAGES_NAME,
  LOGO_PATH,
} from "./dev_variables";

export default function MainNavbar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();

  // Set initial state based on screen size
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsCollapsed(true); // Collapse for mobile screens
    }
  }, []);

  const handleHamburgerClick = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActive = (paths) => {
    for (const path of paths) {
      if (location.pathname.includes(path)) {
        if (location.pathname !== "/" && path === "/") {
          continue;
        }
        return "active";
      }
    }
    return "";
  };

  return (
    <>
      <div className={isCollapsed ? "wrapper collapse" : "wrapper"}>
        <Background>
          <Outlet />
        </Background>

        {/* Sidebar for Large Screens */}
        <div className="outer-sidebar d-none d-md-block">
          <div className="sidebar">
            <div className="top_navbar">
              <div className="hamburger" onClick={handleHamburgerClick}>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
            <Container>
              <Stack className="mt-2" gap={3} style={{ padding: "10px" }}>
                <Image src={LOGO_PATH} />
                {PAGES_NAMES_AND_COMPONENT.filter(
                  (item, index, self) =>
                    index ===
                    self.findIndex((t) => t.page_name === item.page_name)
                ).map(({ page_name, path }) => (
                  <Link
                    to={path ? path :`/${page_name.toLowerCase().replace(" ", "-")}`}
                    className={
                      isActive([
                        `/${page_name.toLowerCase().replace(" ", "-")}`,
                        path,
                      ]) + " p-2"
                    }
                    key={page_name}
                  >
                    <span className="icon">
                      <TbWorldPin />
                    </span>
                    <span className="title">{page_name}</span>
                  </Link>
                ))}
              </Stack>
            </Container>
          </div>
        </div>

        {/* Hamburger Menu for Small Screens */}
        <div
          className="d-block d-md-none"
          style={{
            position: "absolute",
            top: "60px",
            left: "50px",
            zIndex: 1000,
          }}
        >
          <div
            className="hamburger"
            onClick={handleHamburgerClick}
            style={{ cursor: "pointer" }}
          >
            <div style={{ backgroundColor: "#00246b" }}></div>
            <div style={{ backgroundColor: "#00246b" }}></div>
            <div style={{ backgroundColor: "#00246b" }}></div>
          </div>
        </div>

        {/* Sidebar Drawer for Small Screens */}
        <div
          className={`outer-sidebar ${
            isCollapsed ? "hidden" : "visible"
          } d-md-none`}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "250px",
            height: "100vh",
            backgroundColor: "#00246B",
            zIndex: 999,
            overflowX: "hidden",
            transform: isCollapsed ? "translateX(-100%)" : "translateX(0)",
            transition: "transform 0.3s ease",
          }}
        >
          <div>
            {/* Close Button */}
            <div
              style={{
                textAlign: "end",
                padding: "10px",
              }}
            >
              <button
                onClick={() => setIsCollapsed(true)}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: "#fff",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
            <Container>
              <Stack className="mt-5" gap={3} style={{ padding: "10px" }}>
                <Image src={LOGO_PATH} />
                {PAGES_NAMES_AND_COMPONENT.filter(
                  (item, index, self) =>
                    index ===
                    self.findIndex((t) => t.page_name === item.page_name)
                ).map(({ page_name, path }) => (
                  <Link
                    to={`/${page_name.toLowerCase().replace(" ", "-")}`}
                    className={
                      isActive([
                        `/${page_name.toLowerCase().replace(" ", "-")}`,
                        path,
                      ]) + " p-2"
                    }
                    key={page_name}
                    onClick={() => setIsCollapsed(true)} // Close sidebar on selection
                  >
                    <span className="icon">
                      <TbWorldPin />
                    </span>
                    <span className="title">{page_name}</span>
                  </Link>
                ))}
              </Stack>
            </Container>
          </div>
        </div>
      </div>
    </>
  );
}
