// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

// Default account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

// Route to build Login View
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to build Registration View
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login data
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Process logout route
router.get(
  "/logout", 
  utilities.handleErrors(accountController.accountLogout))

// Deliver update account view
router.get(
  "/update/:account_id", 
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildUpdateAccount))

// Process account info update
router.post(
  "/update", 
  utilities.checkLogin, 
  regValidate.updateAccountRules(), regValidate.checkUpdateData, 
  utilities.handleErrors(accountController.updateAccount))

// Process password update
router.post( 
  "/update-password", 
  utilities.checkLogin, 
  regValidate.passwordRules(), 
  regValidate.checkPasswordData, 
  utilities.handleErrors(accountController.updatePassword) )

module.exports = router