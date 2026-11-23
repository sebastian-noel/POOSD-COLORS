CREATE TABLE Colors (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(50) NOT NULL,
    UserID INT NOT NULL
);

INSERT INTO Colors (Name, UserID) VALUES
    ('Blue', 42),
    ('Red', 42),
    ('Light Blue', 43);
