import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Modal.css';

const EventForm = ({ event, onAddEvent, onClose, userid }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState(event.start || new Date());
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      setError(t('pleaseEnterTitle'));
      return;
    }

    const newEvent = {
      title,
      description,
      start,
      end: start,
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
        setError('');
        onClose();
      } else {
        setError(data.message || t('eventAddError'));
      }
      
    } catch (error) {
      console.error("Error occurred:", error);
      setError(t('eventAddError'));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={handleSubmit} className="event-form">
          <h2>{t('NewEvent')}</h2>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder={t('enterEventTitle')}
            required 
            className="form-input"
          />
          <input 
            type="text" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder={t('enterEventDescription')} 
            required 
            className="form-input"
          />
          
          <input type="hidden" value={start.toISOString()} />
          
          <button type="submit" className="submit-button">{t('add')}</button>
          <button type="button" onClick={onClose} className="close-button">{t('close')}</button>
          
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </form>
      </div>
    </div>
  );
};
//
export default EventForm;
