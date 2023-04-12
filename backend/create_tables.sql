CREATE TABLE IF NOT EXISTS users (
    Username VARCHAR(64) NOT NULL,
    HashedPassword VARCHAR(64) NOT NULL,
    PRIMARY KEY (Username)
);

CREATE TABLE IF NOT EXISTS events (
    EventID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    Host VARCHAR(64) NOT NULL,
    EventName VARCHAR(128) NOT NULL,
    EventDescription VARCHAR(512),
    EventIcon MEDIUMBLOB,  -- This stores up to 16MB
    EventStart TIMESTAMP NOT NULL,
    EventEnd TIMESTAMP NOT NULL,
    ResultsDate TIMESTAMP,
    Announcement VARCHAR(256),
    Team BOOLEAN NOT NULL,
    Teams TEXT,  -- This one will be storing a JSON sting
    CurrentActivityset INT UNSIGNED,
    PRIMARY KEY (EventID),
    CONSTRAINT FK_Host FOREIGN KEY (Host) REFERENCES users(Username)
);

CREATE TABLE IF NOT EXISTS participants (
    JoinLog INT UNSIGNED NOT NULL AUTO_INCREMENT,
    Username VARCHAR(64),
    JoinedEvent INT UNSIGNED,
    Team VARCHAR(64),
    PRIMARY KEY (JoinLog),
    CONSTRAINT FK_Username FOREIGN KEY (Username) REFERENCES users(Username),
    CONSTRAINT FK_Joined FOREIGN KEY (JoinedEvent) REFERENCES events(EventID)
);

CREATE TABLE IF NOT EXISTS activitysets (
    ActivitysetID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    SetName VARCHAR(128) NOT NULL,
    SetStart TIMESTAMP NOT NULL,
    SetEnd TIMESTAMP NOT NULL,
    MaxSubmissions TINYINT UNSIGNED NOT NULL,
    EventID INT UNSIGNED,
    PRIMARY KEY (ActivitysetID),
    CONSTRAINT FK_EventID FOREIGN KEY (EventID) REFERENCES events(EventID)
);

ALTER TABLE events
ADD CONSTRAINT FK_Activityset FOREIGN KEY (CurrentActivityset) REFERENCES activitysets(ActivitysetID);

CREATE TABLE IF NOT EXISTS activities (
    ActivityID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    ActivitysetID INT UNSIGNED,
    ActivityName VARCHAR(128) NOT NULL,
    ActivityDescription VARCHAR(512),
    InputType ENUM("num", "str", "pdf", "jpg", "png"),  -- IDK, put all types that will be supported here
    GradingType ENUM("points", "answer", "judge"),
    PointValue INT,
    Answer VARCHAR(512),
    MaxMark INT,
    PRIMARY KEY (ActivityID),
    CONSTRAINT FK_ActivitysetID FOREIGN KEY (ActivitysetID) REFERENCES activitysets(ActivitysetID)
);

CREATE TABLE IF NOT EXISTS submissions (
    SubmissionID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    ActivityID INT UNSIGNED,
    Username VARCHAR(64),
    Team VARCHAR(64),
    SubmittedAt TIMESTAMP NOT NULL,
    InputType ENUM("num", "str", "pdf", "jpg", "png"),
    NumSubmission DECIMAL(20, 10),
    StrSubmission VARCHAR(512),
    FileSubmission MEDIUMBLOB,
    Mark INT,
    Graded BOOLEAN NOT NULL,
    PRIMARY KEY (SubmissionID),
    CONSTRAINT FK_ActivityID FOREIGN KEY (ActivityID) REFERENCES activities(ActivityID),
    CONSTRAINT FK_Submitter FOREIGN KEY (Username) REFERENCES users(Username)
);
