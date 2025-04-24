import { useState } from 'react';
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
  LinearProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
} from '@mui/material';
import { Theme } from '@mui/material/styles';
import { Edit as EditIcon, Visibility as ViewIcon } from '@mui/icons-material';

// Sample data for incubation batches
const initialBatches = [
  { 
    id: 1, 
    batchId: 'B9201', 
    label: 'II',
    startDate: '2023-06-10', 
    expectedHatchDate: '2023-07-01', 
    quantity: 500,
    temperature: 37.5,
    humidity: 60,
    dayNumber: 12,
    notes: 'Development on track'
  },
  { 
    id: 2, 
    batchId: 'A9831', 
    label: 'III',
    startDate: '2023-06-12', 
    expectedHatchDate: '2023-07-03', 
    quantity: 450,
    temperature: 37.6,
    humidity: 61,
    dayNumber: 10,
    notes: 'Slightly higher temperature'
  },
  { 
    id: 3, 
    batchId: 'E7003', 
    label: 'I',
    startDate: '2023-06-15', 
    expectedHatchDate: '2023-07-06', 
    quantity: 520,
    temperature: 37.4,
    humidity: 58,
    dayNumber: 7,
    notes: ''
  },
];

// Interface for batch form data
interface BatchFormData {
  id: number;
  batchId: string;
  label: string;
  startDate: string;
  expectedHatchDate: string;
  quantity: number;
  temperature: number;
  humidity: number;
  dayNumber: number;
  notes: string;
}

export default function Incubation() {
  const [batches, setBatches] = useState(initialBatches);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBatch, setCurrentBatch] = useState<BatchFormData>({
    id: 0,
    batchId: '',
    label: '',
    startDate: new Date().toISOString().split('T')[0],
    expectedHatchDate: '',
    quantity: 0,
    temperature: 37.5,
    humidity: 60,
    dayNumber: 0,
    notes: '',
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditItem = (item: BatchFormData) => {
    setCurrentBatch(item);
    setIsEditing(true);
    setOpen(true);
  };

  const handleSave = () => {
    if (isEditing) {
      setBatches(batches.map(item => 
        item.id === currentBatch.id ? currentBatch : item
      ));
    }
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    
    // If changing the start date, update the expected hatch date (21 days later)
    if (name === 'startDate' && typeof value === 'string') {
      const startDate = new Date(value);
      const expectedHatchDate = new Date(startDate);
      expectedHatchDate.setDate(startDate.getDate() + 21);
      
      setCurrentBatch({
        ...currentBatch,
        [name]: value,
        expectedHatchDate: expectedHatchDate.toISOString().split('T')[0],
      });
    } else if (name) {
      // Convert string numbers to actual numbers for number fields
      const processedValue = 
        ['quantity', 'temperature', 'humidity', 'dayNumber'].includes(name) && typeof value === 'string'
          ? Number(value)
          : value;
      
      setCurrentBatch({
        ...currentBatch,
        [name]: processedValue,
      });
    }
  };

  // Calculate progress percentage for each batch
  const calculateProgress = (dayNumber: number) => {
    // Assuming 21 days incubation period
    return Math.min((dayNumber / 21) * 100, 100);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" fontWeight={600} color="primary.main" gutterBottom>
        Incubation Management
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Monitor and track egg batches during the incubation period
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={0}
            sx={{ 
              p: 2, 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Active Batches
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {batches.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={0}
            sx={{ 
              p: 2, 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Total Eggs in Incubation
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {batches.reduce((sum, batch) => sum + batch.quantity, 0).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Incubation Batches Table */}
      <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mt: 4, mb: 2 }}>
        Incubation Batches
      </Typography>
      <TableContainer component={Paper} sx={{ 
        borderRadius: 2, 
        overflow: 'hidden', 
        border: '1px solid', 
        borderColor: 'divider',
        mb: 4
      }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white' }}>Batch ID</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white' }}>Label</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white' }}>Start Date</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white' }}>Days</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white' }}>Progress</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white' }}>Expected Hatch</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white' }}>Quantity</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {batches.map((batch) => {
              const progress = calculateProgress(batch.dayNumber);
              
              return (
                <TableRow key={batch.id} hover
                  sx={{
                    '&:nth-of-type(odd)': {
                      backgroundColor: (theme: Theme) => theme.palette.action.hover,
                    },
                  }}>
                  <TableCell sx={{ 
                    fontWeight: 600, 
                    color: 'primary.main', 
                    borderLeft: '4px solid', 
                    borderColor: 'primary.main',
                  }}>{batch.batchId}</TableCell>
                  <TableCell>{batch.label}</TableCell>
                  <TableCell>{batch.startDate}</TableCell>
                  <TableCell>{batch.dayNumber}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress variant="determinate" value={progress} />
                      </Box>
                      <Box sx={{ minWidth: 35 }}>
                        <Typography variant="body2" color="text.secondary">
                          {Math.round(progress)}%
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{batch.expectedHatchDate}</TableCell>
                  <TableCell>{batch.quantity}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" size="small" onClick={() => handleEditItem(batch)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton color="primary" size="small">
                      <ViewIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>
          Edit Incubation Batch
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={4}>
              <TextField
                name="batchId"
                label="Batch ID"
                fullWidth
                variant="outlined"
                value={currentBatch.batchId}
                InputProps={{ readOnly: true }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                name="label"
                label="Label"
                fullWidth
                variant="outlined"
                value={currentBatch.label}
                InputProps={{ readOnly: true }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                name="quantity"
                label="Quantity"
                type="number"
                fullWidth
                variant="outlined"
                value={currentBatch.quantity}
                InputProps={{ readOnly: true }}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                name="startDate"
                label="Start Date"
                type="date"
                fullWidth
                variant="outlined"
                value={currentBatch.startDate}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="expectedHatchDate"
                label="Expected Hatch Date"
                type="date"
                fullWidth
                variant="outlined"
                value={currentBatch.expectedHatchDate}
                InputProps={{ readOnly: true }}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                name="dayNumber"
                label="Day Number"
                type="number"
                fullWidth
                variant="outlined"
                value={currentBatch.dayNumber}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                name="temperature"
                label="Temperature (°C)"
                type="number"
                fullWidth
                variant="outlined"
                value={currentBatch.temperature}
                onChange={handleChange}
                sx={{ mb: 2 }}
                inputProps={{ step: 0.1 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                name="humidity"
                label="Humidity (%)"
                type="number"
                fullWidth
                variant="outlined"
                value={currentBatch.humidity}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
          <TextField
            name="notes"
            label="Notes"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={currentBatch.notes}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={handleClose} color="inherit" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 