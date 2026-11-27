# EasySpot Frontend

React frontend for EasySpot, a parking space reservation system. Drivers see which spaces are free on a live parking board and reserve one before they arrive. Attendants check cars in and out from the parking desk. It connects to the [EasySpot backend API](https://github.com/Yngnell/EasySpot), by Jonnel S. Dagohoy (BSIT 4B) for the ITEC 116 Final Project.

## Tech stack

- **React 19** + **TypeScript**
- **Vite**: dev server and build
- **React Router**: pages and protected routes
- Browser `fetch` with a JWT Bearer token to call the backend REST API

## Pages

| Page | Who | What it does | API calls |
|---|---|---|---|
| Login / Register | Everyone | Log in (stores the JWT) or create a driver account | `POST /auth/login`, `POST /auth/register`, `GET /auth/profile` |
| Find Parking | Driver | Pick a lot, see the live space board (refreshes every 5 s), reserve a free space | `GET /parking-lots`, `GET /parking-lots/:id/spaces`, `POST /reservations` |
| My Reservations | Driver | See current booking and history, edit or cancel | `GET /reservations/me`, `PATCH /reservations/:id`, `PATCH /reservations/:id/cancel` |
| Parking Desk | Attendant, Admin | Check drivers in and out (fee shown), change a space's status | `GET /reservations`, `PATCH /reservations/:id/check-in`, `PATCH /reservations/:id/complete`, `PATCH /parking-spaces/:id/status` |

## How to run locally

1. Start the **EasySpot backend** first (see its README). It must be running at http://localhost:3000, with `CORS_ORIGIN=http://localhost:5173` in its `.env`.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Optional: copy `.env.example` to `.env` if your API is not at http://localhost:3000.
4. Start the frontend and open http://localhost:5173:
   ```bash
   npm run dev
   ```
5. Log in with the demo accounts created by the backend's `npm run seed` (`driver@easyspot.local`, `attendant@easyspot.local`), or register a new driver.
