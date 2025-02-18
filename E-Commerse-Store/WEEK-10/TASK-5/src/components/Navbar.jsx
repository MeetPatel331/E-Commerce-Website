import React, { useEffect, useState } from "react";
import { FaBars, FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { Link, Navigate, useNavigate } from "react-router-dom";
import logo from "../images/horizontal.avif";
import Cart from "../pages/Cart";
import axios from "axios";
import { useCart } from "./CartProvider";

// Open cart
export const openCart = () => {
  document.getElementById("mySidenav").style.width = "400px";
  document.getElementById("overlay").style.display = "block";
  document.body.style.overflow = "hidden";
};

// Close cart
export function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("overlay").style.display = "none";
  document.body.style.overflow = "auto";
}



const Navbar = () => {
  const navigate = useNavigate();
  const [q, Setq] = useState("");
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [quantity, setCartQuantity] = useState(0)
  const { cart, BASE_URL, handleAdminLogin, admin } = useCart()
  // const [admin, SetisAdmin] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsNavbarVisible(false);
      } else {
        setIsNavbarVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  useEffect(() => {
    let q = 0;
    for (let i of cart) {
      q += i.quantity
    }
    setCartQuantity(q)
  }, [cart]);


  const Auth = () => {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    if (accessToken && refreshToken) {
      axios.post(`${BASE_URL}/check/verifyAccess`, {}, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      }).then((res) => {
        if (res.data.success) {
          handleAdminLogin()
          if (admin) {
            navigate('/admin')
          }
          else {
            navigate(`/profile/${res.data.id}`)
          }
        }
      }).catch((err) => {
        console.log(err)
        axios.post(`${BASE_URL}/check/refreshToekn`, {}, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${refreshToken}`
          }
        }).then((res) => {
          if (res.data.success) {
            localStorage.setItem('accessToken', res.data.accessToken)
            if (localStorage.getItem('admin')) {
              navigate('/admin')
            }
            else {
              navigate(`/profile/${res.data.id}`)
            }
          }
        }).catch((err) => {
          navigate('/login')
        })
      }).catch((err) => {
        console.log(err)
        navigate('/login')
      })
    }
    else {
      navigate('/login')
    }
  }

  useEffect(() => {
    handleAdminLogin()
  }, [admin])
  useEffect(() => {
    handleAdminLogin()
  }, [])

  return (
    <div style={{ position: "relative" }}>

      <div className="overlay" id="overlay" onClick={closeNav}></div>
      <div className="sidenav" id="mySidenav">
        <div className="fixed">
          <p>{`Your Cart(${quantity})`}</p>
          <a onClick={closeNav}>
            <ImCross />
          </a>
        </div>
        <div style={{ marginTop: "50px" }}>
          <Cart />
        </div>
      </div>
      <div
        className={`headerContainer ${isNavbarVisible ? "visible" : "hidden"}`}
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          transition: "transform 0.3s ease",
          transform: isNavbarVisible ? "translateY(0)" : "translateY(-100%)",
          zIndex: 1000,
        }}
      >

        <div
          style={{
            backgroundColor: "black",
            color: "white",
            textAlign: "center",
            padding: "10px",
          }}
          className="top"
        >
          Free Shipping
        </div>
        <div className='searchOverlay' id='searchOverlay'>
          <div className='search'>
            <input type="search" onChange={(e) => Setq(e.target.value)} placeholder='Search' />
            <FaSearch className='searchIcon' onClick={() => navigate(`/search/${q}/`)} />
            <button onClick={() => {
              document.getElementsByClassName('navHeader')[0].style.display = 'flex';
              document.getElementById('searchOverlay').style.display = 'none'
            }}><ImCross /></button>
          </div>
        </div>


        <div className="navHeader">
          <div className="logo">
            <ul>
              <li>
                <Link className="title" to="/">
                  <img src={logo} style={{ height: "50px" }} />
                </Link>
              </li>
            </ul>
          </div>
          <div className="navs">
            <ul>
              <li>
                <Link to="/" className="tab">
                  HOME
                </Link>
              </li>
              <li>
                <Link className="tab">OUR ROOTS</Link>
              </li>
              {
                !admin ? <li>
                  <Link className="tab" to="/products">
                    OUR PRODUCTS
                  </Link>
                </li> : ''
              }
              <li>
                <Link className="tab">PROCESS</Link>
              </li>
              <li>
                <Link className="tab">CONTACT</Link>
              </li>
            </ul>
          </div>
          <div className="icons">
            <ul>
              {
                !admin ?
                  <li>
                    <button
                      className="tab2"
                      onClick={() => {
                        document.getElementsByClassName(
                          "navHeader"
                        )[0].style.display = "none";
                        document.getElementById("searchOverlay").style.display =
                          "block";
                      }}
                    >
                      {<FaSearch />}
                    </button>
                  </li> : ''
              }
              <li>
                <button className="tab2" onClick={Auth}>
                  {<FaUser />}
                </button>
              </li>
              {
                !admin ? <li className="notification">
                  <button className="tab2" onClick={openCart}>
                    {<FaShoppingCart />}
                  </button>
                  {
                    quantity > 0 ? <span>{quantity}</span> : ''
                  }
                </li> : ''
              }
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="mobilenav">
        <div className="navs">
          <button>{<FaBars />}</button>
          <button>{<FaSearch />}</button>
        </div>
        <div>
          <Link className="title">
            <img src={logo} style={{ height: "50px" }} />
          </Link>
        </div>
        <div className="navs">
          <button onClick={() => navigate("/login")}>{<FaUser />}</button>
          <button>{<FaShoppingCart />}</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
