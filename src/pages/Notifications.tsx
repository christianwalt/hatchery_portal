import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Divider,
  Tabs,
  Tab,
  Paper,
  Chip,
  Badge,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Notifications as NotificationsIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Event as EventIcon,
  Settings as SettingsIcon,
  Inventory as InventoryIcon,
  Update as UpdateIcon,
  Assignment as TaskIcon,
} from '@mui/icons-material';

// Sample data for notifications
const initialNotifications = [
  {
    id: 1,
    type: 'alert',
    title: 'Temperature Alert',
    message: 'Temperature in Incubator 2 is above normal range',
    timestamp: '2023-05-15T09:45:00',
    read: false,
    category: 'system'
  },
  {
    id: 2,
    type: 'task',
    title: 'Maintenance Task Due',
    message: 'Scheduled maintenance for Incubator 1 is due today',
    timestamp: '2023-05-15T08:30:00',
    read: true,
    category: 'task'
  },
  {
    id: 3,
    type: 'info',
    title: 'System Update Available',
    message: 'A new system update (v2.3.4) is available for installation',
    timestamp: '2023-05-14T16:20:00',
    read: false,
    category: 'system'
  },
  {
    id: 4,
    type: 'event',
    title: 'Batch Ready for Transfer',
    message: 'Batch B1004 is ready for transfer to hatching',
    timestamp: '2023-05-14T10:15:00',
    read: false,
    category: 'operation'
  },
  {
    id: 5,
    type: 'alert',
    title: 'Humidity Warning',
    message: 'Humidity in Hatcher 1 is below recommended level',
    timestamp: '2023-05-13T14:55:00',
    read: true,
    category: 'system'
  },
  {
    id: 6,
    type: 'inventory',
    title: 'Low Inventory Alert',
    message: 'Chick boxes are running low. Current count: 150',
    timestamp: '2023-05-13T11:30:00',
    read: false,
    category: 'inventory'
  },
  {
    id: 7,
    type: 'event',
    title: 'New Sales Order',
    message: 'New order #1089 received from Sunshine Farms',
    timestamp: '2023-05-12T09:25:00',
    read: true,
    category: 'operation'
  }
];

// Interface for notification data
interface NotificationData {
  id: number;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: string;
}

