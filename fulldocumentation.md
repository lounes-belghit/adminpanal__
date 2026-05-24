# Bike Rental System - Full Documentation

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Features](#2-features)
3. [Technology Stack](#3-technology-stack)
4. [Prerequisites](#4-prerequisites)
5. [Quick Start Guide](#5-quick-start-guide)
6. [Database Setup](#6-database-setup)
7. [Configuration](#7-configuration)
8. [Running the Application](#8-running-the-application)
9. [API Endpoints](#9-api-endpoints)
10. [Request/Response Formats](#10-requestresponse-formats)
11. [Error Handling](#11-error-handling)
12. [Security](#12-security)
13. [Business Rules](#13-business-rules)
14. [Testing](#14-testing)
15. [Project Structure](#15-project-structure)

---

## 1. Project Overview

The **Bike Rental System** is a robust, location-aware bike rental backend built for the Algerian market. It allows users to rent bicycles from stations across cities using NFC tags, QR codes, and GPS tracking, with an integrated points-based loyalty system.

### Core Purpose
- Enable users to register and verify their identity
- Rent bikes from designated stations
- Return bikes at any station
- Earn and spend points through a loyalty program

### Base URL
```
http://localhost:8080/api/v1
```

---

## 2. Features

| Feature | Description |
|---------|-------------|
| **User Management** | Secure registration, login, and profile updates |
| **Identity Verification** | Document verification via NFC/QR/Manual methods |
| **Fleet Management** | Station-based bike tracking and status management |
| **Bike Rentals** | Full rental lifecycle (Start/End) with point-based billing |
| **Points System** | Earn points from purchases, spend on rentals |
| **GPS Tracking** | Real-time bike location tracking |
| **Maintenance Tracking** | Bike maintenance records |
| **Audit Logging** | Comprehensive audit trail for all operations |
| **Security** | JWT authentication (with roles) and salted password hashing (BCrypt) |
| **User Roles** | Multi-level access: `user`, `admin`, `super_admin` |

---

## 3. Technology Stack

| Component | Technology |
|-----------|------------|
| **Language** | Java 17+ |
| **Framework** | Javalin 6.1.3 |
| **Database** | MySQL 8.0+ |
| **Connection Pool** | HikariCP 5.1.0 |
| **Authentication** | JWT (jjwt 0.11.5) |
| **Password Hashing** | BCrypt (jbcrypt 0.4) |
| **JSON Processing** | Jackson 2.17.0 / Gson 2.10.1 |
| **Logging** | Log4j / SLF4J |
| **Validation** | Hibernate Validator 8.0.1.Final |
| **Build Tool** | Maven 3.8+ |
| **Testing** | JUnit 5, Mockito, AssertJ |

---

## 4. Prerequisites

Before running the application, ensure you have the following installed:

### Required Software
- **Java Development Kit (JDK)**: Version 17 or higher
- **Maven**: Version 3.8 or higher
- **MySQL**: Version 8.0 or higher (or Docker)

### Optional (for containerized setup)
- **Docker Desktop**: For running MySQL in a container

---

## 5. Quick Start Guide

### Option A: Using Docker (Recommended)

1. **Start the Database**:
   ```bash
   docker-compose up -d
   ```
   This initializes the MySQL database and applies the schema from `db.sql` automatically.

2. **Run the Application**:
   ```bash
   mvn compile exec:java -Dexec.mainClass="com.bykerantel.Main"
   ```

3. **Verify Server is Running**:
   Open your browser to: `http://localhost:8080/api/v1/stations/list`
   (Note: This endpoint requires authentication, so use Postman or cURL with a token)

### Option B: Running the JAR File

1. **Navigate to the final folder**:
   ```bash
   cd final
   ```

2. **Start the database**:
   ```bash
   docker-compose up -d
   ```

3. **Run the application**:
   ```bash
   java -jar app.jar
   ```

---

## 6. Database Setup

### Database Schema

The application uses MySQL with the following main tables:

| Table | Description |
|-------|-------------|
| `Users` | Registered user accounts |
| `UserIdentities` | Verified identity documents |
| `Stations` | Bike pickup/drop locations |
| `Bikes` | Rental bicycles |
| `Rentals` | Active and completed rentals |
| `PointTransactions` | Points earning/spending history |
| `SalePoints` | Physical purchase locations |
| `BikeMaintenance` | Service records |
| `AuditLogs` | System activity tracking |

### Database Triggers

The system uses MySQL triggers for data integrity:

1. **`trg_rental_insert_verify`**: Enforces identity verification before a user can rent
2. **`trg_bike_after_update`**: Automatically updates available bike count in stations

### Initial Setup

The database is automatically created when using Docker:

```bash
# Using docker-compose (recommended)
docker-compose up -d

# Manual setup (if not using Docker)
mysql -u root -p < db.sql
```

### Default Database Credentials

| Property | Default Value |
|----------|---------------|
| Host | localhost |
| Port | 3306 |
| Database | BikeRentalDB |
| Username | root |
| Password | root |

---

## 7. Configuration

### Application Properties

Located at: `src/main/resources/application.properties`

```properties
# Application Configuration
server.port=8080
server.contextPath=/api/v1

# JWT Configuration
jwt.secret=your-super-secret-key-that-should-be-at-least-thirty-two-characters-long
jwt.expiration=86400000
jwt.refreshExpiration=604800000

# App Metadata
app.name=Bike Rental System (Algeria)
app.version=1.0.0
```

### Database Properties

Located at: `src/main/resources/database.properties`

```properties
# Database Connection Pool (HikariCP)
db.driver=com.mysql.cj.jdbc.Driver
db.url=jdbc:mysql://localhost:3306/BikeRentalDB?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
db.user=root
db.password=root

# HikariCP Settings
db.pool.maxSize=10
db.pool.minIdle=2
db.pool.idleTimeout=30000
db.pool.connectionTimeout=20000
db.pool.maxLifetime=1800000
```

### Production Configuration

For production deployments:
1. Copy template files from `final/config/`
2. Remove the `.template` suffix
3. Update credentials and secrets

---

## 8. Running the Application

### Development Mode

```bash
# Compile and run
mvn compile exec:java -Dexec.mainClass="com.bykerantel.Main"

# Or use Maven wrapper
./mvnw compile exec:java -Dexec.mainClass="com.bykerantel.Main"
```

### Production Mode

```bash
# Build the JAR
mvn clean package

# Run the JAR
java -jar target/bike-rental-system-1.0-SNAPSHOT.jar
```

### Verify Server Status

The server starts on port **8080** by default. You can check if it's running by attempting to access any endpoint.

---

## 9. API Endpoints

### Base URL
```
http://localhost:8080/api/v1
```

### Authentication Endpoints (Public)

These endpoints do not require authentication:

#### 9.1 Register User

| Property | Value |
|----------|-------|
| **URL** | `/api/v1/auth/register` |
| **Method** | `POST` |
| **Content-Type** | `application/json` |

**Request Body:**
```json
{
  "name": "Ahmed Benali",
  "email": "ahmed@example.com",
  "password": "securepassword123",
  "phone": "0555123456"
}
```

**Validation Rules:**
- `name`: Required, not blank
- `email`: Required, valid email format
- `password`: Required, minimum 8 characters
- `phone`: Optional

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "userId": 1,
    "name": "Ahmed Benali",
    "email": "ahmed@example.com",
    "phone": "0555123456",
    "pointBalance": 0,
    "isVerified": false,
    "registrationDate": "2026-03-02T12:00:00"
  },
  "message": "User registered successfully"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "data": null,
  "message": "Email already exists"
}
```

---

#### 9.3 Admin User Management (Protected)

These endpoints require higher privileges.

**Role: Admin or Super Admin**

- `GET /api/v1/admin/users`: List all users
- `GET /api/v1/admin/users/{id}`: Detailed view of a user
- `PUT /api/v1/admin/users/{id}/status`: Enable/Disable account

**Role: Super Admin**

- `PUT /api/v1/admin/users/{id}/role`: Change user role (user, admin, super_admin)
- `DELETE /api/v1/admin/users/{id}`: Deactivate account

---

#### 9.2 Login

| Property | Value |
|----------|-------|
| **URL** | `/api/v1/auth/login` |
| **Method** | `POST` |
| **Content-Type** | `application/json` |

**Request Body:**
```json
{
  "email": "ahmed@example.com",
  "password": "securepassword123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJhaG1lZEBleGFtcGxlLmNvbSIsImlhdCI6MTcwNjgwMDAwMCwiZXhwIjoxNzA2ODgzNjAwfQ.xxxxxxxxxxxxxx"
  },
  "message": "Login successful"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "data": null,
  "message": "Invalid email or password"
}
```

---

### Protected Endpoints (Require JWT Token)

All protected endpoints require the JWT token in the Authorization header:

```
Authorization: Bearer <your_token_here>
```

---

#### 9.3 Get User Profile

| Property | Value |
|----------|-------|
| **URL** | `/api/v1/users/profile` |
| **Method** | `GET` |
| **Headers** | `Authorization: Bearer <token>` |

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": 1,
    "name": "Ahmed Benali",
    "email": "ahmed@example.com",
    "phone": "0555123456",
    "pointBalance": 100.00,
    "isVerified": false,
    "registrationDate": "2026-03-02T12:00:00",
    "isActive": true
  },
  "message": "Profile retrieved successfully"
}
```

---

#### 9.4 Update Profile

| Property | Value |
|----------|-------|
| **URL** | `/api/v1/users/profile` |
| **Method** | `PUT` |
| **Headers** | `Authorization: Bearer <token>` |
| **Content-Type** | `application/json` |

**Request Body:**
```json
{
  "name": "Ahmed Mohamed Benali",
  "phone": "0555999999"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": 1,
    "name": "Ahmed Mohamed Benali",
    "email": "ahmed@example.com",
    "phone": "0555999999",
    "pointBalance": 100.00,
    "isVerified": false,
    "registrationDate": "2026-03-02T12:00:00",
    "isActive": true
  },
  "message": "Profile updated successfully"
}
```

---

#### 9.5 List All Stations

| Property | Value |
|----------|-------|
| **URL** | `/api/v1/stations/list` |
| **Method** | `GET` |
| **Headers** | `Authorization: Bearer <token>` |

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "stationId": 1,
      "name": "Algiers Central Station",
      "address": "1 Rue Didouche Mourad, Algiers",
      "latitude": 36.7538000,
      "longitude": 3.0588000,
      "capacity": 20,
      "availableBikes": 15
    },
    {
      "stationId": 2,
      "name": "Oran Harbor Station",
      "address": "Port d'Oran, Oran",
      "latitude": 35.6969000,
      "longitude": -0.6331000,
      "capacity": 15,
      "availableBikes": 8
    }
  ],
  "message": "Stations retrieved successfully"
}
```

---

#### 9.6 Get Station Details

| Property | Value |
|----------|-------|
| **URL** | `/api/v1/stations/{stationId}` |
| **Method** | `GET` |
| **Headers** | `Authorization: Bearer <token>` |

**Example URL:** `/api/v1/stations/1`

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "stationId": 1,
    "name": "Algiers Central Station",
    "address": "1 Rue Didouche Mourad, Algiers",
    "latitude": 36.7538000,
    "longitude": 3.0588000,
    "capacity": 20,
    "availableBikes": 15
  },
  "message": "Station details retrieved successfully"
}
```

---

#### 9.7 Get Available Bikes at Station

| Property | Value |
|----------|-------|
| **URL** | `/api/v1/bikes/available?stationId={stationId}` |
| **Method** | `GET` |
| **Headers** | `Authorization: Bearer <token>` |

**Example URL:** `/api/v1/bikes/available?stationId=1`

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "bikeId": 1,
      "model": "City Bike Pro",
      "serialNumber": "BIKE-2024-001",
      "currentStationId": 1,
      "stationName": "Algiers Central Station",
      "latitude": 36.7538000,
      "longitude": 3.0588000,
      "nfcTag": "NFC-001234",
      "qrCode": "QR-001234",
      "status": "available",
      "batteryLevel": 95.00
    },
    {
      "bikeId": 2,
      "model": "Mountain Trail",
      "serialNumber": "BIKE-2024-002",
      "currentStationId": 1,
      "stationName": "Algiers Central Station",
      "latitude": 36.7538000,
      "longitude": 3.0588000,
      "nfcTag": "NFC-001235",
      "qrCode": "QR-001235",
      "status": "available",
      "batteryLevel": 88.00
    }
  ],
  "message": "Bikes retrieved successfully"
}
```

---

#### 9.8 Get Bike Details

| Property | Value |
|----------|-------|
| **URL** | `/api/v1/bikes/{bikeId}` |
| **Method** | `GET` |
| **Headers** | `Authorization: Bearer <token>` |

**Example URL:** `/api/v1/bikes/1`

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "bikeId": 1,
    "model": "City Bike Pro",
    "serialNumber": "BIKE-2024-001",
    "currentStationId": 1,
    "stationName": "Algiers Central Station",
    "latitude": 36.7538000,
    "longitude": 3.0588000,
    "nfcTag": "NFC-001234",
    "qrCode": "QR-001234",
    "status": "available",
    "batteryLevel": 95.00
  },
  "message": "Bike details retrieved successfully"
}
```

---

#### 9.9 Start Rental

| Property | Value |
|----------|-------|
| **URL** | `/api/v1/rentals/start` |
| **Method** | `POST` |
| **Headers** | `Authorization: Bearer <token>` |
| **Content-Type** | `application/json` |

**Request Body:**
```json
{
  "bikeId": 1,
  "startStationId": 1
}
```

**Validation Rules:**
- `bikeId`: Required, must be a valid bike
- `startStationId`: Required, must be a valid station
- Bike must be available
- User must be verified (if enforced by trigger)

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "rentalId": 50,
    "userId": 1,
    "bikeId": 1,
    "bikeModel": "City Bike Pro",
    "startStationId": 1,
    "startStationName": "Algiers Central Station",
    "endStationId": null,
    "endStationName": null,
    "startTime": "2026-03-02T14:30:00",
    "endTime": null,
    "durationMinutes": null,
    "pointsDeducted": null,
    "status": "active"
  },
  "message": "Rental started successfully"
}
```

**Error Response (409 Conflict):**
```json
{
  "success": false,
  "data": null,
  "message": "Bike is not available for rental"
}
```

---

#### 9.10 End Rental

| Property | Value |
|----------|-------|
| **URL** | `/api/v1/rentals/end/{rentalId}` |
| **Method** | `POST` |
| **Headers** | `Authorization: Bearer <token>` |
| **Content-Type** | `application/json` |

**Example URL:** `/api/v1/rentals/end/50`

**Request Body:**
```json
{
  "endStationId": 2,
  "latitude": 35.6969000,
  "longitude": -0.6331000
}
```

**Validation Rules:**
- `endStationId`: Required
- `latitude`: Optional, current location
- `longitude`: Optional, current location
- Rental must be active
- Points will be calculated and deducted

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "rentalId": 50,
    "userId": 1,
    "bikeId": 1,
    "bikeModel": "City Bike Pro",
    "startStationId": 1,
    "startStationName": "Algiers Central Station",
    "endStationId": 2,
    "endStationName": "Oran Harbor Station",
    "startTime": "2026-03-02T14:30:00",
    "endTime": "2026-03-02T16:15:00",
    "durationMinutes": 105,
    "pointsDeducted": 10.50,
    "status": "completed"
  },
  "message": "Rental ended successfully"
}
```

---

#### 9.11 Get Rental History

| Property | Value |
|----------|-------|
| **URL** | `/api/v1/rentals/history` |
| **Method** | `GET` |
| **Headers** | `Authorization: Bearer <token>` |

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "rentalId": 50,
      "userId": 1,
      "bikeId": 1,
      "bikeModel": "City Bike Pro",
      "startStationId": 1,
      "startStationName": "Algiers Central Station",
      "endStationId": 2,
      "endStationName": "Oran Harbor Station",
      "startTime": "2026-03-02T14:30:00",
      "endTime": "2026-03-02T16:15:00",
      "durationMinutes": 105,
      "pointsDeducted": 10.50,
      "status": "completed"
    },
    {
      "rentalId": 45,
      "userId": 1,
      "bikeId": 3,
      "bikeModel": "Mountain Trail",
      "startStationId": 2,
      "startStationName": "Oran Harbor Station",
      "endStationId": 2,
      "endStationName": "Oran Harbor Station",
      "startTime": "2026-03-01T10:00:00",
      "endTime": "2026-03-01T11:30:00",
      "durationMinutes": 90,
      "pointsDeducted": 9.00,
      "status": "completed"
    }
  ],
  "message": "Rental history retrieved successfully"
}
```

---

#### 9.12 Purchase Points

| Property | Value |
|----------|-------|
| **URL** | `/api/v1/points/purchase` |
| **Method** | `POST` |
| **Headers** | `Authorization: Bearer <token>` |
| **Content-Type** | `application/json` |

**Request Body:**
```json
{
  "amountPaid": 1000.00,
  "paymentMethod": "card"
}
```

**Validation Rules:**
- `amountPaid`: Required, must be greater than 0
- `paymentMethod`: Required (e.g., "cash", "card", "mobile", "transfer")
- `salepointId`: Optional

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "transactionId": 101,
    "transactionRef": "TXN-20260302-001",
    "pointsAdded": 1000.00,
    "newBalance": 1100.00,
    "transactionDate": "2026-03-02T12:00:00"
  },
  "message": "Points purchased successfully"
}
```

