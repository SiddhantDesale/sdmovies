import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { IoMdArrowDropdown, IoMdHome } from "react-icons/io";

import { NAV_ITEMS } from "../constants/navConfig";
import { GENRES, LANGUAGES } from "../constants/filterData";
import SearchBar from "./SearchBar";

export default function NavbarDesktop({ navigate, handleSearch }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef();
  const location = useLocation();

  // CLOSE ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // CLOSE ON ROUTE CHANGE
  useEffect(() => {
    setOpenDropdown(null);
  }, [location.pathname]);

  return (
    <div className="navbar-container">
      <div className="navbar-left" ref={dropdownRef}>
        {/* NAV ITEMS */}
        {NAV_ITEMS.map((item) => (
          <button
            type="button"
            key={item.path}
            className={item.name === "Home" ? "home-btn" : "nav-btn"}
            onClick={() => {
              navigate(item.path);
              setOpenDropdown(null);
            }}
          >
            {item.name === "Home" && <IoMdHome className="home-icon" />}
            {item.name}
          </button>
        ))}

        {/* GENRES */}
        <div className="dropdown">
          <div
            className="dropdown-btn"
            onClick={() =>
              setOpenDropdown(openDropdown === "genre" ? null : "genre")
            }
          >
            Genres <IoMdArrowDropdown className="arrow-icon" />
          </div>

          {openDropdown === "genre" && (
            <div className="dropdown-content">
              {GENRES.map((g) => (
                <div
                  key={g.key}
                  className="dropdown-item"
                  onClick={() => {
                    navigate(`/genre/${g.key}`);
                    setOpenDropdown(null);
                  }}
                >
                  {g.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* LANGUAGES */}
        <div className="dropdown">
          <div
            className="dropdown-btn"
            onClick={() =>
              setOpenDropdown(openDropdown === "language" ? null : "language")
            }
          >
            Languages <IoMdArrowDropdown className="arrow-icon" />
          </div>

          {openDropdown === "language" && (
            <div className="dropdown-content">
              {LANGUAGES.map((l) => (
                <div
                  key={l.key}
                  className="dropdown-item"
                  onClick={() => {
                    navigate(`/language/${l.key}`);
                    setOpenDropdown(null);
                  }}
                >
                  {l.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <SearchBar onSearch={handleSearch} />
    </div>
  );
}
