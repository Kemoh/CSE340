const pool = require("../database/")

/* *****************************
*   Register Add Classification
* *************************** */
async function addClassification(classification_name) {
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
        const data = await pool.query(sql, [ classification_name ])
        return data.rows[0]
        
    } catch (error) {
        return error.message
    } 
}


/* *****************************
*   Register Add Vehicle
* *************************** */
async function addVehicle(classification_id, 
 inv_make, 
 inv_model, 
 inv_description,
 inv_image, 
 inv_thumbnail, 
 inv_price, 
 inv_year, 
 inv_miles, 
 inv_color) {
  try {
    const sql = `
      INSERT INTO inventory (
      classification_id, 
      inv_make, 
      inv_model, 
      inv_description,
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_year, 
      inv_miles, 
      inv_color)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *
    `
    const data = await pool.query(sql, [
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
    ])
    return data.rows[0]
  } catch (error) {
        return error.message
    } 
}

module.exports = { addClassification, addVehicle }