---

#### 9.13 Create Bike (Admin)

| Property | Value |
|----------|-------|
| **URL** | `/api/v1/bikes` |
| **Method** | `POST` |
| **Headers** | `Authorization: Bearer <token>` |
| **Content-Type** | `application/json` |

**Request Body:**
```json
{
  "model": "City Bike Pro",
  "serialNumber": "BIKE-2024-010",
  "nfcTag": "NFC-001243",
  "qrCode": "QR-001243",
  "currentStationId": 1,
  "status": "available",
  "batteryLevel": 100.00
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "bikeId": 10,
    "model": "City Bike Pro",
    "serialNumber": "BIKE-2024-010",
    "currentStationId": 1,
    "stationName": "Algiers Central Station",
    "latitude": null,
    "longitude": null,
    "nfcTag": "NFC-001243",
    "qrCode": "QR-001243",
    "status": "available",
    "batteryLevel": 100.00
  },
  "message": "Bike created successfully"
}
```

---

#### 9.14 Create Station (Admin)

| Property | Value |
|----------|-------|
| **URL** | `/api/v1/stations` |
| **Method** | `POST` |
| **Headers** | `Authorization: Bearer <token>` |
| **Content-Type** | `application/json` |

**Request Body:**
```json
{
  "name": "Constantine University Station",
  "address": "University of Constantine, Constantine",
  "latitude": 36.3650000,
  "longitude": 6.6148000,
  "capacity": 25
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "stationId": 5,
    "name": "Constantine University Station",
    "address": "University of Constantine, Constantine",
    "latitude": 36.3650000,
    "longitude": 6.6148000,
    "capacity": 25,
    "availableBikes": 0
  },
  "message": "Station created successfully"
}
```

