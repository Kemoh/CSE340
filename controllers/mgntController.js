const utilities = require("../utilities")
const mgntModel = require("../models/management-model")
const invModel = require("../models/management-model")


/* *********************************
* Deliver Vehicle Management View
************************************ */
 async function buildVehicleManagement(req, res, next) {
        // Calls a utility function to build the navigation menu
        let nav = await utilities.getNav()

        // Calls a utility function to build the Select Inventory Items
        const classificationSelect = await utilities.buildClassificationList()

        // Calls the Express render function to return a view to the browser
        res.render("inventory/management", {
            title: "Vehicle Management",
            nav,
            errors: null,
            classificationSelect
        }) 
    }


/* ************************************
*  Deliver Add Classification View
* *********************************** */
async function buildAddClassification(req, res, next) {
  let nav = await utilities.getNav()

  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    classification_name: ''
  })
}


/* ***********************************
*  Process Add Classification
* ********************************** */
async function processAddClassification(req, res) {
    const { classification_name } = req.body

    const result = await mgntModel.addClassification(classification_name)

    if (result) {

        // Rebuild nav immediately so the new classification appears 
        let nav = await utilities.getNav()

        const classificationSelect = await utilities.buildClassificationList()

        // Flash success message
        req.flash("notice-success", `Classification "${classification_name}" added successfully.`)

        // Render management view with updated nav and success message 
        res.status(201).render("inventory/management", { 
            title: "Vehicle Management", nav, 
            errors: null,
            classificationSelect 
        })
    } else {
        // If insertion fails, rebuild nav and re-render add-classification view
        let nav = await utilities.getNav()
        req.flash("notice", "Failed to add classification.")

        res.status(500).render("inventory/add-classification", {
            title: "Add Classification",
            nav,
            errors: null,
            classification_name
        })
    }
}


/* ************************************
*  Deliver Add Vehicle View
* *********************************** */
async function buildAddVehicle(req, res) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-vehicle", {
    title: "Add Vehicle",
    nav,
    errors: null,
    classificationList,
    inv_make: '',
    inv_model: '',
    inv_description: '',
    inv_image: '',
    inv_thumbnail: '',
    inv_price: '',
    inv_year: '',
    inv_miles: '',
    inv_color: ''
  })
}


/* ***********************************
*  Process Add Vehicle
* ********************************** */
async function processAddVehicle(req, res) {
  const { classification_id, inv_make, inv_model, inv_description,
          inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body

  const result = await invModel.addVehicle(
    classification_id, inv_make, inv_model, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color
  )

  if (result) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    req.flash("notice", `Vehicle "${inv_make} ${inv_model}" added successfully.`)
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
      classificationSelect
    })
  } else {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    req.flash("notice", "Failed to add vehicle. Please try again.")
    res.status(500).render("inventory/add-vehicle", {
      title: "Add Vehicle",
      nav,
      errors: null,
      classificationList,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color
    })
  }
}


module.exports = { buildVehicleManagement, buildAddClassification, processAddClassification, buildAddVehicle, processAddVehicle }