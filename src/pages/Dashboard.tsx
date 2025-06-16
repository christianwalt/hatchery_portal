import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  useTheme,
  Avatar,
  LinearProgress,
  SvgIcon,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  ArrowUpward as ArrowUpwardIcon,
  ErrorOutline as ErrorIcon,
  InfoOutlined as InfoIcon,
  CheckCircleOutline as CheckCircleIcon,
  Egg as EggIcon,
  Inventory as InventoryIcon,
  LocalShipping as ShippingIcon,
  PlaylistAddCheck as ChecklistIcon,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

// Sample data for dashboard
const stats = {
  totalEggs: 6750,
  activeIncubations: 8,
  pendingHatchings: 4,
  hatchRate: 84.1,
  alerts: 3,
  totalSales: 87000,
};

// Enhanced alerts with more details and actionable items
const alerts = [
  {
    id: 1,
    type: 'temperature',
    device: 'Incubator 2',
    message: 'Temperature above threshold (38.5°C)',
    severity: 'high',
    timestamp: '2023-06-20 08:45:22',
    action: 'Check cooling system',
    assignedTo: 'John D.',
  },
  {
    id: 2,
    type: 'humidity',
    device: 'Hatcher 1',
    message: 'Humidity below threshold (55%)',
    severity: 'medium',
    timestamp: '2023-06-20 12:30:15',
    action: 'Refill water reservoirs',
    assignedTo: 'Sarah M.',
  },
  {
    id: 3,
    type: 'system',
    device: 'System',
    message: 'Scheduled maintenance due in 3 days',
    severity: 'low',
    timestamp: '2023-06-19 14:20:33',
    action: 'Schedule technician visit',
    assignedTo: 'Admin',
  },
  {
    id: 4,
    type: 'inventory',
    device: 'Stock',
    message: 'Low packaging material inventory',
    severity: 'medium',
    timestamp: '2023-06-19 09:15:45',
    action: 'Order supplies',
    assignedTo: 'Michael K.',
  }
];

// Production forecast data
const forecast = [
  { week: 'Current Week', eggs: 1200, hatchlings: 950 },
  { week: 'Next Week', eggs: 1500, hatchlings: 1250 },
  { week: 'Week 3', eggs: 1800, hatchlings: 1480 },
];

