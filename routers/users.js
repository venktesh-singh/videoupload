const express = require('express');
const router = express.Router();
const UserController = require('../controller/user');
const { isSuperAdmin, isAdmin } = require('../helper/authorization');

router.get('/', UserController.getUser)
router.get('/:id', UserController.getUserByID)
router.post('/add',UserController.addUser);
router.put('/edit/:id', UserController.editUser)
router.post('/login', UserController.userLogin)

// Route for super admin to approve admins or users
router.post('/approve/:userId', isSuperAdmin, UserController.superAdminApproveAdminOrUser);

// Route for admin to approve users
router.post('/approve-user/:userId', isAdmin, UserController.adminApproveUser);

module.exports = router;
  