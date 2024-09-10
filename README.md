# PowerHR
# PowerHR-Server
## Getting started

### Clone the Repository

To clone the repository, use the following command:

```sh
git clone https://github.com/UTMPowerHR/PowerHR-Server.git
cd powerhr-server
```

### Install Dependencies

To install the necessary dependencies, run:

```sh
npm install or npm i
```

### Environment Variables

Ensure you have a `.env` file in the root directory of your project with the necessary environment variables. Here is an example of what the `.env` file might look like:

```env
# Example .env file
DB_URL = your_mongodb_database_url
NODE_ENV = 'development'
JWT_SECRET = your_secret_key
EMAIL = your_email
EMAIL_PASSWORD = your_access_token
FRONTEND_URL = your_frontend_url
FIREBASE_API_KEY = your_firebase_api_key
FIREBASE_AUTH_DOMAIN = your_firebase_auth_domain
FIREBASE_PROJECT_ID = your_firebase_project_id
FIREBASE_STORAGE_BUCKET = your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID = your_firebase_messaging_sender_id
FIREBASE_APP_ID = your_firebase_app_id
FIREBASE_MEASUREMENT_ID = your_firebase_measurement_id
```

### Run the Application in Development

To start the application in development mode, use:

```sh
npm run dev
```

Once the application in runnning, you can open your browser and navigate to
`http://localhost:3000` to access the application.

#### Swagger API Documentation
The project includes Swagger for API documentation. You can access it by navigating to
`http://localhost:3000/docs`.


License
-------

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

* * *
