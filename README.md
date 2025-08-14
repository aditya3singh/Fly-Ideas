# 🚀 Fly Thoughts - Modern MERN Blogging Platform

A comprehensive, feature-rich blogging platform built with the MERN stack, designed for performance, scalability, and exceptional user experience.

![Fly Thoughts Banner](https://via.placeholder.com/1200x400/4F46E5/FFFFFF?text=Fly+Thoughts+-+Modern+Blogging+Platform)

## ✨ Features

### 🔐 Authentication & User Management
- Secure JWT-based authentication
- User profiles with avatars and bios
- Follow/unfollow system
- Role-based access control (User/Admin)

### 📝 Content Management
- Rich text editor with formatting options
- Image upload and optimization via Cloudinary
- Categories and tags system
- Draft and published post states
- SEO-friendly URLs with slugs
- Auto-generated excerpts and read time

### 💬 Engagement Features
- Nested comments system
- Like and bookmark functionality
- Real-time notifications
- Social sharing capabilities

### 🔍 Discovery & Search
- Advanced search with filters
- Category-based browsing
- Tag cloud navigation
- Featured posts section
- Trending content

### 📱 Modern UI/UX
- Responsive design (mobile-first)
- Dark/light theme toggle
- Smooth animations with Framer Motion
- Accessibility compliant (WCAG 2.1)
- Progressive Web App features

### 📊 Analytics & Admin
- Post views and engagement metrics
- User analytics dashboard
- Content moderation tools
- Admin panel for user management

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Material-UI v6** - Component library
- **Redux Toolkit** - State management
- **React Router v6** - Client-side routing
- **Framer Motion** - Animations
- **React Quill** - Rich text editor
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Cloudinary** - Image management
- **Nodemailer** - Email service

### DevOps & Tools
- **Docker** - Containerization
- **ESLint & Prettier** - Code quality
- **React Testing Library** - Testing
- **Helmet** - Security middleware

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fly-thoughts.git
   cd fly-thoughts
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cd ../server
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   # Database
   MONGO_URI=mongodb://localhost:27017/FlyThoughts
   
   # JWT
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=30d
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Email (optional)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

4. **Start the application**
   ```bash
   # Start backend (from server directory)
   npm run dev
   
   # Start frontend (from client directory, new terminal)
   cd ../client
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001
   - API Health Check: http://localhost:5001/api/health

### Using Docker (Alternative)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/signup     - Register new user
POST /api/auth/login      - User login
GET  /api/auth/profile    - Get user profile
PUT  /api/auth/profile    - Update profile
```

### Post Endpoints
```
GET    /api/posts              - Get all posts (with filters)
GET    /api/posts/featured     - Get featured posts
GET    /api/posts/:slug        - Get post by slug
POST   /api/posts              - Create new post
PUT    /api/posts/:id          - Update post
DELETE /api/posts/:id          - Delete post
POST   /api/posts/:id/like     - Toggle like
POST   /api/posts/:id/bookmark - Toggle bookmark
```

### Comment Endpoints
```
GET    /api/comments/posts/:postId/comments - Get post comments
POST   /api/comments/posts/:postId/comments - Create comment
PUT    /api/comments/:id                    - Update comment
DELETE /api/comments/:id                    - Delete comment
POST   /api/comments/:id/like               - Toggle comment like
```

## 🏗️ Project Structure

```
Fly-Thoughts/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── store/         # Redux store
│   │   └── utils/         # Utilities
│   └── package.json
├── server/                # Node.js backend
│   ├── controllers/       # Route handlers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utilities
│   └── package.json
├── docker-compose.yaml   # Docker configuration
└── README.md
```

## 🧪 Testing

```bash
# Run frontend tests
cd client
npm test

# Run backend tests
cd server
npm test

# Run all tests
npm run test:all
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the client: `npm run build`
2. Deploy the `build` folder
3. Set environment variables in deployment platform

### Backend (Railway/Render/Heroku)
1. Set environment variables
2. Deploy from the `server` directory
3. Ensure MongoDB Atlas connection

### Database (MongoDB Atlas)
1. Create a cluster on MongoDB Atlas
2. Update `MONGO_URI` in environment variables
3. Configure network access and database users

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI framework
- [Material-UI](https://mui.com/) - Component library
- [Express.js](https://expressjs.com/) - Backend framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Cloudinary](https://cloudinary.com/) - Image management

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the [documentation](./ARCHITECTURE.md)
- Join our community discussions

---

**Made with ❤️ by the Fly Thoughts team**

⭐ Star this repository if you find it helpful!