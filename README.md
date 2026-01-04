# IdoSell Orders Service

**IdoSell Orders Service** is a project developed as a test assignment. The application provides access to a database of orders fetched from the external IdoSell API. The service automatically synchronizes data with the API and stores it in MongoDB, and provides two endpoints to retrieve order information in CSV format.

**Project Highlights:**

- Supports **MongoDB aggregations** via the native driver.

- Configurable periodic order synchronization (timer-based).

- Full logging for all processes with different loggers.

- Configurable architecture for easily switching environments (dev/prod).


---

## Work Load

| Task                                                                     | Time |
| ------------------------------------------------------------------------ | ---- |
| Creating api module (OrdersApi, OrdersIntegrationService, OrdersService) | 7h   |
| Create OrdersController and routes                                       | 1h   |
| Setup external API synchronization                                       | 4h   |
| Add logging and error handling                                           | 4h   |
| Refactoring and configuration system                                     | 5h   |

---

## Technologies Used

|Backend|Libraries|
|---|---|
|Node.js|express, nodemon|
|JavaScript|axios, dotenv, csv-stringify|
|MongoDB|mongodb (native driver)|
|Logging|pino / custom loggers|

---

## Setup Instructions

1. **Clone the repository:**


```bash
git clone https://github.com/yrche/idosell-orders-service
```

2. **Navigate to the project directory:**


```bash
cd idosell-orders-service
```

3. **Install dependencies:**


```bash
npm install
```

4. **Create a `.env` file and define variables:**


```
EXTERNAL_API_KEY=your_external_api_key
EXTERNAL_HOSTNAME=https://example.com
API_KEY=your_api_key
MONGODB_URI=your_mongodb_uri
PORT=3000
DEFAULT_INTERVAL=10
NODE_ENV=development  
LOG_PATH=server.log  
LOG_LEVEL=info
```

5. **Run the project locally:**


```bash
npm start
```

6. **API Endpoints:**


- `/api/orders` — fetch all orders (CSV)

- `/api/orders/:id` — fetch a single order by ID (CSV)


> Filters such as minimum and maximum order worth can be passed as query parameters.

## Configuration

The `config` object is the central place where all application settings, connections, and loggers are defined. It allows you to **easily switch between environments** (development, production) by updating environment variables without changing the application code.

### Structure

- **baseLogger** – Global logger used by services or modules without a dedicated logger.

- **nodeEnv** – Current environment (`development` or `production`), from `.env`.

- **api** – API-specific configuration:

    - `router.path` – Base path for all API endpoints (default: `/api`).

    - `logger` – Logger for request logging (`requestLogger`).

- **mongo** – MongoDB connection and model configuration:

    - `connection.uri` – MongoDB connection URI from `.env`.

    - `connection.options` – MongoDB driver options, including `ServerApiVersion`.

    - `models` – Collection definitions (e.g., `Order` collection in the `orders` database).

    - `logger` – Logger for database operations.

- **externalApi** – External API configuration:

    - `api.baseUrl` – External API base URL.

    - `api.apiKey` – API key for authentication.

    - `api.logger` – Logger for external API requests (`syncLogger`).

    - `autoSyncOrders.interval` – Interval for auto synchronization (e.g., `{ minutes: 10 }`).

- **server** – Express server configuration:

    - `port` – Port number to run the server.

    - `logger` – Logger for server lifecycle events (`serverLogger`).

## Summary

This project is a backend service for managing orders from an external API (IdoSell). It provides a centralized, modular architecture with the following features:

- **Data fetching** – Retrieves orders from an external API and stores them in MongoDB.

- **Automatic synchronization** – Runs periodic updates based on a configurable interval.

- **Modular services** – All core logic (OrdersService, OrdersIntegrationService, OrdersController) is decoupled and initialized through a central `config`.

- **Express API** – Exposes endpoints for accessing orders in CSV or JSON format.

- **Centralized configuration** – All environment-specific values (MongoDB URI, API keys, server port, etc.) are stored in `config` for easy management.

- **Logging** – Detailed logging on API requests, database operations, and background synchronization.


**Key Benefits:**

- Easy to switch between development and production environments by changing the config.

- High modularity allows adding new services or models with minimal code changes.

- Automatic error handling and logging improve maintainability and debugging.