import { useState, useRef, useEffect } from "react";
import {
  IoMdMenu,
  IoMdClose,
  IoMdHome,
  IoMdArrowDropdown,
} from "react-icons/io";
import { useLocation } from "react-router-dom";

import { NAV_ITEMS } from "../constants/navConfig";
import { GENRES, LANGUAGES } from "../constants/filterData";
import SearchBar from "./SearchBar";

export default function NavbarMobile({ navigate, handleSearch }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const menuRef = useRef();
  const location = useLocation();

  // 🔥 CLOSE ON OUTSIDE CLICK
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // 🔥 CLOSE ON ROUTE CHANGE
  useEffect(() => {
    setMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  return (
    <>
      {/* 🔝 TOP BAR */}
      <div className="mobile-topbar">
        <IoMdMenu className="menu-icon" onClick={() => setMenuOpen(true)} />

        <span
          className="home-btn"
          onClick={() => {
            navigate("/");
            setMenuOpen(false);
          }}
        >
          <IoMdHome className="home-icon" />
          Home
        </span>

        {!menuOpen && <SearchBar onSearch={handleSearch} />}
      </div>

      {/* 📂 SIDE MENU */}
      <div className={`side-menu ${menuOpen ? "open" : ""}`} ref={menuRef}>
        <IoMdClose className="close-icon" onClick={() => setMenuOpen(false)} />

        <div className="menu-content">
          <SearchBar onSearch={handleSearch} />

          {/* 🔥 NAV ITEMS */}
          {NAV_ITEMS.map((item) => (
            <div
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setMenuOpen(false);
              }}
            >
              {item.name}
            </div>
          ))}

          {/* GENRES */}
          <div
            onClick={() =>
              setOpenDropdown(openDropdown === "genre" ? null : "genre")
            }
          >
            Genres <IoMdArrowDropdown className="arrow-icon" />
          </div>

          {openDropdown === "genre" &&
            GENRES.map((g) => (
              <div
                key={g.key}
                className="submenu"
                onClick={() => {
                  navigate(`/genre/${g.key}`);
                  setMenuOpen(false);
                }}
              >
                {g.name}
              </div>
            ))}

          {/* LANGUAGES */}
          <div
            onClick={() =>
              setOpenDropdown(openDropdown === "language" ? null : "language")
            }
          >
            Languages <IoMdArrowDropdown className="arrow-icon" />
          </div>

          {openDropdown === "language" &&
            LANGUAGES.map((l) => (
              <div
                key={l.key}
                className="submenu"
                onClick={() => {
                  navigate(`/language/${l.key}`);
                  setMenuOpen(false);
                }}
              >
                {l.name}
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
