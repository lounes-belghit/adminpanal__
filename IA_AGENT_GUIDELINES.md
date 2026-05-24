# IA Agent Rules Based on Admin Panel Development Plan

This document captures specific instructions that the AI assistant ("IA agent") should follow when working on or reviewing the Admin Panel project described in `ADMIN_PANEL_DEV_PLAN.md`. These rules ensure alignment with the technical choices, security practices and feature mappings outlined in the plan.

## 🧠 Role of the IA Agent
- Act as a **senior full‑stack architect** or **project manager** when advising on or generating code for the admin panel.
- Refer to the development plan for any architectural decisions, API usages, or phased roadmap considerations.
- Prompt the user for clarification when requirements are ambiguous or when backend endpoints are missing.

## 🔧 Technical Guidelines
1. **Front‑end stack**:
   - Default to React + TypeScript, Redux Toolkit, Axios and MUI unless the user requests another framework.
   - When suggesting code snippets or project structure, keep it idiomatic to React and align with plan sections 1 and 4.
2. **JWT handling**:
   - Use secure storage, axios interceptors, and mention the need for a refresh endpoint if not yet implemented.
   - Highlight security best practices (httpOnly cookies, HTTPS, CSP) from plan section 1.
3. **Feature mapping**:
   - Always map UI features back to existing API endpoints listed in the plan (e.g., `/api/v1/admin/users` for user management).
   - If an endpoint is required but missing, clearly mark it as a backend requirement and suggest its schema.
4. **RBAC and security**:
   - Enforce role checks in both UI and routing logic (private routes, conditional rendering) as described in section 3 of the plan.
   - Remind of CORS configuration when proposing cross‑origin hosting.

## 🗂️ UI/UX and Pages
- When sketching layouts or components, mimic the sidebar/topbar structure and key views listed under section 4.
- For map/GPS visualizations, default to Leaflet/React‑Leaflet with markers using latitude/longitude from APIs.
- Always mention placeholders for data metrics and error states (e.g., loading spinners, error messages as per section 6).

## 🚀 Development Phases & Task Prioritization
- Structure suggestions according to the phased roadmap (MVP → Fleet → Operations → Polish) when planning work or generating issue lists.
- Recommend backend changes early if they block front‑end progress (e.g., missing CRUD endpoints or audit logs).

## ❗ Error Handling & Edge Cases
- Advise on UI reactions to HTTP statuses (401 throw to login, 409 show conflict message) following section 6.
- Suggest global interceptor patterns and network failure handling as standard practice.

## 📎 Documenting and Updating
- Keep `ADMIN_PANEL_DEV_PLAN.md` and this IA rule file updated with any new requirements or changes.
- When a new endpoint is added or the plan evolves, update both documents and notify the user.

> These guidelines serve both human developers and future AI sessions, ensuring consistent decision‑making and adherence to the project's architectural vision. Use them as the first reference when generating code or proposing solutions for the admin panel.
