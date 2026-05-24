# Admin Panel Development Plan

This document outlines a comprehensive, actionable plan for building a web-based admin panel that interfaces with the Bike Rental System backend. The backend API is documented in `fulldocumentation.md` and all endpoints referenced here are taken directly from that source.

---

## 1. Technology Stack Recommendation

### Frontend Framework
- **React 18** with TypeScript. Alternatives: Vue 3 or Angular 14 depending on team preference.

### Core Libraries
- **State management**: Redux Toolkit (`createSlice` + `createAsyncThunk`) or `zustand`.
- **HTTP requests**: Axios with interceptors (authorization, error handling, timeouts).
- **UI components**: Material-UI (MUI) or Ant Design for ready-made tables, forms, dialogs, etc.
- **Routing**: `react-router-dom` v6.
- **Form validation**: `react-hook-form` + `yup` to mirror backend validation rules.
- **Map/GPS**: `react-leaflet` (Leaflet) or Google Maps JS SDK.

### JWT Authentication Handling
1. **Storage**: prefer httpOnly secure cookies; if cross‑domain not possible, use memory or secure `localStorage` with strong XSS controls.
2. **Interceptors**: Axios request interceptor attaches `Authorization: Bearer <token>` to protected calls; response interceptor handles `401`/`403` (redirect to login and optionally attempt token refresh).
3. **Refresh logic**:
   - Backend should provide `POST /api/v1/auth/refresh` returning a fresh token (currently missing).
   - Client schedules refresh shortly before expiration (24h lifespan, 7-day refresh window).
4. **Logout**: clear token storage and navigate to `/login`.
5. **Security notes**:
   - Never embed JWT secret client-side.
   - Use HTTPS in production.
   - Implement CSP and other browser hardening.

---

## 2. Feature Mapping & API Integration

### Dashboard
- **Metrics**:
  - Active rentals count: compute from `GET /api/v1/rentals/history` filtered `status=active`.
  - Total users: fetched via `GET /api/v1/admin/users` (use length or backend count endpoint).
  - Bikes availability: aggregate from `GET /api/v1/bikes/available?stationId={id}` across stations.
  - Points purchased today: requires backend summary endpoint (new requirement).

### User Management
- List: `GET /api/v1/admin/users`.
- View detail: `GET /api/v1/admin/users/{id}`.
- Enable/Disable: `PUT /api/v1/admin/users/{id}/status`.
- Change role: `PUT /api/v1/admin/users/{id}/role` (super_admin only).
- Deactivate: `DELETE /api/v1/admin/users/{id}`.
- **Backend note**: Creating users via panel may require `POST` endpoint.

### Fleet Management
- **Stations**:
  - List: `GET /api/v1/stations/list`.
  - Detail: `GET /api/v1/stations/{stationId}`.
  - Create: `POST /api/v1/stations`.
  - **Missing**: `PUT /api/v1/stations/{id}`, `DELETE /api/v1/stations/{id}`.
- **Bikes**:
  - Available by station: `GET /api/v1/bikes/available?stationId={stationId}`.
  - Detail: `GET /api/v1/bikes/{bikeId}`.
  - Create: `POST /api/v1/bikes`.
  - **Missing**: `PUT /api/v1/bikes/{id}`, `DELETE /api/v1/bikes/{id}`.

### Rentals & Maintenance
- Active rentals: filter `GET /api/v1/rentals/history` by `status=active` (or backend `GET /api/v1/rentals/active`).
- Rental history: `GET /api/v1/rentals/history`.
- End rental: `POST /api/v1/rentals/end/{rentalId}`.
- **Maintenance logs**: not exposed; require new endpoints like `GET /api/v1/maintenance/logs`.

### Audit Logs
- Database `AuditLogs` table exists but no API; **add `GET /api/v1/admin/audit-logs`** with filters (date/user/action).

---

## 3. Security & Role-Based Access Control (RBAC)

- Decode JWT or call `/users/profile` to obtain current role(s).
- **Private routes** component guards by role: e.g. `<PrivateRoute roles={['super_admin']} ...>`.
- UI hides/disables actions requiring higher privilege (e.g. role change, delete).
- CORS: backend must allow frontend origin and `Authorization` header, plus credentials if using cookies.
- In-app logic checks role changes mid‑session; if current token no longer valid, force logout.

---

## 4. UI/UX Wireframe Concepts

### Layout
- Sidebar: Dashboard | Users | Fleet ↳ Bikes, Stations | Rentals | Maintenance | Points | Audit Logs | Settings.
- Top bar: logo/title, notifications, user avatar with profile/logout.
- Content area: load page views with breadcrumb if desired.

### Key pages
- **Login** – simple form with email/password.
- **Dashboard** – cards, charts (rentals per day, station utilization).
- **User List/Detail** – searchable table + profile modal.
- **Bike Fleet** – table/paginated list; create/edit dialogs.
- **Station Map** – world/map view with station markers, clickable for details; show available count.
- **Rental History & Active Rentals** – filterable list, ability to end rental.
- **Maintenance Logs** – table with create/edit.
- **Audit Logs** – list with filters and export.
- **Points Management** – view purchases, manual adjustments.
- **Settings/Profile** – admin profile update.

### GPS Visualization
- On station/bike pages show map marker using latitude/longitude fields.
- For active rentals, optionally draw path if lat/lon traced.

---

## 5. Development Phases (Roadmap)

1. **Phase 1 (MVP)**: auth, dashboard, basic user list/detail, role/status toggling.
2. **Phase 2 (Fleet)**: station & bike CRUD, map view, availability display.
3. **Phase 3 (Operations)**: active rentals view, rental control, maintenance, audit logs.
4. **Phase 4 (Polish)**: filtering/search, data export, dark mode, responsive tweaks.
5. **Phase 5 (Future)**: real-time updates (WebSockets), analytics dashboards.

Each phase includes any required backend endpoints as noted above.

---

## 6. Error Handling & Edge Cases

- Map HTTP codes to user actions (401 → login, 403 → access denied, 409 → show API message).
- Network/timeouts: global axios timeout, retry logic or offline banner.
- Handle expired tokens with interceptor refresh or forced logout.
- Guard against concurrency issues (409 conflict messages) and display friendly UI prompts.

---

> 📝 **Backend requirements summary**
> - `/auth/refresh` endpoint
> - CRUD for bikes & stations
> - Maintenance logs endpoints
> - Audit logs retrieval
> - (Optional) rentals/active and points summary endpoints

This plan is structured for realistic production delivery and is tied to the existing API documentation. Adjustments should be made as new backend features are added.
