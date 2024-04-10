const mssql = require("mssql");
const config = require("../config/userConfig");

async function addLandLeasingDetails(req, res) {
  try {
    let sql = await mssql.connect(config);
    let user = req.body;
    if (sql.connected) {
      let request = new mssql.Request(sql);
      request.input("UserID", user.UserID);
      request.input("CountyName", user.CountyName);
      request.input("SubCountyName", user.SubCountyName);
      request.input("ConstituencyName", user.ConstituencyName);
      request.input("LandSize", user.LandSize);
      let results = await request.execute("dbo.SendLeaseRequest");
      res.json({
        success: true,
        message: "Added land leasing request details successfully",
        results: results.recordset,
      });
    }
  } catch (error) {
    console.error("Error adding land leasing request details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function LeaseLand(req, res) {
  try {
    let sql = await mssql.connect(config);
    let user = req.body;
    if (sql.connected) {
      let request = new mssql.Request(sql);
      request.input("LeaseLandDataID", user.LeaseLandDataID);
      request.input("RequesterUserID", user.RequesterUserID)
      let results = await request.execute("dbo.LeaseLand");
      res.json({
        success: true,
        message: "Land leased successfully",
        results: results.recordset,
      });
    }
  } catch (error) {
    console.error("Error leasing land:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function withdrawLandLeasingDetails(req, res) {
  try {
    let sql = await mssql.connect(config);
    let user = req.body;
    if (sql.connected) {
      let request = new mssql.Request(sql);
      request.input("UserID", user.UserID);
      request.input("LeaseLandDataID", user.LeaseLandDataID);
      let results = await request.execute("dbo.addLandLeasingDetails");
      res.json({
        success: true,
        message: "Land leasing details withdrawn pending approval",
        results: results.recordset,
      });
    }
  } catch (error) {
    console.error("Error withdrawing land leasing details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function UpdateLandSizeDetails(req, res) {
  try {
    let sql = await mssql.connect(config);
    let user = req.body;
    const userID = req.decodedToken.userID;
    if (sql.connected) {
      let request = new mssql.Request(sql);
      request.input("UserID", user.UserID);
      request.input("LeaseLandDataID", user.LeaseLandDataID);
      request.input("newLandSize", user.newLandSize);
      let results = await request.execute("dbo.addLandLeasingDetails");
      res.json({
        success: true,
        message: "Land size details update request received pending approval",
        results: results.recordset,
      });
    }
  } catch (error) {
    console.error("Error updating land size details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function  UserViewPendingLeaseRequests
(req, res) {
  try {
    let sql = await mssql.connect(config);
    let user = req.body;
    if (sql.connected) {
      let request = new mssql.Request(sql);
      request.input("UserID", user.UserID);
      let results = await request.execute("dbo.UserViewPendingLeaseRequests");
      res.json({
        success: true,
        message: "Viewing pending lease requests successful",
        results: results.recordset,
      });
    }
  } catch (error) {
    console.error("Error viewing pending lease requests successful:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


async function  UserViewApprovedLeaseRequests
(req, res) {
  try {
    let sql = await mssql.connect(config);
    let user = req.body;
    if (sql.connected) {
      let request = new mssql.Request(sql);
      request.input("UserID", user.UserID);
      let results = await request.execute("dbo.UserViewApprovedLeaseRequests");
      res.json({
        success: true,
        message: "Viewing approved lease requests successful",
        results: results.recordset,
      });
    }
  } catch (error) {
    console.error("Error viewing approved lease requests successful:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function  UserViewApprovedLeaseRequestsByCounty
(req, res) {
  try {
    let sql = await mssql.connect(config);
    let user = req.body;
    if (sql.connected) {
      let request = new mssql.Request(sql);
      request.input("CountyName", user.CountyName);
      let results = await request.execute("dbo.UserViewApprovedLeaseRequestsByCountyName");
      res.json({
        success: true,
        message: "Viewing approved lease requests successful",
        results: results.recordset,
      });
    }
  } catch (error) {
    console.error("Error viewing approved lease requests successful:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  LeaseLand,
  addLandLeasingDetails,
  withdrawLandLeasingDetails,
  UpdateLandSizeDetails,
  UserViewPendingLeaseRequests,
  UserViewApprovedLeaseRequests,
  UserViewApprovedLeaseRequestsByCounty
};
