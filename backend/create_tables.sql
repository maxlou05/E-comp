CREATE TABLE IF NOT EXISTS Users (
    Username VARCHAR(50) NOT NULL,
    HashedPassword CHAR(64) NOT NULL,
    PRIMARY KEY (Username)
);

CREATE TABLE IF NOT EXISTS Events (
    EventID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    Host VARCHAR(50) NOT NULL,
    EventName VARCHAR(100) NOT NULL,
    EventDescription VARCHAR(500),
    EventIcon MEDIUMBLOB,  -- This stores up to 16MB
    EventStart TIMESTAMP NOT NULL,
    EventEnd TIMESTAMP NOT NULL,
    ResultsDate TIMESTAMP,
    Announcement VARCHAR(250),
    Team BOOLEAN NOT NULL,
    Teams VARCHAR(65535),  -- This one will be storing a JSON sting
    Public BOOLEAN NOT NULL,
    PRIMARY KEY (EventID),
    CONSTRAINT FK_Host FOREIGN KEY (Host) REFERENCES Users(Username)
);

CREATE TABLE IF NOT EXISTS Participants (
    JoinLog INT UNSIGNED NOT NULL AUTO_INCREMENT,
    User VARCHAR(50) NOT NULL,
    JoinedEvent INT UNSIGNED NOT NULL,
    Team VARCHAR(50),
    PRIMARY KEY (JoinLog),
    CONSTRAINT FK_Username FOREIGN KEY (User) REFERENCES Users(Username),
    CONSTRAINT FK_Joined FOREIGN KEY (JoinedEvent) REFERENCES Events(EventID)
);

CREATE TABLE IF NOT EXISTS ActivitySets (
    ActivitySetID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    SetName VARCHAR(100) NOT NULL,
    SetStart TIMESTAMP NOT NULL,
    SetEnd TIMESTAMP NOT NULL,
    MaxSubmissions INT UNSIGNED,
    EventID INT UNSIGNED NOT NULL,
    PRIMARY KEY (ActivitySetID),
    CONSTRAINT FK_EventID FOREIGN KEY (EventID) REFERENCES Events(EventID)
);

CREATE TABLE IF NOT EXISTS Activities (
    ActivityID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    ActivitySetID INT UNSIGNED NOT NULL,
    ActivityName VARCHAR(100) NOT NULL,
    ActivityDescription VARCHAR(500),
    InputType ENUM("num", "str", "pdf", "jpg", "png") NOT NULL,  -- IDK, put all types that will be supported here
    GradingType ENUM("points", "answer", "judge") NOT NULL,
    PointValue INT,
    Answer VARCHAR(500),
    PRIMARY KEY (ActivityID),
    CONSTRAINT FK_ActivitySetID FOREIGN KEY (ActivitySetID) REFERENCES ActivitySets(ActivitySetID)
);

CREATE TABLE IF NOT EXISTS Submissions (
    SubmissionID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    ActivityID INT UNSIGNED NOT NULL,
    User VARCHAR(50) NOT NULL,
    Team VARCHAR(50),
    SubmittedAt TIMESTAMP NOT NULL,
    InputType ENUM("num", "str", "pdf", "jpg", "png") NOT NULL,
    NumSubmission DECIMAL(20, 10),
    StrSubmission VARCHAR(500),
    FileSubmission MEDIUMBLOB,
    Mark INT,
    Graded BOOLEAN NOT NULL,
    PRIMARY KEY (SubmissionID),
    CONSTRAINT FK_ActivityID FOREIGN KEY (ActivityID) REFERENCES Activities(ActivityID),
    CONSTRAINT FK_Submitter FOREIGN KEY (User) REFERENCES Users(Username)
);
