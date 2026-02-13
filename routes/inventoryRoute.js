// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")

/* ***************************
 * VISITORS ROUTES
 * ************************** */
// Route to load inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to load vehicle detail view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildVehicleDetailByInventoryId))

// Route to load intentional error
router.get("/intentional-error", utilities.handleErrors(invController.throwIntentionalError))

// Route to load management view (JSON data)
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))


/* ***************************
 * ADMIN ONLY ROUTES
 * ************************** */
// Route to load edit inventory view
router.get("/edit/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.editInventoryView))

// Route to update the edit inventory view
router.post("/update/", utilities.checkAccountType, utilities.handleErrors(invController.updateInventory))

// Deliver the delete confirmation view
router.get("/delete/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.buildDeleteConfirmView))

// Process the delete inventory route
router.post("/delete", utilities.checkAccountType, utilities.handleErrors(invController.deleteInventoryItem))

// Exports router so other files can import and use it
module.exports = router
