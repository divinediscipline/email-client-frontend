# Email Client Frontend

A modern, responsive email client built with Next.js, TypeScript, and Tailwind CSS. This application connects to a live API to provide a fully functional email management experience.

## Features

- **Modern UI/UX**: Clean, professional interface matching the provided design
- **Real-time Data**: All data comes from the live API at `https://email-list-api.onrender.com`
- **Authentication**: Secure login/logout with JWT tokens
- **Email Management**: View, search, star, and manage emails
- **Responsive Design**: Works on desktop and mobile devices
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icons
- **Axios**: HTTP client for API calls
- **Headless UI**: Accessible UI components

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd email-list-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Login Credentials

The application uses seeded user credentials from the API:

- **Email**: `sarah.johnson@techcorp.com`
- **Password**: `SecurePass123!`

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── login/          # Login page
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/          # Reusable components
│   ├── Header.tsx      # Top navigation header
│   ├── Sidebar.tsx     # Left sidebar navigation
│   ├── EmailList.tsx   # Email list component
│   └── LoadingSpinner.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── lib/               # Utility libraries
│   └── api.ts         # API service functions
└── types/             # TypeScript type definitions
    └── index.ts       # Application types
```

## API Integration

The application integrates with the following API endpoints. **Note**: The API has been updated to use `view` parameters instead of `folder` parameters for email filtering, and the `moveEmail` functionality has been removed.

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/register` - Register new user

### Emails
- `GET /api/emails` - Get emails with pagination and filtering (supports view, search, labels parameters)
- `GET /api/emails/counts` - Get email counts by view
- `GET /api/emails/:id` - Get specific email
- `PATCH /api/emails/:id/star` - Toggle email star
- `PATCH /api/emails/:id/read` - Mark email as read
- `PATCH /api/emails/:id/important` - Toggle email important

### Labels
- `GET /api/emails/labels` - Get email labels
- `POST /api/emails/labels` - Create email label
- `PATCH /api/emails/:id/labels/add` - Add label to email
- `PATCH /api/emails/:id/labels/remove` - Remove label from email
- `DELETE /api/emails/labels/:id` - Delete email label

### Navigation
- `GET /api/navigation/items` - Get navigation items
- `GET /api/navigation/upgrade-info` - Get upgrade information

### Notifications
- `GET /api/notifications/notifications` - Get notifications
- `GET /api/notifications/notifications/unread-count` - Get unread notification count
- `PATCH /api/notifications/notifications/:id/read` - Mark notification as read
- `PATCH /api/notifications/notifications/mark-all-read` - Mark all notifications as read
- `GET /api/notifications/messages` - Get messages
- `GET /api/notifications/messages/unread-count` - Get unread message count
- `PATCH /api/notifications/messages/:id/read` - Mark message as read
- `PATCH /api/notifications/messages/mark-all-read` - Mark all messages as read

## Key Features

### 1. Three-Column Layout
- **Header**: Search bar and user controls
- **Sidebar**: Navigation, user profile, email folders, and labels
- **Main Content**: Email list with pagination

### 2. Email Management
- View emails with sender, subject, and timestamp
- Star/unstar emails
- Search functionality
- Pagination support
- Attachment indicators

### 3. Navigation
- Collapsible sections
- Active state indicators
- Email folder counts
- User profile display

### 4. Authentication
- Secure login with seeded credentials
- JWT token management
- Automatic redirects
- Logout functionality

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

No environment variables are required as the API base URL is hardcoded to the live endpoint.

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## API Documentation

For detailed API documentation, refer to the live API at `https://email-list-api.onrender.com/api`.

## Notes

- All data is fetched from the live API - no mock data is used
- The application is fully functional and ready for production
- Authentication is handled client-side with localStorage
- The UI matches the provided design exactly
- All interactive elements are functional
