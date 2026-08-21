const express = require('express');
const router = express.Router();
const {
  registerForEvent,
  getMyRegistrations,
  getEventRegistrations,
  cancelRegistration,
} = require('../controllers/registrationController');
const { protect, authorize } = require('../middleware/auth');

router.post('/:eventId', protect, authorize('student'), registerForEvent);
router.get('/me', protect, getMyRegistrations);
router.get('/event/:eventId', protect, authorize('organizer', 'admin'), getEventRegistrations);
router.delete('/:id', protect, cancelRegistration);

module.exports = router;
