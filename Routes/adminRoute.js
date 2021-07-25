const express       = require('express');
const router        = express.Router();
const controller    = require('../controller');
const { authorize, authenticate } = require('../middleware/authenticate');

router.use("/admin", router)

// ADMIN ROUTES
router.post("/add-course", authenticate, authorize("admin"), async (req, res) => {
    controller.addCourse(req, res);
});

router.post("/add-trainer", authenticate, authorize("admin"), async (req, res) => {
    controller.addTrainer(req, res);
});

router.get("/all-courses", authenticate, authorize("admin"), async(req, res) => {
    controller.allCourses(req, res);
});

router.get("/single-course", authenticate, authorize("admin"), async(req, res) => {
    controller.singleCourse(req, res);
});

router.get("/all-trainers", authenticate, authorize("admin"), async(req, res) => {
    controller.allTrainers(req, res);
});

router.get("/single-trainer", authenticate, authorize("admin"), async(req, res) => {
    controller.singleTrainer(req, res);
});

router.get("/all-orders", authenticate, authorize("admin"), async (req, res) => {
    controller.allOrders(req, res);
});

router.get("/single-order", authenticate, authorize("admin"), async (req, res) => {
    controller.singleOrder(req, res);
});

router.post("/course-assignment", authenticate, authorize("admin"), async (req, res) => {
    controller.courseAssignment(req, res);
});

module.exports = router;