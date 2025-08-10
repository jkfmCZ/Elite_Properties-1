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
  IconTrash
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { BookingService, type Booking, type BookingFormData } from '@/services/bookingService';

export function CalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
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
    console.log('CalendarPage mounted, fetching bookings...');
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await BookingService.getAllBookings();
      console.log('Fetched bookings data:', data);
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus('idle');

    try {
      await BookingService.createBooking(formData);
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
      fetchBookings();
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch (error) {
      console.error('Error creating booking:', error);
      setSubmitStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setSelectedBooking(null);
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
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - startOfMonth.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dayBookings = bookings.filter(booking => 
        booking.preferredDate === currentDate.toISOString().split('T')[0]
      );
      
      days.push({
        date: new Date(currentDate),
        bookings: dayBookings,
        isCurrentMonth: currentDate.getMonth() === today.getMonth(),
        isToday: currentDate.toDateString() === today.toDateString()
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  // Simple filtering without complex logic for debugging
  let filteredBookings = bookings;
  
  // Apply status filter
  if (statusFilter !== 'all') {
    filteredBookings = BookingService.filterBookingsByStatus(filteredBookings, statusFilter);
  }
  
  // Apply date filter
  if (selectedDate) {
    filteredBookings = BookingService.getBookingsForDate(filteredBookings, selectedDate);
  }

  // Debug logging
  console.log('Raw bookings:', bookings);
  console.log('Selected date:', selectedDate);
  console.log('Status filter:', statusFilter);
  console.log('Filtered bookings:', filteredBookings);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'cancelled': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <IconCheck className="h-4 w-4" />;
      case 'pending': return <IconClock className="h-4 w-4" />;
      case 'cancelled': return <IconX className="h-4 w-4" />;
      default: return <IconClock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Potvrzeno';
      case 'pending': return 'Čekající';
      case 'cancelled': return 'Zrušeno';
      default: return 'Neznámý';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Enhanced Background Elements */}
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
              <Button
                onClick={generateRandomBooking}
                variant="outline"
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <IconTestPipe className="h-4 w-4 mr-2" />
                Test Data
              </Button>
              
              <Button
                onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
                variant="outline"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                {viewMode === 'list' ? (
                  <>
                    <IconCalendarEvent className="h-4 w-4 mr-2" />
                    Kalendář
                  </>
                ) : (
                  <>
                    <IconList className="h-4 w-4 mr-2" />
                    Seznam
                  </>
                )}
              </Button>
              
              <Button
                onClick={() => setShowForm(!showForm)}
                variant="outline"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <IconPlus className="h-4 w-4 mr-2" />
                Nová rezervace
              </Button>
              
              <Button
                onClick={fetchBookings}
                disabled={loading}
                variant="outline"
                className="bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0 hover:from-violet-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <IconRefresh className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Obnovit
              </Button>
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
                  <Button
                    onClick={handleCloseForm}
                    variant="outline"
                    size="sm"
                    className="hover:bg-gray-50"
                  >
                    <IconX className="h-4 w-4" />
                  </Button>
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

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Rezervuji...
                      </>
                    ) : (
                      <>
                        <IconPlus className="h-4 w-4 mr-2" />
                        Vytvořit rezervaci
                      </>
                    )}
                  </Button>

                  {submitStatus === 'success' && (
                    <div className="flex items-center gap-2 text-emerald-600 text-sm bg-emerald-50 p-3 rounded-xl">
                      <IconCheck className="h-4 w-4" />
                      <span>Rezervace byla úspěšně vytvořena!</span>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="flex items-center gap-2 text-rose-600 text-sm bg-rose-50 p-3 rounded-xl">
                      <IconX className="h-4 w-4" />
                      <span>Chyba při vytváření rezervace</span>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

          {/* Bookings Display */}
          <div className={showForm ? "lg:col-span-2" : "lg:col-span-3"}>
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6">
              {/* Filters */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <IconFilter className="h-5 w-5 text-violet-600" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    {viewMode === 'calendar' ? 'Kalendář rezervací' : `Rezervace (${filteredBookings.length})`}
                  </h2>
                </div>
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-violet-500 focus:outline-none bg-white/80"
                  >
                    <option value="all">Všechny</option>
                    <option value="pending">Čekající</option>
                    <option value="confirmed">Potvrzené</option>
                    <option value="cancelled">Zrušené</option>
                  </select>
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
                      onClick={() => day.bookings.length > 0 && setSelectedDate(day.date.toISOString().split('T')[0])}
                    >
                      <div className="text-sm font-medium mb-1">
                        {day.date.getDate()}
                      </div>
                      {day.bookings.length > 0 && (
                        <div className="space-y-1">
                          {day.bookings.slice(0, 2).map((booking) => (
                            <div
                              key={booking.id}
                              className={`text-xs p-1 rounded truncate cursor-pointer ${getStatusColor(booking.status)}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBookingClick(booking);
                              }}
                            >
                              {booking.clientName}
                            </div>
                          ))}
                          {day.bookings.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{day.bookings.length - 2} další
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
                  ) : filteredBookings.length === 0 ? (
                    <div className="text-center py-12">
                      <IconCalendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Žádné rezervace nebyly nalezeny</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-200/50 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                          onClick={() => handleBookingClick(booking)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <IconUser className="h-4 w-4 text-violet-600" />
                                <h3 className="font-semibold text-gray-800">{booking.clientName}</h3>
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(booking.status)}`}>
                                  {getStatusIcon(booking.status)}
                                  {getStatusText(booking.status)}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                                <div className="flex items-center gap-1">
                                  <IconMail className="h-4 w-4" />
                                  <span>{booking.clientEmail}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <IconPhone className="h-4 w-4" />
                                  <span>{booking.clientPhone}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <IconClock className="h-4 w-4" />
                                  <span>{booking.preferredDate} v {booking.preferredTime}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <IconMapPin className="h-4 w-4" />
                                  <span>{booking.preferredLocation}</span>
                                </div>
                              </div>
                              {booking.message && (
                                <div className="flex items-start gap-1 text-sm text-gray-600">
                                  <IconMessage className="h-4 w-4 mt-0.5" />
                                  <span className="truncate">{booking.message}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-violet-50 hover:border-violet-300"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleBookingClick(booking);
                                }}
                              >
                                <IconEye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Booking Detail Modal */}
        {showDetail && selectedBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">Detail rezervace</h2>
                  <Button
                    onClick={handleCloseDetail}
                    variant="outline"
                    size="sm"
                  >
                    <IconX className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Klient</label>
                      <div className="flex items-center gap-2 mt-1">
                        <IconUser className="h-4 w-4 text-violet-600" />
                        <span className="text-lg font-semibold">{selectedBooking.clientName}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <div className="flex items-center gap-2 mt-1">
                        <IconMail className="h-4 w-4 text-violet-600" />
                        <span>{selectedBooking.clientEmail}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Telefon</label>
                      <div className="flex items-center gap-2 mt-1">
                        <IconPhone className="h-4 w-4 text-violet-600" />
                        <span>{selectedBooking.clientPhone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Datum a čas</label>
                      <div className="flex items-center gap-2 mt-1">
                        <IconClock className="h-4 w-4 text-violet-600" />
                        <span className="text-lg font-semibold">
                          {selectedBooking.preferredDate} v {selectedBooking.preferredTime}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Místo</label>
                      <div className="flex items-center gap-2 mt-1">
                        <IconMapPin className="h-4 w-4 text-violet-600" />
                        <span>{selectedBooking.preferredLocation}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <div className="mt-1">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm border ${getStatusColor(selectedBooking.status)}`}>
                          {getStatusIcon(selectedBooking.status)}
                          {getStatusText(selectedBooking.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedBooking.message && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Poznámka</label>
                    <div className="flex items-start gap-2 mt-1 p-4 bg-gray-50 rounded-xl">
                      <IconMessage className="h-4 w-4 text-violet-600 mt-0.5" />
                      <span>{selectedBooking.message}</span>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    className="flex-1"
                  >
                    <IconEdit className="h-4 w-4 mr-2" />
                    Upravit
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 hover:bg-red-50"
                  >
                    <IconTrash className="h-4 w-4 mr-2" />
                    Smazat
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
