import React, { Component } from "react";
import { Navbar } from "react-bootstrap";
import { Link } from 'react-router-dom';

// import dashboardRoutes from "../../routes/dashboard.jsx";

class HomeHeader extends Component {
    constructor(props) {
        super(props);
        this.mobileSidebarToggle = this.mobileSidebarToggle.bind(this);
        this.state = {
            sidebarExists: false
        };
    }
    mobileSidebarToggle(e) {
        if (this.state.sidebarExists === false) {
            this.setState({
                sidebarExists: true
            });
        }
        e.preventDefault();
        document.documentElement.classList.toggle("nav-open");
        var node = document.createElement("div");
        node.id = "bodyClick";
        node.onclick = function () {
            this.parentElement.removeChild(this);
            document.documentElement.classList.toggle("nav-open");
        };
        document.body.appendChild(node);
    }

    render() {
        return (
            <Navbar fluid>
                <Navbar.Header>
                    <Navbar.Brand>
                        Isma Chat Apps
                    </Navbar.Brand>
                    <Navbar.Toggle onClick={this.mobileSidebarToggle} />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Navbar.Brand className="pull-right">
                        <Link to='/register'>
                            Register
                        </Link>
                    </Navbar.Brand>
                    <Navbar.Brand className="pull-right">
                        <Link to='/login'>
                            Login
                        </Link>
                    </Navbar.Brand>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default HomeHeader;
