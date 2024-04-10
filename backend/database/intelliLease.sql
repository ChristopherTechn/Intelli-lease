--CREATE DATABASE intelliLease

USE intelliLease

CREATE TABLE Tokens (
    TokenID UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    UserID UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Users,
    Token NVARCHAR(500) NOT NULL,
    ExpiryDate DATETIME NOT NULL,
	IsDeleted INT DEFAULT 0,
);

DROP TABLE Tokens

CREATE TABLE Users(
	UserID UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
	FirstName VARCHAR(60) NOT NULL,
    LastName VARCHAR(60) NOT NULL,
    UserEmail VARCHAR(60) UNIQUE,
    UserPasswordHash VARCHAR(60) NOT NULL,
	timeStamp DATETIME DEFAULT CURRENT_TIMESTAMP,
	IsAccountDeleted BIT DEFAULT 0
)
DROP TABLE Users

CREATE TABLE Admin(
	AdminID UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
	FirstName VARCHAR(60) NOT NULL,
    LastName VARCHAR(60) NOT NULL,
    AdminEmail VARCHAR(60) UNIQUE,
    AdminPasswordHash VARCHAR(60) NOT NULL,
	timeStamp DATETIME DEFAULT CURRENT_TIMESTAMP,
	IsAccountDeleted BIT DEFAULT 0
)
DROP TABLE Admin


CREATE TABLE userProfile(
	ProfileID UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
	UserID UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Users,
	UserName VARCHAR(60),
    ProfileImage VARCHAR(255),
    UserEmail VARCHAR(60) UNIQUE,
    PhoneNumber VARCHAR(60) NOT NULL,
	Gender VARCHAR(60),
	timeStamp DATETIME DEFAULT CURRENT_TIMESTAMP,
	isProfileDeleted BIT DEFAULT 0
)
DROP TABLE userProfile


CREATE TABLE leaseLandData(
	LeaseLandDataID UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
	UserID UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Users,
	CountyName VARCHAR(60),
	SubCountyName VARCHAR(60),
	ConstituencyName VARCHAR(60),
	LandSize INT,
	timeStamp DATETIME DEFAULT CURRENT_TIMESTAMP,
	isApproved BIT DEFAULT 0,
	isDeleted BIT DEFAULT 0
)

DROP TABLE leaseLandData


CREATE TABLE Notifications(
	NotificationsID UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
	UserID UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Users,
	ReceipientID UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Users,
	NotificationContent VARCHAR(255),
	timeStamp DATETIME DEFAULT CURRENT_TIMESTAMP,
	isRead BIT DEFAULT 0
)
DROP TABLE Notifications

CREATE TABLE Predictions (
	PredictionID UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
	UserID UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Users,
	ReceipientID UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Users,
	NotificationContent VARCHAR(255),
	timeStamp DATETIME DEFAULT CURRENT_TIMESTAMP,
	isRead BIT DEFAULT 0
)
DROP TABLE Predictions


--Stored Procedures
CREATE PROCEDURE AddUser
	@FirstName varchar(60),
	@LastName varchar(60),
	@UserEmail varchar(60), 
	@UserPasswordHash varchar(60)
AS
BEGIN
	IF EXISTS (SELECT 1 FROM Users WHERE UserEmail = @UserEmail)
	BEGIN
		RAISERROR('The user already exists.', 16, 1);
		RETURN;
	END
	INSERT INTO Users (FirstName, LastName, UserEmail, UserPasswordHash)
	VALUES (@FirstName, @LastName, @UserEmail, @UserPasswordHash)
	
END;

DROP PROCEDURE AddUser

EXEC AddUser 'Rashad', 'Khalif', 'khalif@gmail.com', 'password321'
SELECT * FROM Users



--Edit username
CREATE PROCEDURE EditUsername
	@userID UNIQUEIDENTIFIER,
	@newUserName VARCHAR(60)
