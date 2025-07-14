const { mockBookings } = require('../data/mockData');

class BookingController {
    constructor() {
        this.bookings = [...mockBookings];
    }

    getAllBookings = (req, res) => {
        try {
            const { status, propertyId } = req.query;
            let filteredBookings = [...this.bookings];

            if (status) {
                filteredBookings = filteredBookings.filter(b => b.status === status);
            }
            if (propertyId) {
                filteredBookings = filteredBookings.filter(b => b.propertyId === propertyId);
            }

            // Sort by creation date (newest first)
            filteredBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            const response = {
                success: true,
                message: 'Bookings retrieved successfully',
                data: filteredBookings
            };

            res.json(response);
        } catch (error) {
            const response = {
                success: false,
                message: 'Error retrieving bookings'
            };
            res.status(500).json(response);
        }
    };

    getBookingById = (req, res) => {
        try {
            const { id } = req.params;
            const booking = this.bookings.find(b => b.id === id);

            if (!booking) {
                const response = {
                    success: false,
                    message: 'Booking not found'
                };
                return res.status(404).json(response);
            }

            const response = {
                success: true,
                message: 'Booking retrieved successfully',
                data: booking
            };

            res.json(response);
        } catch (error) {
            const response = {
                success: false,
                message: 'Error retrieving booking'
            };
            res.status(500).json(response);
        }
    };

    createBooking = (req, res) => {
        try {
            const bookingData = req.body;
            
            // Validate required fields
            if (!bookingData.clientName || !bookingData.clientEmail || !bookingData.clientPhone) {
                const response = {
                    success: false,
                    message: 'Missing required fields: clientName, clientEmail, clientPhone'
                };
                return res.status(400).json(response);
            }

            const newBooking = {
                ...bookingData,
                id: (this.bookings.length + 1).toString(),
                status: 'pending',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            this.bookings.push(newBooking);

            const response = {
                success: true,
                message: 'Booking created successfully',
                data: newBooking
            };

            res.status(201).json(response);
        } catch (error) {
            const response = {
                success: false,
                message: 'Error creating booking'
            };
            res.status(500).json(response);
        }
    };

    updateBooking = (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
            
            const bookingIndex = this.bookings.findIndex(b => b.id === id);
            
            if (bookingIndex === -1) {
                const response = {
                    success: false,
                    message: 'Booking not found'
                };
                return res.status(404).json(response);
            }

            this.bookings[bookingIndex] = {
                ...this.bookings[bookingIndex],
                ...updateData,
                id, // Ensure ID doesn't change
                updatedAt: new Date().toISOString()
            };

            const response = {
                success: true,
                message: 'Booking updated successfully',
                data: this.bookings[bookingIndex]
            };

            res.json(response);
        } catch (error) {
            const response = {
                success: false,
                message: 'Error updating booking'
            };
            res.status(500).json(response);
        }
    };

    deleteBooking = (req, res) => {
        try {
            const { id } = req.params;
            const bookingIndex = this.bookings.findIndex(b => b.id === id);
            
            if (bookingIndex === -1) {
                const response = {
                    success: false,
                    message: 'Booking not found'
                };
                return res.status(404).json(response);
            }

            this.bookings.splice(bookingIndex, 1);

            const response = {
                success: true,
                message: 'Booking deleted successfully'
            };

            res.json(response);
        } catch (error) {
            const response = {
                success: false,
                message: 'Error deleting booking'
            };
            res.status(500).json(response);
        }
    };

    updateBookingStatus = (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            
            if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
                const response = {
                    success: false,
                    message: 'Invalid status. Must be one of: pending, confirmed, completed, cancelled'
                };
                return res.status(400).json(response);
            }

            const bookingIndex = this.bookings.findIndex(b => b.id === id);
            
            if (bookingIndex === -1) {
                const response = {
                    success: false,
                    message: 'Booking not found'
                };
                return res.status(404).json(response);
            }

            this.bookings[bookingIndex].status = status;
            this.bookings[bookingIndex].updatedAt = new Date().toISOString();

            const response = {
                success: true,
                message: 'Booking status updated successfully',
                data: this.bookings[bookingIndex]
            };

            res.json(response);
        } catch (error) {
            const response = {
                success: false,
                message: 'Error updating booking status'
            };
            res.status(500).json(response);
        }
    };
}

module.exports = { BookingController };
