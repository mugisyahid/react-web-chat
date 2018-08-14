import React, { Component } from "react";
import { NavItem, Nav, NavDropdown, MenuItem } from "react-bootstrap";
import { Redirect, withRouter, Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert'; // Import
import { FIRST_LOAD, LOGOUT, UPDATE_TIME, UPDATE_TIME_NOTIF } from "../../constants/actionTypes";
import { connect } from 'react-redux';
import moment from 'moment';
import agent from '../../agent';


const mapStateToProps = state => ({ ...state, notif: state.common.notif });
const mapDispatchToProps = dispatch => ({
  onClickLogout: () =>
    dispatch({ type: LOGOUT }),
  onLoad: (payload) =>
    dispatch({ type: FIRST_LOAD, payload }),
  updateTime: (payload) => {
    if (Math.ceil(payload.sec) % 15 === 0) {
      const user = JSON.parse(window.localStorage.getItem('user'))
      if (user) {
        Promise.resolve(agent.Notif.getNotif(user.ID, user.PRIVILEGES_ROLES)).then(function (payload2) {
          dispatch({ type: UPDATE_TIME_NOTIF, payload, payload2 })
        }, function (value) {
          // not called
        })
      }
    } else {
      dispatch({ type: UPDATE_TIME, payload })
    }
  }
});

class HeaderLinks extends Component {
  // eslint-disable-next-line
  constructor() {
    super()
  }

  componentWillMount() {
    // set date in common
    const user = JSON.parse(window.localStorage.getItem('user'))
    this.props.onLoad(Promise.all([agent.Notif.getDate(), agent.Notif.getNotif(user.ID, user.PRIVILEGES_ROLES)]))
  }

  componentDidMount() {
    // update every second
    this.interval = setInterval(() => {
      const date = this.calculateCountdown(moment(this.props.common.currentDate).format('YYYY-MM-DDTHH:mm:ss.SSS'));
      date ? this.props.updateTime(date) : this.stop();
    }, 1000)
  }

  calculateCountdown(endDate) {
    let diff = (Date.parse(new Date()) - Date.parse(endDate)) / 1000;

    // clear countdown when date is reached
    if (diff <= 0) return false;

    const timeLeft = {
      years: 0,
      days: 0,
      hours: 0,
      min: 0,
      sec: 0,
      millisec: 0,
    };

    // calculate time difference between now and expected date
    if (diff >= (365.25 * 86400)) { // 365.25 * 24 * 60 * 60
      timeLeft.years = Math.floor(diff / (365.25 * 86400));
      diff -= timeLeft.years * 365.25 * 86400;
    }
    if (diff >= 86400) { // 24 * 60 * 60
      timeLeft.days = Math.floor(diff / 86400);
      diff -= timeLeft.days * 86400;
    }
    if (diff >= 3600) { // 60 * 60
      timeLeft.hours = Math.floor(diff / 3600);
      diff -= timeLeft.hours * 3600;
    }
    if (diff >= 60) {
      timeLeft.min = Math.floor(diff / 60);
      diff -= timeLeft.min * 60;
    }
    timeLeft.sec = diff;

    return timeLeft;
  }

  stop() {
    clearInterval(this.interval);
  }

  addLeadingZeros(value) {
    value = String(value);
    while (value.length < 2) {
      value = '0' + value;
    }
    return value;
  }


  render() {

    const user = JSON.parse(window.localStorage.getItem('user'))
    if (!user) {
      return <Redirect to='/login' />;
    }
    const logOut = () => {
      confirmAlert({
        title: `Logging out`,
        message: 'Are you sure to do this?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => this.props.onClickLogout()
          },
          {
            label: 'No',
            onClick: () => { }
          }
        ]
      })
    };

    const expired = window.localStorage.getItem('expiredDate')
    if (expired < moment(new Date()).valueOf()) {
      this.props.onClickLogout()
    }


    let arr = []
    let i = 0
    if (this.props.common.notif.length > 0) {
      this.props.common.notif.forEach((n, idx) => {
        // if (user.PRIVILEGES_ROLES === 'Creator' && n.STATUS !== 'Created') {
        //   arr[i++] = n
        // } else if (user.PRIVILEGES_ROLES === 'Approver') {
        //   arr[i++] = n
        // } else {
          arr[i++] = n
        // }
      })
    }

    const notification = (
      <div>
        <i className="fa fa-globe" />
        <b className="caret" />
        <span className="notification">{arr.length}</span>
        <p className="hidden-lg hidden-md">Notification</p>
      </div>
    );

    return (
      <div>
        {user.STATUS.includes('INCOMPLETE') ? '' :
          <div>
            <Nav>
              <NavItem eventKey={1} href="https://ismachat.herokuapp.com/">
                <i className="fa fa-dashboard" />
                <p className="hidden-lg hidden-md">Home</p>
              </NavItem>
              <NavDropdown
                title={notification}
                noCaret
                id="basic-nav-dropdown"
              >
                <MenuItem>Notification</MenuItem>
                <MenuItem divider />
                {arr.map((prop, key) => {
                  return <MenuItem><Link to={`/viewTicket/${prop.TICKET_ID}`}>{prop.TICKET}</Link></MenuItem>
                })}

              </NavDropdown>
            </Nav>
            <Nav pullRight>
              <NavDropdown
                eventKey={2}
                title="Profile"
                id="basic-nav-dropdown-right"
              >
                <MenuItem eventKey={2.1}>Logged in as: {user ? user.USER_ID : ""}</MenuItem>
                <MenuItem divider />
                <MenuItem eventKey={2.1}>Name: {user ? user.NAME : ""}</MenuItem>
                <MenuItem eventKey={2.1}>Email: {user ? user.CONTACT_EMAIL : ""}</MenuItem>
                <MenuItem eventKey={2.2}>Roles: {user ? user.PRIVILEGES_ROLES : ""}</MenuItem>
              </NavDropdown>
              <NavItem onClick={logOut}>
                Log out
          </NavItem>
            </Nav>
          </div>
        }
      </div>
    );
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HeaderLinks));