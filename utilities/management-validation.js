// VALIDATION MIDDLEWARE
const utilities = require(".")
const { body, validationResult } = require("express-validator")

/*  **********************************
*  Add Classification Data Validation Rules
* ********************************* */
const classificationRules = () => {
    return [
        body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3, max: 30})
        .matches(/^[A-Za-z]+$/)
        .withMessage("Classification name must be 3-30 alphabetic characters only, no spaces.")
    ]
}


/* ******************************
* Check Add Classification Data
* ***************************** */
const checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body

    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()

        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name
        })
        return
    }
    next()
} 


/*  **********************************
*  Add Vehicle Data Validation Rules
* ********************************* */
const vehicleRules = () => {
  return [
    body("classification_id")
    .notEmpty()
    .withMessage("Classification is required."),

    body("inv_make")
    .trim()
    .isAlpha()
    .isLength({ min: 3 })
    .withMessage("Make must be alphabetic and at least 3 characters."),

    body("inv_model")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Model is required."),

    body("inv_description")
    .trim()
    .notEmpty()
    .withMessage("Description is required."),

    body("inv_image")
    .trim()
    .notEmpty()
    .withMessage("Image path is required."),

    body("inv_thumbnail")
    .trim()
    .notEmpty()
    .withMessage("Thumbnail path is required."),

    body("inv_price")
    .isFloat()
    .withMessage("Price must be a number."),

    body("inv_year")
    .isInt({ min: 1900, max: 9999 })
    .isLength({ min: 4 })
    .withMessage("Year must be 4 digits."),

    body("inv_miles")
    .isInt()
    .withMessage("Miles must be digits only."),

    body("inv_color")
    .trim()
    .isAlpha()
    .withMessage("Color must be alphabetic.")
  ]
}


/*  **********************************
*  Add Vehicle Data Validation Rules
* ********************************* */
const newInventoryRules = () => {
  return [
    body("classification_id")
    .notEmpty()
    .withMessage("Classification is required."),

    body("inv_make")
    .trim()
    .isAlpha()
    .isLength({ min: 3 })
    .withMessage("Make must be alphabetic and at least 3 characters."),

    body("inv_model")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Model is required."),

    body("inv_description")
    .trim()
    .notEmpty()
    .withMessage("Description is required."),

    body("inv_image")
    .trim()
    .notEmpty()
    .withMessage("Image path is required."),

    body("inv_thumbnail")
    .trim()
    .notEmpty()
    .withMessage("Thumbnail path is required."),

    body("inv_price")
    .isFloat()
    .withMessage("Price must be a number."),

    body("inv_year")
    .isInt({ min: 1900, max: 9999 })
    .isLength({ min: 4 })
    .withMessage("Year must be 4 digits."),

    body("inv_miles")
    .isInt()
    .withMessage("Miles must be digits only."),

    body("inv_color")
    .trim()
    .isAlpha()
    .withMessage("Color must be alphabetic.")
  ]
}

/* ******************************
* Check Add Vehicle Data
* ***************************** */
const checkVehicleData = async (req, res, next) => {
  const { classification_id } = req.body

  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)

    res.render("inventory/add-vehicle", {
      errors,
      title: "Add Vehicle",
      nav,
      classificationList,
      ...req.body // sticky values
    })
    return
  }
  next()
}

/* ******************************
* Check Update Vehicle Data
* ***************************** */
const checkUpdateData = async (req, res, next) => {
  const { classification_id, inv_id } = req.body

  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)

    const itemName = `${req.body.inv_make} ${req.body.inv_model}`

    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit " + itemName,
      nav,
      classificationList,
      inv_id, 
      ...req.body 
    })
    return
  }
  next()
}


module.exports = { classificationRules, vehicleRules, checkClassificationData, checkVehicleData, checkUpdateData, newInventoryRules }