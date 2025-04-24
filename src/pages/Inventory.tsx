import { useState } from 'react';
import {
  Box,
  Typography,
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
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

// Sample inventory data - in a real app, this would come from an API
const initialInventory = [
  { id: 1, name: 'Feed - Starter', category: 'Feed', quantity: 250, unit: 'kg', status: 'Adequate' },
  { id: 2, name: 'Feed - Grower', category: 'Feed', quantity: 120, unit: 'kg', status: 'Low' },
  { id: 3, name: 'Vaccines - Newcastle', category: 'Medication', quantity: 500, unit: 'doses', status: 'Adequate' },
  { id: 4, name: 'Disinfectant', category: 'Supplies', quantity: 30, unit: 'liters', status: 'Critical' },
  { id: 5, name: 'Egg Trays', category: 'Equipment', quantity: 105, unit: 'pcs', status: 'Adequate' },
];

// Status colors
const statusColors = {
  Adequate: 'success',
  Low: 'warning',
  Critical: 'error',
};

export default function Inventory() {
  const [inventory, setInventory] = useState(initialInventory);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentItem, setCurrentItem] = useState<any>({
    id: 0,
    name: '',
    category: '',
    quantity: 0,
    unit: '',
    status: 'Adequate',
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleClickOpen = () => {
    setCurrentItem({
      id: inventory.length + 1,
      name: '',
      category: '',
      quantity: 0,
      unit: '',
      status: 'Adequate',
    });
    setIsEditing(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditItem = (item: any) => {
    setCurrentItem(item);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDeleteItem = (id: number) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  const handleSave = () => {
    if (isEditing) {
      setInventory(inventory.map(item => 
        item.id === currentItem.id ? currentItem : item
      ));
    } else {
      setInventory([...inventory, currentItem]);
    }
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setCurrentItem({
      ...currentItem,
      [name as string]: value,
    });
  };

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Inventory Management
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            label="Search Inventory"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
            sx={{ height: '100%' }}
          >
            Add New Item
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell component="th" scope="row">
                  {item.name}
                </TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>
                  <Chip 
                    label={item.status} 
                    color={statusColors[item.status as keyof typeof statusColors]} 
                    size="small" 
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleEditItem(item)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteItem(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>{isEditing ? 'Edit Inventory Item' : 'Add New Inventory Item'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Item Name"
            type="text"
            fullWidth
            variant="outlined"
            value={currentItem.name}
            onChange={handleChange}
            sx={{ mb: 2, mt: 1 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={currentItem.category}
              label="Category"
              onChange={handleChange}
            >
              <MenuItem value="Feed">Feed</MenuItem>
              <MenuItem value="Medication">Medication</MenuItem>
              <MenuItem value="Equipment">Equipment</MenuItem>
              <MenuItem value="Supplies">Supplies</MenuItem>
            </Select>
          </FormControl>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="quantity"
                label="Quantity"
                type="number"
                fullWidth
                variant="outlined"
                value={currentItem.quantity}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="unit"
                label="Unit"
                type="text"
                fullWidth
                variant="outlined"
                value={currentItem.unit}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={currentItem.status}
              label="Status"
              onChange={handleChange}
            >
              <MenuItem value="Adequate">Adequate</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Critical">Critical</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 