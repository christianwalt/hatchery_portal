import { useState, useEffect } from 'react';
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
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  Autocomplete,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  CheckCircle as CheckIcon
} from '@mui/icons-material';

// Sample data from lockdown for transferred batches (in a real app, this would come from an API or context)
const transferredLockdownBatches = [
  {
    id: 1,
    batchId: 'B1001',
    label: 'House I',
    lockdownDate: '2023-04-03',
    transferDate: '2023-04-06', // 3 days after lockdown
    quantity: 5000,
    notes: 'Transferred from lockdown'
  },
  {
    id: 2,
    batchId: 'B1003',
    label: 'House III',
    lockdownDate: '2023-04-13',
    transferDate: '2023-04-16', // 3 days after lockdown
    quantity: 6000,
    notes: 'Transferred from lockdown'
  },
  {
    id: 3,
    batchId: 'B1004',
    label: 'House IV',
    lockdownDate: '2023-05-10',
    transferDate: '2023-05-13',
    quantity: 4800,
    notes: 'Ready for hatching'
  }
];

// Sample data for hatching records
const initialHatchings = [
  {
    id: 1,
    batchId: 'B1001',
    label: 'House I',
    hatchDate: '2023-04-09', // 3 days after transfer date
    quantity: 5000,
    hatchedEggs: 4200,
    unhatchedEggs: 600,
    cullChicks: 120,
    deadChicks: 80,
    status: 'completed',
    notes: 'Successful hatching with good hatch rate'
  },
  {
    id: 2,
    batchId: 'B1003',
    label: 'House III',
    hatchDate: '2023-04-19', // 3 days after transfer date
    quantity: 6000,
    hatchedEggs: 0,
    unhatchedEggs: 0,
    cullChicks: 0,
    deadChicks: 0,
    status: 'in-progress',
    notes: 'Hatching in progress'
  }
];

// Interface for hatching form data
interface HatchingFormData {
  id: number;
  batchId: string;
  label: string;
  hatchDate: string;
  quantity: number;
  hatchedEggs: number;
  unhatchedEggs: number;
  cullChicks: number;
  deadChicks: number;
  status: string;
  notes: string;
}

interface TransferredBatch {
  id: number;
  batchId: string;
  label: string;
  lockdownDate: string;
  transferDate: string;
  quantity: number;
  notes: string;
}

