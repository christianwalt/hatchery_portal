import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Edit as EggCollectionIcon,
  SettingsInputComponent as EggSettingIcon,
  BuildCircle as IncubatorIcon,
  Search as CandlingIcon,
  Lock as LockdownIcon,
  ChildCare as HatchingIcon,
  LocalShipping as PackagingIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Science as ScienceIcon,
  MonetizationOn as SalesIcon,
  NotificationsActive as AlertsIcon,
  BarChart as ReportsIcon,
} from '@mui/icons-material';

const drawerWidth = 260;

const navItems = [
  { name: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { name: 'Egg Collection', path: '/egg-collection', icon: <EggCollectionIcon /> },
  { name: 'Egg Setting', path: '/egg-setting', icon: <EggSettingIcon /> },
  { name: 'Incubation', path: '/incubation', icon: <IncubatorIcon /> },
  { name: 'Egg Candling', path: '/egg-candling', icon: <CandlingIcon /> },
  { name: 'Lockdown', path: '/lockdown', icon: <LockdownIcon /> },
  { name: 'Hatching', path: '/hatching', icon: <HatchingIcon /> },
  { name: 'Final Packaging', path: '/final-packaging', icon: <PackagingIcon /> },
  { name: 'Sales', path: '/sales', icon: <SalesIcon /> },
  { name: 'Alerts', path: '/alerts', icon: <AlertsIcon /> },
  { name: 'Reports & Analytics', path: '/reports-analytics', icon: <ReportsIcon /> },
];

export default function MainLayout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerToggleDesktop = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: drawerOpen ? 'space-between' : 'center',
          padding: theme.spacing(1.5),
          paddingLeft: drawerOpen ? theme.spacing(2) : theme.spacing(1.5),
        }}
      >
        {drawerOpen && (
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              color: theme.palette.primary.main,
            }}
          >
            <ScienceIcon sx={{ mr: 1 }} />
            HatchPro
          </Typography>
        )}
        {!isMobile && (
          <IconButton onClick={handleDrawerToggleDesktop}>
            {drawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        )}
      </Box>
      <Divider />
      <List sx={{ p: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
            <ListItem key={item.name} disablePadding sx={{ display: 'block', mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  minHeight: 48,
                  justifyContent: drawerOpen ? 'initial' : 'center',
                  px: 2.5,
                  borderRadius: '8px',
                  backgroundColor: isActive ? 'rgba(46, 125, 50, 0.08)' : 'transparent',
                  '&:hover': {
                    backgroundColor: isActive ? 'rgba(46, 125, 50, 0.12)' : 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: drawerOpen ? 2 : 'auto',
                    justifyContent: 'center',
                    color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {drawerOpen && (
                  <ListItemText 
                    primary={item.name} 
                    sx={{ 
                      opacity: drawerOpen ? 1 : 0,
                      color: isActive ? theme.palette.primary.main : theme.palette.text.primary, 
                      '& .MuiListItemText-primary': {
                        fontWeight: isActive ? 600 : 400,
                      }
                    }} 
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerOpen ? drawerWidth : 64}px)` },
          ml: { md: `${drawerOpen ? drawerWidth : 64}px` },
          backgroundColor: 'white',
          borderBottom: '1px solid #f0f0f0',
          color: theme.palette.text.primary,
          height: { xs: '48px', sm: '56px' },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar sx={{ minHeight: { xs: '48px', sm: '56px' }, height: '100%', p: 0, pl: 1 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Notifications">
              <IconButton
                size="large"
                aria-label="show 3 new notifications"
                color="inherit"
                onClick={handleNotificationsOpen}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={notificationsAnchorEl}
              open={Boolean(notificationsAnchorEl)}
              onClose={handleNotificationsClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.10))',
                  minWidth: 300,
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleNotificationsClose}>
                <Box>
                  <Typography variant="subtitle2">Temperature alert: Incubator 2</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Temperature above threshold (38.5°C)
                  </Typography>
                </Box>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleNotificationsClose}>
                <Box>
                  <Typography variant="subtitle2">Humidity alert: Hatcher 1</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Humidity below threshold (55%)
                  </Typography>
                </Box>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleNotificationsClose}>
                <Box>
                  <Typography variant="subtitle2">Batch B1003 ready for lockdown</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Scheduled for today
                  </Typography>
                </Box>
              </MenuItem>
            </Menu>
            
            <Tooltip title="Account settings">
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={handleUserMenuOpen}
                color="inherit"
                sx={{ ml: 1 }}
              >
                <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 32, height: 32 }}>JD</Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={userMenuAnchorEl}
              open={Boolean(userMenuAnchorEl)}
              onClose={handleUserMenuClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.10))',
                  minWidth: 200,
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleUserMenuClose}>
                <ListItemIcon>
                  <AccountCircleIcon fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem onClick={handleUserMenuClose}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => navigate('/login')}>
                <ListItemIcon>
                  <ChevronLeftIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { md: drawerOpen ? drawerWidth : 64 }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerOpen ? drawerWidth : 64,
              borderRight: '1px solid #f0f0f0',
              backgroundColor: 'white',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: 'hidden',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          m: 0,
          width: { xs: '100%', md: `calc(100% - ${drawerOpen ? drawerWidth : 64}px)` },
          ml: { xs: 0, md: 0 },
          position: 'absolute',
          top: 0,
          right: 0,
          backgroundColor: '#f9fafb',
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: { xs: '48px', sm: '56px' }, // Only padding is to account for AppBar height
          transition: theme.transitions.create(['width', 'right'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Box sx={{ 
          flex: 1,
          overflow: 'auto',
          padding: 0,
          margin: 0,
          height: '100%'
        }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}