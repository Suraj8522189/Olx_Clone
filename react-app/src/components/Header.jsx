import { Link, useNavigate } from 'react-router-dom'
import './Header.css'
import { FaSearch } from "react-icons/fa"
import { useState } from 'react'
import sell from '../assets/sell.jpg'

function Header(props) {
  const [loc, setLoc] = useState('')
  const [showOver, setshowOver] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    navigate('/login')
  }

  const locations = [
  { latitude: 28.6139, longitude: 77.2090, placeName: "New Delhi, Delhi" },
  { latitude: 19.0760, longitude: 72.8777, placeName: "Mumbai, Maharashtra" },
  { latitude: 30.1290, longitude: 77.2674, placeName: "Yamunanagar, Haryana" },
  { latitude: 30.7333, longitude: 76.7794, placeName: "Chandigarh, Chandigarh" },
  { latitude: 28.4595, longitude: 77.0266, placeName: "Gurugram, Haryana" }
];

  return (
    <div className="header-container d-flex justify-content-between">
      <div className="header">
        <Link className="links" to="/">
          <img src={sell} alt="logo" className="logo" />
        </Link>

        <select
          value={loc}
          onChange={(e) => {
            localStorage.setItem('userLoc', e.target.value)
            setLoc(e.target.value)
          }}
        >
          <option value="">Select Location</option>
          {locations.map((item, index) => (
            <option
              key={item.placeName + index}
              value={`${item.latitude},${item.longitude}`}
            >
              {item.placeName}
            </option>
          ))}
        </select>

        <div className="search-wrap">
          <input
            className="search"
            type="text"
            value={props?.search || ''}
            onChange={(e) => props?.handlesearch?.(e.target.value)}
            placeholder="Search products..."
          />
          <button
            className="search-btn"
            onClick={() => props?.handleClick?.()}
            aria-label="search"
          >
            <FaSearch color='red'/>
          </button>
        </div>
      </div>

      <div className="profile-wrap">
        <div
          onClick={() => setshowOver(!showOver)}
          className="profile-circle"
        >
          N
        </div>

        {showOver && (
          <div className="profile-dropdown">
            {!!localStorage.getItem('token') && (
            <Link to="/my-profile">PROFILE</Link>
            )}
            {!!localStorage.getItem('token') && (
              <Link to="/add-products">ADD PRODUCT</Link>
            )}
            {!!localStorage.getItem('token') && (
              <Link to="/liked-products">FAVOURITES</Link>
            )}
            {!!localStorage.getItem('token') && (
              <Link to="/my-products">MY ADS</Link>
            )}
            {!localStorage.getItem('token') ? (
              <Link to="/login">LOGIN</Link>
            ) : (
              <button onClick={handleLogout}>LOGOUT</button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Header