export default function Hatching() {
  const theme = useTheme();
  const [hatchings, setHatchings] = useState<HatchingFormData[]>(initialHatchings);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [availableBatches, setAvailableBatches] = useState<TransferredBatch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<TransferredBatch | null>(null);
  const [currentHatching, setCurrentHatching] = useState<HatchingFormData>({
    id: 0,
    batchId: '',
    label: '',
    hatchDate: new Date().toISOString().split('T')[0],
    quantity: 0,
    hatchedEggs: 0,
    unhatchedEggs: 0,
    cullChicks: 0,
    deadChicks: 0,
    status: 'in-progress',
    notes: '',
  });
  
  // Find batches that are ready for hatching (3 days after transfer) but not yet added
  useEffect(() => {
    // In a real app, you would fetch data from an API or use a state management solution
    // For this simulation, we'll just use the mock data
    
    // Filter out batches that are already in the hatching records
    const filteredBatches = transferredLockdownBatches.filter(
      lockdownBatch => !hatchings.some(hatching => hatching.batchId === lockdownBatch.batchId)
    );
    
    // Make these batches available for selection
    setAvailableBatches(filteredBatches);
    
    // Auto-add logic removed to use the dropdown selection exclusively
  }, [hatchings]);  // Add hatchings dependency

  const handleClickOpen = () => {
    setCurrentHatching({
      id: hatchings.length + 1,
      batchId: '',
      label: '',
      hatchDate: new Date().toISOString().split('T')[0],
      quantity: 0,
      hatchedEggs: 0,
      unhatchedEggs: 0,
      cullChicks: 0,
      deadChicks: 0,
      status: 'in-progress',
      notes: '',
    });
    setSelectedBatch(null);
    setIsEditing(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditItem = (item: HatchingFormData) => {
    setCurrentHatching(item);
    setSelectedBatch(null); // Clear selected batch when editing
    setIsEditing(true);
    setOpen(true);
  };

  const handleSave = () => {
    const newHatching = {
      ...currentHatching
    };

    if (isEditing) {
      setHatchings(hatchings.map(item => 
        item.id === currentHatching.id ? newHatching : item
      ));
    } else {
      setHatchings([...hatchings, newHatching]);
      
      // Remove the batch from available batches after adding
      if (selectedBatch) {
        setAvailableBatches(prev => prev.filter(batch => batch.id !== selectedBatch.id));
      }
    }
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setCurrentHatching({
      ...currentHatching,
      [name as string]: value,
    });
  };

  // Handle batch selection from dropdown
  const handleBatchSelect = (_event: React.SyntheticEvent, value: TransferredBatch | null) => {
    setSelectedBatch(value);
    
    if (value) {
      // Calculate hatch date (3 days after transfer)
      const hatchDate = new Date(new Date(value.transferDate).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      // Update form with selected batch data
      setCurrentHatching({
        ...currentHatching,
        batchId: value.batchId,
        label: value.label,
        hatchDate: hatchDate,
        quantity: value.quantity,
        hatchedEggs: 0,
        unhatchedEggs: 0,
        cullChicks: 0,
        deadChicks: 0,
        notes: `Batch from ${value.label} transferred on ${value.transferDate}`
      });
    }
  };

  // Calculate stats
  const totalHatched = hatchings.reduce((sum, hatching) => sum + hatching.hatchedEggs, 0);
  const totalUnhatched = hatchings.reduce((sum, hatching) => sum + hatching.unhatchedEggs, 0);
  const totalCulls = hatchings.reduce((sum, hatching) => sum + hatching.cullChicks, 0);
  const totalDeads = hatchings.reduce((sum, hatching) => sum + hatching.deadChicks, 0);
  const completedHatchings = hatchings.filter(h => h.status === 'completed');
  const avgHatchRate = completedHatchings.length > 0 
    ? completedHatchings.reduce((sum, hatching) => sum + (hatching.hatchedEggs / hatching.quantity * 100), 0) / completedHatchings.length 
    : 0;
  const inProgressCount = hatchings.filter(hatching => hatching.status === 'in-progress').length;

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 600 }}>
        Hatching Management
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', borderTop: `3px solid ${theme.palette.primary.main}` }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography color="text.secondary" variant="subtitle1" fontWeight={500} gutterBottom>
                Total Chicks Hatched
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                {totalHatched.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Unhatched Eggs: {totalUnhatched}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', borderTop: `3px solid ${theme.palette.success.main}` }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography color="text.secondary" variant="subtitle1" fontWeight={500} gutterBottom>
                Average Hatch Rate
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 600, color: theme.palette.success.main }}>
                {avgHatchRate.toFixed(2)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', borderTop: `3px solid ${theme.palette.error.main}` }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography color="text.secondary" variant="subtitle1" fontWeight={500} gutterBottom>
                Losses
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 600, color: theme.palette.error.main }}>
                {totalCulls + totalDeads + totalUnhatched}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Unhatched: {totalUnhatched} | Culls: {totalCulls} | Dead: {totalDeads}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', borderTop: `3px solid ${theme.palette.warning.main}` }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography color="text.secondary" variant="subtitle1" fontWeight={500} gutterBottom>
                In-Progress Hatchings
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 600, color: theme.palette.warning.main }}>
                {inProgressCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Hatch Button */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
          sx={{ px: 3, py: 1 }}
        >
          Add Hatching Record
        </Button>
      </Box>

      {/* Hatching Records Table */}
      <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
          <TableHead sx={{ bgcolor: theme.palette.action.hover }}>
              <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Batch ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Label</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Hatch Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Hatched Eggs</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Unhatched Eggs</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Cull Chicks</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Dead Chicks</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {hatchings.map((hatching) => (
              <TableRow 
                key={hatching.id}
                sx={{
                  '&:hover': { bgcolor: theme.palette.action.hover },
                  bgcolor: hatching.status === 'in-progress' ? alpha(theme.palette.warning.light, 0.1) : 'inherit',
                }}
              >
                <TableCell>{hatching.batchId}</TableCell>
                <TableCell>{hatching.label}</TableCell>
                  <TableCell>{hatching.hatchDate}</TableCell>
                <TableCell>{hatching.quantity.toLocaleString()}</TableCell>
                <TableCell>{hatching.hatchedEggs.toLocaleString()}</TableCell>
                <TableCell>{hatching.unhatchedEggs.toLocaleString()}</TableCell>
                <TableCell>{hatching.cullChicks.toLocaleString()}</TableCell>
                <TableCell>{hatching.deadChicks.toLocaleString()}</TableCell>
                  <TableCell>
                    {hatching.status === 'completed' ? (
                      <Chip 
                        label="Completed" 
                        color="success" 
                        size="small" 
                      icon={<CheckIcon />} 
                        sx={{ fontWeight: 500 }}
                      />
                    ) : (
                      <Chip 
                        label="In Progress" 
                        color="warning" 
                        size="small"
                        sx={{ fontWeight: 500 }} 
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleEditItem(hatching)}
                  >
                    <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>
          {isEditing ? 'Edit Hatching Record' : 'Add New Hatching Record'}
        </DialogTitle>
        <DialogContent>
          {!isEditing && (
            <Box sx={{ mb: 2, mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Select a transferred batch to create a hatching record. Batch details will be automatically populated.
              </Typography>
              <Autocomplete<TransferredBatch>
                options={availableBatches}
                getOptionLabel={(option: TransferredBatch) => `${option.batchId} - ${option.label} (${option.quantity} eggs)`}
                onChange={handleBatchSelect}
                // @ts-expect-error - params is properly typed by Autocomplete
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Transferred Batch"
                    helperText="Select a batch that has completed its 3-day transfer period"
                    fullWidth
                    required
                  />
                )}
              />
            </Box>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                name="batchId"
                label="Batch ID"
                value={currentHatching.batchId}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: !isEditing,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="label"
                label="Label"
                value={currentHatching.label}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: !isEditing,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="hatchDate"
                label="Hatch Date"
                type="date"
                value={currentHatching.hatchDate}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="quantity"
                label="Quantity"
                type="number"
                value={currentHatching.quantity}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: !isEditing,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="hatchedEggs"
                label="Hatched Eggs"
                type="number"
                value={currentHatching.hatchedEggs}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="unhatchedEggs"
                label="Unhatched Eggs"
                type="number"
                value={currentHatching.unhatchedEggs}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="cullChicks"
                label="Cull Chicks"
                type="number"
                value={currentHatching.cullChicks}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="deadChicks"
                label="Dead Chicks"
                type="number"
                value={currentHatching.deadChicks}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={currentHatching.status}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="notes"
                label="Notes"
                value={currentHatching.notes}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            color="primary"
            disabled={!isEditing && (!selectedBatch || !currentHatching.batchId)}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 