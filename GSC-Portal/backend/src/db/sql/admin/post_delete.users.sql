-- POST USERS
UPDATE user_account
SET status = 'active'
WHERE user_id = ?;

-- DELETE USERS
DELETE FROM user_account
WHERE user_id = ?;
