import {Navigate} from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {


  const logged = window.localStorage.getItem("user")

     if (!logged) {

       return <Navigate to={'/login'}/>;
     }

  return children
};

