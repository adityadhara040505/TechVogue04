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

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/pitch-events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      console.log('Fetched events:', data);
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
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
    window.location.href = `/pitch-events/${clickInfo.event.id}`;
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
            events={events.map(event => ({
              id: event._id,
              title: event.title,
              start: event.date,
              className: new Date(event.date) > new Date() ? 'bg-blue-600' : 'bg-gray-500'
            }))}
            eventClick={handleEventClick}
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