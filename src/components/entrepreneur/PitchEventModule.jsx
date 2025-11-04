import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function PitchEventModule() {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [pitchEvents, setPitchEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Get events from localStorage
      const events = JSON.parse(localStorage.getItem('pitchEvents') || '[]');
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      
      // Get registered events for current user
      const registrations = JSON.parse(localStorage.getItem('registeredPitchEvents') || '[]')
        .filter(reg => reg.userId === currentUser?.id);

      setPitchEvents(events);
      setRegisteredEvents(registrations);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = (eventId) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      toast.error('Please sign in to register for events');
      return;
    }

    const event = pitchEvents.find(e => e.id === eventId);
    if (!event) return;

    const newRegistration = {
      id: Date.now().toString(),
      eventId,
      userId: currentUser.id,
      registeredAt: new Date().toISOString(),
      status: 'pending'
    };

    const updatedRegistrations = [...registeredEvents, newRegistration];
    setRegisteredEvents(updatedRegistrations);
    localStorage.setItem('registeredPitchEvents', JSON.stringify(updatedRegistrations));
    toast.success('Successfully registered for the event!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Pitch Events</h2>
        <Link
          to="/pitch-events/create"
          className="px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 transition-colors"
        >
          Create New Event
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Available Events</h3>
          <div className="space-y-4">
            {pitchEvents.map(event => (
              <div key={event.id} className="border rounded-lg p-4 bg-white">
                <h4 className="font-medium">{event.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{new Date(event.date).toLocaleDateString()}</p>
                {event.venue && <p className="text-sm text-gray-600">📍 {event.venue}</p>}
                <button
                  onClick={() => handleRegister(event.id)}
                  className="mt-3 text-sm text-brand-600 hover:text-brand-700"
                >
                  Register →
                </button>
              </div>
            ))}
            {pitchEvents.length === 0 && (
              <p className="text-gray-500 text-center py-4">No events available</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Your Registrations</h3>
          <div className="space-y-4">
            {registeredEvents.map(reg => {
              const event = pitchEvents.find(e => e.id === reg.eventId);
              if (!event) return null;
              return (
                <div key={reg.id} className="border rounded-lg p-4 bg-white">
                  <h4 className="font-medium">{event.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                  <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-brand-100 text-brand-700">
                    {reg.status}
                  </span>
                </div>
              );
            })}
            {registeredEvents.length === 0 && (
              <p className="text-gray-500 text-center py-4">No registrations yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}