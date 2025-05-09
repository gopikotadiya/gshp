# GSP - Global Student Housing 🌍🏠
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.10%2B-blue)](https://python.org)
[![React](https://img.shields.io/badge/React-18%2B-blue)](https://react.dev)

A full-stack platform connecting international students with verified landlords, offering secure housing solutions with advanced matching capabilities.

## Table of Contents
- [Features](#features-)
- [Tech Stack](#tech-stack-)
- [Installation](#installation-)
- [Configuration](#configuration-)
- [Running](#running-)
- [Demo](#demo-)
- [Enhancement](#future-enhancements-)
- [Contributing](#contributing-)

## Features ✨

### 👨🎓 Tenant Features
- Property search with filters (price, location, amenities)
- Digital application system with document upload
- Roommate matching algorithm
- Application status tracking
- Secure messaging system

### 👔 Landlord Features
- Property listing management dashboard
- Tenant application review system
- Rental calendar & availability management
- Property analytics & insights
- Direct communication channel

### 👮 Admin Features
- User verification & background checks
- Content moderation tools
- Application approval workflow
- Platform usage analytics
- Fraud detection system

## Tech Stack 💻

| Component | Technologies |
|--|--|
| **Frontend** | React 18, Ant Design, React Router, Axios, Chart.js, React Hook Form  |
| **Backend** | Python 3.10, FastAPI, SQLAlchemy, Alembic, Uvicorn, Pydantic  |
| **Database** | PostgreSQL 14  |
| **Security** | JWT Authentication, bcrypt, CORS middleware, HTTPS encryption  |

## Installation 🛠️

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 14+

1. **Clone Repository**
```bash
git clone https://github.com/gopikotadiya/gshp.git
cd gshp
```

2. **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
```

## ⚙️ Configuration

Create `.env` files in both the `backend` and `frontend` directories with the following content:

### 🔐 `backend/.env`

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/gsp_db
JWT_SECRET_KEY=your_secure_secret_here
JWT_REFRESH_SECRET_KEY=your_refresh_secret_here
REDIS_URL=redis://localhost:6379
MAIL_USER=your_email@domain.com
MAIL_PASSWORD=your_email_password
```

### 🌐 `frontend/.env`


```bash 
REACT_APP_API_URL=http://localhost:8000
REACT_APP_MAP_KEY=your_mapbox_key
REACT_APP_RECAPTCHA_KEY=your_recaptcha_key
``` 

## ▶️ Running the Project

### 🗄️ Start Database

```bash
sudo service postgresql start # OS-specific command
```

### 🚀 Run Backend

```bash
cd backend
alembic upgrade head uvicorn app.main:app --reload
``` 


### 💻 Run Frontend

```bash
cd ../frontend
npm start
``` 


### 🔗 Access the App

-   **Frontend**: [http://localhost:3000](http://localhost:3000)
    
-   **Backend**: [http://localhost:8000](http://localhost:8000)
    
-   **API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
    


## ▶️ Demo
🎥 **Watch the walkthrough demo video:**  

![alt text](image.png)

[📽️ GSP Platform Demo](demo/Project%20Demo.mp4)

## ✅ Future Enhancements

-   Notification system for new messages and approvals
    
-   Payment integration for rent transactions
    
-   Language localization for international students


## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.