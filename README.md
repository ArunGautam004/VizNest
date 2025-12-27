# 📚 VizNest Development Chat Documentation

## 📖 Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Features Discussed](#features-discussed)
4. [Backend Configuration](#backend-configuration)
5. [Frontend Setup](#frontend-setup)
6. [API Endpoints & Integration](#api-endpoints--integration)
7. [Authentication System](#authentication-system)
8. [Email & OTP Verification](#email--otp-verification)
9. [Payment Integration](#payment-integration)
10. [Image Storage (Cloudinary)](#image-storage-cloudinary)
11. [Admin Panel](#admin-panel)
12. [User Dashboard](#user-dashboard)
13. [Database Schema](#database-schema)
14. [Security Implementations](#security-implementations)
15. [Troubleshooting & Solutions](#troubleshooting--solutions)
16. [Deployment Guide](#deployment-guide)
17. [Key Learning Points](#key-learning-points)

---

## 🛍️ Project Overview

**VizNest** is a modern, full-stack e-commerce platform built with the **MERN Stack** (MongoDB, Express, React, Node.js). The platform provides a seamless online shopping experience with advanced features including:

- Secure user authentication with email verification
- Real-time order management
- Secure payment processing
- User profile and address management
- Admin dashboard for store management
- Product catalog with filtering and search

**Live Website:** https://viznest.vercel.app  
**GitHub Repository:** https://github.com/ArunGautam004/VizNest.git
**Developer:** Arun Gautam  And Md. Kaif Iqbal
**Email:** arungautam0041@gmail.com

---

## 🚀 Tech Stack

### Frontend
- **Framework:** React.js with Vite
- **Styling:** Tailwind CSS
- **State Management:** React Context API (AuthContext)
- **Icons:** Lucide React
- **HTTP Client:** Fetch API
- **Deployment:** Vercel

### Backend
- **Runtime:** Node.js (v16+)
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT (JSON Web Tokens) & Passport.js (Google OAuth)
- **Deployment:** Render

### External Services
- **Payments:** Razorpay
- **Email/OTP:** Brevo (formerly Sendinblue)
- **Image Storage:** Cloudinary
- **Social Authentication:** Google OAuth 2.0

---

## 🌟 Features Discussed

### User Authentication
- Email & password registration with 6-digit OTP verification
- Google OAuth social login
- Forgot password functionality with email verification
- Auto-verification prompts for unverified users
- JWT-based session management
- Secure password hashing with bcryptjs

### User Dashboard
- Profile management (name, phone, profile picture)
- Address book with add, edit, delete, and primary address selection
- Order history with pagination (5 orders per page)
- Invoice generation and PDF download for delivered orders
- Profile picture upload to Cloudinary

### Shopping Experience
- Product catalog with filtering options
- Add/remove items from cart
- Wishlist functionality
- Secure checkout process
- Address selection during checkout
- Real-time cart updates

### Admin Panel
- Product management (add, edit, delete)
- View all user orders
- Change order status (Processing → Delivered)
- User order management interface

### Order Management
- Order status tracking
- Multiple order statuses (Pending, Processing, Delivered)
- Invoice generation for completed orders
- Order history with detailed information

---

## ⚙️ Backend Configuration

### Environment Variables (.env)

The backend requires the following environment variables to function properly:

```env
# Server Configuration
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
SESSION_SECRET=your_session_secret

# Frontend URL (Important for CORS)
FRONTEND_URL=http://localhost:5173

# Cloudinary (Images)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Brevo)
BREVO_API_KEY=your_brevo_api_key
SENDER_EMAIL=your_verified_sender_email

# Razorpay (Payments)
RAZORPAY_KEY_ID=your_razorpay_key_id

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Backend Installation

```bash
# Clone repository
git clone https://github.com/ArunGautam004/VizNest.git
cd Viznest-Live

# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file with above variables

# Start development server
npm run server

# Server runs on http://localhost:5000
```

### Key Backend Dependencies
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **passport** - Authentication middleware
- **cloudinary** - Image upload and storage
- **axios** - HTTP client for API calls
- **nodemailer** - Email sending (integrated with Brevo)
- **cors** - Cross-Origin Resource Sharing

---

## 🎨 Frontend Setup

### Environment Variables (.env)

```env
VITE_API_URL=http://localhost:5000
```

### Frontend Installation

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create .env file with above variable

# Start development server
npm run dev

# App runs on http://localhost:5173
```

### Frontend Folder Structure
- `/src/components` - Reusable React components
- `/src/pages` - Page components (Login, Dashboard, Shop, etc.)
- `/src/context` - React Context (AuthContext for state management)
- `/src/styles` - Tailwind CSS and custom styles
- `/public` - Static assets and images

---

## 🔌 API Endpoints & Integration

### Authentication Endpoints
- `POST /api/auth/register` - User registration with OTP verification
- `POST /api/auth/verify-otp` - Verify OTP sent to email
- `POST /api/auth/login` - User login with email and password
- `POST /api/auth/forgot-password` - Initiate password recovery
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/google` - Google OAuth login initiation
- `GET /api/auth/google/callback` - Google OAuth callback

### User Endpoints
- `GET /api/user/profile` - Get user profile information
- `PUT /api/user/profile` - Update user profile (name, phone)
- `POST /api/user/profile/picture` - Upload profile picture
- `GET /api/user/addresses` - Get user's addresses
- `POST /api/user/addresses` - Add new address
- `PUT /api/user/addresses/:id` - Update address
- `DELETE /api/user/addresses/:id` - Delete address
- `PUT /api/user/addresses/:id/primary` - Set primary address

### Order Endpoints
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `POST /api/orders/:id/invoice` - Generate invoice

### Product Endpoints (Admin)
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Payment Endpoints
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment after successful transaction

---

## 🔐 Authentication System

### JWT Implementation
- **Token Generation:** Upon successful login/registration, a JWT token is created containing user ID and role
- **Token Storage:** Token is stored in browser's localStorage (or httpOnly cookie for enhanced security)
- **Token Verification:** Every protected API request includes the token in the Authorization header
- **Token Expiration:** Tokens typically expire after 7-30 days (configurable)

### Google OAuth Flow
1. User clicks "Login with Google"
2. Redirected to Google's OAuth consent screen
3. User grants permissions
4. Google redirects back with authorization code
5. Backend exchanges code for access token
6. User profile created/verified in database
7. JWT token generated for session

### Password Security
- Passwords are hashed using bcryptjs with salt rounds = 10
- Bcrypt automatically handles salt generation and storage
- Password comparison is done securely during login
- Forgotten passwords are reset via secure email tokens

---

## 📧 Email & OTP Verification

### Brevo Integration
**Why Brevo?** Brevo is used instead of Nodemailer with Gmail because:
- More reliable for production use
- Better email deliverability
- Higher sending limits
- Professional email infrastructure
- Better handling of SMTP authentication

### OTP Verification Flow
1. User registers with email
2. Backend generates 6-digit OTP
3. OTP sent to user's email via Brevo
4. User enters OTP in verification form
5. Backend validates OTP (checks if correct and not expired)
6. User account activated upon successful verification

### Email Templates
The system sends emails for:
- **OTP Verification:** 6-digit code for account activation
- **Forgot Password:** Password reset link with secure token
- **Order Confirmation:** Order details and invoice
- **Shipment Notification:** Order status updates

### Brevo API Key Setup
1. Create account at https://www.brevo.com
2. Verify sender email address
3. Generate API key from account settings
4. Add to `.env` file as `BREVO_API_KEY`
5. Set `SENDER_EMAIL` to your verified email

---

## 💳 Payment Integration

### Razorpay Payment Gateway
**Why Razorpay?** Industry-leading payment processor in India with:
- Multiple payment methods (Credit/Debit cards, UPI, NetBanking)
- Secure PCI-compliant infrastructure
- Easy integration and documentation
- Test mode for development
- Real-time payment status updates

### Payment Flow
1. User initiates checkout with cart items and selected address
2. Frontend requests Razorpay order creation from backend
3. Backend creates order and returns order ID to frontend
4. Frontend opens Razorpay payment modal with order details
5. User enters payment information and completes transaction
6. Razorpay sends payment success/failure callback
7. Backend verifies payment signature
8. Order is saved to database upon successful verification
9. User receives order confirmation email

### Test Payment Credentials
For development/testing use these test cards:
- **Card Number:** 4111 1111 1111 1111
- **Expiry:** Any future date
- **CVV:** Any 3 digits
- **Name:** Any name

### Security Considerations
- Payment signatures verified server-side
- Razorpay Key ID stored securely in backend
- Sensitive payment data never stored in frontend
- HTTPS enforced in production
- PCI DSS compliance maintained

---

## 🖼️ Image Storage (Cloudinary)

### Why Cloudinary?
- Cloud-based image storage (no local server storage needed)
- Automatic image optimization
- CDN delivery for fast loading
- Easy integration with multiple platforms
- Free tier available for testing

### Image Upload Process
1. User selects image file
2. File sent to backend endpoint
3. Cloudinary API processes and stores image
4. Image URL returned and saved in database
5. URL used throughout application for display

### Supported Features
- Profile picture upload (for user accounts)
- Product images (for catalog)
- Automatic resizing and optimization
- Secure image delivery via CDN

### Cloudinary Setup
1. Create account at https://cloudinary.com
2. Get Cloud Name, API Key, and API Secret
3. Add credentials to backend `.env` file
4. Use Cloudinary SDK to upload files

---

## 👨‍💼 Admin Panel

### Admin Features
- **Product Management:** Add, edit, and delete products
- **Order Management:** View all orders and update status
- **User Management:** View registered users
- **Analytics:** Basic dashboard with order stats

### Admin Access
- Admin users have special role in database
- Admin routes protected by middleware
- Only admin-authenticated requests allowed
- Admin activities logged for security

### Product Management
- Add new products with name, description, price, stock
- Edit existing product details
- Upload product images to Cloudinary
- Delete products from catalog
- Filter and search products

### Order Management
- View all orders from all users
- Change order status (Pending → Processing → Delivered)
- View order details and customer information
- Track payment status

---

## 👤 User Dashboard

### Profile Management
- **View Profile:** See current name, email, phone
- **Edit Profile:** Update name and phone number
- **Profile Picture:** Upload and change profile picture to Cloudinary
- **Account Settings:** Manage email and password

### Address Book
- **Add Address:** Add new shipping addresses with details
- **Edit Address:** Modify existing address information
- **Delete Address:** Remove unused addresses
- **Set Primary:** Mark one address as default for checkout
- **Pagination:** List addresses with easy navigation

### Order History
- **View Orders:** See all past orders in paginated list (5 per page)
- **Order Details:** Click to view full order information
- **Order Status:** Track current status of orders
- **Invoice Download:** Download PDF invoice for delivered orders
- **Order Search:** Find orders by date or ID

### Features Breakdown
- **Profile Page:** Central hub for account information
- **Address Page:** Complete address management interface
- **Order Page:** Historical view of all purchases
- **Invoice Page:** Download and view invoice PDFs

---

## 🗄️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  profilePicture: String (Cloudinary URL),
  isVerified: Boolean,
  role: String (user/admin),
  addresses: [AddressId],
  createdAt: Date,
  updatedAt: Date
}
```

### Address Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  fullName: String,
  phone: String,
  addressLine1: String,
  addressLine2: String,
  city: String,
  state: String,
  postalCode: String,
  country: String,
  isPrimary: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  items: [
    {
      productId: ObjectId,
      quantity: Number,
      price: Number
    }
  ],
  address: Object,
  totalAmount: Number,
  paymentStatus: String (pending/completed),
  orderStatus: String (pending/processing/delivered),
  razorpayOrderId: String,
  razorpayPaymentId: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Product Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  stock: Number,
  image: String (Cloudinary URL),
  category: String,
  createdAt: Date,
  updatedAt: Date
}
```

### OTP Verification Collection
```javascript
{
  _id: ObjectId,
  email: String,
  otp: String,
  expiresAt: Date,
  createdAt: Date
}
```

---

## 🛡️ Security Implementations

### Authentication Security
- JWT tokens for stateless authentication
- Httponly cookies (recommended for production)
- Secure password hashing with bcryptjs
- CORS configuration to restrict cross-origin requests
- Session management with secure secrets

### Data Protection
- MongoDB Atlas encryption at rest
- HTTPS/TLS for data in transit
- Sensitive data never logged
- Environment variables for secrets
- No hardcoded credentials

### API Security
- Request validation using middleware
- Rate limiting to prevent brute force attacks
- Input sanitization to prevent injection attacks
- CSRF protection (if using cookies)
- Authorization checks on all protected routes

### Payment Security
- Razorpay payment signature verification
- PCI-DSS compliance
- No storage of payment card data
- Secure token handling
- Server-side verification required

### Email Security
- Brevo SMTP for secure email delivery
- OTP tokens with expiration
- Secure password reset links
- Email verification required for account activation

### Best Practices
- Implement HTTPS in production
- Use environment variables for all secrets
- Regular security audits
- Update dependencies regularly
- Implement logging and monitoring
- Use strong password requirements
- Enable CORS only for trusted domains

---

## 🔧 Troubleshooting & Solutions

### Common Issues & Fixes

#### Issue: Mongoose Connection Error
**Problem:** Cannot connect to MongoDB Atlas  
**Solution:**
- Verify MongoDB URI in .env file
- Ensure IP address is whitelisted in MongoDB Atlas
- Check network connectivity
- Verify credentials are correct

#### Issue: Email Not Sending
**Problem:** OTP/emails not received  
**Solution:**
- Verify Brevo API key is correct
- Confirm sender email is verified in Brevo
- Check email goes to spam folder
- Verify BREVO_API_KEY is in .env
- Test with Brevo dashboard first

#### Issue: Google OAuth Not Working
**Problem:** Cannot login with Google  
**Solution:**
- Verify Google Client ID and Secret in .env
- Check redirect URI matches in Google Console
- Ensure frontend URL is correct in backend CORS config
- Verify credentials aren't expired
- Check browser console for errors

#### Issue: Payment Integration Error
**Problem:** Razorpay modal not opening  
**Solution:**
- Verify RAZORPAY_KEY_ID is correct
- Check payment amount is in smallest currency unit (paise)
- Ensure order was created successfully first
- Check browser console for errors
- Verify test credentials are being used in dev

#### Issue: Profile Picture Not Uploading
**Problem:** Image upload fails  
**Solution:**
- Verify Cloudinary credentials in .env
- Check file size doesn't exceed limits
- Ensure image format is supported (JPG, PNG, etc.)
- Test with Cloudinary dashboard
- Check network tab for actual error

#### Issue: CORS Errors
**Problem:** Frontend cannot reach backend  
**Solution:**
- Verify FRONTEND_URL in backend .env
- Add frontend URL to CORS whitelist
- Check if using correct protocol (http/https)
- Clear browser cache
- Test API directly with Postman

#### Issue: Token Expiration
**Problem:** User gets logged out frequently  
**Solution:**
- Increase JWT expiration time
- Implement refresh token logic
- Check token isn't being invalidated prematurely
- Verify token storage mechanism

---

## 🚀 Deployment Guide

### Frontend Deployment (Vercel)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Select GitHub repository
   - Configure build settings

3. **Environment Variables**
   - Add VITE_API_URL pointing to deployed backend
   - Set to production API endpoint

4. **Deploy**
   - Vercel automatically deploys on git push
   - Monitor deployment logs
   - Test all features on live site

### Backend Deployment (Render)

1. **Prepare Repository**
   ```bash
   # Ensure Procfile exists with:
   # web: npm run server
   git add .
   git commit -m "Ready for backend deployment"
   git push origin main
   ```

2. **Connect to Render**
   - Go to https://render.com
   - Create new Web Service
   - Connect GitHub repository
   - Select backend branch

3. **Configure Environment Variables**
   - Add all .env variables in Render dashboard
   - Ensure MongoDB URI is correct
   - Update FRONTEND_URL to production frontend URL
   - Set PORT to 5000

4. **Deploy**
   - Render builds and deploys automatically
   - Monitor deployment logs
   - Verify API is running

5. **Update Frontend**
   - Change VITE_API_URL to production backend URL
   - Redeploy frontend

### Production Checklist
- [ ] HTTPS enabled on both frontend and backend
- [ ] All environment variables configured
- [ ] Email/SMS service working
- [ ] Payment processing in production mode
- [ ] Database backups configured
- [ ] Logging and monitoring enabled
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] Error handling and logging in place
- [ ] Rate limiting enabled

---

## 📚 Key Learning Points

### Architecture Insights
- **MERN Stack Benefits:** Full JavaScript stack, good community support, scalable
- **Separation of Concerns:** Frontend/Backend separated for independent scaling
- **Authentication:** JWT provides stateless authentication suitable for APIs
- **External Services:** Using third-party services (Razorpay, Cloudinary) reduces complexity

### Best Practices Implemented
- **Environment Variables:** Sensitive data never hardcoded
- **Password Security:** Bcryptjs hashing with proper salt rounds
- **API Design:** RESTful endpoints with proper HTTP methods
- **Error Handling:** Meaningful error messages for debugging
- **Code Organization:** Modular structure for maintainability

### Security Principles
- **Principle of Least Privilege:** Users and apps only get needed permissions
- **Defense in Depth:** Multiple layers of security (validation, hashing, HTTPS)
- **Secure by Default:** Security built in, not added as afterthought
- **Data Minimization:** Only collect and store necessary data

### Performance Optimization
- **Image Optimization:** Cloudinary handles image resizing
- **Database Indexing:** Important fields indexed for faster queries
- **Pagination:** Large datasets paginated to reduce memory usage
- **Lazy Loading:** Assets loaded as needed, not all at once

### Testing Approach
- **Manual Testing:** Test all features during development
- **Postman Testing:** Test APIs with Postman before frontend integration
- **Environment Testing:** Test in development, staging, and production
- **Edge Cases:** Test error scenarios and edge cases

### Development Workflow
1. Plan database schema before coding
2. Implement backend API first
3. Test API with Postman
4. Build frontend components
5. Integrate with backend
6. Test end-to-end workflows
7. Deploy to staging
8. Final testing in production environment

### Future Enhancement Ideas
- Implement cart functionality with database persistence
- Add product reviews and ratings system
- Implement search and advanced filtering
- Add inventory management
- Implement user notifications
- Add order tracking with SMS notifications
- Implement discount codes and coupons
- Add wishlist functionality
- Implement user referral system
- Add analytics dashboard

---

## 📞 Contact & Support

**Developer:** Arun Gautam  
**Email:** arungautam0041@gmail.com  
**GitHub:** https://github.com/ArunGautam004/VizNest.git 
**Video Demo:** https://www.linkedin.com/feed/update/urn:li:activity:7409512616924131330/  
**Live Demo:** https://viznest.vercel.app

---

⭐ **If you found this documentation helpful, please star the project on GitHub!**

---

## 📝 Document Information

- **Last Updated:** December 2024
- **Project Status:** Fully Functional
- **Version:** 1.0
- **Documentation Version:** Complete Chat Log
