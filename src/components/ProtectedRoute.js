import React from 'react';
import { Navigate } from 'react-router-dom';

class ProtectedRoute extends React.Component {
    render() {
        const { component: Component, user, ...props } = this.props

        return (
            user && user.role === 'ROLE_USER' ?
                <Component {...props} /> :
                <Navigate to="/login" replace />
        );
    }
}

export default ProtectedRoute;
