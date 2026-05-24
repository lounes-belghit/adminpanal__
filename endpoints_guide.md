# Bike Rental System - Frontend API Guide

This guide provides the essential information for frontend developers to integrate with the Bike Rental System API.

## Base URL
```
http://localhost:8080/api/v1
```

---

## 🔐 Authentication

The API uses stateless **JWT (JSON Web Tokens)**.

1.  **Login**: Call `POST /auth/login` to receive an `access_token` (named `token`) and a `refreshToken`.
2.  **Storage**: Securely store both tokens (e.g., in `localStorage` or `AsyncStorage`).
3.  **Usage**: Include the access token in the `Authorization` header for all protected requests:
    ```
    Authorization: Bearer <your_token_here>
    ```
4.  **Refresh**: When the access token expires (401 Unauthorized), call `POST /auth/refresh-token` with your `refreshToken` to get a new pair.

---

## 📋 Endpoint Reference

### 1. Authentication & Identity
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/auth/register` | `POST` | No | Register a new user |
| `/auth/login` | `POST` | No | Login (returns `token` + `refreshToken`) |
| `/auth/refresh-token` | `POST` | No | Get new tokens using refresh token |
| `/auth/logout` | `POST` | Yes | Invalidate session (stateless) |
| `/auth/me` | `GET` | Yes | Get currently logged-in user profile |
| `/users/profile` | `PUT` | Yes | Update name or phone |
| `/users/verification-status` | `GET` | Yes | Check if user is ID-verified |

### 2. Stations & Bikes
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/stations` | `GET` | Yes | List all stations |
| `/stations/{id}` | `GET` | Yes | Get specific station details |
| `/stations/nearby` | `GET` | Yes | Find stations by lat/lon/radius |
| `/bikes/available` | `GET` | Yes | List available bikes at a station |
| `/bikes/{id}/status` | `GET` | Yes | Quick status check (battery, location) |

### 3. Rental Operations
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/rentals/start` | `POST` | Yes | Start a rental (requires `bikeId`) |
| `/rentals/active` | `GET` | Yes | Get user's current ongoing rental |
| `/rentals/end/{id}` | `POST` | Yes | End rental (requires `endStationId`) |
| `/rentals/history` | `GET` | Yes | Get user's past rentals |
| `/rentals/{id}` | `GET` | Yes | Get details of a specific rental |

### 4. Points & Transactions
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/points/balance` | `GET` | Yes | Get current point balance |
| `/points/purchase` | `POST` | Yes | Buy points (simulated payment) |
| `/points/transactions` | `GET` | Yes | History of earning/spending points |
| `/points/topup` | `POST` | **Worker** | Worker-only: refill user points |

### 5. Worker & Admin
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/auth/worker/login` | `POST` | No | Separate login for sales workers |
| `/workers/me` | `GET` | Yes | Worker's own profile info |
| `/admin/dashboard` | `GET` | **Admin** | High-level system stats |
| `/admin/bikes` | `GET` | **Admin** | List all bikes in the fleet |
| `/admin/rentals` | `GET` | **Admin** | List all rentals in the system |

---

## 📦 Request/Response Format

### Standard Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Standard Error Response
```json
{
  "success": false,
  "data": null,
  "message": "Error description here"
}
```

### Common HTTP Status Codes
- `200 OK`: Request succeeded.
- `201 Created`: Resource (rental, user) created.
- `400 Bad Request`: Validation error (missing fields, invalid format).
- `401 Unauthorized`: Token missing or invalid.
- `403 Forbidden`: User lacks required role (e.g., trying admin endpoint).
- `404 Not Found`: Resource doesn't exist.
- `409 Conflict`: Business rule violation (e.g., bike already rented, insufficient points).

---

## 🚀 Pro-Tips for Frontend
- **Polling**: For the active rental screen, poll `GET /rentals/active` every 30 seconds to update duration/cost.
- **Location**: Use `GET /stations/nearby` with the device's GPS coordinates for the landing page map.
- **Verification**: Always check `/users/verification-status` before enabling the "Scan QR to Rent" button.