---

## 10. Request/Response Formats

### Standard API Response Format

All responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Success Response
```json
{
  "success": true,
  "data": {
    "key": "value"
  },
  "message": "Success message"
}
```

### Error Response
```json
{
  "success": false,
  "data": null,
  "message": "Error message describing what went wrong"
}
```

### Data Types

| Type | JSON Format | Example |
|------|-------------|---------|
| Integer | Number | `1`, `42` |
| Decimal | Number | `100.00`, `36.7538000` |
| String | Quoted text | `"Hello"` |
| Boolean | `true`/`false` | `true` |
| Timestamp | ISO 8601 | `"2026-03-02T14:30:00"` |
| Date | ISO 8601 | `"2026-03-02"` |
| Null | `null` | `null` |

---

## 11. Error Handling

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request succeeded |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Access denied |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Business rule violation |
| 500 | Internal Server Error | Server error |

### Common Error Messages

| Message | Cause | Solution |
|---------|-------|----------|
| "Missing or invalid Authorization header" | No token provided | Include JWT token in header |
| "Invalid or expired token" | Token expired or tampered | Re-login to get new token |
| "Email already exists" | Duplicate email | Use different email |
| "Bike is not available" | Bike already rented | Choose another bike |
| "User must verify identity first" | User not verified | Complete verification |
| "Insufficient points balance" | Not enough points | Purchase more points |

