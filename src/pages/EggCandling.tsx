import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Tabs,
  Tab,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
} from '@mui/material';
import { alpha, Theme } from '@mui/material/styles';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  FactCheck as FactCheckIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';

// Define interfaces for the data
interface CandlingEntry {
  id: number;
  batchId: string;
  label: string;
  date: string;
  day: number;
  fullSetters: number;
  unfullSetters: number;
  unfullSetterCount: number;
  totalEggs: number;
}

// Interface for form data
interface CandlingFormData {
  id: number;
  batchId: string;
  label: string;
  date: string;
  day: number;
  fullSetters: number;
  unfullSetters: number;
  unfullSetterCount: number;
  totalEggs: number;
}

// Sample data for fertile eggs
const initialFertileEggs: CandlingEntry[] = [
  {
    id: 1,
    batchId: 'B9201',
    label: 'House I',
    date: '2023-10-20',
    day: 7,
    fullSetters: 8,
    unfullSetters: 1,
    unfullSetterCount: 35,
    totalEggs: 851
  },
  {
    id: 2,
    batchId: 'A9831',
    label: 'House II',
    date: '2023-10-23',
    day: 7,
    fullSetters: 12,
    unfullSetters: 1,
    unfullSetterCount: 22,
    totalEggs: 1246
  },
];

// Sample data for clear (infertile) eggs
const initialClearEggs: CandlingEntry[] = [
  {
    id: 1,
    batchId: 'B9201',
    label: 'House I',
    date: '2023-10-20',
    day: 7,
    fullSetters: 1,
    unfullSetters: 0,
    unfullSetterCount: 15,
    totalEggs: 117
  },
  {
    id: 2,
    batchId: 'A9831',
    label: 'House II',
    date: '2023-10-23',
    day: 7,
    fullSetters: 0,
    unfullSetters: 1,
    unfullSetterCount: 52,
    totalEggs: 52
  },
];

// Sample batches for dropdown
const batches = [
  { id: 'B9201', label: 'House I', date: '2023-10-13' },
  { id: 'A9831', label: 'House II', date: '2023-10-16' },
  { id: 'C5482', label: 'House III', date: '2023-10-18' },
];

