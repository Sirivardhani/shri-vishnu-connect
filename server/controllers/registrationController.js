const Registration = require('../models/Registration');
const Event = require('../models/Event');

// POST /api/registrations/:eventId  (student registers for an event)
const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.capacity > 0) {
      const count = await Registration.countDocuments({ event: eventId, status: 'registered' });
      if (count >= event.capacity) {
        return res.status(400).json({ message: 'This event is full' });
      }
    }

    const registration = await Registration.create({
      user: req.user.id,
      event: eventId,
    });

    res.status(201).json(registration);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'You are already registered for this event' });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/registrations/me (student's own registrations)
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user.id }).populate('event');
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/registrations/event/:eventId (organizer/admin: who registered)
const getEventRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ event: req.params.eventId }).populate(
      'user',
      'name email department year'
    );
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE /api/registrations/:id (student cancels their own registration)
const cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    if (registration.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to cancel this registration' });
    }
    await registration.deleteOne();
    res.json({ message: 'Registration cancelled' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  registerForEvent,
  getMyRegistrations,
  getEventRegistrations,
  cancelRegistration,
};
