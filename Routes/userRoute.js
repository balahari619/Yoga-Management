const express       = require('express');
const router        = express.Router();
const controller    = require('../controller');
const { authenticate , authorize } = require('../middleware/authenticate');

router.use("/users", router)

// USER ROUTES
router.get("/user-profile/me", authenticate, authorize("user"), async (req, res) => {
    controller.userProfile(req, res);
});

router.get("/all-courses", authenticate, authorize("user"), async(req, res) => {
    controller.allCourses(req, res);
});

router.get("/single-course", authenticate, authorize("user"), async(req, res) => {
    controller.singleCourse(req, res);
});

router.get('/user-courses', authenticate, authorize("user"), async(req, res) => {
    controller.userCourses(req, res);
});

router.post("/order-booking", authenticate, authorize("user"), async (req, res) => {
    controller.orderBooking(req, res);
});

router.get("/user-schedule", authenticate, async(req, res) => {
    controller.userSchedule(req, res);
});


router.post("/feedback", authenticate, async (req, res) => {
    controller.feedback(req, res);
});

router.get("/session", authenticate, async(req, res) => {
    controller.session(req, res);
});

module.exports = router;