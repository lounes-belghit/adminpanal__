# Admin Panel Architecture & File Structure

This document outlines the recommended architecture and file organization for the **Admin Panel frontend** of the Bike Rental System. It is intended as a reference for developers building the administrative interface that consumes the existing Java backend API.

---

## Frontend (Admin Panel, proposed)

Although not yet implemented, the recommended structure for the React admin panel is:

```
admin-panel/
├── package.json
├── tsconfig.json
├── public/
│   └── index.html
├── src/
│   ├── index.tsx              # React entry point
│   ├── App.tsx                # Router and layout
│   ├── api/
│   │   ├── axios.ts           # configured Axios instance
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   └── ...                # per-module API calls
│   ├── components/
│   │   ├── common/            # buttons, inputs, loaders, etc.
│   │   ├── layout/            # sidebar, topbar, private route
│   │   ├── maps/              # map wrappers
│   │   └── ...
│   ├── features/              # Redux slices or pages
│   │   ├── auth/
│   │   ├── users/
│   │   ├── bikes/
│   │   ├── stations/
│   │   ├── rentals/
│   │   ├── maintenance/
│   │   └── auditLogs/
│   ├── hooks/                 # custom hooks (e.g. useAuth)
│   ├── routes/                # route definitions
│   ├── styles/                # global and theme styles
│   ├── utils/                 # helpers, constants
│   └── assets/                # images, icons
└── README.md
```

### Breakdown
- `api/` packages wrap network calls using Axios, exporting functions that return promises with typed responses.
- `features/` contain components, slices, and tests per domain area (mirrors API resources).
- `components/` hold reusable UI elements; `layout/` includes sidebar/topbar.
- `hooks/` for authentication logic, data fetching, etc.
- Follow the roadmap phases when populating folders: MVP features in `auth`, `dashboard`, `users` first.

