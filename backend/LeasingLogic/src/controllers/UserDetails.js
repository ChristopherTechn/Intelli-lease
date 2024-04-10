const mssql = require("mssql");
const config = require("../config/userConfig");


async function getUserDetails(req, res) {
  try {
    let sql = await mssql.connect(config);
    const user = req.body
    if (sql.connected) {
      let request = new mssql.Request(sql);
      request.input("UserID", user.UserID);
      let results = await request.execute("dbo.getUserDetails");
      res.json({
        success: true,
        message: "User details sent successfully",
        results: results.recordsets[0],
      });
    }
  } catch (error) {
    console.error("Error accessing user account :", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function ViewProfile(req, res) {
  try {
    let sql = await mssql.connect(config);
    const userID = req.decodedToken.userID;
    if (sql.connected) {
      let request = new mssql.Request(sql);
      request.input("UserID", userID);
      let results = await request.execute("dbo.EditUsername");
      res.json({
        success: true,
        message: "Account deleted successfully",
        results: results.recordset,
      });
    }
  } catch (error) {
    console.error("Error deleting account :", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function DeleteAccount(req, res) {
  try {
    let sql = await mssql.connect(config);
    let user = req.body;
    const userID = req.decodedToken.userID;
    if (sql.connected) {
      let request = new mssql.Request(sql);
      request.input("UserID", userID);
      let results = await request.execute("dbo.EditUsername");
      res.json({
        success: true,
        message: "Account deleted successfully",
        results: results.recordset,
      });
    }
  } catch (error) {
    console.error("Error deleting account :", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function EditUsername(req, res) {
  try {
    let sql = await mssql.connect(config);
    let user = req.body;
    const userID = req.decodedToken.userID;
    if (sql.connected) {
      let request = new mssql.Request(sql);
      request.input("UserID", userID);
      request.input("newUserName", user.newUserName);
      let results = await request.execute("dbo.EditUsername");
      res.json({
        success: true,
        message: "Edited username successfully",
        results: results.recordset,
      });
    }
  } catch (error) {
    console.error("Error obtaining username :", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function ViewNotifications(req, res) {
  try {
    let sql = await mssql.connect(config);
    let user = req.body;
    if (sql.connected) {
      let request = new mssql.Request(sql);
      request.input("UserID", user.UserID);
      let results = await request.execute("dbo.ViewNotifications");
      res.json({
        success: true,
        message: "Viewed notifications successfully",
        results: results.recordset,
      });
    }
  } catch (error) {
    console.error("Error viewing notifications :", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function CreateProfile(req, res) {
  try {
    let sql = await mssql.connect(config);
    let user = req.body;
    const userID = req.decodedToken.userID;
    if (sql.connected) {
      let request = new mssql.Request(sql);
      request.input("UserID", userID);
      request.input("UserName", user.UserName);
      request.input("ProfileImage", user.ProfileImage);
      request.input("UserEmail", user.UserEmail);
      request.input("PhoneNumber", user.PhoneNumber);
      request.input("Gender", user.Gender);
      let results = await request.execute("dbo.CreateProfile");
      res.json({
        success: true,
        message: "Create Profile successful",
        results: results.recordset,
      });
    }
  } catch (error) {
    console.error("Error creating profile :", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
module.exports = {
  getUserDetails,
  EditUsername,
  ViewProfile,
  DeleteAccount,
  ViewNotifications,
  CreateProfile
};
