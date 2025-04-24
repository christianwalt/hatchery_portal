import React, { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Menu,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { alpha, Theme } from '@mui/material/styles';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Notifications as NotificationsIcon,
  EventAvailable as EventAvailableIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  SwapHoriz as SwapHorizIcon
} from '@mui/icons-material';

// Sample data for lockdown batches
const initialBatches = [
  {
    id: 1,
    batchId: 'B1001',
    label: 'House I',
    startDate: '2023-03-15',
    lockdownDate: '2023-04-03',
    quantity: 5000,
    incubatorId: 'inc1',
    transferredTo: 'hat1',
    humidity: 70,
    temperature: 37.2,
    notificationSent: true,
    notes: 'Regular transfer schedule',
    day: 18
  },
  {
    id: 2,
    batchId: 'B1002',
    label: 'House II',
    startDate: '2023-03-20',
    lockdownDate: '2023-04-08',
    quantity: 4500,
    incubatorId: 'inc2',
    transferredTo: '',
    humidity: 72,
    temperature: 37.5,
    notificationSent: false,
    notes: 'Pending transfer to hatcher',
    day: 18
  },
  {
    id: 3,
    batchId: 'B1003',
    label: 'House III',
    startDate: '2023-03-25',
    lockdownDate: '2023-04-13',
    quantity: 6000,
    incubatorId: 'inc1',
    transferredTo: 'hat2',
    humidity: 71,
    temperature: 37.3,
    notificationSent: true,
    notes: 'Emergency transfer due to temperature fluctuation',
    day: 15
  }
];

// Sample data for available hatchers
const hatchers = [
  { id: 'hat1', name: 'Hatcher A' },
  { id: 'hat2', name: 'Hatcher B' },
  { id: 'hat3', name: 'Hatcher C' },
];

// Sample data for incubators
const incubators = [
  { id: 'inc1', name: 'Incubator 1' },
  { id: 'inc2', name: 'Incubator 2' },
  { id: 'inc3', name: 'Incubator 3' },
];

interface LockdownFormData {
  id: number;
  batchId: string;
  label: string;
  startDate: string;
  lockdownDate: string;
  quantity: number;
  incubatorId: string;
  transferredTo: string;
  humidity: number;
  temperature: number;
  notificationSent: boolean;
  notes: string;
  day: number;
}

