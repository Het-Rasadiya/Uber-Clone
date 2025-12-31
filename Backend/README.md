# Users API — `/users/register`

✅ **Create a new user account**

## Overview
This endpoint allows clients to register a new user. It validates input, hashes the password, stores the user, and returns a JSON Web Token (JWT) on success.

---

## Endpoint
- **Method:** `POST`
- **URL:** `/users/register` (mounted at `/users` in `app.js`)
- **Headers:**
  - `Content-Type: application/json`

## Request Body
Send a JSON object with the following shape:

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "johndoe@example.com",
  "password": "secret123"
}
```

### Validation rules
| Field | Type | Required | Rules |
| --- | --- | ---: | --- |
| `fullname.firstname` | string | ✅ | min length 2 characters |
| `fullname.lastname` | string | ✅ | min length 2 characters |
| `email` | string | ✅ | valid email format |
| `password` | string | ✅ | min length 6 characters |

> ⚠️ Note: The route uses express-validator to enforce the rules shown above.

---

## Responses
| Status | Meaning | Body example |
| ---: | --- | --- |
| `201 Created` ✅ | Registration successful. Returns the created user (password omitted) and an auth token. | ```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "<id>",
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "johndoe@example.com",
    "socketId": null
  },
  "token": "<jwt-token>"
}
``` |
| `400 Bad Request` ⚠️ | Validation failed. The response contains an `errors` array from `express-validator`. | ```json
{
  "errors": [ { "msg": "Invalid email address", "param": "email", "location": "body" } ]
}
``` |
| `409 Conflict` ⚠️ | Email already exists (duplicate key from Mongo/Mongoose). | ```json
{ "message": "Email already exists" }
``` |
| `500 Internal Server Error` ⚠️ | Server or database error. | ```json
{ "message": "Internal server error" }
``` |

### Example: Successful Response

Below is an example JSON returned when registration succeeds (`201 Created`):

```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "64b7f3e9a1b2c3d4e5f67890",
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "johndoe@example.com",
    "socketId": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

- Note: The `password` is not returned. The `token` is a JWT that the client can use for authenticated requests.

---

## Notes & Implementation details
- Passwords are hashed using `bcrypt` before storing (`user.model.js` provides `hashPassword`).
- The `password` field is set to `select: false` in the model, so it won't be returned in queries by default.
- A JWT token is signed with `process.env.JWT_SECRET`. Make sure `JWT_SECRET` is set in your `.env`.
- The endpoint is mounted under `/users` in `app.js` (so full path is `/users/register`).

---

## Example cURL
```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{"fullname":{"firstname":"John","lastname":"Doe"},"email":"johndoe@example.com","password":"secret123"}'
```

---

💡 If you'd like, I can add documentation for additional user endpoints (login, profile, etc.).
