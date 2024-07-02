
const Auth = {
  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    return Auth.getToken() !== null;
  },

  authHeader: () => {
    const token = Auth.getToken();
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  },

  isLoggedIn: () => {
    return !!Auth.getToken();
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getRole: () => {
    const token = Auth.getToken();
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken.userId ? 'user' :
             decodedToken.adminId ? 'admin' :
             decodedToken.superAdminId ? 'superadmin' : null;
    }
    return null;
  },

  getUserId: () => {
    const token = Auth.getToken();
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken.userId || null;
    }
    return null;
  },

  getAdminId: () => {
    const token = Auth.getToken();
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken.adminId || null;
    }
    return null;
  },

  getSuperAdminId: () => {
    const token = Auth.getToken();
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken.superAdminId || null;
    }
    return null;
  },

  
};

export default Auth;