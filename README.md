## Features
### Rocket List
- Display rockets with image, name, and description
- Search and filter rockets by name
- Add new rockets locally based on provided rocket options
- Handles UI states: loading, error (with retry), and success
### Rocket Detail
- Display detailed rocket information: Image, Name, Description, Country, Status, Type, and Company
- Accessible via dynamic route: /rockets/:id
- Handles loading and error states
### Tech Stack
- **Framework**: Vue 3 + Vite
- **Language**: TypeScript
- **State Management**: Pinia
- **HTTP Requests**: Axios
### Project Structure
```bash
src/
├─ components/    # Reusable UI components
├─ pages/         # Route-based views
├─ service/       # API service layer
├─ stores/        # Pinia state management
├─ types/         # TypeScript domain types
└─ main.ts        # Entry point
```
### Getting Started
1. Install dependencies:
```bash
npm install
```
2. Start the development server:
```bash
npm run dev
```
### Environment Variables
Create a `.env` file in the root (or copy `.env.example`) and configure:
```bash
VITE_APP_API_URL=https://api.spacexdata.com/v4
```