AS 
BEGIN
	IF EXISTS(SELECT 1 FROM userProfile WHERE UserName = @newUserName)
	BEGIN
		RAISERROR('New username already exists!', 16, 1)
		RETURN;
	END

	UPDATE userProfile
	SET UserName = @newUserName
	WHERE UserID = @userID;

	SELECT 'Username updated successfully.' AS Result;
END

EXEC EditUsername @userID=7, @newUserName='Kokomelon'

--delete account
CREATE PROCEDURE DeleteAccount
	@userID UNIQUEIDENTIFIER
AS
BEGIN
	DECLARE @firstName VARCHAR(60);

	SELECT @firstName = FirstName
	FROM Users
	WHERE UserID = @userID;

	UPDATE Users
	SET IsAccountDeleted = 1
	WHERE UserID = @userID;

	SELECT CONCAT(@firstName, ', your account has been deleted.') AS Result;
END;

EXEC DeleteAccount @userID='0F2D9837-7E86-48D0-94A8-D707794B0482';

--ADMIN--View all USERS
CREATE PROCEDURE ViewUsers
AS
BEGIN
	SELECT * FROM Users
END

EXEC ViewUsers

--View profile
CREATE PROCEDURE ViewProfile
	@UserID UNIQUEIDENTIFIER
AS
BEGIN
	SELECT * FROM userProfile
	WHERE @UserID = UserID
END


--ADMIN--View lease requests
CREATE PROCEDURE ViewPendingLeaseRequests
AS
BEGIN
	SELECT * FROM leaseLandData
	WHERE isApproved = 0
END

DROP PROCEDURE ViewLeaseRequests

EXEC ViewPendingLeaseRequests

CREATE PROCEDURE ViewApprovedLeaseRequests
AS
BEGIN
	SELECT * FROM leaseLandData
	WHERE isApproved = 1
END

DROP PROCEDURE ViewApprovedLeaseRequests

--ViewLeaseRequests

CREATE PROC UserViewPendingLeaseRequests
	@UserID UNIQUEIDENTIFIER
AS
BEGIN
	SELECT * FROM leaseLandData
	WHERE UserID = @UserID AND isApproved=0
END

EXEC ViewPendingLeaseRequests

CREATE PROC UserViewApprovedLeaseRequests
	@UserID UNIQUEIDENTIFIER
AS
BEGIN
	SELECT * FROM leaseLandData
	WHERE UserID = @UserID AND isApproved=1
END
EXEC UserViewApprovedLeaseRequests
--Approve lease requests
CREATE PROCEDURE ApproveLeaseRequest
	@UserID UNIQUEIDENTIFIER,
	@LeaseLandDataID UNIQUEIDENTIFIER
AS
BEGIN
	DECLARE @firstName VARCHAR(60);

	SELECT @firstName = FirstName
	FROM Users
	WHERE UserID = @UserID;

	UPDATE leaseLandData
	SET IsApproved = 1
	WHERE UserID = @UserID AND LeaseLandDataID = @LeaseLandDataID;

	DECLARE @AdminID UNIQUEIDENTIFIER;
	DECLARE @notificationMessage VARCHAR(255)
	SET @notificationMessage = '@' + @firstName + ' your lease request was approved. Your land can now be viewed and leased via our application'

	INSERT INTO Notifications(UserID, ReceipientID, NotificationContent)
	VALUES(@AdminID, @UserID, @notificationMessage)

	DECLARE @notificationMessage1 VARCHAR(255)
	SET @notificationMessage1 = '@' + @firstName + ' your lease request was approved. Your land can now be viewed and leased via our application'

	INSERT INTO Notifications(UserID, ReceipientID, NotificationContent)
	VALUES(@AdminID, @UserID, @notificationMessage1)
END
DROP PROCEDURE ApproveLeaseRequest

EXEC ApproveLeaseRequest '1FBFB730-8D35-42EC-942E-BC8AF5E16014', '8039F23A-88E1-4820-9532-6729BEF0CCA2'


