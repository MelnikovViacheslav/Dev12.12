import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const EventForm = ({ event, onAddEvent, onClose, userid }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState(event.start || new Date());
  const [end, setEnd] = useState(event.end || new Date());
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      setError(t('pleaseEnterTitle'));
      return;
    }

    // Создаем новое событие
    const newEvent = {
      title,
      description,
      start,
      end,
      userid,
    };

    try {
      const response = await fetch('http://localhost/Calendar/events.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "success") {
        onAddEvent(newEvent);
        setSuccessMessage(t('eventAddedSuccess'));
        setTitle('');
        setDescription('');
        setStart(new Date());
        setEnd(new Date());
        setError('');
      } else {
        setError(data.message || t('eventAddError'));
      }
      
    } catch (error) {
      console.error("Error occurred:", error);
      setError(t('eventAddError'));
    }
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
        <input 
          type="text" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder={t('enterEventDescription')} 
          required 
        />
        
        <label>{t('startDate')}</label>
        <input 
          type="datetime-local"
          value={start.toISOString().slice(0, 16)}
          onChange={(e) => setStart(new Date(e.target.value))}
          required
        />
        
        <label>{t('endDate')}</label>
        <input 
          type="datetime-local"
          value={end.toISOString().slice(0, 16)}
          onChange={(e) => setEnd(new Date(e.target.value))}
          required
        />

        <button type="submit">{t('add')}</button>
        <button type="button" onClick={onClose}>{t('close')}</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default EventForm;
