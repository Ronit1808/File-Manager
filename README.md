# User Portal Web Application

A full-stack web application built with Django and ReactJS that provides a comprehensive user portal. Users can authenticate, manage files, view analytics on their file uploads, and update their profile information—including managing multiple addresses.

## Features

### Authentication
- **Login:** Secure login using JWT authentication (username and password).
- **Token Refresh:** Automatic refresh of access tokens when expired.

### File Management
- **File Upload:** Users can upload files (PDF, Excel, TXT, etc.) with descriptions.
- **File Listing:** View a table of uploaded files with details (filename, upload date, file type).
- **File Download:** Download files by clicking on their filename.

### Dashboard
- **Total Files:** View the total number of files uploaded.
- **File Type Breakdown:** See analytics for each file type.
- **User File Counts:** Display the number of files uploaded per user.

### User Profile
- **Edit Username:** Update your username.
- **Update Phone Number:** Change your contact number.
- **Manage Addresses:** Add, view, and manage multiple addresses.

## Tech Stack

- **Backend:** 
  - Django & Django REST Framework
  - Simple JWT for authentication
  - PostgreSQL as the database
  - python-dotenv for environment variable management
  - django-cors-headers for handling CORS

- **Frontend:** 
  - ReactJS (Vite template)
  - Tailwind CSS for styling
  - Axios for API requests
  - Recharts for data visualization

## Setup

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/File-Manager.git
   cd File-Manager/backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python -m venv portalenv
   portalenv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create a .env file in the backend directory with the following variables:**
   ```env
   SECRET_KEY=secret_key
   DEBUG=True
   DATABASE_NAME=db_name
   DATABASE_USER=db_user
   DATABASE_PASSWORD=db_password
   ```

5. **Apply migrations:**
   ```bash
   python manage.py migrate
   ```

6. **Create a superuser (optional):**
   ```bash
   python manage.py createsuperuser 
   ```

7. **Run the development server:**  (you can add user and file with django admin panel)
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## Usage

### Authentication:
Navigate to the login page, enter your username and password, and sign in. The application will use JWT tokens for subsequent API requests.

### File Management:
After logging in, access the file management section to upload new files, view existing uploads, and download files.

### Dashboard:
The dashboard provides visual analytics on total files, file type breakdown, and per-user file uploads.

### User Profile:
Update your username and phone number, and manage your addresses in the profile section.


## Acknowledgements

- Django
- ReactJS
- Tailwind CSS
- Recharts
- Simple JWT