--Send Lease Request
CREATE PROCEDURE SendLeaseRequest
	@UserID UNIQUEIDENTIFIER,
	@CountyName VARCHAR(60),
	@SubCountyName VARCHAR(60),
	@ConstituencyName VARCHAR(60),
	@LandSize INT
AS
BEGIN
	INSERT INTO leaseLandData (UserID, CountyName, SubCountyName, ConstituencyName, LandSize)
	VALUES (@UserID, @CountyName, @SubCountyName, @ConstituencyName, @LandSize)
	
	DECLARE @firstName VARCHAR(60);

	SELECT @firstName = FirstName
	FROM Users
	WHERE UserID = @userID;

	DECLARE @AdminID UNIQUEIDENTIFIER;

	SELECT @AdminID = AdminID
	FROM Admin
	WHERE @AdminID = AdminID

	
	DECLARE @notificationMessage VARCHAR(255)
	SET @notificationMessage = '@' + @firstName + ' sent a lease request'

	INSERT INTO Notifications(UserID, ReceipientID, NotificationContent)
	VALUES(@UserID, @AdminID, @notificationMessage)

	DECLARE @notificationMessage1 VARCHAR(255)
	SET @notificationMessage1 = '@' + @firstName + ' your lease request was received and is being processed'

	INSERT INTO Notifications(UserID, ReceipientID, NotificationContent)
	VALUES(@AdminID, @UserID, @notificationMessage)
END;

DROP proc  SendLeaseRequest
EXEC SendLeaseRequest '1FBFB730-8D35-42EC-942E-BC8AF5E16014', 'Mombasa', 'Changamwe', 'Msamweni', 100


--
SELECT* FROM Users
SELECT* FROM Notifications

--Withdraw Lease Request
CREATE PROCEDURE WithdrawLeaseRequest
	@UserID UNIQUEIDENTIFIER,
	@LeaseLandDataID UNIQUEIDENTIFIER
AS
BEGIN
	DECLARE @firstName VARCHAR(60);

	SELECT @firstName = FirstName
	FROM Users
	WHERE UserID = @UserID;

	DECLARE @AdminID UNIQUEIDENTIFIER;
	DECLARE @notificationMessage VARCHAR(255)
	SET @notificationMessage = '@' + @firstName + ' your lease withdrawal request has been approved.'

	INSERT INTO Notifications(UserID, ReceipientID, NotificationContent)
	VALUES(@AdminID, @UserID, @notificationMessage)

	DECLARE @notificationMessage1 VARCHAR(255)
	SET @notificationMessage1 = 'Your withdrew' + '@' + @firstName + ' lease request'

	INSERT INTO Notifications(UserID, ReceipientID, NotificationContent)
	VALUES(@AdminID, @UserID, @notificationMessage1)
END

--Approve Withdraw Lease Request
CREATE PROCEDURE ApproveWithdrawLeaseRequest
	@UserID UNIQUEIDENTIFIER,
	@LeaseLandDataID UNIQUEIDENTIFIER
AS
BEGIN
	DECLARE @firstName VARCHAR(60);

	SELECT @firstName = FirstName
	FROM Users
	WHERE UserID = @UserID;

	UPDATE leaseLandData
	SET IsDeleted = 1
	WHERE UserID = @UserID AND LeaseLandDataID = @LeaseLandDataID;

	DECLARE @AdminID UNIQUEIDENTIFIER;
	DECLARE @notificationMessage VARCHAR(255)
	SET @notificationMessage = '@' + @firstName + ' your lease withdrawal request has been approved.'

	INSERT INTO Notifications(UserID, ReceipientID, NotificationContent)
	VALUES(@AdminID, @UserID, @notificationMessage)

	DECLARE @notificationMessage1 VARCHAR(255)
	SET @notificationMessage1 = 'Your withdrew' + '@' + @firstName + ' lease request'

	INSERT INTO Notifications(UserID, ReceipientID, NotificationContent)
	VALUES(@AdminID, @UserID, @notificationMessage1)