### Error Response Example
```json
{
  "success": false,
  "data": null,
  "message": "Bike is not available for rental"
}
```

---

## 12. Security

### Authentication

The system uses **JWT (JSON Web Tokens)** for stateless authentication:

1. User logs in with email and password
2. Server validates credentials and returns a JWT token
3. Token is included in the `Authorization` header for protected requests
4. Server validates token on each protected request

### Token Details

| Property | Value |
|----------|-------|
| Algorithm | HS256 |
| Expiration | 24 hours (86400000 ms) |
| Refresh Expiration | 7 days (604800000 ms) |

### Password Security

- Passwords are hashed using **BCrypt** with salt
- Minimum password length: 8 characters
- Passwords are never stored in plain text

### Request Header Format

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJ...
```

### Best Practices

1. **Never expose JWT secret** in client-side code
2. **Use HTTPS** in production
3. **Store tokens securely** (httpOnly cookies recommended)
4. **Implement token refresh** for long sessions

---

## 13. Business Rules

### User Management

| Rule | Description |
|------|-------------|
| U001 | Email must be unique |
| U002 | Phone number must be unique (optional) |
| U003 | Password minimum 8 characters |
| U004 | Identity document numbers are hashed for privacy |
| U005 | Users must be verified before renting (trigger enforced) |
| U006 | Points balance cannot be negative |

### Bike Management

| Rule | Description |
|------|-------------|
| B001 | Serial number must be unique |
| B002 | NFC tag must be unique |
| B003 | QR code must be unique |
| B004 | Battery level is 0-100% |
| B005 | Bike status: available, rented, maintenance, stolen |
| B006 | Only 'available' bikes can be rented |
| B007 | GPS coordinates updated on rental start/end |

### Rental Rules

| Rule | Description |
|------|-------------|
| R001 | User must be verified to rent (database trigger) |
| R002 | Bike must be 'available' status |
| R003 | Rental end time must be after start time |
| R004 | Points deducted on rental completion |
| R005 | Default rental duration: 24 hours max |
| R006 | Late returns incur additional point deduction |

### Points System

| Rule | Description |
|------|-------------|
| P001 | Points earned: 1 point per 10 DZD spent |
| P002 | Points spent: 1 point = 1 DZD discount |
| P003 | Points cannot be negative |
| P004 | Transaction references must be unique |

---

## 14. Testing

### Running Tests

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=BikeDAOTest

# Run with coverage
mvn test -Dcoverage
```

