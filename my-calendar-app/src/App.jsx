import React, { useState } from 'react';
import MyCalendar from './components/Calendar'; 
import { useTranslation } from 'react-i18next';
import Register from './components/Register';
import Login from './components/Login';
import EventForm from './components/EventForm';
import i18n from './i18n';

const App = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const changeLanguage = async (lng) => {
    try {
      await i18n.changeLanguage(lng);
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  const handleSelectEvent = (event) => {

    setEventDetails(event);
  };

  return (
    <div>
      <h1>{t('welcome')}</h1>

      {user ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{t('Hello')}, {user.name}!</span>
          <button onClick={handleLogout}>{t('logout')}</button>
        </div>
      ) : (
        <div style={{ marginBottom: '20px' }}>
          <Register onRegister={handleLogin} />
          <Login onLogin={handleLogin} />
        </div>
      )}


      <MyCalendar userid={user ? user.id : null} onSelectEvent={handleSelectEvent} />


      {eventDetails && (
        <EventForm 
          event={eventDetails} 
          onAddEvent={() => { setEventDetails(null); }}
          onClose={() => setEventDetails(null)} 
          userid={user ? user.id : null}
        />
      )}

      <div>
        <button onClick={() => changeLanguage('en')}>English</button>
        <button onClick={() => changeLanguage('ru')}>Русский</button>
      </div>
    </div>
  );
};

export default App;