END
DROP PROCEDURE WithdrawLeaseRequest

--Update lease details
CREATE PROCEDURE UpdateLandSizeDetails
	@UserID UNIQUEIDENTIFIER,
	@LeaseLandDataID UNIQUEIDENTIFIER,
	@newLandSize INT
AS
BEGIN
	DECLARE @firstName VARCHAR(60);

	SELECT @firstName = FirstName
	FROM Users
	WHERE UserID = @UserID;

	DECLARE @AdminID UNIQUEIDENTIFIER;
	DECLARE @notificationMessage VARCHAR(255)
	SET @notificationMessage = '@' + @firstName + ' your land size update request has been received pending approval.'

	INSERT INTO Notifications(UserID, ReceipientID, NotificationContent)
	VALUES(@AdminID, @UserID, @notificationMessage)

	DECLARE @notificationMessage1 VARCHAR(255)
	SET @notificationMessage1 = '@' + @firstName + ' sent an update land size request'

	INSERT INTO Notifications(UserID, ReceipientID, NotificationContent)
	VALUES(@AdminID, @UserID, @notificationMessage1)
END

--Approve Update lease details
CREATE PROCEDURE ApproveUpdatedLandSizeDetails
	@UserID UNIQUEIDENTIFIER,
	@LeaseLandDataID UNIQUEIDENTIFIER,
	@newLandSize INT
AS
BEGIN
	DECLARE @firstName VARCHAR(60);

	SELECT @firstName = FirstName
	FROM Users
	WHERE UserID = @UserID;

	UPDATE leaseLandData
	SET LandSize = @newLandSize
	WHERE UserID = @UserID AND LeaseLandDataID = @LeaseLandDataID;

	DECLARE @AdminID UNIQUEIDENTIFIER;
	DECLARE @notificationMessage VARCHAR(255)
	SET @notificationMessage = '@' + @firstName + ' your land size has been updated.'

	INSERT INTO Notifications(UserID, ReceipientID, NotificationContent)
	VALUES(@AdminID, @UserID, @notificationMessage)

	DECLARE @notificationMessage1 VARCHAR(255)
	SET @notificationMessage1 = 'Your approved' + '@' + @firstName + ' land size update'

	INSERT INTO Notifications(UserID, ReceipientID, NotificationContent)
	VALUES(@AdminID, @UserID, @notificationMessage1)
END


CREATE PROC ViewNotifications
	@UserID UNIQUEIDENTIFIER
AS
BEGIN
	SELECT * FROM Notifications
	WHERE ReceipientID = @UserID
END

EXEC ViewNotifications '1FBFB730-8D35-42EC-942E-BC8AF5E16014'

CREATE PROC ViewAdminNotifications
AS
BEGIN
	SELECT * FROM Notifications
	WHERE ReceipientID IS NULL
END

DROP PROC ViewAdminNotifications
EXEC ViewAdminNotifications

--Create Profile
CREATE PROC CreateProfile
	@UserID UNIQUEIDENTIFIER,
	@UserName VARCHAR(60),
    @ProfileImage VARCHAR(255),
    @UserEmail VARCHAR(60),
    @PhoneNumber VARCHAR(60),
	@Gender VARCHAR(60)
AS
BEGIN
	INSERT INTO userProfile(UserID, UserName, ProfileImage, UserEmail, PhoneNumber, Gender)
	VALUES(@UserID, @UserName, @ProfileImage, @UserEmail, @PhoneNumber, @Gender)
END

SELECT * FROM Users

CREATE PROCEDURE loginProcedure
	  @UserEmail VARCHAR(60)
AS
BEGIN
	IF EXISTS (SELECT 1 FROM Users WHERE UserEmail = @UserEmail)
	BEGIN
		RETURN 'Logged in successfully' 
	END
END

SELECT * FROM Tokens
INSERT INTO Tokens (UserID, Token, ExpiryDate)
VALUES ('12345678o', '456789', '')


