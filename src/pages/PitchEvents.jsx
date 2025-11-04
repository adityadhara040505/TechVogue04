import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function PitchEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming'); // upcoming, past, all

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/pitch-events?filter=${filter}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900"
          >
            Pitch Events
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 md:mt-0 flex space-x-4"
          >
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
            >
              <option value="upcoming">Upcoming Events</option>
              <option value="past">Past Events</option>
              <option value="all">All Events</option>
            </select>
            <Link
              to="/pitch-events/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
            >
              Create Event
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event, index) => (
            <EventCard key={event._id} event={event} index={index} />
          ))}
        </div>

        {events.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">No events found</p>
            <Link
              to="/pitch-events/create"
              className="mt-4 inline-flex items-center text-brand-600 hover:text-brand-700"
            >
              Create your first event →
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function EventCard({ event, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            new Date(event.date) > new Date() 
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {new Date(event.date) > new Date() ? 'Upcoming' : 'Past'}
          </span>
          <span className="text-sm text-gray-500">
            {new Date(event.date).toLocaleDateString()}
          </span>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {event.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {event.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-2">
              {event.attendees?.slice(0, 3).map((attendee, i) => (
                <img
                  key={i}
                  src={attendee.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(attendee.name)}
                  alt={attendee.name}
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              ))}
              {event.attendees?.length > 3 && (
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                  +{event.attendees.length - 3}
                </div>
              )}
            </div>
            <span className="text-sm text-gray-500">
              {event.attendees?.length || 0} attending
            </span>
          </div>
          
          <Link
            to={`/pitch-events/${event._id}`}
            className="text-brand-600 hover:text-brand-700 font-medium text-sm"
          >
            View Details →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}