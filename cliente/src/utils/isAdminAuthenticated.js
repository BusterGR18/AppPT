import {jwtDecode} from 'jwt-decode';

const isAdminAuthenticated = () => {
    const token = localStorage.getItem('token');
    
    // Basic check to see if the token exists
    if (!token) {
      return false;
    }
    if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken.role === 'admin';
    }
  };
  
  export default isAdminAuthenticated;
