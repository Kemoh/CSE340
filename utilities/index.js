const invModel = require("../models/inventory-model")

const Util = {}

/* ************************************
* Constructs the nav HTML unordered list
************************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
        '<a href="/inv/type/' + row.classification_id +'" title="See our inventory of ' + row.classification_name +' vehicles">' + row.classification_name +
        "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

/* *************************************
* Middleware For Handling Errors
* Wrap other function in this for
* General Error Handling
*****************************************/
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util

/* *************************************
* Build the classification view 
************************************* */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="/inv/detail/'+ vehicle.inv_id + '" title="View ' + vehicle.inv_make +' '+ vehicle.inv_model +' details"><img src=" '+ vehicle.inv_thumbnail +' " alt="Image of '+ vehicle.inv_make +' '+ vehicle.inv_model +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="/inv/detail/' + vehicle.inv_id +'" title="View '+ vehicle.inv_make +' '+ vehicle.inv_model +' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


/* ===============================
   BUILD VEHICLE DETAIL VIEW
================================ */

Util.buildVehicleDetail = async function (vehicle) {
  
  let vehicleDetail = ''

  
  if (vehicle) {
    vehicleDetail += '<section class="vehicle-detail">'

    // Image
    vehicleDetail += '<div class="vehicle-image">'
    vehicleDetail += '<img src="' + vehicle.inv_image + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model + '">'
    vehicleDetail += '</div>'

    // Heading h1
    vehicleDetail += '<div class="vehicle-info">'
    vehicleDetail += '<h2>' + vehicle.inv_make + ' ' + vehicle.inv_model + ' Details </h2>'

    // Price
    vehicleDetail += '<p class="price"><strong>Price:</strong> $' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</p>'

    // Description
    vehicleDetail += '<p class="description"><strong>Description:</strong><br>' + vehicle.inv_description + '</p>'

    // Color
    vehicleDetail += '<p class="color"><strong>Color:</strong> ' + vehicle.inv_color + '</p>'

    // Mileage
    vehicleDetail += '<p class="mileage"><strong>Miles:</strong> ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + ' </p>'

    vehicleDetail += '</div>'
    vehicleDetail += '</section>'
  } else {
    vehicleDetail += '<p class="notice">Sorry, vehicle details could not be found.</p>'
  }

  return vehicleDetail
}


/* ===============================
   BUILD CLASSIFICATION DROP-DOWN LIST
================================ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
  '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (classification_id != null && row.classification_id == classification_id) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

