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

  // CLOSE ON OUTSIDE CLICK
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

  // CLOSE ON ROUTE CHANGE
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

      {/* OVERLAY */}
      {menuOpen && (
        <div
          className="menu-overlay"
          onClick={() => {
            setMenuOpen(false);
            setOpenDropdown(null);
          }}
        />
      )}

      {/* SIDE MENU */}
      <div className={`side-menu ${menuOpen ? "open" : ""}`} ref={menuRef}>
        <IoMdClose className="close-icon" onClick={() => setMenuOpen(false)} />

        <div className="menu-content">
          <SearchBar onSearch={handleSearch} />

          {/* NAV ITEMS */}
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              type="button"
              className="mobile-nav-btn"
              onClick={() => {
                navigate(item.path);
                setMenuOpen(false);
              }}
            >
              {item.name}
            </button>
          ))}

          {/* GENRES */}
          <button
            type="button"
            className="mobile-nav-btn"
            onClick={() =>
              setOpenDropdown(openDropdown === "genre" ? null : "genre")
            }
          >
            Genres <IoMdArrowDropdown className="arrow-icon" />
          </button>

          {openDropdown === "genre" &&
            GENRES.map((g) => (
              <button
                key={g.key}
                className="submenu"
                onClick={() => {
                  navigate(`/genre/${g.key}`);
                  setMenuOpen(false);
                }}
              >
                {g.name}
              </button>
            ))}

          {/* LANGUAGES */}
          <button
            type="button"
            className="mobile-nav-btn"
            onClick={() =>
              setOpenDropdown(openDropdown === "language" ? null : "language")
            }
          >
            Languages <IoMdArrowDropdown className="arrow-icon" />
          </button>

          {openDropdown === "language" &&
            LANGUAGES.map((l) => (
              <button
                key={l.key}
                className="submenu"
                onClick={() => {
                  navigate(`/language/${l.key}`);
                  setMenuOpen(false);
                }}
              >
                {l.name}
              </button>
            ))}
        </div>
      </div>
    </>
  );
}
