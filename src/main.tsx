import { createRoot } from 'react-dom/client';
import './index.css';
import AppRouter from './routes/Router.tsx';
import { createTheme, ThemeProvider } from '@mui/material';
import { AppProvider } from './context/appProvider.tsx';
import HeaderNav from './components/HeaderNav/HeaderNav.tsx';
import { BrowserRouter } from 'react-router-dom';
// import AuthModal from './components/auth/AuthModal.tsx';
import { CustomNotificaciones } from './components/ui/CustomNotification.tsx';
import Footer from './components/footer/Footer.tsx';

const theme = createTheme();

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AppProvider>
      <ThemeProvider theme={theme}>
        <HeaderNav />
        <AppRouter />
        <Footer/>
        {/* <AuthModal/> */}
        <CustomNotificaciones />
      </ThemeProvider>
  </AppProvider>
  </BrowserRouter>
);
