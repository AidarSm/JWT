import React from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import { getProfile, logoutUser } from '../../store/auth/authThunk';
import Login from './components/Login';
import { useNavigate } from 'react-router-dom';

const Main = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const profile = useSelector((state: RootState) => state.auth.profileData.profile);
  const isLoggedIn = useSelector((state: RootState) => !!state.auth.authData.accessToken);

  const renderProfile = () => (
    <div>
      <div>Вы успешно авторизовались, {profile}</div>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={() => dispatch(getProfile())}>update profile</button>
    </div>
  );

  return (
    <div>
      <h1>Main</h1>
      {isLoggedIn ? renderProfile() : <Login />}
    </div>
  );
};

export default Main;
