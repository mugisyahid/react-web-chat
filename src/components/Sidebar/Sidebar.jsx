/* eslint-disable */
import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import HeaderLinks from "../Header/HeaderLinks.jsx";
import { Redirect } from 'react-router-dom';

import imagine from "../../assets/img/sidebar-3.jpg";
import logo from "../../assets/img/reactlogo.png";

import dashboardRoutes from "../../routes/dashboard.jsx";


Array.prototype.kontains = function (obj) {
  var i = this.length;
  while (i--) {
    if (obj.toLowerCase().includes(this[i].toLowerCase().trim())) {
      return true;
    }
  }
  return false;
}

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth
    };
  }
  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  }
  updateDimensions() {
    this.setState({ width: window.innerWidth });
  }
  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }
  render() {
    const u = window.localStorage.getItem('user')
    if (u === 'undefined' || !u) {
      return <Redirect to='/login' />;
    }
    const user = JSON.parse(u)
    if (user.STATUS === 'INCOMPLETE') {
      return <Redirect to={'/updateUser/' + user.ID + '?message=Your+profile+is+incomplete.+Please+update.'} />;
    }
    const roles = user.PRIVILEGES_ROLES.split(',')

    const sidebarBackground = {
      backgroundImage: "url(" + imagine + ")"
    };
    return (
      <div
        id="sidebar"
        className="sidebar"
        data-color="black"
        data-image={imagine}
      >
        <div className="sidebar-background" style={sidebarBackground} />
        <div className="logo">
          <a
            href="https://ismachat.herokuapp.com/"
            className="simple-text logo-mini"
          >
            <div className="logo-img">
              <img src={logo} alt="logo_image" />
            </div>
          </a>
          <a
            href="https://ismachat.herokuapp.com/"
            className="simple-text logo-normal"
          >
            Isma Chat
          </a>
        </div>
        <div className="sidebar-wrapper">
          <ul className="nav">
            {this.state.width <= 991 ? <HeaderLinks /> : null}
            {dashboardRoutes.map((prop, key) => {
              if (!prop.redirect)
                return (
                  <li
                    className={
                      `${prop.upgrade
                        ? "active active-pro"
                        : this.activeRoute(prop.path)}
                      ${roles.kontains(prop.display) ? "" : "hide"}`
                    }
                    key={key}
                  >
                    <NavLink
                      to={prop.path}
                      className="nav-link"
                      activeClassName="active"
                    >
                      <i className={prop.icon} />
                      <p>{prop.name}</p>
                    </NavLink>
                  </li>
                );
              return null;
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default Sidebar;
