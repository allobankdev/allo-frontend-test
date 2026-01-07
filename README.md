# Allo Bank Frontend Technical Assignment

In this assignment, you’re assigned to create a website that displays rockets. This website only has two screens: rocket list screen and rocket detail screen. Here are the requirements:

### Functional Requirements
- As a user, I want to see a list of rockets in the rocket list screen (Show each rocket image, rocket name, and rocket description)
- As a user, I want to be able to filter the rockets in the rocket list screen
- As a user, I want to be able to add the new rocket in the rocket list screen
- As a user, I want to be able to see the rocket detail by clicking a rocket in the rocket list screen (Show rocket image, rocket name, rocket description, cost per launch, country, first flight)

### Non-Functional Requirements
- Use Space-X API (https://github.com/r-spacex/SpaceX-API) for getting the rocket data
- Implement routers
- Implement state management
- Implement lifecycles
- Create components based will be + points
- UI states (Loading, Fail/Retry, and Success)
- Show loading when waiting response from API
- If an error occurred, user can retry by pressing retry button
- Show result when get response from API

### Nice to have characteristics
Responsive design
You don’t need to worry about the detailed design, we’re not interested in your artistic prowess (for now), put your efforts on creating a readable/clean/maintainable source code.

### Submission

1.  **Fork** this repository.

2.  Implement your solution on a dedicated feature branch (e.g., `feat/allo-spacex`).

3.  When complete, submit your solution via a **Pull Request (PR)** back to the main repository.
   
4.  Please complete the form to submit your technical test: [Click Here](https://forms.gle/nZKQ2EjTCPfAKHog7)

Good luck with your assignment! Don't hesitate to contact us if you have any questions about the assignment process.

---

## Overview
This Pull Request implements a simple frontend application to display SpaceX rockets data using Vue 3.
The application consists of two main screens: Rocket List and Rocket Detail, following the requirements of the technical assignment.

The focus of this implementation is on clean architecture, state management, clear UI states, and maintainable code structure, rather than complex UI design.

### Features Implemented
#### Rocket List Page

- Display list of rockets with image, name, and description
- Search/filter rockets by name
- Add new rocket locally (client-side only)
- UI states:
  - Loading
  - Error with retry action
  - Success state

#### Rocket Detail Page
- Display rocket detail information:
  - Image
  - Name
  - Description
  - Country
  - First flight
  - Cost per launch
- Accessed via dynamic route /rockets/:id
- Handles loading and error states

### Technical Implementation
- Vue 3 + Vite
- TypeScript
- Pinia for state management
- vue-router (file-based routing) for navigation
- Axios for API communication
- Native CSS for styling (no external UI library)

Project structure is organized by responsibility:
- ```api/``` → API layer
- ```stores/``` → State management
- ```pages/``` → Route-based views
- ```components/``` → Reusable UI components
- ```types/``` → Domain types

### Architectural Decisions

#### State Management
Rocket list data is managed globally using Pinia as a single source of truth.
UI-specific concerns such as filtering and form input are handled locally in the view.

#### API Handling
API logic is isolated in a dedicated service layer. Error handling and UI states are managed at the store or page level.

#### Add Rocket Behavior
Since SpaceX API is read-only, adding a new rocket is implemented as a local state update. Newly added rockets are immediately reflected in the list and can be accessed in the detail page.

### How to Run the Project

```ignorelang
npm install
npm run dev
```
Make sure to create a .env file based on .env.example:
```
VITE_SPACEX_API_BASE_URL=https://api.spacexdata.com/v4
```