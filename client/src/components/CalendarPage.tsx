import React, { useState, useEffect } from 'react';
import { 
  IconCalendar,
  IconPlus,
  IconUser,
  IconMail,
  IconPhone,
  IconClock,
  IconMapPin,
  IconMessage,
  IconCheck,
  IconX,
  IconFilter,
  IconRefresh,
  IconEye,
  IconTestPipe,
  IconSparkles,
  IconList,
  IconCalendarEvent,
  IconEdit,
  IconTrash,
  IconAlertTriangle
} from '@tabler/icons-react';

// TypeScript interfaces matching your Go API
interface CalendarEvent {
  cname: string;
  estart: string; // ISO date string from Go
  eend: string;   // ISO date string from Go
  property: string;
}

interface BookingFormData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  preferredDate: string;
  preferredTime: string;
  preferredLocation: string;
  message: string;
}

// API Service for your Go backend
const CalendarAPI = {
  // Get events from your Go API
  async getEvents(): Promise<CalendarEvent[]> {
    try {
      const response = await fetch('http://localhost:8080/api/calendar/show');
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  },

  // Send new booking to your Go API
  async createBooking(bookingData: BookingFormData): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:8080/api/calendar/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cname: bookingData.clientName,
          estart: new Date(bookingData.preferredDate + 'T' + bookingData.preferredTime + ':00'),
          eend: new Date(new Date(bookingData.preferredDate + 'T' + bookingData.preferredTime + ':00').getTime() + 60 * 60 * 1000), // +1 hour
          property: bookingData.preferredLocation
        })
      });
      
      if (!response.ok) throw new Error('Failed to create booking');
      return true;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }
};

