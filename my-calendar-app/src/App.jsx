import React, { useState } from 'react';
import MyCalendar from './components/Calendar'; 
import { useTranslation } from 'react-i18next';
import Register from './components/Register';
import Login from './components/Login';
import i18n from './i18n';

const App = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);

  const handleLogin = (username) => {
    setUser(username);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const changeLanguage = async (lng) => {
    console.log(`Attempting to change language to: ${lng}`);
    try {
      await i18n.changeLanguage(lng);
      console.log(`Language changed to: ${lng}`);
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  return (
    <div>
      <h1>{t('welcome')}</h1>

      {user ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Привет, {user}!</span>
          <button onClick={handleLogout}>{t('logout')}</button>
        </div>
      ) : (
        <div style={{ marginBottom: '20px' }}>
          <Register onRegister={handleLogin} />
          <Login onLogin={handleLogin} />
        </div>
      )}

      <MyCalendar />

      <div>
        <button onClick={() => changeLanguage('en')}>English</button>
        <button onClick={() => changeLanguage('ru')}>Русский</button>
      </div>
    </div>
  );
};

export default App;
