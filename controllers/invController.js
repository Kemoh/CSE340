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
        const vehicleDetailHTML = await utilities.buildVehicleDetail(vehicleResponseData)

        // Calls a utility function to build the navigation menu
        let nav = await utilities.getNav()

        // Extracts data based on inv_year, inv_make and inv_model
        const className = `${vehicleResponseData.inv_year} ${vehicleResponseData.inv_make} ${vehicleResponseData.inv_model}`

        // Calls the Express render function to return a view to the browser
        res.render("./inventory/detail", {
            title: className,
            nav,
            vehicleDetailHTML,
        }) 
    }

/* *********************************
* Build intentional error  view
************************************ */
invCont.throwIntentionalError = async function (req, res, next) {
    // Simulates a 500 error
    throw new Error("Intentional 500 error")  
}

// Export the invCont object so other files can import and use it
module.exports = invCont