export default function EggCandling() {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  
  // State for data tables
  const [fertileEggs, setFertileEggs] = useState<CandlingEntry[]>(initialFertileEggs);
  const [clearEggs, setClearEggs] = useState<CandlingEntry[]>(initialClearEggs);
  
  // Dialog states
  const [fertileDiaglogOpen, setFertileDiaglogOpen] = useState(false);
  const [clearDiaglogOpen, setClearDiaglogOpen] = useState(false);
  const [isEditingFertile, setIsEditingFertile] = useState(false);
  const [isEditingClear, setIsEditingClear] = useState(false);
  
  // Current form data
  const [fertileFormData, setFertileFormData] = useState<CandlingFormData>({
    id: 0,
    batchId: '',
    label: '',
    date: new Date().toISOString().split('T')[0],
    day: 7,
    fullSetters: 0,
    unfullSetters: 0,
    unfullSetterCount: 0,
    totalEggs: 0
  });
  
  const [clearFormData, setClearFormData] = useState<CandlingFormData>({
    id: 0,
    batchId: '',
    label: '',
    date: new Date().toISOString().split('T')[0],
    day: 7,
    fullSetters: 0,
    unfullSetters: 0,
    unfullSetterCount: 0,
    totalEggs: 0
  });

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Calculate total eggs and other statistics
  const calculateTotal = (entries: CandlingEntry[]) => {
    return entries.reduce((sum, entry) => sum + entry.totalEggs, 0);
  };

  const totalFertileEggs = calculateTotal(fertileEggs);
  const totalClearEggs = calculateTotal(clearEggs);
  const totalEggs = totalFertileEggs + totalClearEggs;
  const fertilityRate = totalEggs > 0 ? (totalFertileEggs / totalEggs) * 100 : 0;

  // Handle form changes for fertile eggs
  const handleFertileFormChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    
    if (name) {
      // If selecting a batch, update the label
      if (name === 'batchId') {
        const selectedBatch = batches.find(batch => batch.id === value);
        if (selectedBatch) {
          setFertileFormData({
            ...fertileFormData,
            [name]: value as string,
            label: selectedBatch.label,
          });
          return;
        }
      }
      
      // For numeric fields
      if (['day', 'fullSetters', 'unfullSetters', 'unfullSetterCount'].includes(name)) {
        const newValue = value === '' ? 0 : Number(value);
        
        // Update form data with new value
        setFertileFormData(prev => {
          const updated = { ...prev, [name]: newValue };
          
          // Recalculate total eggs
          if (['fullSetters', 'unfullSetters', 'unfullSetterCount'].includes(name)) {
            updated.totalEggs = (updated.fullSetters * 102) + (updated.unfullSetters > 0 ? updated.unfullSetterCount : 0);
          }
          
          return updated;
        });
    } else {
        // For non-numeric fields
        setFertileFormData({
          ...fertileFormData,
          [name]: value as string,
        });
      }
    }
  };

  // Handle form changes for clear eggs
  const handleClearFormChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    
    if (name) {
      // If selecting a batch, update the label
      if (name === 'batchId') {
        const selectedBatch = batches.find(batch => batch.id === value);
        if (selectedBatch) {
          setClearFormData({
            ...clearFormData,
            [name]: value as string,
            label: selectedBatch.label,
          });
          return;
        }
      }
      
      // For numeric fields
      if (['day', 'fullSetters', 'unfullSetters', 'unfullSetterCount'].includes(name)) {
        const newValue = value === '' ? 0 : Number(value);
        
        // Update form data with new value
        setClearFormData(prev => {
          const updated = { ...prev, [name]: newValue };
          
          // Recalculate total eggs
          if (['fullSetters', 'unfullSetters', 'unfullSetterCount'].includes(name)) {
            updated.totalEggs = (updated.fullSetters * 102) + (updated.unfullSetters > 0 ? updated.unfullSetterCount : 0);
          }
          
          return updated;
        });
      } else {
        // For non-numeric fields
        setClearFormData({
          ...clearFormData,
          [name]: value as string,
        });
      }
    }
  };

  // Save fertile egg record
  const handleSaveFertile = () => {
    if (isEditingFertile) {
      setFertileEggs(fertileEggs.map(item => 
        item.id === fertileFormData.id ? fertileFormData : item
      ));
    } else {
      setFertileEggs([...fertileEggs, fertileFormData]);
    }
    setFertileDiaglogOpen(false);
  };

  // Save clear egg record
  const handleSaveClear = () => {
    if (isEditingClear) {
      setClearEggs(clearEggs.map(item => 
        item.id === clearFormData.id ? clearFormData : item
      ));
    } else {
      setClearEggs([...clearEggs, clearFormData]);
    }
    setClearDiaglogOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" fontWeight={600} color="primary.main" gutterBottom>
        Egg Candling
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Monitor egg fertility and development during incubation
      </Typography>

      {/* Batches Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FactCheckIcon sx={{ color: 'primary.main', mr: 1, fontSize: 28 }} />
          <Typography variant="h5" fontWeight={600} color="primary.main">
            Egg Candling Records
          </Typography>
        </Box>
        <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <CategoryIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
          Available Batches
        </Typography>
        
        <Grid container spacing={2}>
          {batches.map((batch) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={batch.id}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: (theme: Theme) => alpha(theme.palette.info.light, 0.05),
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: (theme: Theme) => alpha(theme.palette.info.light, 0.1),
                    borderColor: 'info.light',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Chip 
                    label={batch.id} 
                    color="primary" 
                    size="small" 
                    sx={{ fontWeight: 600 }} 
                  />
                  <Typography variant="caption" color="text.secondary">
                    {batch.date}
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight={500}>
                  {batch.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Stats Cards Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card 
            elevation={0}
            sx={{ 
              p: 2, 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              bgcolor: (theme: Theme) => alpha(theme.palette.success.main, 0.05)
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircleIcon sx={{ color: 'success.main', mr: 1 }} />
                <Typography variant="h6" color="success.main">
                  Fertile Eggs
              </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {totalFertileEggs.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {fertileEggs.length} candling records
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card 
            elevation={0}
            sx={{ 
              p: 2, 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              bgcolor: (theme: Theme) => alpha(theme.palette.error.main, 0.05)
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CancelIcon sx={{ color: 'error.main', mr: 1 }} />
                <Typography variant="h6" color="error.main">
                  Clear Eggs (Infertile)
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {totalClearEggs.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {clearEggs.length} candling records
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card 
            elevation={0}
            sx={{ 
              p: 2, 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.05)
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <InfoIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" color="primary.main">
                  Fertility Rate
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {fertilityRate.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {totalEggs.toLocaleString()} total eggs candled
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant="contained"
          color="success"
            startIcon={<AddIcon />}
          onClick={() => {
            setFertileFormData({
              id: fertileEggs.length > 0 ? Math.max(...fertileEggs.map(e => e.id)) + 1 : 1,
              batchId: '',
              label: '',
              date: new Date().toISOString().split('T')[0],
              day: 7,
              fullSetters: 0,
              unfullSetters: 0,
              unfullSetterCount: 0,
              totalEggs: 0
            });
            setIsEditingFertile(false);
            setFertileDiaglogOpen(true);
          }}
          sx={{ 
            borderRadius: 1.5,
            px: 3,
            py: 1,
            fontWeight: 600
          }}
        >
          Add Fertile Eggs
          </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<AddIcon />}
          onClick={() => {
            setClearFormData({
              id: clearEggs.length > 0 ? Math.max(...clearEggs.map(e => e.id)) + 1 : 1,
              batchId: '',
              label: '',
              date: new Date().toISOString().split('T')[0],
              day: 7,
              fullSetters: 0,
              unfullSetters: 0,
              unfullSetterCount: 0,
              totalEggs: 0
            });
            setIsEditingClear(false);
            setClearDiaglogOpen(true);
          }}
          sx={{ 
            borderRadius: 1.5,
            px: 3,
            py: 1,
            fontWeight: 600
          }}
        >
          Add Clear Eggs
        </Button>
      </Box>

      {/* Tabs for switching between Fertile and Clear tables */}
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        aria-label="egg candling tabs"
        variant="fullWidth"
        sx={{ 
          mb: 3, 
          borderBottom: '1px solid',
          borderColor: 'divider',
          '& .MuiTab-root': {
            fontWeight: 600, 
            fontSize: '1.1rem',
            textTransform: 'none',
            py: 2
          }
        }}
      >
        <Tab 
          label="Fertile Eggs" 
          icon={<CheckCircleIcon color="success" />} 
          iconPosition="start"
          sx={{ color: tabValue === 0 ? 'success.main' : 'inherit' }}
        />
        <Tab 
          label="Clear Eggs" 
          icon={<CancelIcon color="error" />} 
          iconPosition="start" 
          sx={{ color: tabValue === 1 ? 'error.main' : 'inherit' }}
        />
      </Tabs>

      {/* TabPanel 1: Fertile Eggs Table */}
      <Box role="tabpanel" hidden={tabValue !== 0}>
        {tabValue === 0 && (
          <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
                  <TableCell sx={{ fontWeight: 700, bgcolor: theme.palette.success.main, color: 'white' }}>Batch ID</TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: theme.palette.success.main, color: 'white' }}>Label</TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: theme.palette.success.main, color: 'white' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: theme.palette.success.main, color: 'white' }}>Day</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, bgcolor: theme.palette.success.main, color: 'white' }}>Full Setters</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, bgcolor: theme.palette.success.main, color: 'white' }}>Unfull Setters</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, bgcolor: theme.palette.success.main, color: 'white' }}>Unfull Setter Count</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, bgcolor: theme.palette.success.main, color: 'white' }}>Total Eggs</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, bgcolor: theme.palette.success.main, color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
                {fertileEggs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="text.secondary">
                        No fertile egg records found. Add your first record.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  fertileEggs.map((entry) => (
                    <TableRow 
                      key={entry.id}
                      hover
                      sx={{
                        '&:nth-of-type(odd)': {
                          backgroundColor: (theme: Theme) => alpha(theme.palette.success.light, 0.05),
                        }
                      }}
                    >
                      <TableCell sx={{ 
                        fontWeight: 600,
                        borderLeft: '4px solid', 
                        borderColor: 'success.main',
                      }}>{entry.batchId}</TableCell>
                      <TableCell>{entry.label}</TableCell>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{entry.day}</TableCell>
                      <TableCell align="right">{entry.fullSetters}</TableCell>
                      <TableCell align="right">{entry.unfullSetters}</TableCell>
                      <TableCell align="right">{entry.unfullSetterCount}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>{entry.totalEggs}</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Tooltip title="Edit">
                            <IconButton 
                      size="small" 
                              color="primary"
                              onClick={() => {
                                setFertileFormData({ ...entry });
                                setIsEditingFertile(true);
                                setFertileDiaglogOpen(true);
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton 
                              size="small" 
                              color="error" 
                              onClick={() => {
                                setFertileEggs(fertileEggs.filter(item => item.id !== entry.id));
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                  </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* TabPanel 2: Clear Eggs Table */}
      <Box role="tabpanel" hidden={tabValue !== 1}>
        {tabValue === 1 && (
          <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, bgcolor: theme.palette.error.main, color: 'white' }}>Batch ID</TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: theme.palette.error.main, color: 'white' }}>Label</TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: theme.palette.error.main, color: 'white' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: theme.palette.error.main, color: 'white' }}>Day</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, bgcolor: theme.palette.error.main, color: 'white' }}>Full Setters</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, bgcolor: theme.palette.error.main, color: 'white' }}>Unfull Setters</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, bgcolor: theme.palette.error.main, color: 'white' }}>Unfull Setter Count</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, bgcolor: theme.palette.error.main, color: 'white' }}>Total Eggs</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, bgcolor: theme.palette.error.main, color: 'white' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clearEggs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="text.secondary">
                        No clear egg records found. Add your first record.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  clearEggs.map((entry) => (
                    <TableRow 
                      key={entry.id}
                      hover
                      sx={{
                        '&:nth-of-type(odd)': {
                          backgroundColor: (theme: Theme) => alpha(theme.palette.error.light, 0.05),
                        }
                      }}
                    >
                      <TableCell sx={{ 
                        fontWeight: 600,
                        borderLeft: '4px solid', 
                        borderColor: 'error.main',
                      }}>{entry.batchId}</TableCell>
                      <TableCell>{entry.label}</TableCell>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{entry.day}</TableCell>
                      <TableCell align="right">{entry.fullSetters}</TableCell>
                      <TableCell align="right">{entry.unfullSetters}</TableCell>
                      <TableCell align="right">{entry.unfullSetterCount}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>{entry.totalEggs}</TableCell>
                  <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Tooltip title="Edit">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => {
                                setClearFormData({ ...entry });
                                setIsEditingClear(true);
                                setClearDiaglogOpen(true);
                              }}
                            >
                              <EditIcon fontSize="small" />
                    </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton 
                              size="small" 
                              color="error" 
                              onClick={() => {
                                setClearEggs(clearEggs.filter(item => item.id !== entry.id));
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                    </IconButton>
                          </Tooltip>
                        </Box>
                  </TableCell>
                </TableRow>
                  ))
                )}
          </TableBody>
        </Table>
      </TableContainer>
        )}
      </Box>

      {/* Dialog for Fertile Eggs */}
      <Dialog 
        open={fertileDiaglogOpen} 
        onClose={() => setFertileDiaglogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 2,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            overflow: 'visible'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            bgcolor: (theme: Theme) => alpha(theme.palette.success.main, 0.05),
            borderBottom: '1px solid', 
            borderColor: 'divider',
            p: 2,
            pb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'success.main'
          }}
        >
          <Typography variant="h6" component="div" fontWeight={600}>
            {isEditingFertile ? 'Edit Fertile Eggs Record' : 'New Fertile Eggs Record'}
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3, pt: 3 }}>
          <Box 
            sx={{ 
              p: 2, 
              mb: 3, 
              bgcolor: (theme: Theme) => alpha(theme.palette.info.light, 0.1),
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'info.light',
              display: 'flex',
              gap: 1
            }}
          >
            <InfoIcon color="info" sx={{ mt: 0.2 }} />
            <Box>
              <Typography variant="subtitle2" color="info.main" fontWeight={600}>
                How to record fertile eggs from candling:
              </Typography>
              <Typography variant="body2">
                1. Select batch to candle (batch ID, label, and date will be shown)
              </Typography>
              <Typography variant="body2">
                2. Enter the incubation day and count of fertile eggs
              </Typography>
              <Typography variant="body2">
                3. Specify full setters and unfull setters (102 eggs per full setter)
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {/* Batch information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="success.main" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
                Batch Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined" sx={{ mb: 1 }}>
                <InputLabel id="fertile-batch-label" sx={{ backgroundColor: 'white', px: 1 }}>Batch ID</InputLabel>
            <Select
                  labelId="fertile-batch-label"
                  id="fertile-batch"
              name="batchId"
                  value={fertileFormData.batchId}
                  onChange={handleFertileFormChange}
                  label="Batch ID"
                  displayEmpty
                  renderValue={(value: string | unknown) => value ? `${value}` : "Batch ID"}
                  MenuProps={{
                    PaperProps: {
                      sx: { maxHeight: 300 }
                    }
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-notchedOutline': { 
                      borderColor: (theme: Theme) => alpha(theme.palette.success.main, 0.3),
                      borderWidth: '1px',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'success.main',
                      borderWidth: '1px',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'success.main',
                      borderWidth: '2px',
                    },
                    '& .MuiSelect-select': {
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      fontSize: '1rem'
                    }
                  }}
                >
                  <MenuItem value="" disabled>
                    <em>Select a batch</em>
                  </MenuItem>
              {batches.map((batch) => (
                <MenuItem key={batch.id} value={batch.id}>
                      {batch.id} - {batch.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                name="label"
                label="Label"
                value={fertileFormData.label}
                onChange={handleFertileFormChange}
                fullWidth
                disabled
                InputLabelProps={{ shrink: true }}
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    bgcolor: (theme: Theme) => alpha(theme.palette.grey[100], 0.5) 
                  },
                  '& .MuiInputLabel-root': {
                    color: 'text.secondary',
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                name="date"
                label="Date"
                type="date"
                value={fertileFormData.date}
                onChange={handleFertileFormChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ 
                  '& .MuiOutlinedInput-notchedOutline': { 
                    borderColor: (theme: Theme) => alpha(theme.palette.success.main, 0.3),
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'success.main',
                  },
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'success.main',
                    borderWidth: '2px',
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                name="day"
                label="Incubation Day"
                type="number"
                value={fertileFormData.day}
                onChange={handleFertileFormChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ 
                  '& .MuiOutlinedInput-notchedOutline': { 
                    borderColor: (theme: Theme) => alpha(theme.palette.success.main, 0.3),
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'success.main',
                  },
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'success.main',
                    borderWidth: '2px',
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 3 }}>
                <Chip 
                  label="Eggs Count" 
                  size="medium" 
                  color="success" 
                  sx={{ 
                    px: 2, 
                    py: 2.5, 
                    fontWeight: 600, 
                    fontSize: '0.9rem' 
                  }} 
                />
              </Divider>
          </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 0.5 }}>
                <Typography variant="subtitle2" color="success.main" fontWeight={600} gutterBottom>
                  Full Setters
                </Typography>
          <TextField
                  name="fullSetters"
            type="number"
                  value={fertileFormData.fullSetters}
                  onChange={handleFertileFormChange}
            fullWidth
            variant="outlined"
                  placeholder="0"
                  InputProps={{
                    startAdornment: (
                      <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary', fontWeight: 600 }}>
                        №
                      </Typography>
                    ),
                  }}
                  helperText="102 eggs per setter"
                  sx={{ 
                    '& .MuiOutlinedInput-notchedOutline': { 
                      borderColor: (theme: Theme) => alpha(theme.palette.success.main, 0.3),
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'success.main',
                    },
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'success.main',
                      borderWidth: '2px',
                    }
                  }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 0.5 }}>
                <Typography variant="subtitle2" color="success.main" fontWeight={600} gutterBottom>
                  Unfull Setters
                </Typography>
              <TextField
                  name="unfullSetters"
                type="number"
                  value={fertileFormData.unfullSetters}
                  onChange={handleFertileFormChange}
                fullWidth
                variant="outlined"
                  placeholder="0"
                  InputProps={{
                    startAdornment: (
                      <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary', fontWeight: 600 }}>
                        №
                      </Typography>
                    ),
                  }}
                  helperText="Number of partial setters"
                  sx={{ 
                    '& .MuiOutlinedInput-notchedOutline': { 
                      borderColor: (theme: Theme) => alpha(theme.palette.success.main, 0.3),
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'success.main',
                    },
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'success.main',
                      borderWidth: '2px',
                    }
                  }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 0.5 }}>
                <Typography variant="subtitle2" color="success.main" fontWeight={600} gutterBottom>
                  Unfull Setter Count
                </Typography>
              <TextField
                  name="unfullSetterCount"
                type="number"
                  value={fertileFormData.unfullSetterCount}
                  onChange={handleFertileFormChange}
                fullWidth
                variant="outlined"
                  placeholder="0"
                  InputProps={{
                    startAdornment: (
                      <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary', fontWeight: 600 }}>
                        №
                      </Typography>
                    ),
                  }}
                  helperText="Eggs in unfull setters"
                  sx={{ 
                    '& .MuiOutlinedInput-notchedOutline': { 
                      borderColor: (theme: Theme) => alpha(theme.palette.success.main, 0.3),
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'success.main',
                    },
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'success.main',
                      borderWidth: '2px',
                    }
                  }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Box 
                sx={{ 
                  p: 3, 
                  bgcolor: (theme: Theme) => alpha(theme.palette.success.main, 0.1),
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: (theme: Theme) => alpha(theme.palette.success.main, 0.3),
                  mt: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <Typography variant="h6" fontWeight={600} color="success.main" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Total Fertile Eggs</span>
                  <Box sx={{ 
                    bgcolor: 'success.main', 
                    color: 'white', 
                    px: 3, 
                    py: 1, 
                    borderRadius: 2,
                    fontSize: '1.5rem',
                    minWidth: '120px',
                    textAlign: 'center'
                  }}>
                    {fertileFormData.totalEggs}
                  </Box>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Auto-calculated: (Full Setters × 102) + Eggs in unfull setters
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, gap: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: (theme: Theme) => alpha(theme.palette.grey[100], 0.5) }}>
          <Button 
            onClick={() => setFertileDiaglogOpen(false)} 
            color="inherit"
            variant="outlined"
            size="large"
            sx={{ borderRadius: 1.5, px: 3 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveFertile} 
            color="success" 
            variant="contained"
            size="large"
            sx={{ borderRadius: 1.5, px: 3, fontWeight: 600 }}
          >
            {isEditingFertile ? 'Update Record' : 'Save Record'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Clear Eggs */}
      <Dialog 
        open={clearDiaglogOpen} 
        onClose={() => setClearDiaglogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 2,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            overflow: 'visible'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            bgcolor: (theme: Theme) => alpha(theme.palette.error.main, 0.05),
            borderBottom: '1px solid', 
            borderColor: 'divider',
            p: 2,
            pb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'error.main'
          }}
        >
          <Typography variant="h6" component="div" fontWeight={600}>
            {isEditingClear ? 'Edit Clear Eggs Record' : 'New Clear Eggs Record'}
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3, pt: 3 }}>
          <Box 
            sx={{ 
              p: 2, 
              mb: 3, 
              bgcolor: (theme: Theme) => alpha(theme.palette.info.light, 0.1),
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'info.light',
              display: 'flex',
              gap: 1
            }}
          >
            <InfoIcon color="info" sx={{ mt: 0.2 }} />
            <Box>
              <Typography variant="subtitle2" color="info.main" fontWeight={600}>
                How to record infertile (clear) eggs from candling:
              </Typography>
              <Typography variant="body2">
                1. Select batch to candle (batch ID, label, and date will be shown)
              </Typography>
              <Typography variant="body2">
                2. Enter the incubation day and count of infertile eggs
              </Typography>
              <Typography variant="body2">
                3. Specify full setters and unfull setters (102 eggs per full setter)
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {/* Batch information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="error.main" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
                Batch Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined" sx={{ mb: 1 }}>
                <InputLabel id="clear-batch-label" sx={{ backgroundColor: 'white', px: 1 }}>Batch ID</InputLabel>
                <Select
                  labelId="clear-batch-label"
                  id="clear-batch"
                  name="batchId"
                  value={clearFormData.batchId}
                  onChange={handleClearFormChange}
                  label="Batch ID"
                  displayEmpty
                  renderValue={(value: string | unknown) => value ? `${value}` : "Batch ID"}
                  MenuProps={{
                    PaperProps: {
                      sx: { maxHeight: 300 }
                    }
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-notchedOutline': { 
                      borderColor: (theme: Theme) => alpha(theme.palette.error.main, 0.3),
                      borderWidth: '1px',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'error.main',
                      borderWidth: '1px',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'error.main',
                      borderWidth: '2px',
                    },
                    '& .MuiSelect-select': {
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      fontSize: '1rem'
                    }
                  }}
                >
                  <MenuItem value="" disabled>
                    <em>Select a batch</em>
                  </MenuItem>
                  {batches.map((batch) => (
                    <MenuItem key={batch.id} value={batch.id}>
                      {batch.id} - {batch.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                name="label"
                label="Label"
                value={clearFormData.label}
                onChange={handleClearFormChange}
                fullWidth
                disabled
                InputLabelProps={{ shrink: true }}
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    bgcolor: (theme: Theme) => alpha(theme.palette.grey[100], 0.5) 
                  },
                  '& .MuiInputLabel-root': {
                    color: 'text.secondary',
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                name="date"
                label="Date"
                type="date"
                value={clearFormData.date}
                onChange={handleClearFormChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ 
                  '& .MuiOutlinedInput-notchedOutline': { 
                    borderColor: (theme: Theme) => alpha(theme.palette.error.main, 0.3),
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'error.main',
                  },
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'error.main',
                    borderWidth: '2px',
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                name="day"
                label="Incubation Day"
                type="number"
                value={clearFormData.day}
                onChange={handleClearFormChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ 
                  '& .MuiOutlinedInput-notchedOutline': { 
                    borderColor: (theme: Theme) => alpha(theme.palette.error.main, 0.3),
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'error.main',
                  },
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'error.main',
                    borderWidth: '2px',
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 3 }}>
                <Chip 
                  label="Eggs Count" 
                  size="medium" 
                  color="error" 
                  sx={{ 
                    px: 2, 
                    py: 2.5, 
                    fontWeight: 600, 
                    fontSize: '0.9rem' 
                  }} 
                />
              </Divider>
          </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 0.5 }}>
                <Typography variant="subtitle2" color="error.main" fontWeight={600} gutterBottom>
                  Full Setters
                </Typography>
          <TextField
                  name="fullSetters"
                  type="number"
                  value={clearFormData.fullSetters}
                  onChange={handleClearFormChange}
            fullWidth
            variant="outlined"
                  placeholder="0"
                  InputProps={{
                    startAdornment: (
                      <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary', fontWeight: 600 }}>
                        №
                      </Typography>
                    ),
                  }}
                  helperText="102 eggs per setter"
                  sx={{ 
                    '& .MuiOutlinedInput-notchedOutline': { 
                      borderColor: (theme: Theme) => alpha(theme.palette.error.main, 0.3),
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'error.main',
                    },
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'error.main',
                      borderWidth: '2px',
                    }
                  }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 0.5 }}>
                <Typography variant="subtitle2" color="error.main" fontWeight={600} gutterBottom>
                  Unfull Setters
                </Typography>
          <TextField
                  name="unfullSetters"
                  type="number"
                  value={clearFormData.unfullSetters}
                  onChange={handleClearFormChange}
            fullWidth
            variant="outlined"
                  placeholder="0"
                  InputProps={{
                    startAdornment: (
                      <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary', fontWeight: 600 }}>
                        №
                      </Typography>
                    ),
                  }}
                  helperText="Number of partial setters"
                  sx={{ 
                    '& .MuiOutlinedInput-notchedOutline': { 
                      borderColor: (theme: Theme) => alpha(theme.palette.error.main, 0.3),
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'error.main',
                    },
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'error.main',
                      borderWidth: '2px',
                    }
                  }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 0.5 }}>
                <Typography variant="subtitle2" color="error.main" fontWeight={600} gutterBottom>
                  Unfull Setter Count
                </Typography>
                <TextField
                  name="unfullSetterCount"
                  type="number"
                  value={clearFormData.unfullSetterCount}
                  onChange={handleClearFormChange}
                  fullWidth
                  variant="outlined"
                  placeholder="0"
                  InputProps={{
                    startAdornment: (
                      <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary', fontWeight: 600 }}>
                        №
                      </Typography>
                    ),
                  }}
                  helperText="Eggs in unfull setters"
                  sx={{ 
                    '& .MuiOutlinedInput-notchedOutline': { 
                      borderColor: (theme: Theme) => alpha(theme.palette.error.main, 0.3),
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'error.main',
                    },
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'error.main',
                      borderWidth: '2px',
                    }
                  }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Box 
                sx={{ 
                  p: 3, 
                  bgcolor: (theme: Theme) => alpha(theme.palette.error.main, 0.1),
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: (theme: Theme) => alpha(theme.palette.error.main, 0.3),
                  mt: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <Typography variant="h6" fontWeight={600} color="error.main" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Total Clear Eggs</span>
                  <Box sx={{ 
                    bgcolor: 'error.main', 
                    color: 'white', 
                    px: 3, 
                    py: 1, 
                    borderRadius: 2,
                    fontSize: '1.5rem',
                    minWidth: '120px',
                    textAlign: 'center'
                  }}>
                    {clearFormData.totalEggs}
                  </Box>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Auto-calculated: (Full Setters × 102) + Eggs in unfull setters
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, gap: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: (theme: Theme) => alpha(theme.palette.grey[100], 0.5) }}>
          <Button 
            onClick={() => setClearDiaglogOpen(false)} 
            color="inherit"
            variant="outlined"
            size="large"
            sx={{ borderRadius: 1.5, px: 3 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveClear} 
            color="error" 
            variant="contained"
            size="large"
            sx={{ borderRadius: 1.5, px: 3, fontWeight: 600 }}
          >
            {isEditingClear ? 'Update Record' : 'Save Record'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 