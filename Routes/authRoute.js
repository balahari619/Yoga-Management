const express       = require('express');
const router        = express.Router();
const controller    = require('../controller');

router.use('/auth', router)

// AUTH ROUTES
router.post("/user-register", async (req, res) => {
    controller.userRegister(req, res);
});

router.post("/user-login", async (req, res) => {
    controller.userLogin(req, res);
});

router.post("/admin-register", async (req, res) => {
    controller.adminRegister(req, res);
});

router.post("/admin-login", async (req, res) => {
    controller.adminLogin(req, res);
});


module.exports = router;