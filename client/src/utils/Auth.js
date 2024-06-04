const Auth = {
  getToken: () => {
    return localStorage.getItem('token');
  },

  authHeader: () => {
    const token = Auth.getToken();
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  }
  
};

export default Auth;