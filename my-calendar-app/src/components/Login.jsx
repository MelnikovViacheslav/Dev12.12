import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Login = ({ onLogin }) => {
  const { t } = useTranslation(); 
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const response = await fetch('http://localhost/Calendar/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ Login: login, Password: password }),
    });
    
    const data = await response.json();
    alert(data.message);

    if (data.success) {
      onLogin(login);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input 
        type="text" 
        placeholder={t('login')}
        value={login} 
        onChange={(e) => setLogin(e.target.value)} 
        required 
      />
      <input 
        type="password" 
        placeholder={t('password')}
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        required 
      />
      <button type="submit">{t('login')}</button>
    </form>
  );
};

export default Login;
