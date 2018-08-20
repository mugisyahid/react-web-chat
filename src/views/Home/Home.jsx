import React, { Component } from "react";
import { connect } from 'react-redux';

import HomeHeader from '../../components/HomeHeader/HomeHeader';

import devicePic from '../../assets/image/device.jpg'

import Footer from '../../components/Footer/Footer'


const mapStateToProps = state => ({ ...state });
const mapDispatchToProps = dispatch => ({
});

class Home extends Component {
    componentWillMount() {
    }

    componentWillUnmount() {
    }

    render() {

        return (<div className="container" color="dark">
            <HomeHeader />
            <h1 style={{textAlign: 'center'}}> Your private chatting Apps </h1>
            <img src={devicePic} alt={'Platform'} height="80%"/>
            <Footer />
        </div>);
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Home);
