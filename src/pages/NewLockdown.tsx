import React, { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Paper,
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
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Notifications as NotificationsIcon,
  EventAvailable as EventAvailableIcon,
  MoreVert as MoreVertIcon,
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
    transferred: true,
    transferDate: '2023-04-03',
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
    transferred: false,
    transferDate: '',
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
    transferred: true,
    transferDate: '2023-04-13',
    notificationSent: true,
    notes: 'Emergency transfer due to temperature fluctuation',
    day: 15
  }
];

interface LockdownFormData {
  id: number;
  batchId: string;
  label: string;
  startDate: string;
  lockdownDate: string;
  quantity: number;
  transferred: boolean;
  transferDate: string;
  notificationSent: boolean;
  notes: string;
  day: number;
}

export default function NewLockdown() {
  const [batches, setBatches] = useState<LockdownFormData[]>(initialBatches);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedBatch, setSelectedBatch] = useState<LockdownFormData | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);

  // Calculate summary stats
  const totalBatches = batches.length;
  const totalEggs = batches.reduce((sum, batch) => sum + batch.quantity, 0);
  const pendingTransfers = batches.filter(batch => !batch.transferred && batch.day >= 18).length;

  const handleEditItem = (item: LockdownFormData) => {
    // This function would be used if we added edit functionality later
    console.log("Edit functionality disabled - automatic process", item);
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

  // Handle batch transfer
  const handleTransferBatch = () => {
    if (selectedBatch) {
      setBatches(batches.map(batch => 
        batch.id === selectedBatch.id 
          ? { ...selectedBatch, transferred: true, notificationSent: false } 
          : batch
      ));
      setTransferDialogOpen(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4">Lockdown Management</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Batches are automatically placed in lockdown when they are 3 days away from hatching.
            All batches initially appear with "Pending Transfer" status until moved to hatchers.
          </Typography>
        </Box>
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
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {batches.map((batch) => (
              <TableRow key={batch.id} sx={{ 
                '&:hover': { bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.03) },
                bgcolor: batch.day >= 18 && !batch.transferred ? 
                  (theme: Theme) => alpha(theme.palette.warning.light, 0.05) : 'inherit'
              }}>
                <TableCell>{batch.batchId}</TableCell>
                <TableCell>{batch.label}</TableCell>
                <TableCell>{batch.lockdownDate}</TableCell>
                <TableCell>{batch.day}</TableCell>
                <TableCell>{batch.quantity.toLocaleString()}</TableCell>
                <TableCell>
                  {batch.transferred ? (
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
        {selectedBatch && !selectedBatch.transferred && (
          <MenuItem onClick={handleTransferBatch}>
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
      <Dialog open={transferDialogOpen} onClose={() => setTransferDialogOpen(false)}>
        <DialogTitle>
          Transfer Batch
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Mark batch {selectedBatch?.batchId} as transferred to hatching?
          </Typography>
          <TextField
            margin="dense"
            name="transferDate"
            label="Transfer Date"
            type="date"
            fullWidth
            variant="outlined"
            value={selectedBatch?.transferDate || new Date().toISOString().split('T')[0]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (selectedBatch) {
                setSelectedBatch({
                  ...selectedBatch,
                  transferDate: e.target.value,
                });
              }
            }}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTransferDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleTransferBatch} color="primary" variant="contained">
            Confirm Transfer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 