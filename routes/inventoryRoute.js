// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")

// Note how the Middleware For Handling Errors in the utilities/index.js file is use here

// Route to load inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to load vehicle detail view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildVehicleDetailByInventoryId))

// Route to load intentional error
router.get("/intentional-error", utilities.handleErrors(invController.throwIntentionalError))

// Exports router so other files can import and use it
module.exports = router;