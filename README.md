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

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm (version 8 or higher) or yarn (version 1.22 or higher)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
    cd <project-directory>
   ```
3. Install dependencies:
   ```bash
    npm install
   ```
   
### Development
To start the local development server with Hot Module Replacement:
   ```bash
      npm run dev
   ```

### Build
To build the project for production:

  ```bash
    npm run build
  ```

### Technical Implementation


#### State Management (Pinia)
The application uses Pinia for centralized state management.
This ensures that rocket data fetched from the API and rockets added locally by the user remain
synchronized across the List and Detail screens.

#### Key Features of the Store:
- **State**: Holds the list of rockets and any locally added rockets.
- **Actions**: Includes methods to fetch rockets from the SpaceX API and add new rockets.
- **Getters**: Provides filtered views of the rocket list based on user input.

#### Routing (Vue Router)
The project utilizes file-based routing.
- **List Screen**: Accessible at the root path (`/`), displaying the list of rockets.
- **Detail Screen**: Accessible via dynamic routes (e.g., `/rockets/:id

### Component Architecture
The application is structured into reusable components:
- **AddRocketDialog.vue**: Encapsulates the logic for the creation form and input validation.
- **RocketCard**: (Integrated within index.vue) handles the responsive display of individual items.

### Functional Features
- **Live Filtering** : The search bar filters the rocket list in real-time using a computed property based on the store state.
- **Data Validation** : The "Add Rocket" form enforces mandatory fields and ensures that the cost per launch is a positive value greater than zero.
- **Error Handling** : If the SpaceX API fails to respond, a retry mechanism is provided to the user to re-attempt the request without refreshing the page.

### Project Structure
   ```plaintext
    ├── src
    │   ├── components
    │   │   └── AddRocketDialog.vue
    │   ├── pages
    │   │   ├── index.vue
    │   │   └── rockets
    │   │       └── [id].vue
    │   ├── store
    │   │   └── rocketStore.ts 
    │   ├── App.vue
    │   └── main.ts
    ```  

### Non-Functional Requirements Met
- Implementation of Vue 3 Lifecycle hooks for data fetching.
- Full responsive design using Vuetify’s grid system.
- TypeScript integration for enhanced type safety and developer experience.
- Detailed UI states (Loading, Success, and Error handling).