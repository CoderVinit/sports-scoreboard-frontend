# Sports Scoreboard Frontend

A modern sports scoreboard application built with React, Vite, Redux Toolkit, Material-UI, and Tailwind CSS.

## 🚀 Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **Material-UI (MUI)** - Component library
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **ESLint** - Code linting

## 📁 Project Structure

```
client/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, icons, etc.
│   ├── components/     # Reusable components
│   ├── config/         # Configuration files
│   ├── features/       # Redux slices and features
│   │   └── auth/       # Authentication feature
│   ├── pages/          # Page components
│   ├── store/          # Redux store configuration
│   ├── theme/          # MUI theme configuration
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main App component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── .env.example        # Environment variables example
├── index.html          # HTML template
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind configuration
└── postcss.config.js   # PostCSS configuration
```

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update the `.env` file with your API URL:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
The app will run on `http://localhost:3000`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

## 🎨 Styling

This project uses a combination of:
- **Material-UI** for pre-built components
- **Tailwind CSS** for utility classes
- **Emotion** for CSS-in-JS (via MUI)

The Tailwind `preflight` is disabled to avoid conflicts with MUI's base styles.

## 📦 State Management

Redux Toolkit is configured with the following slices:
- `auth` - Authentication state

Add more slices in the `src/features/` directory as needed.

## 🔐 Authentication

The app includes:
- Axios interceptors for adding auth tokens
- Automatic redirect on 401 responses
- Token storage in localStorage

## 🌐 API Integration

Configure API endpoints in `src/config/api.config.js`

Use the axios instance from `src/utils/axios.js` for all API calls:
```javascript
import axios from '../utils/axios';

const fetchData = async () => {
  const response = await axios.get('/endpoint');
  return response.data;
};
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Features

- ✅ React 19 with Hooks
- ✅ Redux Toolkit for state management
- ✅ Material-UI components
- ✅ Tailwind CSS utilities
- ✅ Responsive design
- ✅ Dark/Light theme support (MUI)
- ✅ Axios interceptors
- ✅ ESLint configuration
- ✅ Hot Module Replacement (HMR)

## 📚 Documentation

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [Material-UI](https://mui.com)
- [Tailwind CSS](https://tailwindcss.com)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run linter: `npm run lint`
4. Submit a pull request

## 📄 License

ISC
