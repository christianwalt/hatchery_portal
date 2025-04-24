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
  Button,
  Tabs,
  Tab,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  BarChart as ChartIcon,
  Summarize as ReportIcon,
  Download as DownloadIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Egg as EggIcon,
  LocalShipping as ChicksIcon,
  MonetizationOn as SalesIcon,
} from '@mui/icons-material';

// Sample data for reports and analytics
const performanceData = [
  { month: 'Jan', eggCollection: 5280, hatchRate: 82.4, totalSales: 12500 },
  { month: 'Feb', eggCollection: 5720, hatchRate: 83.1, totalSales: 13200 },
  { month: 'Mar', eggCollection: 6100, hatchRate: 84.2, totalSales: 14800 },
  { month: 'Apr', eggCollection: 5850, hatchRate: 82.8, totalSales: 14200 },
  { month: 'May', eggCollection: 6300, hatchRate: 85.1, totalSales: 15600 },
  { month: 'Jun', eggCollection: 6750, hatchRate: 86.3, totalSales: 16700 }
];

const productionSummary = [
  { category: 'Egg Collection', current: 6750, previous: 6300, change: '+7.1%' },
  { category: 'Eggs Set', current: 6200, previous: 5800, change: '+6.9%' },
  { category: 'Fertile Eggs', current: 5950, previous: 5500, change: '+8.2%' },
  { category: 'Chicks Hatched', current: 5130, previous: 4675, change: '+9.7%' },
  { category: 'Chicks Sold', current: 5050, previous: 4600, change: '+9.8%' },
  { category: 'Eggs Sold', current: 520, previous: 480, change: '+8.3%' },
];

