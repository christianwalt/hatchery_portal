import React from 'react';
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
  Button,
  Chip,
  Stack,
  LinearProgress,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Notifications as NotificationsIcon,
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  MoreVert as MoreVertIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowForward as ArrowForwardIcon,
  MonetizationOn as SalesIcon,
} from '@mui/icons-material';

// Sample data for dashboard
const stats = {
  totalEggs: 6750,
  activeIncubations: 8,
  pendingHatchings: 4,
  hatchRate: 84.1,
  alerts: 3,
  totalSales: 87000,
};

const recentBatches = [
  {
    id: 'B1005',
    startDate: '2023-06-15',
    status: 'incubating',
    quantity: 64,
    expectedHatch: '2023-07-06',
    breed: 'Rhode Island Red',
    location: 'Incubator 2',
    progress: 25,
  },
  {
    id: 'B1006',
    startDate: '2023-06-10',
    status: 'incubating',
    quantity: 48,
    expectedHatch: '2023-07-01',
    breed: 'Leghorn',
    location: 'Incubator 1',
    progress: 38,
  },
  {
    id: 'B1007',
    startDate: '2023-06-03',
    status: 'lockdown',
    quantity: 36,
    expectedHatch: '2023-06-24',
    breed: 'Plymouth Rock',
    location: 'Incubator 3 → Hatcher 1',
    progress: 85,
  },
  {
    id: 'B1008',
    startDate: '2023-05-25',
    status: 'hatched',
    quantity: 72,
    hatchedQuantity: 62,
    hatchRate: 86.1,
    breed: 'Orpington',
    location: 'Incubator 1 → Hatcher 2',
    progress: 100,
  },
];

const alerts = [
  {
    id: 1,
    type: 'temperature',
    device: 'Incubator 2',
    message: 'Temperature above threshold (38.5°C)',
    severity: 'high',
    timestamp: '2023-06-20 08:45:22',
  },
  {
    id: 2,
    type: 'humidity',
    device: 'Hatcher 1',
    message: 'Humidity below threshold (55%)',
    severity: 'medium',
    timestamp: '2023-06-20 12:30:15',
  },
  {
    id: 3,
    type: 'system',
    device: 'System',
    message: 'Scheduled maintenance due in 3 days',
    severity: 'medium',
    timestamp: '2023-06-19 14:20:33',
  }
];

const devices = [
  { name: 'Incubator 1', temperature: 37.8, humidity: 60, lastUpdated: '2 minutes ago', status: 'normal' },
  { name: 'Incubator 2', temperature: 38.5, humidity: 58, lastUpdated: '1 minute ago', status: 'warning' },
  { name: 'Incubator 3', temperature: 37.5, humidity: 62, lastUpdated: '5 minutes ago', status: 'normal' },
  { name: 'Hatcher 1', temperature: 37.2, humidity: 55, lastUpdated: '3 minutes ago', status: 'warning' },
  { name: 'Hatcher 2', temperature: 37.0, humidity: 68, lastUpdated: '2 minutes ago', status: 'normal' },
];

