import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import './App.css';

// Placeholder components - we'll create these files next
import Dashboard from './pages/Dashboard';
import EggCollection from './pages/EggCollection';
import EggSetting from './pages/EggSetting';
import Incubation from './pages/Incubation';
import EggCandling from './pages/EggCandling';
import NewLockdown from './pages/NewLockdown';
import Hatching from './pages/Hatching';
import FinalPackaging from './pages/FinalPackaging';
import Sales from './pages/Sales';
import Alerts from './pages/Alerts';
import ReportsAnalytics from './pages/ReportsAnalytics';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import MainLayout from './components/layout/MainLayout';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Green shade for primary actions
      light: '#4caf50',
      dark: '#1b5e20',
    },
    secondary: {
      main: '#1976d2', // Blue shade for secondary actions
      light: '#42a5f5',
      dark: '#0d47a1',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#0288d1',
    },
    success: {
      main: '#2e7d32',
    },
    text: {
      primary: '#263238',
      secondary: '#546e7a',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 6px rgba(0,0,0,0.06)',
          border: '1px solid #f0f0f0',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 6px rgba(0,0,0,0.06)',
          border: '1px solid #f0f0f0',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: '#f9f9f9',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="egg-collection" element={<EggCollection />} />
            <Route path="egg-setting" element={<EggSetting />} />
            <Route path="incubation" element={<Incubation />} />
            <Route path="egg-candling" element={<EggCandling />} />
            <Route path="lockdown" element={<NewLockdown />} />
            <Route path="hatching" element={<Hatching />} />
            <Route path="final-packaging" element={<FinalPackaging />} />
            <Route path="sales" element={<Sales />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="reports-analytics" element={<ReportsAnalytics />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