// Monthly performance data
const monthlyPerformance = [
  { month: 'January', hatchRate: 82.5, sales: 42000 },
  { month: 'February', hatchRate: 83.1, sales: 45000 },
  { month: 'March', hatchRate: 81.8, sales: 40000 },
  { month: 'April', hatchRate: 82.2, sales: 43500 },
  { month: 'May', hatchRate: 83.7, sales: 47000 },
  { month: 'June', hatchRate: 84.1, sales: 49000 },
];

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  change?: number;
  color: string;
  suffix?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change, color, suffix }) => {
  const theme = useTheme();
  
  return (
    <Card sx={{ 
      height: '100%', 
      borderRadius: 2,
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      transition: 'transform 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 6px 25px rgba(0,0,0,0.1)',
      }
    }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle1" color="text.secondary" fontWeight={500}>
            {title}
          </Typography>
          <Avatar sx={{ bgcolor: alpha(color, 0.15), color: color, width: 40, height: 40 }}>
            {icon}
          </Avatar>
        </Box>
        
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          {value}{suffix}
        </Typography>
        
        {change !== undefined && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip 
              icon={<ArrowUpwardIcon fontSize="small" />} 
              label={`${change}% vs last month`}
              size="small"
              sx={{ 
                bgcolor: alpha(theme.palette.success.main, 0.1),
                color: theme.palette.success.main,
                fontWeight: 500,
                '& .MuiChip-icon': { color: theme.palette.success.main } 
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default function Dashboard() {
  const theme = useTheme();
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <ErrorIcon color="error" />;
      case 'medium':
        return <WarningIcon color="warning" />;
      case 'low':
        return <InfoIcon color="info" />;
      default:
        return <CheckCircleIcon color="success" />;
    }
  };

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
        py: 2, 
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
            Hatchery Dashboard
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" sx={{ lineHeight: 1.2, mt: 0.5 }}>
            Real-time overview of operations and key metrics
          </Typography>
        </Box>
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          px: 2,
          py: 0.75,
          borderRadius: 2
        }}>
          <CalendarIcon sx={{ color: theme.palette.primary.main, mr: 1, fontSize: 18 }} />
          <Typography variant="body2" fontWeight={500} color="text.secondary">
            {currentDate}
          </Typography>
        </Box>
      </Box>

      {/* Content wrapper */}
      <Box sx={{ 
        px: 3, 
        pt: 3,
        pb: 3,
        overflow: 'visible',
        flex: 1,
        bgcolor: alpha(theme.palette.background.default, 0.5)
      }}>
        {/* Key Performance Indicators */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Total Eggs in Incubation" 
              value={stats.totalEggs}
              icon={<EggIcon />}
              change={2.4}
              color={theme.palette.primary.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Active Incubation Batches" 
              value={stats.activeIncubations}
              icon={<InventoryIcon />}
              color={theme.palette.secondary.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Batches Pending Hatching" 
              value={stats.pendingHatchings}
              icon={<ShippingIcon />}
              color={theme.palette.warning.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Average Hatch Rate" 
              value={stats.hatchRate}
              icon={<ChecklistIcon />}
              change={1.5}
              color={theme.palette.success.main}
              suffix="%"
            />
          </Grid>
        </Grid>

        {/* Two column layout */}
        <Grid container spacing={2.5}>
          {/* Left column - System Alerts */}
          <Grid item xs={12} md={7}>
            <Card sx={{ 
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              height: '100%',
            }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  p: 2,
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <NotificationsIcon sx={{ color: theme.palette.warning.main, mr: 1 }} />
                    <Typography variant="h6" fontWeight={600}>
                      System Alerts & Notifications
                    </Typography>
                  </Box>
                  <Chip 
                    label={`${alerts.length} Active`}
                    size="small"
                    sx={{ 
                      bgcolor: alpha(theme.palette.warning.main, 0.1),
                      color: theme.palette.warning.main,
                      fontWeight: 500
                    }}
                  />
                </Box>
                
                <TableContainer sx={{ maxHeight: 400 }}>
                  <Table sx={{ 
                    minWidth: 650,
                    '& .MuiTableCell-root': {
                      borderColor: alpha(theme.palette.divider, 0.5),
                      py: 1.75
                    }
                  }} aria-label="alerts table">
                    <TableHead>
                      <TableRow>
                        <TableCell width="5%">Status</TableCell>
                        <TableCell width="20%">Device/Area</TableCell>
                        <TableCell width="30%">Alert Message</TableCell>
                        <TableCell width="15%">Assigned To</TableCell>
                        <TableCell width="15%">Action</TableCell>
                        <TableCell width="15%">Timestamp</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {alerts.map((alert) => (
                        <TableRow
                          key={alert.id}
                          sx={{ 
                            '&:last-child td, &:last-child th': { border: 0 },
                            '&:hover': { 
                              bgcolor: alpha(theme.palette.primary.main, 0.03),
                            }
                          }}
                        >
                          <TableCell>
                            {getSeverityIcon(alert.severity)}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>
                              {alert.device}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {alert.type}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {alert.message}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={alert.assignedTo}
                              size="small"
                              sx={{ 
                                fontWeight: 500,
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {alert.action}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(alert.timestamp).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    variant="outlined" 
                    size="small"
                    sx={{ 
                      borderRadius: 1.5,
                      textTransform: 'none',
                      fontWeight: 500
                    }}
                  >
                    View All Alerts
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Right column - Monthly Performance */}
          <Grid item xs={12} md={5}>
            <Card sx={{ 
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              height: '100%',
            }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  p: 2,
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUpIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                    <Typography variant="h6" fontWeight={600}>
                      Monthly Performance
                    </Typography>
                  </Box>
                  <Button
                    variant="text"
                    size="small"
                    sx={{ textTransform: 'none', fontWeight: 500 }}
                  >
                    View Report
                  </Button>
                </Box>
                
                <TableContainer>
                  <Table sx={{ 
                    minWidth: 400,
                    '& .MuiTableCell-root': {
                      borderColor: alpha(theme.palette.divider, 0.5),
                      py: 1.75
                    }
                  }} aria-label="performance table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Month</TableCell>
                        <TableCell align="right">Hatch Rate</TableCell>
                        <TableCell align="right">Sales</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {monthlyPerformance.map((row) => (
                        <TableRow
                          key={row.month}
                          sx={{ 
                            '&:last-child td, &:last-child th': { border: 0 },
                            '&:hover': { 
                              bgcolor: alpha(theme.palette.primary.main, 0.03),
                            }
                          }}
                        >
                          <TableCell component="th" scope="row">
                            <Typography variant="body2" fontWeight={500}>
                              {row.month}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight={500} color={row.hatchRate > 83 ? 'success.main' : 'text.primary'}>
                              {row.hatchRate}%
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight={500}>
                              ${row.sales.toLocaleString()}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Production Forecast */}
        <Box sx={{ mt: 2.5 }}>
          <Card sx={{ 
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                p: 2,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AssessmentIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Production Forecast
                  </Typography>
                </Box>
              </Box>
              
              <Grid container spacing={0}>
                {forecast.map((item, index) => (
                  <Grid item xs={12} md={4} key={item.week} sx={{ 
                    borderRight: index < forecast.length - 1 ? `1px solid ${alpha(theme.palette.divider, 0.5)}` : 'none',
                    p: 2.5
                  }}>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
                      {item.week}
                    </Typography>
                    
                    <Box sx={{ mb: 2.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          Eggs in Incubation
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {item.eggs}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate"
                        value={(item.eggs / 2000) * 100}
                        sx={{ 
                          height: 10, 
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          '& .MuiLinearProgress-bar': {
                            bgcolor: theme.palette.primary.main
                          }
                        }}
                      />
                    </Box>
                    
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          Expected Hatchlings
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {item.hatchlings}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate"
                        value={(item.hatchlings / 1500) * 100}
                        sx={{ 
                          height: 10, 
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.success.main, 0.1),
                          '& .MuiLinearProgress-bar': {
                            bgcolor: theme.palette.success.main
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}

function CalendarIcon(props: React.ComponentProps<typeof SvgIcon>) {
  return (
    <SvgIcon {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </SvgIcon>
  );
} 