export default function Dashboard() {
  const theme = useTheme();
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: '100%',
      m: 0,
      p: 0,
      boxSizing: 'border-box',
      overflow: 'visible',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        py: 0.75, 
        px: 3,
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        bgcolor: '#fff',
        width: '100%',
        m: 0,
        position: 'sticky',
        top: 0,
        zIndex: 1,
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
      }}>
        <Box>
          <Typography variant="h5" component="h1" fontWeight="600" sx={{ lineHeight: 1.2 }}>
            Dashboard
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" sx={{ lineHeight: 1.2, mt: 0.5 }}>
            Overview of your hatchery operations
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {currentDate}
        </Typography>
      </Box>

      {/* Content wrapper */}
      <Box sx={{ 
        px: 3, 
        pt: 1,
        pb: 3,
        overflow: 'visible',
        flex: 1
      }}>
        {/* Key Performance Indicators */}
        <Typography variant="h6" sx={{ mb: 0.5, mt: 0, fontWeight: 500, color: theme.palette.primary.main }}>
          Key Performance Indicators
        </Typography>
        <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <Card sx={{ 
              height: '100%', 
              borderTop: `3px solid ${theme.palette.primary.main}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              borderRadius: 1
            }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom fontWeight={500}>
                  Total Eggs
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>{stats.totalEggs}</Typography>
                  <Box sx={{ 
                    backgroundColor: 'rgba(46, 125, 50, 0.1)', 
                    borderRadius: '50%', 
                    width: 40, 
                    height: 40, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <TrendingUpIcon sx={{ color: theme.palette.primary.main }} />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <ArrowUpwardIcon sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                  <Typography variant="caption" color="success.main" fontWeight={500}>
                    +7.1% from last month
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <Card sx={{ 
              height: '100%', 
              borderTop: `3px solid ${theme.palette.primary.main}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              borderRadius: 1
            }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom fontWeight={500}>
                  Active Incubations
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>{stats.activeIncubations}</Typography>
                  <Box sx={{ 
                    backgroundColor: 'rgba(46, 125, 50, 0.1)', 
                    borderRadius: '50%', 
                    width: 40, 
                    height: 40, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <PlayArrowIcon sx={{ color: theme.palette.primary.main }} />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <ArrowUpwardIcon sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                  <Typography variant="caption" color="success.main" fontWeight={500}>
                    +1 new batch
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <Card sx={{ 
              height: '100%', 
              borderTop: `3px solid ${theme.palette.primary.main}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              borderRadius: 1
            }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom fontWeight={500}>
                  Pending Hatchings
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>{stats.pendingHatchings}</Typography>
                  <Box sx={{ 
                    backgroundColor: 'rgba(46, 125, 50, 0.1)', 
                    borderRadius: '50%', 
                    width: 40, 
                    height: 40, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <CheckCircleIcon sx={{ color: theme.palette.primary.main }} />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <ArrowForwardIcon sx={{ color: 'info.main', fontSize: 16, mr: 0.5 }} />
                  <Typography variant="caption" color="info.main" fontWeight={500}>
                    Next in 4 days
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <Card sx={{ 
              height: '100%', 
              borderTop: `3px solid ${theme.palette.primary.main}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              borderRadius: 1
            }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom fontWeight={500}>
                  Hatch Rate
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>{stats.hatchRate}%</Typography>
                  <Box sx={{ 
                    backgroundColor: 'rgba(46, 125, 50, 0.1)', 
                    borderRadius: '50%', 
                    width: 40, 
                    height: 40, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <TrendingUpIcon sx={{ color: theme.palette.primary.main }} />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <ArrowUpwardIcon sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                  <Typography variant="caption" color="success.main" fontWeight={500}>
                    +1.7% improvement
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <Card sx={{ 
              height: '100%', 
              borderTop: `3px solid ${theme.palette.error.main}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              borderRadius: 1
            }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom fontWeight={500}>
                  Total Sales
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>${(stats.totalSales/1000).toFixed(1)}k</Typography>
                  <Box sx={{ 
                    backgroundColor: 'rgba(211, 47, 47, 0.1)', 
                    borderRadius: '50%', 
                    width: 40, 
                    height: 40, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <SalesIcon sx={{ color: theme.palette.error.main }} />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <ArrowUpwardIcon sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                  <Typography variant="caption" color="success.main" fontWeight={500}>
                    +7.5% from last month
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <Card sx={{ 
              height: '100%', 
              borderTop: stats.alerts > 0 ? `3px solid ${theme.palette.warning.main}` : `3px solid ${theme.palette.success.main}`,
              backgroundColor: stats.alerts > 0 ? 'rgba(255, 152, 0, 0.04)' : 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              borderRadius: 1
            }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom fontWeight={500}>
                  Alerts
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: stats.alerts > 0 ? 'warning.main' : 'inherit' }}>
                    {stats.alerts}
                  </Typography>
                  <Box sx={{ 
                    backgroundColor: stats.alerts > 0 ? 'rgba(255, 152, 0, 0.1)' : 'rgba(46, 125, 50, 0.1)', 
                    borderRadius: '50%', 
                    width: 40, 
                    height: 40, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <NotificationsIcon sx={{ color: stats.alerts > 0 ? theme.palette.warning.main : theme.palette.success.main }} />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  {stats.alerts > 0 ? (
                    <>
                      <WarningIcon sx={{ color: 'warning.main', fontSize: 16, mr: 0.5 }} />
                      <Typography variant="caption" color="warning.main" fontWeight={500}>
                        {stats.alerts} requires attention
                      </Typography>
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                      <Typography variant="caption" color="success.main" fontWeight={500}>
                        All systems normal
                      </Typography>
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Dashboard Content */}
        <Grid container spacing={1.5} sx={{ width: '100%' }}>
          {/* Left Column - Operational Data */}
          <Grid item xs={12} lg={8}>
            {/* Recent Batches */}
            <Paper sx={{ 
              p: 0, 
              overflow: 'hidden', 
              width: '100%', 
              mb: 1.5, 
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)', 
              borderRadius: 1 
            }}>
              <Box sx={{ 
                p: 2, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                borderBottom: '1px solid #f0f0f0',
                bgcolor: '#fff'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AssessmentIcon color="primary" />
                  <Typography variant="h6" fontWeight={600}>Recent Batches</Typography>
                </Box>
                <Box>
                  <IconButton size="small">
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              <TableContainer sx={{ overflow: 'visible' }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
                    <TableRow>
                      <TableCell>Batch ID</TableCell>
                      <TableCell>Breed</TableCell>
                      <TableCell>Start Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Progress</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentBatches.map((batch) => (
                      <TableRow key={batch.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="500">{batch.id}</Typography>
                        </TableCell>
                        <TableCell>{batch.breed}</TableCell>
                        <TableCell>{batch.startDate}</TableCell>
                        <TableCell>
                          {batch.status === 'hatched' ? (
                            <Chip 
                              label="Hatched" 
                              color="success" 
                              size="small" 
                              icon={<CheckCircleIcon style={{ fontSize: 14 }} />} 
                              sx={{ fontWeight: 500 }}
                            />
                          ) : batch.status === 'lockdown' ? (
                            <Chip 
                              label="Lockdown" 
                              color="secondary" 
                              size="small" 
                              sx={{ fontWeight: 500 }}
                            />
                          ) : (
                            <Chip 
                              label="Incubating" 
                              color="primary" 
                              size="small" 
                              icon={<PlayArrowIcon style={{ fontSize: 14 }} />} 
                              sx={{ fontWeight: 500 }}
                            />
                          )}
                        </TableCell>
                        <TableCell>{batch.location}</TableCell>
                        <TableCell sx={{ width: '180px' }}>
                          {batch.status === 'hatched' ? (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box sx={{ width: '100%', mr: 1 }}>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={100} 
                                  color="success" 
                                  sx={{ height: 6, borderRadius: 3 }}
                                />
                              </Box>
                              <Typography variant="body2" fontWeight="500" color="success.main">
                                {batch.hatchRate}%
                              </Typography>
                            </Box>
                          ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box sx={{ width: '100%', mr: 1 }}>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={batch.progress}
                                  sx={{ height: 6, borderRadius: 3 }}
                                />
                              </Box>
                              <Typography variant="body2" fontWeight="500">
                                {batch.progress}%
                              </Typography>
                            </Box>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ p: 2, borderTop: '1px solid #f0f0f0', textAlign: 'center', bgcolor: '#fff' }}>
                <Button 
                  size="small" 
                  endIcon={<ArrowForwardIcon />} 
                  sx={{ 
                    fontWeight: 500,
                    px: 3
                  }}
                >
                  View All Batches
                </Button>
              </Box>
            </Paper>

            {/* Environment Monitoring */}
            <Paper sx={{ 
              p: 0, 
              overflow: 'hidden', 
              width: '100%',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              borderRadius: 1
            }}>
              <Box sx={{ 
                p: 2, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                borderBottom: '1px solid #f0f0f0',
                bgcolor: '#fff'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AssessmentIcon color="primary" />
                  <Typography variant="h6" fontWeight={600}>Environment Monitoring</Typography>
                </Box>
                <IconButton size="small">
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Box>
              <TableContainer sx={{ overflow: 'visible' }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
                    <TableRow>
                      <TableCell>Device</TableCell>
                      <TableCell align="right">Temperature</TableCell>
                      <TableCell align="right">Humidity</TableCell>
                      <TableCell>Last Updated</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {devices.map((device) => (
                      <TableRow key={device.name} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="500">{device.name}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          {device.temperature}°C
                          {device.status === 'warning' && device.temperature > 38.0 && (
                            <Typography component="span" color="error.main" fontSize="small" sx={{ ml: 1 }}>
                              ↑
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {device.humidity}%
                          {device.status === 'warning' && device.humidity < 56 && (
                            <Typography component="span" color="error.main" fontSize="small" sx={{ ml: 1 }}>
                              ↓
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>{device.lastUpdated}</TableCell>
                        <TableCell>
                          {device.status === 'normal' ? (
                            <Chip 
                              label="Normal" 
                              color="success" 
                              size="small" 
                              icon={<CheckCircleIcon style={{ fontSize: 14 }} />} 
                              sx={{ fontWeight: 500 }}
                            />
                          ) : (
                            <Chip 
                              label="Warning" 
                              color="warning" 
                              size="small" 
                              icon={<WarningIcon style={{ fontSize: 14 }} />} 
                              sx={{ fontWeight: 500 }}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ p: 2, borderTop: '1px solid #f0f0f0', textAlign: 'center', bgcolor: '#fff' }}>
                <Button 
                  size="small" 
                  endIcon={<ArrowForwardIcon />} 
                  sx={{ 
                    fontWeight: 500,
                    px: 3
                  }}
                >
                  View All Devices
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Right Column - Alerts & Notifications */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{ 
              p: 0, 
              overflow: 'hidden', 
              width: '100%', 
              height: '100%', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)', 
              borderRadius: 1 
            }}>
              <Box sx={{ 
                p: 2, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                backgroundColor: 'rgba(211, 47, 47, 0.04)',
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <NotificationsIcon color="error" />
                  <Typography variant="h6" fontWeight={600}>System Alerts</Typography>
                </Box>
                <Chip 
                  label={`${alerts.length} New`} 
                  size="small" 
                  color="error" 
                  sx={{ fontWeight: 500 }}
                />
              </Box>
              <Box sx={{ 
                maxHeight: 'none', 
                overflow: 'visible', 
                bgcolor: '#fff', 
                p: 2
              }}>
                <Stack spacing={2}>
                  {alerts.map((alert) => (
                    <Card 
                      key={alert.id}
                      sx={{ 
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        borderRadius: 1,
                        bgcolor: 
                          alert.severity === 'high' 
                            ? 'rgba(211, 47, 47, 0.04)'
                            : alert.severity === 'medium' 
                              ? 'rgba(255, 152, 0, 0.04)'
                              : 'rgba(46, 125, 50, 0.04)',
                        border: `1px solid ${
                          alert.severity === 'high' 
                            ? 'rgba(211, 47, 47, 0.2)'
                            : alert.severity === 'medium' 
                              ? 'rgba(255, 152, 0, 0.2)'
                              : 'rgba(46, 125, 50, 0.2)'
                        }`,
                        '&:hover': {
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                        }
                      }}
                    >
                      <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {alert.severity === 'high' ? (
                              <WarningIcon color="error" fontSize="small" />
                            ) : alert.severity === 'medium' ? (
                              <WarningIcon color="warning" fontSize="small" />
                            ) : (
                              <WarningIcon color="success" fontSize="small" />
                            )}
                            <Typography variant="subtitle2" fontWeight={600}>
                              {alert.device}
                            </Typography>
                          </Box>
                          <Chip 
                            label={alert.severity} 
                            size="small"
                            color={
                              alert.severity === 'high' 
                                ? 'error' 
                                : alert.severity === 'medium' 
                                  ? 'warning' 
                                  : 'success'
                            }
                            sx={{ fontWeight: 500, textTransform: 'capitalize' }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {alert.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          {alert.timestamp}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Box>
              <Box sx={{ p: 2, borderTop: '1px solid #f0f0f0', textAlign: 'center', bgcolor: '#fff' }}>
                <Button 
                  size="small" 
                  endIcon={<ArrowForwardIcon />} 
                  sx={{ 
                    fontWeight: 500,
                    px: 3
                  }}
                >
                  View All Alerts
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
} 