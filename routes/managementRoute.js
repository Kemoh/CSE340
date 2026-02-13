// Needed Resources
const express = require("express")
const router = new express.Router()
const mgntController = require("../controllers/mgntController")
const utilities = require("../utilities")
const mgntValidate = require('../utilities/management-validation')
const invController = require("../controllers/invController")

// Route to load Vehicle Management View (Admin/Employee only)
router.get("/", utilities.checkAccountType, utilities.handleErrors(mgntController.buildVehicleManagement))

// GET route to display Add Classification form (Admin/Employee only)
router.get("/add-classification", utilities.checkAccountType, utilities.handleErrors(mgntController.buildAddClassification))

// POST route to process Add Classification form submission (Admin/Employee only)
router.post(
  "/add-classification",
  utilities.checkAccountType,
  mgntValidate.classificationRules(),
  mgntValidate.checkClassificationData,
  utilities.handleErrors(mgntController.processAddClassification)
)

// GET route to display Add Vehicle form (Admin/Employee only)
router.get("/add-vehicle", utilities.checkAccountType, utilities.handleErrors(mgntController.buildAddVehicle))

// POST route to process Add Vehicle form submission (Admin/Employee only)
router.post(
  "/add-vehicle",
  utilities.checkAccountType,
  mgntValidate.vehicleRules(),
  mgntValidate.checkVehicleData,
  utilities.handleErrors(mgntController.processAddVehicle)
)

// POST route to update inventory (Admin/Employee only)
router.post(
  "/update",
  utilities.checkAccountType,
  mgntValidate.newInventoryRules(),
  mgntValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

module.exports = router