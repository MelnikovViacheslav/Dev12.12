import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const EventForm = ({ event, onAddEvent, onClose }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title) return;


    const newEvent = {
      title,
      start: event.start,
      end: event.end || event.start,
    };


    onAddEvent(newEvent);
    setSuccessMessage(t('eventAddedSuccess'));

    setTitle('');
    setError('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder={t('enterEventTitle')}
          required 
        />
        <button type="submit">{t('add')}</button> {}
        <button type="button" onClick={onClose}>{t('close')}</button> {}
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>} {}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>} {}
    </div>
  );
};

export default EventForm;
