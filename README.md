# Mini Loan App

Welcome to the Mini Loan App! This application provides a platform for managing loans for both administrators and clients.

## About the Application

The Mini Loan App offers a seamless experience for users to register, request loans with customized terms, and manage their repayments. Administrators have the authority to review loan requests, approve or reject them, and monitor the overall loan portfolio.

### User Registration and Loan Request

Users can easily register on the platform by providing necessary details. Once registered, they can submit loan requests specifying the desired loan amount and repayment terms. The application allows users to customize repayment schedules based on their financial preferences.

### Loan Approval Process

Loan requests are processed by administrators who review the user's information. Administrators have the discretion to approve or reject loan requests based on predefined criteria such as creditworthiness and risk assessment.

### Repayment Management

Upon approval, users are notified, and they can start making weekly payments towards their loans. The application provides a user-friendly interface for managing repayments, tracking payment history.

### Additional Loan Requests

Users have the flexibility to request additional loan amounts if needed. Whether it's for unexpected expenses or personal investments, users can submit new loan requests..

## Cloning the Project from GitHub

To clone the Mini Loan App project from GitHub, follow these steps:

1. Open your terminal or command prompt.
2. Navigate to the directory where you want to clone the project.
3. Use the following command to clone the repository:

   ```bash
   git clone https://github.com/siddharthisrani/Loan-app.git
   
   cd Loan-app


### Running on Local Server

If you prefer to run the application locally, follow these steps:

#### Using npm

1. Navigate to the client directory: `cd client`
2. Install dependencies: `npm install`
3. Run the client: `npm run dev`
4. Navigate to the server directory: `cd ../server`
5. Install dependencies: `npm install`
6. Run the server: `nodemon`

Make sure the server is running on Port 5000 and the client on Port 5173.

## Admin Credentials

To upgrade a user to an administrator:

1. Log in using the provided admin credentials.
2. Navigate to the user management section.
3. Select the user you want to upgrade.
4. Modify the user's profile in the MongoDB database, changing the `user_type` field from "user" to "admin".
5. The user will now have administrative privileges and can access the admin features of the application.

You can log in as an administrator using the following credentials:

- **Email:** sid123@gmail.com
- **Password:** 1234


Feel free to explore and enjoy managing your loans!

