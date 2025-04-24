import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Slider,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';

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
      id={`hatchery-tabpanel-${index}`}
      aria-labelledby={`hatchery-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Sample incubator data
const incubators = [
  { id: 1, name: 'Incubator 1', capacity: 500, currentEggs: 450, status: 'Active', temp: 37.5, humidity: 60 },
  { id: 2, name: 'Incubator 2', capacity: 500, currentEggs: 480, status: 'Active', temp: 37.8, humidity: 62 },
  { id: 3, name: 'Incubator 3', capacity: 500, currentEggs: 0, status: 'Maintenance', temp: 0, humidity: 0 },
  { id: 4, name: 'Hatcher 1', capacity: 250, currentEggs: 180, status: 'Active', temp: 36.9, humidity: 70 },
  { id: 5, name: 'Hatcher 2', capacity: 250, currentEggs: 210, status: 'Active', temp: 37.1, humidity: 75 },
];

// Sample batch data
const batches = [
  { id: 'B001', startDate: '2023-06-01', eggs: 500, stage: 'Incubation', daysLeft: 13, location: 'Incubator 1' },
  { id: 'B002', startDate: '2023-06-05', eggs: 480, stage: 'Incubation', daysLeft: 17, location: 'Incubator 2' },
  { id: 'B003', startDate: '2023-05-15', eggs: 180, stage: 'Hatching', daysLeft: 3, location: 'Hatcher 1' },
  { id: 'B004', startDate: '2023-05-12', eggs: 210, stage: 'Hatching', daysLeft: 0, location: 'Hatcher 2' },
];

// Interface for batch form data
interface BatchFormData {
  id: string;
  startDate: string;
  eggs: number;
  location: string;
}

export default function HatcheryManagement() {
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingIncubator, setEditingIncubator] = useState<number | null>(null);
  const [incubatorSettings, setIncubatorSettings] = useState({
    temp: 37.5,
    humidity: 60,
  });
  const [batchFormData, setBatchFormData] = useState<BatchFormData>({
    id: '',
    startDate: new Date().toISOString().split('T')[0],
    eggs: 0,
    location: '',
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleIncubatorControl = (incubatorId: number) => {
    setEditingIncubator(incubatorId);
    const incubator = incubators.find(inc => inc.id === incubatorId);
    if (incubator) {
      setIncubatorSettings({
        temp: incubator.temp,
        humidity: incubator.humidity,
      });
    }
  };

  const handleSettingsChange = (setting: string) => (event: Event, value: number | number[]) => {
    setIncubatorSettings({
      ...incubatorSettings,
      [setting]: value as number,
    });
  };

  const handleSaveSettings = () => {
    // In a real app, this would send the settings to a backend API
    console.log(`Saving settings for incubator ${editingIncubator}:`, incubatorSettings);
    setEditingIncubator(null);
  };

  const handleAddBatch = () => {
    setOpenDialog(true);
    setBatchFormData({
      id: `B${String(batches.length + 1).padStart(3, '0')}`,
      startDate: new Date().toISOString().split('T')[0],
      eggs: 0,
      location: '',
    });
  };

  const handleBatchInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setBatchFormData({
      ...batchFormData,
      [name as string]: value,
    });
  };

  const handleSaveBatch = () => {
    // In a real app, this would send the batch data to a backend API
    console.log('Saving new batch:', batchFormData);
    setOpenDialog(false);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Hatchery Management
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="hatchery management tabs">
          <Tab label="Incubators & Hatchers" id="tab-0" />
          <Tab label="Batches" id="tab-1" />
          <Tab label="Schedule" id="tab-2" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {incubators.map((incubator) => (
            <Grid item xs={12} md={6} key={incubator.id}>
              <Card>
                <CardHeader 
                  title={incubator.name} 
                  subheader={`Status: ${incubator.status}`}
                  action={
                    <IconButton 
                      color="primary" 
                      onClick={() => handleIncubatorControl(incubator.id)}
                      disabled={incubator.status === 'Maintenance'}
                    >
                      <EditIcon />
                    </IconButton>
                  }
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Temperature
                      </Typography>
                      <Typography variant="h6">
                        {incubator.temp}°C
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Humidity
                      </Typography>
                      <Typography variant="h6">
                        {incubator.humidity}%
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Capacity Usage
                      </Typography>
                      <Typography variant="h6">
                        {incubator.currentEggs} / {incubator.capacity} eggs ({Math.round(incubator.currentEggs / incubator.capacity * 100)}%)
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={handleAddBatch}
          >
            Add New Batch
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Batch ID</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell align="right">Eggs</TableCell>
                <TableCell>Stage</TableCell>
                <TableCell align="right">Days Left</TableCell>
                <TableCell>Location</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {batches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell component="th" scope="row">
                    {batch.id}
                  </TableCell>
                  <TableCell>{batch.startDate}</TableCell>
                  <TableCell align="right">{batch.eggs}</TableCell>
                  <TableCell>{batch.stage}</TableCell>
                  <TableCell align="right">{batch.daysLeft}</TableCell>
                  <TableCell>{batch.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>
          Upcoming Schedule
        </Typography>
        <Typography>
          Schedule management functionality would be implemented here in a real application.
        </Typography>
      </TabPanel>

      {/* Incubator Control Dialog */}
      <Dialog 
        open={editingIncubator !== null} 
        onClose={() => setEditingIncubator(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Control Settings - {incubators.find(inc => inc.id === editingIncubator)?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ my: 2 }}>
            <Typography gutterBottom>
              Temperature: {incubatorSettings.temp}°C
            </Typography>
            <Slider
              value={incubatorSettings.temp}
              onChange={handleSettingsChange('temp')}
              aria-label="Temperature"
              valueLabelDisplay="auto"
              step={0.1}
              min={35}
              max={40}
            />
          </Box>
          <Box sx={{ my: 2 }}>
            <Typography gutterBottom>
              Humidity: {incubatorSettings.humidity}%
            </Typography>
            <Slider
              value={incubatorSettings.humidity}
              onChange={handleSettingsChange('humidity')}
              aria-label="Humidity"
              valueLabelDisplay="auto"
              step={1}
              min={45}
              max={85}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingIncubator(null)}>Cancel</Button>
          <Button onClick={handleSaveSettings} variant="contained">
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Batch Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Batch</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="id"
            label="Batch ID"
            type="text"
            fullWidth
            variant="outlined"
            value={batchFormData.id}
            onChange={handleBatchInputChange}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            name="startDate"
            label="Start Date"
            type="date"
            fullWidth
            variant="outlined"
            value={batchFormData.startDate}
            onChange={handleBatchInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="eggs"
            label="Number of Eggs"
            type="number"
            fullWidth
            variant="outlined"
            value={batchFormData.eggs}
            onChange={handleBatchInputChange}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Location</InputLabel>
            <Select
              name="location"
              value={batchFormData.location}
              label="Location"
              onChange={handleBatchInputChange}
            >
              {incubators
                .filter(inc => inc.status === 'Active')
                .map(inc => (
                  <MenuItem key={inc.id} value={inc.name}>
                    {inc.name} ({inc.currentEggs}/{inc.capacity} eggs)
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveBatch} variant="contained">
            Add Batch
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 