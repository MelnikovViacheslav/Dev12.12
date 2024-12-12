import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import EventForm from './EventForm';
import { useTranslation } from 'react-i18next';

const locales = { ru, en: enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const MyCalendar = () => {
  const { t, i18n } = useTranslation();
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleSelectSlot = ({ start }) => {
    setSelectedEvent({ start, end: start });
    setShowForm(true);
  };

  const handleAddEvent = (event) => {
    setEvents((prevEvents) => [...prevEvents, event]);
    setShowForm(false);
  };


  const currentLocale = i18n.language === 'ru' ? locales.ru : locales.en;

  return (
    <div>
      <h2>{t('calendar')}</h2>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectSlot={handleSelectSlot}
        selectable
        messages={{
          today: t('today'),
          back: t('back'),
          next: t('next'),
          month: t('month'), 
          week: t('week'),
          day: t('day'),
          agenda: t('agenda'),
        }}
        components={{
          toolbar(props) {
            return (
              <div>
                <span className="rbc-toolbar-label">{format(props.date, 'MMMM yyyy', { locale: currentLocale })}</span>
                <span className="rbc-btn-group">
                  <button type="button" onClick={() => props.onNavigate('TODAY')}>{t('today')}</button>
                  <button type="button" onClick={() => props.onNavigate('PREV')}>{t('back')}</button>
                  <button type="button" onClick={() => props.onNavigate('NEXT')}>{t('next')}</button>
                  <button type="button" onClick={() => props.onView('month')}>{t('month')}</button>
                  <button type="button" onClick={() => props.onView('week')}>{t('week')}</button>
                  <button type="button" onClick={() => props.onView('day')}>{t('day')}</button>
                  <button type="button" onClick={() => props.onView('agenda')}>{t('agenda')}</button>
                </span>
              </div>
            );
          },
        }}
      />

      {showForm && (
        <EventForm 
          event={selectedEvent} 
          onAddEvent={handleAddEvent} 
          onClose={() => setShowForm(false)} 
        />
      )}
    </div>
  );
};

export default MyCalendar;