### Test Categories

| Category | Description |
|----------|-------------|
| Unit Tests | Test individual methods and classes |
| Integration Tests | Test API endpoints and database operations |
| DAO Tests | Test data access layer |

### Test Results

Test results are available in:
- `target/surefire-reports/` - Unit test results
- `target/failsafe-reports/` - Integration test results

---

## 15. Project Structure

```
bykerantel/
├── pom.xml                          # Maven configuration
├── docker-compose.yml               # Docker database setup
├── db.sql                           # Database schema
├── README.md                        # Quick start guide
│
├── src/
│   └── main/
│       ├── java/
│       │   └── com/bykerantel/
│       │       ├── Main.java                    # Application entry point
│       │       │
│       │       ├── config/                       # Configuration classes
│       │       │   ├── AppConfig.java
│       │       │   ├── DatabaseConfig.java
│       │       │   └── LogConfig.java
│       │       │
│       │       ├── controller/                  # REST API controllers
│       │       │   ├── AuthController.java
│       │       │   ├── UserController.java
│       │       │   ├── BikeController.java
│       │       │   ├── StationController.java
│       │       │   ├── RentalController.java
│       │       │   └── PointsController.java
│       │       │
│       │       ├── service/                     # Business logic
│       │       │   ├── AuthService.java
│       │       │   ├── UserService.java
│       │       │   ├── BikeService.java
│       │       │   ├── StationService.java
│       │       │   ├── RentalService.java
│       │       │   ├── PointsService.java
│       │       │   ├── VerificationService.java
│       │       │   └── MaintenanceService.java
│       │       │
│       │       ├── dao/                         # Data access layer
│       │       │   ├── BaseDAO.java
│       │       │   ├── UserDAO.java
│       │       │   ├── BikeDAO.java
│       │       │   ├── StationDAO.java
│       │       │   ├── RentalDAO.java
│       │       │   ├── PointTransactionDAO.java
│       │       │   ├── UserIdentityDAO.java
│       │       │   ├── BikeMaintenanceDAO.java
│       │       │   ├── SalePointDAO.java
│       │       │   └── AuditLogDAO.java
│       │       │
│       │       ├── model/                       # Data entities
│       │       │   ├── User.java
│       │       │   ├── Bike.java
│       │       │   ├── Station.java
│       │       │   ├── Rental.java
│       │       │   ├── PointTransaction.java
│       │       │   ├── UserIdentity.java
│       │       │   ├── BikeMaintenance.java
│       │       │   ├── SalePoint.java
│       │       │   └── AuditLog.java
│       │       │
│       │       ├── dto/                         # Data transfer objects
│       │       │   ├── request/
│       │       │   │   ├── LoginRequest.java
│       │       │   │   ├── RegisterRequest.java
│       │       │   │   ├── RentalRequest.java
│       │       │   │   ├── BikeRequest.java
│       │       │   │   ├── StationRequest.java
│       │       │   │   └── PointsRequest.java
│       │       │   │
│       │       │   └── response/
│       │       │       ├── ApiResponse.java
│       │       │       ├── UserResponse.java
│       │       │       ├── BikeResponse.java
│       │       │       ├── StationResponse.java
│       │       │       ├── RentalResponse.java
│       │       │       ├── PointsResponse.java
│       │       │       └── ErrorResponse.java
│       │       │
│       │       ├── util/                        # Utility classes
│       │       │   ├── DatabaseUtil.java
│       │       │   ├── JwtUtil.java
│       │       │   ├── PasswordUtil.java
│       │       │   ├── HashUtil.java
│       │       │   ├── DateUtil.java
│       │       │   └── ResponseUtil.java
│       │       │
│       │       └── exception/                  # Exception handling
│       │           ├── GlobalExceptionHandler.java
│       │           ├── AuthenticationException.java
│       │           ├── DatabaseException.java
│       │           ├── ValidationException.java
│       │           ├── RentalException.java
│       │           └── ResourceNotFoundException.java
│       │
│       └── resources/
│           ├── application.properties
│           ├── database.properties
│           └── log4j.properties
│
├── final/                               # Production-ready files
│   ├── app.jar                          # Executable JAR
│   ├── docker-compose.yml               # Database setup
│   ├── db.sql                           # Schema
│   ├── config/                          # Configuration templates
│   └── docs/                            # Documentation
│
├── docs/                                # Documentation
│   ├── api_spec.md
│   ├── database_schema.md
│   └── user_manual.md
│
└── test/                                # Test files
    └── java/com/bykerantel/
        └── dao/
            ├── BikeDAOTest.java
            └── AuditLogDAOTest.java
```

