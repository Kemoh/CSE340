const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************************
*  Deliver Login View
* *********************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()

  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email: ''
  })
}

/* ************************************
*  Deliver Registration View
* *********************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()

  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    account_firstname: '',
    account_lastname: '', 
    account_email: ''
  })
}

/* ************************************
*  Process Registration
* *********************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email: account_email
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      account_firstname, 
      account_lastname, 
      account_email
    })
  }
}


/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })

      // Save account info in session for views 
      req.session.accountData = accountData

      // Set Cookie
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}


/* ****************************************
 *  Build Account Management View
 * ************************************ */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()

  try {
    res.render("account/account-mgnt", {
      title: "Account Management",
      nav,
      errors: null,
      accountData: res.locals.accountData
    })
  } catch (error) {
    next(error)
  }  
}


/* ****************************************
 *  Process Logout Request
 * ************************************ */
async function accountLogout(req, res) {
  req.session.destroy(() => {
    res.clearCookie("jwt")
    res.redirect("/") 
  })
}

/* ****************************************
 *  Deliver Update Account
 * ************************************ */
async function buildUpdateAccount(req, res, next) {
  let nav = await utilities.getNav()
  const account_id = req.params.account_id
  const accountData = await accountModel.getAccountById(account_id)

  res.render("account/update", {
    title: "Update Account Information",
    nav,
    errors: null,
    accountData
  })
}

/* ****************************************
 *  Process Update Account
 * ************************************ */
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email } = req.body

  const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email)

  if (updateResult) {
    req.flash("notice", "Account information updated successfully.")
    const accountData = await accountModel.getAccountById(account_id) 
    res.render("account/account-mgnt", { title: "Account Management", 
    nav, 
    errors: null, 
    accountData })
  } else {
    req.flash("notice", "Update failed. Please try again.")
    res.status(400).render("account/update", {
      title: "Update Account Information",
      nav,
      errors: null,
      accountData: { account_id, account_firstname, account_lastname, account_email }
    })
  }
}

/* ****************************************
 *  Process Update Password
 * ************************************ */
async function updatePassword(req, res, next) {
  let nav = await utilities.getNav()
  const { account_id, account_password } = req.body

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(account_password, 10)

    // Update in the database
    const updateResult = await accountModel.updatePassword(account_id, hashedPassword)

    if (updateResult) {
      req.flash("notice", "Password updated successfully.")
      const accountData = await accountModel.getAccountById(account_id) 
      res.render("account/account-mgnt", { title: "Account Management", 
      nav, 
      errors: null, 
      accountData })
    } else {
      req.flash("notice", "Password update failed. Please try again.")
      res.status(400).render("account/update", {
        title: "Update Account Information",
        nav,
        errors: null,
        accountData: { account_id }
      })
    }
  } catch (error) {
    next(error)
  }
}

module.exports = { 
  buildLogin, 
  buildRegister, 
  registerAccount, 
  accountLogin, 
  buildAccountManagement, 
  accountLogout,
  buildUpdateAccount,
  updateAccount,
  updatePassword 
}
