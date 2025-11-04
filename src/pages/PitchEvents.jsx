import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import '../styles/calendar.css';

export default function PitchEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('Month');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    try {
      // Get events from localStorage
      const storedEvents = JSON.parse(localStorage.getItem('pitchEvents') || '[]');
      console.log('Fetched events:', storedEvents);
      
      // Transform the data for FullCalendar
      const transformedEvents = storedEvents.map(event => ({
        id: event.id,
        title: event.title,
        start: event.date,
        end: event.endDate || event.date,
        description: event.description,
        location: event.venue,
        extendedProps: {
          status: event.status,
          maxParticipants: event.maxParticipants,
          requirements: event.requirements,
          format: event.format
        },
        className: getEventClassName(event)
      }));
      
      setEvents(transformedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };
  
  const getEventClassName = (event) => {
    const baseClass = 'px-2 py-1 rounded-lg font-medium text-sm';
    if (new Date(event.date) > new Date()) {
      return `${baseClass} bg-blue-100 text-blue-800 border border-blue-200`;
    } else {
      return `${baseClass} bg-gray-100 text-gray-800 border border-gray-200`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    toast(
      <div>
        <h3 className="font-bold text-lg mb-2">{event.title}</h3>
        <p className="text-sm mb-1">
          {new Date(event.start).toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
        {event.extendedProps.location && (
          <p className="text-sm mb-1">📍 {event.extendedProps.location}</p>
        )}
        {event.extendedProps.description && (
          <p className="text-sm text-gray-600">{event.extendedProps.description}</p>
        )}
        <button
          onClick={() => window.location.href = `/pitch-events/${event.id}`}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
        >
          View Details →
        </button>
      </div>,
      {
        duration: 5000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#ffffff',
          color: '#1f2937',
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Pitch Events</h1>
          <div className="flex items-center gap-4">
            <select 
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              defaultValue="Upcoming Events"
            >
              <option>Upcoming Events</option>
              <option>Past Events</option>
              <option>All Events</option>
            </select>
            <Link
              to="/pitch-events/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Create Event
            </Link>
          </div>
        </div>

        {/* Calendar Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 border rounded-md hover:bg-gray-50">&lt;</button>
            <button className="px-3 py-2 border rounded-md hover:bg-gray-50">&gt;</button>
            <button className="px-4 py-2 text-sm border rounded-md bg-blue-100 text-blue-700 hover:bg-blue-50">
              Today
            </button>
          </div>
          <h2 className="text-xl font-semibold">November 2025</h2>
          <div className="flex items-center gap-2">
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                view === 'Month' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setView('Month')}
            >
              Month
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                view === 'Week' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setView('Week')}
            >
              Week
            </button>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-lg shadow">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={view === 'Month' ? 'dayGridMonth' : 'timeGridWeek'}
            headerToolbar={false}
            events={events}
            eventClick={handleEventClick}
            eventContent={(eventInfo) => ({
              html: `
                <div class="p-1 truncate">
                  <div class="font-medium">${eventInfo.event.title}</div>
                  ${eventInfo.event.extendedProps.location ? 
                    `<div class="text-xs text-gray-600">${eventInfo.event.extendedProps.location}</div>` : 
                    ''}
                </div>
              `
            })}
            eventDidMount={(info) => {
              info.el.setAttribute('title', `
                ${info.event.title}
                Time: ${new Date(info.event.start).toLocaleTimeString()}
                Location: ${info.event.extendedProps.location || 'TBD'}
                ${info.event.extendedProps.description || ''}
              `.trim());
            }}
            dayMaxEvents={3}
            height="800px"
            contentHeight="auto"
            expandRows={true}
            stickyHeaderDates={true}
            firstDay={1}
            nowIndicator={true}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: false
            }}
            slotMinTime="08:00:00"
            slotMaxTime="20:00:00"
          />
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No events found</p>
            <p className="text-gray-600">Click the Create Event button to add your first event</p>
          </div>
        )}
      </div>
    </div>
  );
};


;