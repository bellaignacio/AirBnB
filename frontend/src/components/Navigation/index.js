import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);

    return (
        <div className="nav-header">
            <div className="logo-title">
                <NavLink exact to="/"><span><i className="fas fa-couch" /></span>SpotSurfing</NavLink>
            </div>
            <div className="menu-header">
                {sessionUser && (
                    <div>
                        <NavLink to="/spots/new">Create a New Spot</NavLink>
                    </div>
                )}
                {isLoaded && (
                    <div>
                        <ProfileButton user={sessionUser} />
                    </div>
                )}
            </div>

        </div>
    );
}

export default Navigation;
