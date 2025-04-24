import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Divider,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Search as SearchIcon,
  NotificationsActive as AlertIcon,
  WarningAmber as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Clear as ClearIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

// Sample data for system alerts
const initialAlerts = [
  {
    id: 1,
    type: 'temperature',
    severity: 'critical',
    source: 'Incubator 2',
    value: '38.5°C',
    threshold: '37.8°C',
    timestamp: '2023-05-15T09:23:45',
    message: 'Temperature above threshold',
    status: 'active',
    duration: '',
    resolution: ''
  },
  {
    id: 2,
    type: 'humidity',
    severity: 'warning',
    source: 'Hatcher 1',
    value: '55%',
    threshold: '60-65%',
    timestamp: '2023-05-15T10:15:22',
    message: 'Humidity below threshold',
    status: 'active',
    duration: '',
    resolution: ''
  },
  {
    id: 3,
    type: 'power',
    severity: 'critical',
    source: 'Main Power Supply',
    value: 'Outage',
    threshold: 'N/A',
    timestamp: '2023-05-14T23:10:05',
    message: 'Power outage detected - Generator activated',
    status: 'resolved',
    duration: '45 minutes',
    resolution: 'Power restored at 2023-05-14T23:55:12'
  },
  {
    id: 4,
    type: 'maintenance',
    severity: 'info',
    source: 'Incubator 1',
    value: '5000 hours',
    threshold: '5000 hours',
    timestamp: '2023-05-13T08:00:00',
    message: 'Routine maintenance required',
    status: 'active',
    duration: '',
    resolution: ''
  },
];

// Interface for alert data
interface AlertData {
  id: number;
  type: string;
  severity: string;
  source: string;
  value: string;
  threshold: string;
  timestamp: string;
  message: string;
  status: string;
  duration: string;
  resolution: string;
}

export default function Alerts() {
  const theme = useTheme();
  const [alerts, setAlerts] = useState<AlertData[]>(initialAlerts);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter alerts based on search term
  const filteredAlerts = alerts.filter(alert => 
    alert.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Statistics
  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  const criticalAlerts = activeAlerts.filter(alert => alert.severity === 'critical');
  const warningAlerts = activeAlerts.filter(alert => alert.severity === 'warning');
  const infoAlerts = activeAlerts.filter(alert => alert.severity === 'info');
  
  // Handle marking an alert as resolved
  const handleResolveAlert = (id: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? {
        ...alert,
        status: 'resolved',
        resolution: `Manually resolved at ${new Date().toISOString()}`,
        duration: calculateDuration(alert.timestamp, new Date().toISOString())
      } : alert
    ));
  };
  
  // Calculate duration between two ISO timestamps
  const calculateDuration = (start: string, end: string): string => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} minutes`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hours} hours, ${mins} minutes`;
    }
  };
  
  // Format ISO timestamp to readable format
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  // Get icon based on alert severity
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <ErrorIcon fontSize="small" sx={{ color: theme.palette.error.main }} />;
      case 'warning':
        return <WarningIcon fontSize="small" sx={{ color: theme.palette.warning.main }} />;
      case 'info':
        return <InfoIcon fontSize="small" sx={{ color: theme.palette.info.main }} />;
      default:
        return <AlertIcon fontSize="small" />;
    }
  };
  
  // Get color based on alert severity
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 600 }}>
        System Alerts & Notifications
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderTop: `3px solid ${theme.palette.error.main}` }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography color="text.secondary" variant="subtitle1" fontWeight={500} gutterBottom>
                Critical Alerts
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 600, color: theme.palette.error.main }}>
                {criticalAlerts.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Require immediate attention
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderTop: `3px solid ${theme.palette.warning.main}` }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography color="text.secondary" variant="subtitle1" fontWeight={500} gutterBottom>
                Warning Alerts
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 600, color: theme.palette.warning.main }}>
                {warningAlerts.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Require attention soon
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderTop: `3px solid ${theme.palette.info.main}` }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography color="text.secondary" variant="subtitle1" fontWeight={500} gutterBottom>
                Info Alerts
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 600, color: theme.palette.info.main }}>
                {infoAlerts.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                System information notices
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderTop: `3px solid ${theme.palette.success.main}` }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography color="text.secondary" variant="subtitle1" fontWeight={500} gutterBottom>
                Total Active Alerts
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 600, color: theme.palette.success.main }}>
                {activeAlerts.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {alerts.length - activeAlerts.length} resolved
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filter */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <TextField
          placeholder="Search by device or message"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: '300px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Alerts Table */}
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead sx={{ bgcolor: theme.palette.action.hover }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Severity</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Source</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Message</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Value</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Threshold</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Time</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAlerts.map((alert) => (
              <TableRow 
                key={alert.id}
                sx={{
                  '&:hover': { bgcolor: theme.palette.action.hover },
                  bgcolor: alert.status === 'active' ? 
                    (alert.severity === 'critical' ? alpha(theme.palette.error.main, 0.05) : 
                     alert.severity === 'warning' ? alpha(theme.palette.warning.main, 0.05) : 
                     alpha(theme.palette.info.main, 0.05)) : 
                    alpha(theme.palette.success.light, 0.05),
                }}
              >
                <TableCell>
                  <Chip
                    icon={getSeverityIcon(alert.severity)}
                    label={alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                    color={getSeverityColor(alert.severity) as "error" | "warning" | "info" | "default"}
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell>{alert.source}</TableCell>
                <TableCell>
                  <Chip
                    label={alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{alert.message}</TableCell>
                <TableCell>{alert.value}</TableCell>
                <TableCell>{alert.threshold}</TableCell>
                <TableCell>{formatTimestamp(alert.timestamp)}</TableCell>
                <TableCell>
                  {alert.status === 'active' ? (
                    <Chip 
                      icon={<AlertIcon fontSize="small" />}
                      label="Active" 
                      color="error" 
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 500 }} 
                    />
                  ) : (
                    <Chip 
                      icon={<CheckCircleIcon fontSize="small" />}
                      label="Resolved" 
                      color="success" 
                      size="small" 
                      variant="outlined"
                      sx={{ fontWeight: 500 }}
                    />
                  )}
                </TableCell>
                <TableCell align="center">
                  {alert.status === 'active' && (
                    <IconButton
                      size="small"
                      color="success"
                      onClick={() => handleResolveAlert(alert.id)}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Resolved Alerts Section */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          Resolved Alerts
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: alpha(theme.palette.success.main, 0.05) }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Severity</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Source</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Message</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Time Detected</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Duration</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Resolution</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alerts.filter(alert => alert.status === 'resolved').map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>
                    <Chip
                      icon={getSeverityIcon(alert.severity)}
                      label={alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                      color={getSeverityColor(alert.severity) as "error" | "warning" | "info" | "default"}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell>{alert.source}</TableCell>
                  <TableCell>{alert.message}</TableCell>
                  <TableCell>{formatTimestamp(alert.timestamp)}</TableCell>
                  <TableCell>{alert.duration}</TableCell>
                  <TableCell>{alert.resolution}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
} 