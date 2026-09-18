# LegalEase - Government & Legal Information Portal

LegalEase is a comprehensive digital platform that helps Indian citizens understand legal documents, discover government schemes, check eligibility, and access legal information in multiple languages.

## 🚀 Features

- **AI Legal Assistant**: Get instant answers to legal questions with source-grounded responses
- **Document Analyzer**: Upload and analyze legal documents with AI-powered insights
- **Government Schemes**: Discover government schemes with intelligent search and recommendations
- **Voice Interaction**: Interact with the platform using voice commands
- **Multilingual Support**: Access information in English, Hindi, Telugu, and more
- **Eligibility Checker**: Check your eligibility for various government schemes
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop

## 🛠️ Tech Stack

- **Frontend**: React 18+ with Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS 3.x
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **API**: Axios
- **State Management**: Context API + Zustand
- **SEO**: React Helmet Async
- **Notifications**: React Hot Toast

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm

## 🏗️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd LegalEase-AI/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and configure your API URL:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🧪 Linting

```bash
npm run lint
```

## 📁 Project Structure

```
frontend/
├── public/
│   ├── favicon.ico
│   └── logo.svg
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   ├── components/
│   │   ├── common/          # Reusable components (Button, Input, Card, etc.)
│   │   ├── layout/          # Layout components (Layout, AuthLayout, DashboardLayout)
│   │   ├── home/            # Home page components
│   │   ├── chat/            # Chat interface components
│   │   ├── documents/       # Document-related components
│   │   ├── schemes/         # Scheme-related components
│   │   └── auth/            # Authentication components
│   ├── pages/               # Page components
│   ├── hooks/               # Custom React hooks
│   ├── contexts/            # React contexts (Auth, Theme, Language, App)
│   ├── services/            # API service functions
│   ├── utils/               # Utility functions and constants
│   ├── styles/              # Global styles
│   ├── App.jsx              # Main app component with routing
│   └── main.jsx             # Application entry point
├── .env.example             # Environment variables template
├── .eslintrc.cjs            # ESLint configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── vite.config.js           # Vite configuration
└── package.json             # Project dependencies
```

## 🎨 Design System

The project uses a custom design system built with Tailwind CSS:

- **Colors**: Brand (indigo), Primary (blue), Success (green), Warning (yellow), Danger (red)
- **Typography**: Inter (sans), Fraunces (display), IBM Plex Mono (mono)
- **Spacing**: Consistent spacing scale (4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 128)
- **Shadows**: Soft shadows for depth, glow effects for emphasis
- **Animations**: Custom animations (float, slide-up, slide-down, fade-in)

## 🔐 Authentication

The application uses token-based authentication:
- Login and register functionality
- Protected routes for authenticated users
- Token storage in localStorage
- Automatic token refresh on 401 errors

## 🌍 Multi-language Support

Currently supported languages:
- English (en)
- Hindi (hi)
- Telugu (te)

Language selection persists in localStorage and updates the entire UI.

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

## ♿ Accessibility

The application follows WCAG 2.1 AA guidelines:
- ARIA labels for interactive elements
- Proper color contrast ratios
- Keyboard navigation support
- Focus states for all interactive elements

## 🚀 Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Deploy the dist folder
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Government of India for public scheme information
- Open source community for the amazing tools and libraries
- All contributors who help make this project better

## 📞 Support

For support, email contact@legalease.in or open an issue in the repository.

---

Built with ❤️ for the citizens of India