export default function Notifications() {
  const theme = useTheme();
  const [notifications, setNotifications] = useState<NotificationData[]>(initialNotifications);
  const [tabValue, setTabValue] = useState(0);
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Handle marking a notification as read
  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };
  
  // Handle deleting a notification
  const handleDelete = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };
  
  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };
  
  // Format timestamp to readable format
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHrs < 24) {
      return diffHrs === 0 
        ? 'Today ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : `${diffHrs} hour${diffHrs === 1 ? '' : 's'} ago`;
    } else if (diffHrs < 48) {
      return 'Yesterday ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
             ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };
  
  // Get filtered notifications based on current tab
  const getFilteredNotifications = () => {
    switch (tabValue) {
      case 0: // All
        return notifications;
      case 1: // Unread
        return notifications.filter(notification => !notification.read);
      case 2: // System
        return notifications.filter(notification => notification.category === 'system');
      case 3: // Operations
        return notifications.filter(notification => notification.category === 'operation');
      default:
        return notifications;
    }
  };
  
  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <WarningIcon sx={{ color: theme.palette.warning.main }} />;
      case 'task':
        return <TaskIcon sx={{ color: theme.palette.primary.main }} />;
      case 'info':
        return <InfoIcon sx={{ color: theme.palette.info.main }} />;
      case 'event':
        return <EventIcon sx={{ color: theme.palette.success.main }} />;
      case 'inventory':
        return <InventoryIcon sx={{ color: theme.palette.secondary.main }} />;
      default:
        return <NotificationsIcon />;
    }
  };
  
  // Get notification color based on type
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'alert':
        return theme.palette.warning.main;
      case 'task':
        return theme.palette.primary.main;
      case 'info':
        return theme.palette.info.main;
      case 'event':
        return theme.palette.success.main;
      case 'inventory':
        return theme.palette.secondary.main;
      default:
        return theme.palette.grey[500];
    }
  };
  
  // Statistics
  const unreadCount = notifications.filter(notification => !notification.read).length;
  const systemCount = notifications.filter(notification => notification.category === 'system').length;
  const operationCount = notifications.filter(notification => notification.category === 'operation').length;
  const taskCount = notifications.filter(notification => notification.type === 'task').length;

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 600 }}>
        Notifications
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderTop: `3px solid ${theme.palette.primary.main}` }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography color="text.secondary" variant="subtitle1" fontWeight={500} gutterBottom>
                All Notifications
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                {notifications.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {unreadCount} unread
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderTop: `3px solid ${theme.palette.warning.main}` }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography color="text.secondary" variant="subtitle1" fontWeight={500} gutterBottom>
                System Notifications
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 600, color: theme.palette.warning.main }}>
                {systemCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Alerts and system messages
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderTop: `3px solid ${theme.palette.success.main}` }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography color="text.secondary" variant="subtitle1" fontWeight={500} gutterBottom>
                Operation Updates
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 600, color: theme.palette.success.main }}>
                {operationCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Production related
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderTop: `3px solid ${theme.palette.info.main}` }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography color="text.secondary" variant="subtitle1" fontWeight={500} gutterBottom>
                Pending Tasks
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 600, color: theme.palette.info.main }}>
                {taskCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Scheduled activities
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Notifications Content */}
      <Paper sx={{ mb: 4 }}>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            aria-label="notification tabs"
            sx={{ '& .MuiTab-root': { textTransform: 'none' } }}
          >
            <Tab 
              label="All" 
              iconPosition="start"
              icon={<Badge badgeContent={notifications.length} color="primary" sx={{ '& .MuiBadge-badge': { right: -3, top: 3 } }}><NotificationsIcon /></Badge>}
            />
            <Tab 
              label="Unread" 
              iconPosition="start"
              icon={<Badge badgeContent={unreadCount} color="error" sx={{ '& .MuiBadge-badge': { right: -3, top: 3 } }}><CheckCircleIcon /></Badge>}
            />
            <Tab 
              label="System" 
              iconPosition="start"
              icon={<Badge badgeContent={systemCount} color="warning" sx={{ '& .MuiBadge-badge': { right: -3, top: 3 } }}><SettingsIcon /></Badge>}
            />
            <Tab 
              label="Operations" 
              iconPosition="start"
              icon={<Badge badgeContent={operationCount} color="success" sx={{ '& .MuiBadge-badge': { right: -3, top: 3 } }}><UpdateIcon /></Badge>}
            />
          </Tabs>
        </Box>
        
        {/* Notification Action Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          {unreadCount > 0 && (
            <Chip 
              label="Mark all as read" 
              size="small" 
              onClick={handleMarkAllAsRead}
              sx={{ 
                mr: 1,
                cursor: 'pointer',
                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) }
              }}
            />
          )}
        </Box>
        
        {/* Notifications List */}
        <List sx={{ width: '100%', p: 0 }}>
          {getFilteredNotifications().length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No notifications to display
              </Typography>
            </Box>
          ) : (
            getFilteredNotifications().map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{ 
                    py: 2,
                    px: 3,
                    bgcolor: notification.read ? 'inherit' : alpha(theme.palette.primary.light, 0.05),
                    '&:hover': { bgcolor: alpha(theme.palette.action.hover, 0.1) },
                  }}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(notification.id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemAvatar onClick={() => handleMarkAsRead(notification.id)} sx={{ cursor: 'pointer' }}>
                    <Avatar sx={{ bgcolor: alpha(getNotificationColor(notification.type), 0.1) }}>
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: notification.read ? 400 : 600,
                            color: notification.read ? 'text.primary' : 'primary.main',
                            mr: 1
                          }}
                        >
                          {notification.title}
                        </Typography>
                        {!notification.read && (
                          <Chip
                            label="NEW"
                            size="small"
                            color="primary"
                            sx={{ height: 18, fontSize: '0.65rem', fontWeight: 600 }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          variant="body2"
                          color="text.primary"
                          component="span"
                          sx={{ display: 'block', mb: 0.5 }}
                        >
                          {notification.message}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          component="span"
                        >
                          {formatTimestamp(notification.timestamp)}
                        </Typography>
                      </React.Fragment>
                    }
                    onClick={() => handleMarkAsRead(notification.id)}
                    sx={{ cursor: 'pointer' }}
                  />
                </ListItem>
                {index < getFilteredNotifications().length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))
          )}
        </List>
      </Paper>
    </Box>
  );
} 