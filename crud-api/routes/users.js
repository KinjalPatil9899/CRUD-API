var express = require('express');
var router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/users');

// GET all users listing
router.get('/', getAllUsers);

// GET user by ID
router.get('/:userId', getUserById);

// POST new user
router.post('/', createUser);

// PUT update user
router.put('/:userId', updateUser);

// DELETE user
router.delete('/:userId', deleteUser);

module.exports = router;
