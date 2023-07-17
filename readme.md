
# Map Routing Service

This is a web application that provides routing functionality using the Google Maps API. It allows users to enter an origin and destination, and retrieve multiple routes with their respective distances and durations. The application also provides step-by-step directions for each route.

## Installation and Setup

To run this project locally, follow the steps below:

1. Make sure you have the following prerequisites installed:

   - Node.js: [Download](https://nodejs.org) (version 14 or higher)
   - MongoDB: [Download](https://www.mongodb.com) (running instance or connection URI)

2. Clone the repository:

   ```bash
   git clone <repository_url>
   ```

3. Navigate to the project root directory:

   ```bash
   cd map-routing-service
   ```

4. Install dependencies for both the server and client:

   ```bash
   npm run install-all
   ```

5. Configure the environment variables:

   - Create a `.env` file in the project root directory.
   - Add the following configuration variables to the `.env` file:

     ```plaintext
     PORT=5000
     MONGODB_URI=<your_mongodb_connection_uri>
     GOOGLE_API_KEY=<your_google_maps_api_key>
     ```

     Replace `<your_mongodb_connection_uri>` with the connection URI for your MongoDB database.
     Replace `<your_google_maps_api_key>` with your Google Maps API key. Make sure it has the necessary permissions for the Directions API and Distance Matrix API.

## Usage

1. Start the server and client concurrently:

   ```bash
   npm run dev
   ```

   This command will start the server and client simultaneously.

2. Open your web browser and visit http://localhost:3000 to access the application.

## Functionality

- Enter an origin and destination to retrieve multiple routes with distances and durations.
- Click on a route card to view step-by-step directions for that route.
- The application uses MongoDB to cache route data for faster retrieval. If a route has been previously searched for, the cached data will be used instead of making a new request to the Google Maps API. You can force the application to use real-time data from the API by checking the "Force Google API" checkbox.
- Each route is color-coded: the first route is green, the second route is yellow, and subsequent routes are red. The step-by-step directions for each route are also color-coded accordingly.
```

Please note that you may need to customize the instructions or add additional information based on your project's specific details and requirements.