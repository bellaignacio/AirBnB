import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);

    return (
        <div className="nav-header">
            <NavLink className="logo-title" exact to="/"><i className="fas fa-couch" /><h1>SpotSurfing</h1></NavLink>
            <div className="menu-header">
                {sessionUser && (
                    <NavLink to="/spots/new">Create a New Spot</NavLink>
                )}
                {isLoaded && (
                    <ProfileButton user={sessionUser} />
                )}
            </div>

        </div>
    );
}

export default Navigation;
