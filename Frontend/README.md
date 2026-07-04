# GEN AI Frontend

This is the React + Vite frontend for the GEN AI resume and interview assistant.

## Features

- AI interview strategy generation
- Resume upload and self-description flow
- Personalized interview report view
- PDF resume download
- Polished reusable loading screens with back/home actions

## Loading UI

The shared loading screen lives in [src/components/LoadingScreen.jsx](src/components/LoadingScreen.jsx) and is used across auth and interview flows.

It includes:

- Animated ring and progress bar
- Back button for returning to the previous screen
- Home button for returning to the app entry point
- Responsive styling for desktop and mobile

## Development

Install dependencies and start the frontend from the `Frontend` folder.

```bash
npm install
npm run dev
```

## Structure

- `src/features/auth` - login, register, and auth protection
- `src/features/interview` - interview form, report view, and PDF actions
- `src/components` - shared UI pieces such as the loading screen
