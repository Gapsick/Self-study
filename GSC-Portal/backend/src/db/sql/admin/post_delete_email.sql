-- POST Email
INSERT INTO allowed_email (email)
VALUES (?);


-- DELETE Email
DELETE FROM allowed_email
WHERE email_id = ?;