export default function Lockdown() {
  const [open, setOpen] = useState(false);
  const [batches, setBatches] = useState<LockdownFormData[]>(initialBatches);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBatch, setCurrentBatch] = useState<LockdownFormData>({
    id: 0,
    batchId: '',
    label: '',
    startDate: '',
    lockdownDate: '',
    quantity: 0,
    incubatorId: '',
    transferredTo: '',
    humidity: 65,
    temperature: 37.0,
    notificationSent: false,
    notes: '',
    day: 0
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedBatch, setSelectedBatch] = useState<LockdownFormData | null>(null);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Calculate summary stats
  const totalBatches = batches.length;
  const totalEggs = batches.reduce((sum, batch) => sum + batch.quantity, 0);
  const pendingTransfers = batches.filter(batch => !batch.transferredTo && batch.day >= 18).length;

  const handleClickOpen = () => {
    setIsEditing(false);
    setCurrentBatch({
      id: batches.length + 1,
      batchId: `B${1000 + batches.length + 1}`,
      label: '',
      startDate: new Date().toISOString().split('T')[0],
      lockdownDate: new Date().toISOString().split('T')[0],
      quantity: 0,
      incubatorId: '',
      transferredTo: '',
      humidity: 65,
      temperature: 37.0,
      notificationSent: false,
      notes: '',
      day: 0
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditItem = (item: LockdownFormData) => {
    setIsEditing(true);
    setCurrentBatch({ ...item });
    setOpen(true);
  };

  const handleSave = () => {
    if (isEditing) {
      setBatches(batches.map(batch => (batch.id === currentBatch.id ? currentBatch : batch)));
    } else {
      setBatches([...batches, currentBatch]);
    }
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name === "notificationSent") {
      setCurrentBatch({
        ...currentBatch,
        [name]: value === "true",
      });
    } else if (name === "day") {
      setCurrentBatch({
        ...currentBatch,
        [name]: Number(value),
      });
    } else {
      setCurrentBatch({
        ...currentBatch,
        [name as string]: value,
      });
    }
  };

  const getIncubatorName = (id: string) => {
    const incubator = incubators.find(inc => inc.id === id);
    return incubator ? incubator.name : 'Unknown';
  };

  const getHatcherName = (id: string) => {
    if (!id) return 'Not transferred';
    const hatcher = hatchers.find(h => h.id === id);
    return hatcher ? hatcher.name : 'Unknown';
  };

  // Send notification for a batch
  const handleSendNotification = (batch: LockdownFormData) => {
    // In a real app, you would call an API endpoint to send the notification
    // For now, we'll just update the batch's notification status
    const updatedBatches = batches.map(b => {
      if (b.id === batch.id) {
        return { ...b, notificationSent: true };
      }
      return b;
    });
    setBatches(updatedBatches);
    alert(`Notification sent for Batch ${batch.batchId}`);
  };

  // Handle menu open
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, batch: LockdownFormData) => {
    setAnchorEl(event.currentTarget);
    setSelectedBatch(batch);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle delete batch
  const handleDeleteBatch = () => {
    if (selectedBatch) {
      setBatches(batches.filter(batch => batch.id !== selectedBatch.id));
      setDeleteConfirmOpen(false);
      handleMenuClose();
    }
  };

  // Handle open transfer dialog
  const handleOpenTransferDialog = () => {
    setTransferDialogOpen(true);
    handleMenuClose();
  };

  // Handle close transfer dialog
  const handleCloseTransferDialog = () => {
    setTransferDialogOpen(false);
  };

  // Handle batch transfer
  const handleTransferBatch = () => {
    if (selectedBatch && selectedBatch.transferredTo) {
      setBatches(batches.map(batch => 
        batch.id === selectedBatch.id 
          ? { ...selectedBatch, notificationSent: false } 
          : batch
      ));
      setTransferDialogOpen(false);
    }
  };

  // Handle transfer change
  const handleTransferChange = (e: { target: { value: unknown } }) => {
    if (selectedBatch) {
      setSelectedBatch({
        ...selectedBatch,
        transferredTo: e.target.value as string,
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Lockdown Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Add Lockdown
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column',
              height: 140,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.05),
              borderLeft: '4px solid',
              borderColor: 'primary.main'
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Total Batches
            </Typography>
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
              {totalBatches}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Currently in lockdown phase
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column',
              height: 140,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              bgcolor: (theme: Theme) => alpha(theme.palette.secondary.main, 0.05),
              borderLeft: '4px solid',
              borderColor: 'secondary.main'
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Total Eggs
            </Typography>
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
              {totalEggs.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Eggs in lockdown phase
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column',
              height: 140,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              bgcolor: (theme: Theme) => alpha(theme.palette.warning.main, 0.05),
              borderLeft: '4px solid',
              borderColor: 'warning.main'
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Pending Transfers
            </Typography>
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
              {pendingTransfers}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Batches waiting for transfer
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* All Batches Table Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 4 }}>
        <EventAvailableIcon sx={{ color: 'primary.main', mr: 1 }} />
        <Typography variant="h5" component="h2" color="primary.main" fontWeight={600}>
          All Lockdown Batches
        </Typography>
      </Box>
      
      <TableContainer component={Paper} sx={{ mb: 4, overflow: 'hidden', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.05) }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Batch ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Label</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Lockdown Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Day</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>From Incubator</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>To Hatcher</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {batches.map((batch) => (
              <TableRow key={batch.id} sx={{ 
                '&:hover': { bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.03) },
                bgcolor: batch.day >= 18 && !batch.transferredTo ? 
                  (theme: Theme) => alpha(theme.palette.warning.light, 0.05) : 'inherit'
              }}>
                <TableCell>{batch.batchId}</TableCell>
                <TableCell>{batch.label}</TableCell>
                <TableCell>{batch.lockdownDate}</TableCell>
                <TableCell>{batch.day}</TableCell>
                <TableCell>{batch.quantity.toLocaleString()}</TableCell>
                <TableCell>{getIncubatorName(batch.incubatorId)}</TableCell>
                <TableCell>{getHatcherName(batch.transferredTo)}</TableCell>
                <TableCell>
                  {batch.transferredTo ? (
                    <Chip 
                      label="Transferred" 
                      color="success" 
                      size="small" 
                      icon={<CheckIcon />}
                      sx={{ fontWeight: 500 }}
                    />
                  ) : (
                    <Chip 
                      label="Pending Transfer" 
                      color="warning" 
                      size="small"
                      sx={{ fontWeight: 500 }} 
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex' }}>
                    <IconButton 
                      aria-label="more options" 
                      size="small"
                      onClick={(event: React.MouseEvent<HTMLElement>) => handleMenuOpen(event, batch)}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                    {!batch.notificationSent && (
                      <IconButton 
                        color="secondary" 
                        onClick={() => handleSendNotification(batch)}
                        sx={{ ml: 1 }}
                        size="small"
                      >
                        <NotificationsIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 2,
          sx: {
            minWidth: 180,
            borderRadius: 1,
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
          }
        }}
      >
        <MenuItem onClick={() => {
          handleEditItem(selectedBatch!);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <EditIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          setDeleteConfirmOpen(true);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
        {selectedBatch && !selectedBatch.transferredTo && (
          <MenuItem onClick={handleOpenTransferDialog}>
            <ListItemIcon>
              <SwapHorizIcon fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText>Transfer</ListItemText>
          </MenuItem>
        )}
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete batch {selectedBatch?.batchId}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteBatch} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Transfer Dialog */}
      <Dialog open={transferDialogOpen} onClose={handleCloseTransferDialog}>
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SwapHorizIcon sx={{ mr: 1, color: 'success.main' }} />
            Transfer Batch {selectedBatch?.batchId}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select a hatcher to transfer batch {selectedBatch?.batchId} ({selectedBatch?.label})
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>To Hatcher</InputLabel>
            <Select
              value={selectedBatch?.transferredTo || ''}
              label="To Hatcher"
              onChange={handleTransferChange}
              sx={{ borderRadius: 1 }}
            >
              <MenuItem value="">Select Hatcher</MenuItem>
              {hatchers.map((hatcher) => (
                <MenuItem key={hatcher.id} value={hatcher.id}>
                  {hatcher.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseTransferDialog} sx={{ borderRadius: 1 }}>Cancel</Button>
          <Button 
            onClick={handleTransferBatch} 
            variant="contained" 
            color="success"
            sx={{ borderRadius: 1 }}
            disabled={!selectedBatch?.transferredTo}
          >
            Transfer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EventAvailableIcon sx={{ mr: 1, color: 'primary.main' }} />
            {isEditing ? 'Edit Lockdown' : 'Add New Lockdown'}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                name="batchId"
                label="Batch ID"
                fullWidth
                variant="outlined"
                value={currentBatch.batchId}
                onChange={handleChange}
                sx={{ mb: 2 }}
                InputProps={{
                  sx: { borderRadius: 1 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                name="label"
                label="Label (House)"
                fullWidth
                variant="outlined"
                value={currentBatch.label}
                onChange={handleChange}
                sx={{ mb: 2 }}
                InputProps={{
                  sx: { borderRadius: 1 }
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                name="quantity"
                label="Quantity"
                type="number"
                fullWidth
                variant="outlined"
                value={currentBatch.quantity}
                onChange={handleChange}
                sx={{ mb: 2 }}
                InputProps={{
                  sx: { borderRadius: 1 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                name="day"
                label="Day"
                type="number"
                fullWidth
                variant="outlined"
                value={currentBatch.day}
                onChange={handleChange}
                sx={{ mb: 2 }}
                InputProps={{
                  sx: { borderRadius: 1 }
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                name="startDate"
                label="Start Date"
                type="date"
                fullWidth
                variant="outlined"
                value={currentBatch.startDate}
                onChange={handleChange}
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  sx: { borderRadius: 1 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                name="lockdownDate"
                label="Lockdown Date"
                type="date"
                fullWidth
                variant="outlined"
                value={currentBatch.lockdownDate}
                onChange={handleChange}
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  sx: { borderRadius: 1 }
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>From Incubator</InputLabel>
                <Select
                  name="incubatorId"
                  value={currentBatch.incubatorId}
                  label="From Incubator"
                  onChange={handleChange}
                  sx={{ borderRadius: 1 }}
                >
                  {incubators.map((incubator) => (
                    <MenuItem key={incubator.id} value={incubator.id}>
                      {incubator.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>To Hatcher</InputLabel>
                <Select
                  name="transferredTo"
                  value={currentBatch.transferredTo}
                  label="To Hatcher"
                  onChange={handleChange}
                  sx={{ borderRadius: 1 }}
                >
                  <MenuItem value="">Not Transferred</MenuItem>
                  {hatchers.map((hatcher) => (
                    <MenuItem key={hatcher.id} value={hatcher.id}>
                      {hatcher.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                name="temperature"
                label="Temperature (°C)"
                type="number"
                fullWidth
                variant="outlined"
                value={currentBatch.temperature}
                onChange={handleChange}
                sx={{ mb: 2 }}
                inputProps={{ step: 0.1 }}
                InputProps={{
                  sx: { borderRadius: 1 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                name="humidity"
                label="Humidity (%)"
                type="number"
                fullWidth
                variant="outlined"
                value={currentBatch.humidity}
                onChange={handleChange}
                sx={{ mb: 2 }}
                InputProps={{
                  sx: { borderRadius: 1 }
                }}
              />
            </Grid>
          </Grid>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Notification Status</InputLabel>
            <Select
              name="notificationSent"
              value={currentBatch.notificationSent ? "true" : "false"}
              label="Notification Status"
              onChange={handleChange}
              sx={{ borderRadius: 1 }}
            >
              <MenuItem value="true">Notification Sent</MenuItem>
              <MenuItem value="false">Notification Pending</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="notes"
            label="Notes"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={currentBatch.notes}
            onChange={handleChange}
            sx={{ mb: 2 }}
            InputProps={{
              sx: { borderRadius: 1 }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} sx={{ borderRadius: 1 }}>Cancel</Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            color="primary"
            sx={{ borderRadius: 1 }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 