---

## Appendix: Complete cURL Examples

### 1. Register a new user
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ahmed Benali",
    "email": "ahmed@example.com",
    "password": "securepassword123",
    "phone": "0555123456"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ahmed@example.com",
    "password": "securepassword123"
  }'
```

### 3. Get User Profile (Replace TOKEN with actual token)
```bash
curl -X GET http://localhost:8080/api/v1/users/profile \
  -H "Authorization: Bearer TOKEN"
```

### 4. List Stations
```bash
curl -X GET http://localhost:8080/api/v1/stations/list \
  -H "Authorization: Bearer TOKEN"
```

### 5. Get Available Bikes
```bash
curl -X GET "http://localhost:8080/api/v1/bikes/available?stationId=1" \
  -H "Authorization: Bearer TOKEN"
```

### 6. Start Rental
```bash
curl -X POST http://localhost:8080/api/v1/rentals/start \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bikeId": 1,
    "startStationId": 1
  }'
```

### 7. End Rental
```bash
curl -X POST http://localhost:8080/api/v1/rentals/end/50 \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "endStationId": 2,
    "latitude": 35.6969000,
    "longitude": -0.6331000
  }'
```

### 8. Purchase Points
```bash
curl -X POST http://localhost:8080/api/v1/points/purchase \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amountPaid": 1000.00,
    "paymentMethod": "card"
  }'
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Database connection failed | Check MySQL is running and credentials in database.properties |
| Port 8080 already in use | Change port in application.properties |
| JWT token expired | Re-login to get new token |
| 401 Unauthorized | Ensure Authorization header is correctly formatted |
| Bike not available | Wait for bike to be returned or choose another |
| Points insufficient | Purchase more points using /points/purchase endpoint |

---

*Document Version: 1.0*
*Last Updated: 2026-03-02*
*Project: Bike Rental System (Algeria)*
*Author: ByKeraTel Development Team*
