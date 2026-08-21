const Event = require('../models/Event');
const Registration = require('../models/Registration');

// GET /api/events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('organizer', 'name email').sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/events/:id
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/events  (organizer/admin only)
const createEvent = async (req, res) => {
  try {
    const { title, description, category, date, time, venue, capacity } = req.body;

    if (!title || !description || !date || !venue) {
      return res.status(400).json({ message: 'Title, description, date, and venue are required' });
    }

    const event = await Event.create({
      title,
      description,
      category,
      date,
      time,
      venue,
      capacity,
      organizer: req.user.id,
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT /api/events/:id (organizer who owns it, or admin)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const isOwner = event.organizer.toString() === req.user.id;
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this event' });
    }

    Object.assign(event, req.body);
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE /api/events/:id (organizer who owns it, or admin)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const isOwner = event.organizer.toString() === req.user.id;
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await event.deleteOne();
    await Registration.deleteMany({ event: event._id });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent };
