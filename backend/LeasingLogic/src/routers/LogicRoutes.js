const express = require("express");
const logicRoutes = express.Router();
const {
  EditUsername,
  ViewProfile,
  DeleteAccount,
  ViewNotifications,
  CreateProfile,
  getUserDetails,
} = require("../controllers/UserDetails");
const {
  addLandLeasingDetails,
  withdrawLandLeasingDetails,
  UpdateLandSizeDetails,
  UserViewPendingLeaseRequests,
  UserViewApprovedLeaseRequests,
  UserViewApprovedLeaseRequestsByCounty,
  LeaseLand,
} = require("../controllers/LeasingDetails");
const {
  ApproveUpdatedLandSizeDetails,
  ApproveWithdrawLeaseRequest,
  ApproveLeaseRequest,
  ViewAdminNotifications,
  ViewPendingLeaseRequests,
  DeclineLeaseRequest,
  ViewAllUsers,
} = require("../controllers/AdminDetails");
const userMiddleware = require("../middlewares/userMiddlewares");
const { log } = require("console");

logicRoutes.post('/getUserDetails', getUserDetails)
logicRoutes.post('/user-view-approved-lease-requests-by-county', UserViewApprovedLeaseRequestsByCounty)
logicRoutes.use(userMiddleware);
logicRoutes.post('/edit-username', EditUsername)
logicRoutes.post('/create-profile', CreateProfile)
logicRoutes.post('/view-profile', ViewProfile)
logicRoutes.get('/delete-account', DeleteAccount)
logicRoutes.post('/view-notifications', ViewNotifications)
logicRoutes.get('/view-admin-notifications', ViewAdminNotifications)
logicRoutes.post('/add-land-leasing-details', addLandLeasingDetails)
logicRoutes.post('/withdraw-land-leasing-details', withdrawLandLeasingDetails)
logicRoutes.post('/update-land-size-details', UpdateLandSizeDetails)
logicRoutes.post('/user-view-pending-lease-requests', UserViewPendingLeaseRequests)
logicRoutes.post('/user-view-approved-lease-requests', UserViewApprovedLeaseRequests)
logicRoutes.post('/approve-withdraw-lease-request', ApproveWithdrawLeaseRequest)
logicRoutes.post('/approve-lease-request', ApproveLeaseRequest)
logicRoutes.post('/decline-lease-request', DeclineLeaseRequest)
logicRoutes.post('/view-pending-lease-requests', ViewPendingLeaseRequests)
logicRoutes.post('/lease-land', LeaseLand)
logicRoutes.get('/all-users', ViewAllUsers)


module.exports = logicRoutes;
