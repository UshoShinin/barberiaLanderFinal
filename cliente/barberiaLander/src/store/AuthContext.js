import React, { useState } from "react";

const AuthContext = React.createContext({
  user: { ciUsuario: "", nombre: "", rol: "", telefono: "" },
  isLoggedIn: false,
  login: (user) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  let initialUser = localStorage.getItem('user');
  initialUser = initialUser!==undefined?JSON.parse(initialUser):null;
  const [user, setUser] = useState(initialUser);

  const userIsLoggedIn = user !== null;

  const loginHandler = (user) => {
    setUser(user);
    localStorage.setItem('user',JSON.stringify(user))
  };
  const logoutHandler = () => {
    setUser(null);
    localStorage.removeItem('user')
  };
  const contextValue = {
    user: user,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
