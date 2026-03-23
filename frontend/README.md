# Shortify Frontend

A modern, responsive React dashboard for managing shortened URLs and viewing analytics.

## 🚀 Features

- **Dashboard**: A comprehensive view of all your links with one-click copy and manage actions.
- **Analytics**: Beautifully visualized click data using `recharts`.
- **Shortening**: Custom alias support and expiry date selection.
- **QR Codes**: Automatically generated QR codes for every link.
- **Authentication**: Secure login/signup with JWT persistence.
- **Responsive Design**: Mobile-friendly dark theme built with Tailwind CSS.

## 💻 Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   Create a `.env` file and set your API base URL:
   ```bash
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 🛠️ Key Libraries

- **React 19**: Core UI library.
- **Tailwind CSS**: Styling and layout.
- **Vite**: Build tool and dev server.
- **Framer Motion**: Smooth animations and transitions.
- **Lucide React**: Premium icon set.
- **Recharts**: Data visualization.
- **React Toastify**: Elegant notifications.
