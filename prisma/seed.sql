INSERT INTO "Role" (
  id,name, description,
  "createUser", "deleteUser", "updateUser", "readUser",
  "createDocument", "updateDocument", "deleteDocument", "readDocument",
  "createComment", "deleteComment", "readComment"
) VALUES
(
    gen_random_uuid(),
  'ADMIN',
  'Administrator with full access',
  TRUE, TRUE, TRUE, TRUE,
  TRUE, TRUE, TRUE, TRUE,
  TRUE, TRUE, TRUE
),
(
    gen_random_uuid(),
  'USER',
  'Authenticated user with standard permissions',
  FALSE, FALSE, FALSE, FALSE,
  TRUE, TRUE, FALSE, TRUE,
  TRUE, TRUE, TRUE
),
(
    gen_random_uuid(),
  'PUBLICUSER',
  'Guest user with limited read access',
  FALSE, FALSE, FALSE, FALSE,
  FALSE, FALSE, FALSE, TRUE,
  FALSE, FALSE, TRUE
);