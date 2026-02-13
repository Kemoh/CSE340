const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* **************************************
* Build inventory by classification view
* ************************************ */
invCont.buildByClassificationId = async function (req, res, next) {
    // Get the classificationId from the route 
    const classification_id = req.params.classificationId

    // Calls the model function that fetches data from the database based on classification_id
    const data = await invModel.getInventoryByClassificationId(classification_id)

    // Calls a utility function to build an HTML string
    const grid = await utilities.buildClassificationGrid(data)

    // Calls a utility function to build the navigation menu
    let nav = await utilities.getNav()

    // Extracts data based on classification_name
    const className = data[0].classification_name

    // Calls the Express render function to return a view to the browser
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* *********************************
* Build vehicle detail  view
************************************ */
invCont.buildVehicleDetailByInventoryId = async function (req, res, next) {
        // Get the inventoryId from the route 
        const inventory_id = req.params.inventoryId

        // Calls the model function that fetches data from the database based on inventory_id
        const vehicleResponseData = await invModel.getInventoryById(inventory_id) 

        // Calls a utility function to build an HTML string
        const vehicleDetail = await utilities.buildVehicleDetail(vehicleResponseData)

        // Calls a utility function to build the navigation menu
        let nav = await utilities.getNav()

        // Extracts data based on inv_year, inv_make and inv_model
        const className = `${vehicleResponseData.inv_year} ${vehicleResponseData.inv_make} ${vehicleResponseData.inv_model}`

        // Calls the Express render function to return a view to the browser
        res.render("./inventory/detail", {
            title: className,
            nav,
            vehicleDetail,
        }) 
    }

/* *********************************
* Build intentional error  view
************************************ */
invCont.throwIntentionalError = async function (req, res, next) {
    // Simulates a 500 error
    throw new Error("Intentional 500 error")  
}


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


/* ***************************
 *  Build edit/modify inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("/inv/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}


/* ***************************
 * Build Delete Confirmation View
 * ************************** */
invCont.buildDeleteConfirmView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = req.params.inv_id
  const itemData = await invModel.getInventoryById(inv_id)

  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price
  })
}

/* ***************************
 * Delete Inventory Item
 * ************************** */
invCont.deleteInventoryItem = async function (req, res, next) {
    const inv_id = parseInt(req.body.inv_id) 
    const deleteResult = await invModel.deleteInventoryItem(inv_id)

  if (deleteResult) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()

    const classification_id = req.body.classification_id

    const updatedInventory = await invModel.getInventoryByClassificationId(classification_id) 
    const grid = await utilities.buildClassificationGrid(updatedInventory)

    req.flash("notice", "The deletion was successful.")
    res.status(200).render("inventory/management", {
        title: "Vehicle Management", 
        nav, 
        errors: null, 
        classificationSelect,
        grid
    })
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.redirect("/inventory/delete/" + req.ind_id)
  }
}

// Export the invCont object so other files can import and use it
module.exports = invCont