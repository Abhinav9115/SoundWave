# MelodyMosaic (Hackathon Project)

A web-based music player application built for a hackathon.

## Features

*   Browse albums, artists, and tracks.
*   Create and manage playlists.
*   View recently played tracks.
*   Basic music playback controls.

## Tech Stack

*   **Frontend:** React, TypeScript, Vite, Tailwind CSS, Shadcn UI
*   **Backend:** Node.js, Express, TypeScript
*   **Database:** In-memory storage (for demo purposes) using Maps. Data is **not persisted**.
*   **Schema:** Drizzle ORM (used for schema definition, though the current storage is in-memory)

## Running the Project

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone <your-repo-url>
    cd MelodyMosaic 
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Development

To run the development server (with hot-reloading for frontend and backend):

```bash
npm run dev
```

This will start the server (typically on port 3000 or specified in `.env`) and the Vite development server.

### Production Build

To build the project for production:

```bash
npm run build
```

This creates optimized frontend assets and a bundled server entry point in the `dist/` directory.

### Start Production Server

To run the built production server:

```bash
npm run start
```

## Notes

*   **In-Memory Data:** The current version uses an in-memory data store (`server/storage.ts`). All data (including sample data) will be lost when the server restarts.
*   **Authentication:** User authentication is not fully implemented. Playlist and recently played features currently use a hardcoded `userId = 1` (`server/routes.ts`).
*   **Drizzle:** Drizzle ORM is set up (`drizzle.config.ts`, `@shared/schema.ts`), but the application currently uses the `MemStorage` implementation. A real database connection (like PostgreSQL via Neon) would be the next step for persistence. Use `npm run db:push` if you connect a database and want to sync the schema. 