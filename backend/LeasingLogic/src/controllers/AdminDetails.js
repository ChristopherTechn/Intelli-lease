const mssql = require('mssql');
const config = require('../config/userConfig');

async function ViewPendingLeaseRequests(req, res) {
    try{
          let sql = await mssql.connect(config);
          if (sql.connected) {
            let request = new mssql.Request(sql);
            let results = await request.execute('dbo.ViewPendingLeaseRequests')
            res.json({
              success: true,
              message: "View pending lease request successfully",
              results: results.recordset
            }
             );
          }
    }
     catch (error) {
        console.error('Error viewing pending lease request account :', error);
        res.status(500).json({ error: 'Internal server error' });
      }
}

async function ApproveLeaseRequest(req, res) {
  try {
    let sql = await mssql.connect(config);
    const { userID, LeaseLandDataID } = req.body; // Destructure the request body
    if (sql.connected) {
      let request = new mssql.Request(sql);
      request.input("UserID", userID); // Correct parameter name
      request.input("LeaseLandDataID", LeaseLandDataID);
      let results = await request.execute("dbo.ApproveLeaseRequest");
      res.json({
        success: true,
        message: "Approved lease request successfully",
        results: results.recordset,
      });
    }
  } catch (error) {
    console.error("Error approving lease request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function DeclineLeaseRequest(req, res) {
  try {
    let sql = await mssql.connect(config);
    const { userID, LeaseLandDataID } = req.body; // Destructure the request body
    if (sql.connected) {
      let request = new mssql.Request(sql);
      request.input("UserID", userID); // Correct parameter name
      request.input("LeaseLandDataID", LeaseLandDataID);
      let results = await request.execute("dbo.DeclineLeaseRequest");
      res.json({
        success: true,
        message: "Declined lease request successfully",
        results: results.recordset,
      });
    }
  } catch (error) {
    console.error("Error declining lease request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


async function ApproveWithdrawLeaseRequest(req, res) {
  try{
        let sql = await mssql.connect(config);
        let user = req.body;
        const userID = req.decodedToken.userID;
        if (sql.connected) {
          let request = new mssql.Request(sql);
          request.input('UserID', userID)
          request.input('LeaseLandDataID', user.LeaseLandDataID)
          let results = await request.execute('dbo.ApproveWithdrawLeaseRequest')
          res.json({
            success: true,
            message: "Approved withdraw lease request successfully",
            results: results.recordset
          }
           );
        }
  }
   catch (error) {
      console.error('Error approving withdraw lease request account :', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

async function ApproveUpdatedLandSizeDetails(req, res) {
  try{
        let sql = await mssql.connect(config);
        let user = req.body;
        const userID = req.decodedToken.userID;
        if (sql.connected) {
          let request = new mssql.Request(sql);
          request.input('UserID', userID)
          request.input('LeaseLandDataID', user.LeaseLandDataID)
          request.input('newLandSize', user.newLandSize)
          let results = await request.execute('dbo.ApproveUpdatedLandSizeDetails')
          res.json({
            success: true,
            message: "Approved updated landSize details successfully",
            results: results.recordset
          }
           );
        }
  }
   catch (error) {
      console.error('Error approving updated landSize details :', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async function ViewAdminNotifications(req, res) {
    try{
          let sql = await mssql.connect(config);
          let user = req.body;
          const userID = req.decodedToken.userID;
          if (sql.connected) {
            let request = new mssql.Request(sql);
            let results = await request.execute('dbo.ViewAdminNotifications')
            res.json({
              success: true,
              message: "Viewed admin notifications successfully",
              results: results.recordset
            }
             );
          }
    }
     catch (error) {
        console.error('Error viewing admin notifications :', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }

    async function ViewAllUsers(req, res) {
      try{
            let sql = await mssql.connect(config);
            if (sql.connected) {
              let request = new mssql.Request(sql);
              let results = await request.execute('dbo.getUsers')
              res.json({
                success: true,
                message: "Viewed all users successfully",
                results: results.recordset
              }
               );
            }
      }
       catch (error) {
          console.error('Error viewing all users :', error);
          res.status(500).json({ error: 'Internal server error' });
        }
      }

module.exports = {
  ApproveUpdatedLandSizeDetails,
  ApproveWithdrawLeaseRequest,
  ApproveLeaseRequest,
  ViewAdminNotifications,
  ViewPendingLeaseRequests,
  DeclineLeaseRequest,
  ViewAllUsers
}