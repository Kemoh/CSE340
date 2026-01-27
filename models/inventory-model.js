const pool = require("../database/")

/* ******************************
* Get all classification data
* ****************************** */
async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* **********************************
* Get all inventory items and classification_name by classification_id
* ********************************* */
async function getInventoryByClassificationId(classification_id) {
    try {
        // Query the inventory and classification tables using an INNER JOIN based on classification_id
        const data = await pool.query(
            `SELECT *
            FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1;`, [classification_id]
        )
        // Returns data, as an array of all the rows, back to where the function was called (in the controller)
        return data.rows
    } catch (error) {
        console.error("getclassificationsbyid error" + error)
    }
}

/* **********************************
* Get a specific vehicle by inventory ID
* ********************************* */
async function getInventoryById(inventory_id) {
  try {
    // Query the inventory table based on the inventory_id
    const data = await pool.query(
      `SELECT *
       FROM public.inventory
       WHERE inv_id = $1;`,
      [inventory_id]
    )
    // Returns a single record back to where the function was called (in the controller)
    return data.rows[0]
  } catch (error) {
    console.error("getInventoryById error: " + error)
  }
}

// Export functions so other files can import and use it
module.exports = {getClassifications, getInventoryByClassificationId, getInventoryById};
