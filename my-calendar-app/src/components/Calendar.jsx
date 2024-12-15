import React, { useState, useEffect } from 'react';
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

const MyCalendar = ({ userid }) => {
  const { t, i18n } = useTranslation();
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);


  useEffect(() => {
    const fetchEvents = async () => {
      if (!userid) return;
      try {
        const response = await fetch(`http://localhost/Calendar/events.php?userid=${userid}`);
        const data = await response.json();
        
        if (data.status === "success") {
          const formattedEvents = data.events.map(event => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end),
          }));
          setEvents(formattedEvents);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchEvents();
  }, [userid]);

  const handleSelectSlot = ({ start }) => {
    setSelectedEvent({ start, end: start });
    setShowForm(true);
  };

  const handleAddEvent = async (event) => {
    if (!userid) {
      console.error("User not authenticated");
      return;
    }

    const newEvent = {
      ...event,
      userid,
    };

    try {
      const response = await fetch('http://localhost/Calendar/events.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });

      const data = await response.json();

      if (data.status === "success") {
        setEvents((prevEvents) => [...prevEvents, newEvent]);
      } else {
        console.error(data.message);
      }

      setShowForm(false);
      setSelectedEvent(null);

    } catch (error) {
      console.error("An error occurred:", error);
    }
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
          onClose={() => {
            setShowForm(false);
            setSelectedEvent(null);
          }} 
          userid={userid}
        />
      )}
    </div>
  );
};

export default MyCalendar;
