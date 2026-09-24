# Features

This directory houses the core business domains of the application, structured using a **feature-driven modular architecture**. Each feature folder is self-contained, encapsulating everything related to a specific domain (such as components, state management, API services, and types).

## Directory Structure

A typical feature module follows this standardized file layout:

```text
src/features/
└── [feature-name]/
    ├── api/                  # API clients and data communication handlers
    │   ├── [feature].rest.ts     # HTTP / REST API requests
    │   ├── [feature].socket.ts   # WebSocket / real-time event handlers
    │   ├── [feature].mqtt.ts     # MQTT messaging protocol handlers
    │   └── [feature].graphql.ts  # GraphQL queries, mutations, and subscriptions
    ├── store/                # Pinia state management stores
    │   └── [feature].store.ts
    ├── components/           # UI presentation & container components
    │   ├── [Feature]List.vue
    │   ├── [Feature]Card.vue
    │   └── [Feature]Form.vue
    └── [feature].types.ts    # TypeScript interfaces and type definitions
```
