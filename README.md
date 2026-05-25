# AI Form Validator 🔍

An intelligent form validation system powered by AI (Gemini), built with Next.js, Firebase, and a Chrome extension.

## Features

✅ **AI-Powered Form Validation** - Uses Google Gemini to analyze form data  
✅ **Form Builder** - Visual form creation with drag-and-drop support  
✅ **Real-time Validation** - Instant feedback on form fields  
✅ **Chat Support** - AI assistant for form validation questions  
✅ **Chrome Extension** - Validate forms directly on any website  
✅ **Secure** - Firebase authentication and security rules  
✅ **PWA** - Works offline with service worker caching  
✅ **Responsive Design** - Works on desktop and mobile  
✅ **Rate Limiting** - Built-in protection against abuse  
✅ **Error Boundaries** - Graceful error handling throughout the app  

## Prerequisites

- Node.js 16+ and npm/yarn
- Firebase project (Firestore, Authentication, Storage)
- Google Gemini API key
- Chrome browser (for extension)

## Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/balbeerrauniyar1/ai-form-validator.git
cd ai-form-validator
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Firebase and Gemini API keys:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
FIREBASE_ADMIN_SDK_KEY={your_service_account_json}
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Firebase Setup

### 1. Create Firebase Project

- Go to [Firebase Console](https://console.firebase.google.com/)
- Create a new project
- Enable Authentication (Email/Password)
- Create a Firestore database
- Create a Storage bucket

### 2. Deploy Security Rules

Using Firebase CLI:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage
```

## Chrome Extension Setup

### 1. Load Extension in Chrome

1. Open `chrome://extensions/` in Chrome
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `/extension` folder
5. The extension should now appear in your extensions

### 2. Configure Extension

Edit `extension/popup.js` and update the `appUrl` variable:

```javascript
const appUrl = 'https://your-app-domain.com'; // Your deployed app URL
```

## Project Structure

```
.
├── src/
│   ├── components/        # React components
│   ├── lib/              # Utilities (Firebase, Gemini)
│   ├── middleware/       # Auth, rate limiting
│   ├── pages/            # Next.js pages and API routes
│   ├── store/            # Zustand state management
│   └── styles/           # Global CSS
├── extension/            # Chrome extension files
├── public/               # Static assets
├── firestore.rules       # Firestore security rules
├── storage.rules         # Storage security rules
├── .env.local.example    # Environment variables template
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── README.md
```

## API Routes

### POST /api/check-form

Validate form data using AI.

**Request:**
```json
{
  "formData": {
    "email": "user@example.com",
    "name": "John"
  }
}
```

**Response:**
```json
{
  "success": true,
  "results": {
    "email": {
      "isValid": true,
      "errors": [],
      "suggestions": []
    }
  }
}
```

### POST /api/chat

Chat with AI about form validation.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "How do I validate email fields?" }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "reply": "To validate email fields..."
}
```

## Deployment to Vercel

### 1. Connect GitHub Repository

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Click "New Project"
4. Select your GitHub repository
5. Click "Import"

### 2. Add Environment Variables

In Vercel project settings, add all variables from `.env.local`:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `FIREBASE_ADMIN_SDK_KEY`
- `GEMINI_API_KEY`
- `NEXT_PUBLIC_APP_URL` (your Vercel domain)

### 3. Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Your app is now live!

## Rate Limiting

The application implements basic rate limiting:
- **Limit**: 10 requests per minute per IP
- **Applies to**: `/api/check-form` and `/api/chat`
- **Response**: 429 Too Many Requests

## Security

- All API routes require Firebase ID token authentication
- Firestore security rules restrict access to user's own data
- Storage security rules prevent unauthorized access
- Firebase Admin SDK validates tokens server-side
- No sensitive keys exposed in client-side code

## Performance

- PWA with offline caching
- Service worker for static asset caching
- Lazy loading of components
- Optimized Gemini API calls
- Database indexing for queries

## Error Handling

- Global error boundaries prevent app crashes
- Graceful error messages for users
- Console logging for debugging
- Try-catch blocks in all async functions

## SEO

- Meta tags on all pages
- Open Graph support
- Sitemap generation (optional)
- Mobile-friendly design

## Building for Production

```bash
npm run build
npm start
```

## Troubleshooting

### Firebase Connection Issues
- Verify all environment variables are correct
- Check Firebase project settings
- Ensure security rules allow access

### Gemini API Errors
- Verify API key is valid
- Check API quota limits
- Ensure prompt format is correct

### Extension Not Loading
- Enable Developer mode in Chrome
- Check console for errors
- Verify manifest.json is valid

## Contributing

Feel free to fork and submit pull requests!

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues and questions, please create a GitHub issue.

## Future Enhancements

- [ ] Advanced form templates
- [ ] Form analytics dashboard
- [ ] Custom validation rules
- [ ] Multi-language support
- [ ] API documentation
- [ ] Form export options
- [ ] Team collaboration
- [ ] Advanced reporting
