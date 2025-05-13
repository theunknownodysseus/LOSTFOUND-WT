# 🧳 Online Lost and Found System for Web Technology

A modern web application to report and retrieve lost items on campus. Built using **React** for the frontend and **Supabase** as the backend-as-a-service (database + auth).

---

## 🔧 Features

- 📝 Post lost or found items with details and images  
- 🔍 Search and filter items by category, location, and date  
- 🔐 User authentication (Sign Up / Login)  
- 📤 Upload images directly to Supabase Storage  
- 📬 Contact owner or finder via email  
- 🌐 Fully responsive design for mobile and desktop

---

## 🚀 Tech Stack

- **Frontend**: React, Tailwind CSS  
- **Backend/Database**: Supabase (PostgreSQL, Auth, Storage)  
- **Hosting**: Netlify / Vercel (optional)  
- **Deployment**: CI/CD ready

---

## 📦 Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/lost-and-found-react.git
   cd lost-and-found-react
Install dependencies

bash:
npm install
Set up environment variables
Create a .env file in the root directory and add your Supabase keys:

env:
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
Run the app

bash:
npm run dev

🗃 Database Schema (Supabase)
items
Field	Type	Description
id	UUID	Primary key
title	Text	Item name/title
description	Text	Item details
category	Text	e.g., Electronics, Bags
status	Text	"Lost" or "Found"
image_url	Text	Supabase Storage URL
location	Text	Where it was lost/found
date_reported	Date	Date of report
user_id	UUID	Foreign key (users table)

🔐 Authentication
Uses Supabase Auth (email/password)

Auth guards to protect item posting and contact features

Logged-in users can:

Post new items

Edit/delete their own posts

View contact info of other users

📸 Image Uploads
Images are uploaded to Supabase Storage and linked via image_url.

✅ To-Do / Future Improvements
✅ Add pagination and lazy loading

🔜 Add comment/discussion section under posts

🔜 Notification system when item is marked as returned

🔜 Admin dashboard for moderation

🙌 Contributing
Feel free to open issues or pull requests to help improve the system!

📄 License
This project is licensed under the MIT License.