export function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [conflicts, setConflicts] = useState<CalendarEvent[]>([]);
  const [formData, setFormData] = useState<BookingFormData>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    preferredDate: '',
    preferredTime: '',
    preferredLocation: '',
    message: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await CalendarAPI.getEvents();
      console.log('Fetched events:', data);
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check for booking conflicts
  const checkConflicts = (date: string, time: string): boolean => {
    const bookingDateTime = new Date(date + 'T' + time + ':00');
    const bookingEnd = new Date(bookingDateTime.getTime() + 60 * 60 * 1000); // +1 hour
    
    const conflictingEvents = events.filter((event: CalendarEvent) => {
      const eventStart = new Date(event.estart);
      const eventEnd = new Date(event.eend);
      
      // Check if times overlap
      return (bookingDateTime < eventEnd && bookingEnd > eventStart);
    });
    
    setConflicts(conflictingEvents);
    return conflictingEvents.length > 0;
  };

  const generateRandomBooking = () => {
    const names = ['Jan Novák', 'Petra Svobodová', 'Tomáš Dvořák', 'Anna Nováková', 'Pavel Procházka'];
    const emailNames = ['jan.novak', 'petra.svobodova', 'tomas.dvorak', 'anna.novakova', 'pavel.prochazka'];
    const properties = ['Luxusní vila Praha 6', 'Moderní byt Brno centrum', 'Rodinný dům Karlovy Vary', 'Penthouse Ostrava', 'Chata Krkonoše'];
    const messages = [
      'Zájem o prohlídku nemovitosti',
      'Chtěl bych se dozvědět více informací',
      'Plánuji koupi, potřebuji konzultaci',
      'Zajímá mě financování nemovitosti',
      'Chtěl bych prodiskutovat nabídku'
    ];

    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() + Math.floor(Math.random() * 30) + 1);
    
    const hours = 9 + Math.floor(Math.random() * 8); // 9-16 hours
    const minutes = Math.random() < 0.5 ? '00' : '30';
    const randomIndex = Math.floor(Math.random() * names.length);

    setFormData({
      clientName: names[randomIndex],
      clientEmail: `${emailNames[randomIndex]}@email.cz`,
      clientPhone: `+420 ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 900 + 100)}`,
      preferredDate: randomDate.toISOString().split('T')[0],
      preferredTime: `${hours.toString().padStart(2, '0')}:${minutes}`,
      preferredLocation: properties[Math.floor(Math.random() * properties.length)],
      message: messages[Math.floor(Math.random() * messages.length)]
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Check for conflicts when date or time changes
    if (name === 'preferredDate' || name === 'preferredTime') {
      const date = name === 'preferredDate' ? value : formData.preferredDate;
      const time = name === 'preferredTime' ? value : formData.preferredTime;
      
      if (date && time) {
        checkConflicts(date, time);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Final conflict check
    const hasConflicts = checkConflicts(formData.preferredDate, formData.preferredTime);
    if (hasConflicts) {
      setSubmitStatus('error');
      return;
    }

    setSubmitting(true);
    setSubmitStatus('idle');

    try {
      await CalendarAPI.createBooking(formData);
      setSubmitStatus('success');
      setFormData({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        preferredDate: '',
        preferredTime: '',
        preferredLocation: '',
        message: ''
      });
      setConflicts([]);
      fetchEvents(); // Refresh events
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch (error) {
      console.error('Error creating booking:', error);
      setSubmitStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setSelectedEvent(null);
    setShowDetail(false);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormData({
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      preferredDate: '',
      preferredTime: '',
      preferredLocation: '',
      message: ''
    });
    setSubmitStatus('idle');
    setConflicts([]);
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - startOfMonth.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dayEvents = events.filter((event: CalendarEvent) => {
        const eventDate = new Date(event.estart);
        return eventDate.toDateString() === currentDate.toDateString();
      });
      
      days.push({
        date: new Date(currentDate),
        events: dayEvents,
        isCurrentMonth: currentDate.getMonth() === today.getMonth(),
        isToday: currentDate.toDateString() === today.toDateString()
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  // Filter events by selected date
  let filteredEvents: CalendarEvent[] = events;
  if (selectedDate) {
    filteredEvents = events.filter((event: CalendarEvent) => {
      const eventDate = new Date(event.estart);
      return eventDate.toISOString().split('T')[0] === selectedDate;
    });
  }

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('cs-CZ'),
      time: date.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-300/10 to-purple-300/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                <IconCalendar className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  Kalendář schůzek
                </h1>
                <p className="text-gray-600 mt-2">Spravujte rezervace a schůzky s klienty</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={generateRandomBooking}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 px-4 py-2 rounded-xl flex items-center gap-2"
              >
                <IconTestPipe className="h-4 w-4" />
                Test Data
              </button>
              
              <button
                onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 px-4 py-2 rounded-xl flex items-center gap-2"
              >
                {viewMode === 'list' ? (
                  <>
                    <IconCalendarEvent className="h-4 w-4" />
                    Kalendář
                  </>
                ) : (
                  <>
                    <IconList className="h-4 w-4" />
                    Seznam
                  </>
                )}
              </button>
              
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 px-4 py-2 rounded-xl flex items-center gap-2"
              >
                <IconPlus className="h-4 w-4" />
                Nová rezervace
              </button>
              
              <button
                onClick={fetchEvents}
                disabled={loading}
                className="bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0 hover:from-violet-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 px-4 py-2 rounded-xl flex items-center gap-2"
              >
                <IconRefresh className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Obnovit
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Form */}
          {showForm && (
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <IconSparkles className="h-5 w-5 text-violet-600" />
                    <h2 className="text-xl font-semibold text-gray-800">Nová rezervace</h2>
                  </div>
                  <button
                    onClick={handleCloseForm}
                    className="hover:bg-gray-50 p-2 rounded-lg"
                  >
                    <IconX className="h-4 w-4" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jméno klienta
                    </label>
                    <input
                      type="text"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleInputChange}
                      required
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-violet-500 focus:outline-none transition-all duration-200 bg-white/80"
                      placeholder="Jan Novák"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="clientEmail"
                      value={formData.clientEmail}
                      onChange={handleInputChange}
                      required
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-violet-500 focus:outline-none transition-all duration-200 bg-white/80"
                      placeholder="jan.novak@email.cz"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      name="clientPhone"
                      value={formData.clientPhone}
                      onChange={handleInputChange}
                      required
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-violet-500 focus:outline-none transition-all duration-200 bg-white/80"
                      placeholder="+420 123 456 789"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Datum
                      </label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleInputChange}
                        required
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-violet-500 focus:outline-none transition-all duration-200 bg-white/80"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Čas
                      </label>
                      <input
                        type="time"
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleInputChange}
                        required
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-violet-500 focus:outline-none transition-all duration-200 bg-white/80"
                      />
                    </div>
                  </div>

                  {/* Conflict Warning */}
                  {conflicts.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-red-800 mb-2">
                        <IconAlertTriangle className="h-4 w-4" />
                        <span className="font-medium">Časový konflikt!</span>
                      </div>
                      <p className="text-sm text-red-700 mb-2">
                        Na tento čas již máte naplánované schůzky:
                      </p>
                      {conflicts.map((conflict, index) => (
                        <div key={index} className="text-sm text-red-600 bg-red-100 p-2 rounded mb-1">
                          {conflict.cname} - {formatDateTime(conflict.estart).time} - {formatDateTime(conflict.eend).time}
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nemovitost/Místo
                    </label>
                    <input
                      type="text"
                      name="preferredLocation"
                      value={formData.preferredLocation}
                      onChange={handleInputChange}
                      required
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-violet-500 focus:outline-none transition-all duration-200 bg-white/80"
                      placeholder="Luxusní vila Praha 6"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Poznámka
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-violet-500 focus:outline-none transition-all duration-200 bg-white/80 resize-none"
                      placeholder="Dodatečné informace..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || conflicts.length > 0}
                    className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Rezervuji...
                      </>
                    ) : conflicts.length > 0 ? (
                      <>
                        <IconX className="h-4 w-4" />
                        Konflikt - nelze rezervovat
                      </>
                    ) : (
                      <>
                        <IconPlus className="h-4 w-4" />
                        Vytvořit rezervaci
                      </>
                    )}
                  </button>

                  {submitStatus === 'success' && (
                    <div className="flex items-center gap-2 text-emerald-600 text-sm bg-emerald-50 p-3 rounded-xl">
                      <IconCheck className="h-4 w-4" />
                      <span>Rezervace byla úspěšně vytvořena!</span>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="flex items-center gap-2 text-rose-600 text-sm bg-rose-50 p-3 rounded-xl">
                      <IconX className="h-4 w-4" />
                      <span>
                        {conflicts.length > 0 
                          ? 'Nelze rezervovat - časový konflikt!' 
                          : 'Chyba při vytváření rezervace'
                        }
                      </span>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

          {/* Events Display */}
          <div className={showForm ? "lg:col-span-2" : "lg:col-span-3"}>
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6">
              {/* Filters */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <IconFilter className="h-5 w-5 text-violet-600" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    {viewMode === 'calendar' ? 'Kalendář rezervací' : `Události (${filteredEvents.length})`}
                  </h2>
                </div>
                <div className="flex gap-2">
                  {viewMode === 'list' && (
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-violet-500 focus:outline-none bg-white/80"
                    />
                  )}
                </div>
              </div>

              {/* Calendar View */}
              {viewMode === 'calendar' && (
                <div className="grid grid-cols-7 gap-2">
                  {/* Calendar Headers */}
                  {['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'].map((day) => (
                    <div key={day} className="text-center font-semibold text-gray-600 p-2">
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar Days */}
                  {generateCalendarDays().map((day, index) => (
                    <div 
                      key={index}
                      className={`min-h-[80px] p-2 border rounded-lg transition-all duration-200 cursor-pointer hover:shadow-md ${
                        day.isCurrentMonth 
                          ? day.isToday 
                            ? 'bg-violet-100 border-violet-300' 
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                          : 'bg-gray-50 border-gray-100 text-gray-400'
                      }`}
                      onClick={() => day.events.length > 0 && setSelectedDate(day.date.toISOString().split('T')[0])}
                    >
                      <div className="text-sm font-medium mb-1">
                        {day.date.getDate()}
                      </div>
                      {day.events.length > 0 && (
                        <div className="space-y-1">
                          {day.events.slice(0, 2).map((event: CalendarEvent) => (
                            <div
                              key={event.cname + event.estart}
                              className="text-xs p-1 rounded truncate cursor-pointer bg-violet-100 text-violet-800 border border-violet-200"
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                handleEventClick(event);
                              }}
                            >
                              {event.cname}
                            </div>
                          ))}
                          {day.events.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{day.events.length - 2} další
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <>
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
                      <span className="ml-2 text-gray-600">Načítání...</span>
                    </div>
                  ) : filteredEvents.length === 0 ? (
                    <div className="text-center py-12">
                      <IconCalendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Žádné události nebyly nalezeny</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredEvents.map((event: CalendarEvent, index: number) => {
                        const startInfo = formatDateTime(event.estart);
                        const endInfo = formatDateTime(event.eend);
                        
                        return (
                          <div
                            key={index}
                            className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-200/50 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                            onClick={() => handleEventClick(event)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <IconUser className="h-4 w-4 text-violet-600" />
                                  <h3 className="font-semibold text-gray-800">{event.cname}</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                                  <div className="flex items-center gap-1">
                                    <IconClock className="h-4 w-4" />
                                    <span>{startInfo.date} {startInfo.time} - {endInfo.time}</span>
                                  </div>
                                  {event.property && (
                                    <div className="flex items-center gap-1">
                                      <IconMapPin className="h-4 w-4" />
                                      <span>{event.property}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  className="hover:bg-violet-50 hover:border-violet-300 p-2 rounded-lg border"
                                  onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    handleEventClick(event);
                                  }}
                                >
                                  <IconEye className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Event Detail Modal */}
        {showDetail && selectedEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">Detail události</h2>
                  <button
                    onClick={handleCloseDetail}
                    className="hover:bg-gray-50 p-2 rounded-lg"
                  >
                    <IconX className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Název události</label>
                      <div className="flex items-center gap-2 mt-1">
                        <IconUser className="h-4 w-4 text-violet-600" />
                        <span className="text-lg font-semibold">{selectedEvent.cname}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Začátek</label>
                      <div className="flex items-center gap-2 mt-1">
                        <IconClock className="h-4 w-4 text-violet-600" />
                        <span>{formatDateTime(selectedEvent.estart).date} v {formatDateTime(selectedEvent.estart).time}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Konec</label>
                      <div className="flex items-center gap-2 mt-1">
                        <IconClock className="h-4 w-4 text-violet-600" />
                        <span>{formatDateTime(selectedEvent.eend).date} v {formatDateTime(selectedEvent.eend).time}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {selectedEvent.property && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Nemovitost/Místo</label>
                        <div className="flex items-center gap-2 mt-1">
                          <IconMapPin className="h-4 w-4 text-violet-600" />
                          <span>{selectedEvent.property}</span>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Doba trvání</label>
                      <div className="flex items-center gap-2 mt-1">
                        <IconClock className="h-4 w-4 text-violet-600" />
                        <span>
                          {Math.round((new Date(selectedEvent.eend).getTime() - new Date(selectedEvent.estart).getTime()) / (1000 * 60))} minut
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    className="flex-1 border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-xl flex items-center justify-center gap-2"
                  >
                    <IconEdit className="h-4 w-4" />
                    Upravit
                  </button>
                  <button
                    className="text-red-600 hover:bg-red-50 border border-red-300 px-4 py-2 rounded-xl flex items-center justify-center gap-2"
                  >
                    <IconTrash className="h-4 w-4" />
                    Smazat
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}