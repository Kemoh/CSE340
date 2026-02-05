// Needed Resources
const express = require("express")
const router = new express.Router()
const managementController = require("../controllers/mgntController")
const utilities = require("../utilities")
const mgntValidate = require('../utilities/management-validation')

// Route to load Vehicle Management View
router.get("/management", utilities.handleErrors(managementController.buildVehicleManagement))

// GET route to display the forms
router.get("/add-classification", utilities.handleErrors(managementController.buildAddClassification))

// POST route to process Add Classification form submission
router.post(
    "/add-classification",
    mgntValidate.classificationRules(), // validation rules
    mgntValidate.checkClassificationData, // validation check
    utilities.handleErrors(managementController.processAddClassification) // controller
)


// POST route to process Add Vehicle Form Submission
router.get("/add-vehicle", utilities.handleErrors(managementController.buildAddVehicle))

router.post(
    "/add-vehicle",
    mgntValidate.vehicleRules(),
    mgntValidate.checkVehicleData,
    utilities.handleErrors(managementController.processAddVehicle)
)

module.exports = router