const revenueData = [
  { month: 'Jan', chicksRevenue: 9800, eggsRevenue: 2700, totalRevenue: 12500 },
  { month: 'Feb', chicksRevenue: 10400, eggsRevenue: 2800, totalRevenue: 13200 },
  { month: 'Mar', chicksRevenue: 11600, eggsRevenue: 3200, totalRevenue: 14800 },
  { month: 'Apr', chicksRevenue: 11000, eggsRevenue: 3200, totalRevenue: 14200 },
  { month: 'May', chicksRevenue: 12200, eggsRevenue: 3400, totalRevenue: 15600 },
  { month: 'Jun', chicksRevenue: 13100, eggsRevenue: 3600, totalRevenue: 16700 }
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reports-tabpanel-${index}`}
      aria-labelledby={`reports-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 1, md: 2 }, pt: { xs: 2, md: 3 } }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function ReportsAnalytics() {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [reportPeriod, setReportPeriod] = useState('monthly');
  const [dateRange, setDateRange] = useState({
    startDate: '2023-01-01',
    endDate: '2023-06-30',
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePeriodChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setReportPeriod(event.target.value as string);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setDateRange({
      ...dateRange,
      [name]: value,
    });
  };

  return (
    <Box sx={{ 
      width: '100%', 
      p: { xs: 2, md: 3 },
      backgroundColor: alpha(theme.palette.background.default, 0.8)
    }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'flex-start',
        mb: 3
      }}>
        <Typography variant="h4" component="h1" sx={{ 
          mb: 1, 
          fontWeight: 700,
          color: theme.palette.text.primary,
          letterSpacing: '-0.5px'
        }}>
          Reports & Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          View and analyze performance data for the hatchery
        </Typography>
        <Divider sx={{ width: '100%', mt: 1 }} />
      </Box>

      {/* Report Controls */}
      <Paper sx={{ mb: 3, p: 2, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="report-period-label">Report Period</InputLabel>
              <Select
                labelId="report-period-label"
                id="report-period"
                value={reportPeriod}
                label="Report Period"
                onChange={handlePeriodChange}
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Button 
              variant="contained" 
              startIcon={<DownloadIcon />}
              sx={{ 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                backgroundColor: theme.palette.primary.main,
                '&:hover': { backgroundColor: theme.palette.primary.dark },
              }}
            >
              Export Report
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Performance Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ 
            height: '100%', 
            borderRadius: 2, 
            boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)', 
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 8px 24px 0 rgba(0,0,0,0.1)'
            },
            borderTop: `4px solid ${theme.palette.primary.main}` 
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  mr: 2
                }}>
                  <EggIcon />
                </Box>
                <Typography variant="subtitle1" color="text.secondary" fontWeight={500}>
                  Total Eggs Collected
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                36,000
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUpIcon sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption" color="success.main" fontWeight={500}>
                  +7.1% from previous period
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ 
            height: '100%', 
            borderRadius: 2, 
            boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)', 
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 8px 24px 0 rgba(0,0,0,0.1)'
            },
            borderTop: `4px solid ${theme.palette.secondary.main}` 
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                  color: theme.palette.secondary.main,
                  mr: 2
                }}>
                  <ChicksIcon />
                </Box>
                <Typography variant="subtitle1" color="text.secondary" fontWeight={500}>
                  Average Hatch Rate
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.secondary.main }}>
                84.1%
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUpIcon sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption" color="success.main" fontWeight={500}>
                  +1.7% from previous period
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%', 
            borderRadius: 2, 
            boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)', 
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 8px 24px 0 rgba(0,0,0,0.1)'
            },
            borderTop: `4px solid ${theme.palette.error.main}` 
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                  color: theme.palette.error.main,
                  mr: 2
                }}>
                  <SalesIcon />
                </Box>
                <Typography variant="subtitle1" color="text.secondary" fontWeight={500}>
                  Total Revenue
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.error.main }}>
                $87,000
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUpIcon sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption" color="success.main" fontWeight={500}>
                  +7.5% from previous period
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ 
        width: '100%', 
        bgcolor: 'background.paper', 
        mb: 3, 
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        overflow: 'hidden'
      }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: tabValue === 0 ? theme.palette.primary.main : 
                               tabValue === 1 ? theme.palette.secondary.main : 
                               theme.palette.error.main,
              height: 3
            },
            '& .MuiTab-root': {
              transition: 'all 0.2s',
              py: 2
            }
          }}
        >
          <Tab 
            icon={<ChartIcon />} 
            iconPosition="start" 
            label="Performance" 
            sx={{ 
              fontWeight: 600,
              color: tabValue === 0 ? theme.palette.primary.main : theme.palette.text.primary,
              '&.Mui-selected': {
                backgroundColor: alpha(theme.palette.primary.main, 0.05)
              }
            }}
          />
          <Tab 
            icon={<AssessmentIcon />} 
            iconPosition="start" 
            label="Production" 
            sx={{ 
              fontWeight: 600,
              color: tabValue === 1 ? theme.palette.secondary.main : theme.palette.text.primary,
              '&.Mui-selected': {
                backgroundColor: alpha(theme.palette.secondary.main, 0.05)
              }
            }}
          />
          <Tab 
            icon={<ReportIcon />} 
            iconPosition="start" 
            label="Financial" 
            sx={{ 
              fontWeight: 600,
              color: tabValue === 2 ? theme.palette.error.main : theme.palette.text.primary,
              '&.Mui-selected': {
                backgroundColor: alpha(theme.palette.error.main, 0.05)
              }
            }}
          />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <TabPanel value={tabValue} index={0}>
        <Paper sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
            <Typography variant="h6" fontWeight={600}>Performance Metrics</Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Month</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Egg Collection</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Hatch Rate (%)</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total Sales ($)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {performanceData.map((row) => (
                  <TableRow key={row.month} hover>
                    <TableCell component="th" scope="row">
                      <Typography fontWeight={500}>{row.month}</Typography>
                    </TableCell>
                    <TableCell align="right">{row.eggCollection.toLocaleString()}</TableCell>
                    <TableCell align="right">{row.hatchRate}%</TableCell>
                    <TableCell align="right">${row.totalSales.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Paper sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
            <Typography variant="h6" fontWeight={600}>Production Summary</Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.05) }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Current Period</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Previous Period</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Change</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productionSummary.map((row) => (
                  <TableRow key={row.category} hover>
                    <TableCell component="th" scope="row">
                      <Typography fontWeight={500}>{row.category}</Typography>
                    </TableCell>
                    <TableCell align="right">{row.current.toLocaleString()}</TableCell>
                    <TableCell align="right">{row.previous.toLocaleString()}</TableCell>
                    <TableCell align="right" sx={{ 
                      color: row.change.startsWith('+') ? 'success.main' : 'error.main',
                      fontWeight: 500
                    }}>
                      {row.change}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Paper sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
            <Typography variant="h6" fontWeight={600}>Revenue Breakdown</Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: alpha(theme.palette.error.main, 0.05) }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Month</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Chicks Revenue ($)</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Eggs Revenue ($)</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total Revenue ($)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {revenueData.map((row) => (
                  <TableRow key={row.month} hover>
                    <TableCell component="th" scope="row">
                      <Typography fontWeight={500}>{row.month}</Typography>
                    </TableCell>
                    <TableCell align="right">${row.chicksRevenue.toLocaleString()}</TableCell>
                    <TableCell align="right">${row.eggsRevenue.toLocaleString()}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 500 }}>
                      ${row.totalRevenue.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </TabPanel>
    </Box>
  );
} 