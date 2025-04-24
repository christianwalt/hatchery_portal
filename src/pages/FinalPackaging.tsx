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
  Divider,
  Stepper,
  Step,
  StepLabel,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';

// Box types
const boxTypes = [
  { id: 'small', name: 'Small Box', description: 'Small size box for up to 50 chicks', defaultCapacity: 50 },
  { id: 'medium', name: 'Medium Box', description: 'Medium size box for up to 100 chicks', defaultCapacity: 100 },
  { id: 'large', name: 'Large Box', description: 'Large size box for up to 200 chicks', defaultCapacity: 200 },
  { id: 'export', name: 'Export Box', description: 'Special box for international shipping', defaultCapacity: 150 },
];

// Sample data for packaging batches
const initialBatches = [
  {
    id: 1,
    batchId: 'B001',
    label: 'Broilers Batch 1',
    packagingDate: '2023-07-05',
    hatchBatchId: 'B001',
    boxType: 'medium',
    typeOfChicks: 'Broiler',
    fullBoxes: 3,
    unfullBoxes: 1,
    unfullBoxCount: 50,
    chicksPacked: 350,
    status: 'completed',
    assignedTo: 'Sarah Johnson',
    notes: 'Completed on schedule'
  },
  {
    id: 2,
    batchId: 'B002',
    label: 'Layers Batch 1',
    packagingDate: '2023-07-07',
    hatchBatchId: 'B002',
    boxType: 'large',
    typeOfChicks: 'Layer',
    fullBoxes: 1,
    unfullBoxes: 1,
    unfullBoxCount: 120,
    chicksPacked: 320,
    status: 'completed',
    assignedTo: 'Robert Chen',
    notes: 'Special export packaging'
  },
  {
    id: 3,
    batchId: 'B003',
    label: 'Indigenous Batch 1',
    packagingDate: '2023-07-10',
    hatchBatchId: 'B003',
    boxType: 'small',
    typeOfChicks: 'Indigenous',
    fullBoxes: 0,
    unfullBoxes: 0,
    unfullBoxCount: 0,
    chicksPacked: 0,
    status: 'pending',
    assignedTo: 'Sarah Johnson',
    notes: 'Waiting for hatching to complete'
  },
];

// Box Manufacturing form data interface
interface BoxManufacturingData {
  boxType: string;
  boxCapacity: number;
  hasBonusCapacity: boolean;
  bonusCapacity: number;
  totalCapacity: number;
}

// Interface for packaging form data
interface PackagingFormData {
  id: number;
  batchId: string;
  label: string;
  packagingDate: string;
  hatchBatchId: string;
  boxType: string;
  typeOfChicks: string;
  fullBoxes: number;
  unfullBoxes: number;
  unfullBoxCount: number;
  chicksPacked: number;
  status: string;
  assignedTo: string;
  notes: string;
}

export default function FinalPackaging() {
  const [batches, setBatches] = useState(initialBatches);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Box Manufacturing state
  const [boxDialogOpen, setBoxDialogOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [boxData, setBoxData] = useState<BoxManufacturingData>({
    boxType: '',
    boxCapacity: 0,
    hasBonusCapacity: false,
    bonusCapacity: 0,
    totalCapacity: 0
  });
  
  // State to track manufactured box types
  const [manufacturedBoxes, setManufacturedBoxes] = useState<BoxManufacturingData[]>([]);

  const [currentBatch, setCurrentBatch] = useState<PackagingFormData>({
    id: 0,
    batchId: '',
    label: '',
    packagingDate: new Date().toISOString().split('T')[0],
    hatchBatchId: '',
    boxType: '',
    typeOfChicks: '',
    fullBoxes: 0,
    unfullBoxes: 0,
    unfullBoxCount: 0,
    chicksPacked: 0,
    status: 'pending',
    assignedTo: '',
    notes: '',
  });

  // Box Manufacturing functions
  const handleBoxDialogOpen = () => {
    setBoxData({
      boxType: '',
      boxCapacity: 0,
      hasBonusCapacity: false,
      bonusCapacity: 0,
      totalCapacity: 0
    });
    setActiveStep(0);
    setBoxDialogOpen(true);
  };

  const handleBoxDialogClose = () => {
    setBoxDialogOpen(false);
  };

  const handleBoxTypeChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const selectedBoxType = e.target.value as string;
    const selectedBox = boxTypes.find(box => box.id === selectedBoxType);
    
    if (selectedBox) {
      setBoxData({
        ...boxData,
        boxType: selectedBoxType,
        boxCapacity: selectedBox.defaultCapacity,
        totalCapacity: selectedBox.defaultCapacity // Initialize total capacity with default capacity
      });
    }
  };

  const handleBoxDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'hasBonusCapacity') {
      setBoxData({
        ...boxData,
        hasBonusCapacity: checked,
        bonusCapacity: checked ? boxData.bonusCapacity : 0,
        totalCapacity: checked ? boxData.boxCapacity + boxData.bonusCapacity : boxData.boxCapacity
      });
    } else if (name === 'boxCapacity') {
      const newCapacity = Number(value);
      setBoxData({
        ...boxData,
        boxCapacity: newCapacity,
        totalCapacity: newCapacity + (boxData.hasBonusCapacity ? boxData.bonusCapacity : 0)
      });
    } else if (name === 'bonusCapacity') {
      const newBonusCapacity = Number(value);
      setBoxData({
        ...boxData,
        bonusCapacity: newBonusCapacity,
        totalCapacity: boxData.boxCapacity + newBonusCapacity
      });
    } else {
      setBoxData({
        ...boxData,
        [name]: type === 'number' ? Number(value) : value
      });
    }
  };

  const handleNextStep = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBackStep = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleFinishBoxSetup = () => {
    setBoxDialogOpen(false);
    // Add the new box to the manufactured boxes
    setManufacturedBoxes([...manufacturedBoxes, boxData]);
    // Alert for feedback
    alert(`Box created: ${boxTypes.find(box => box.id === boxData.boxType)?.name} with capacity for ${boxData.totalCapacity} chicks`);
  };

  // Packaging functions
  const handleClickOpen = () => {
    setCurrentBatch({
      id: batches.length + 1,
      batchId: '',
      label: '',
      packagingDate: new Date().toISOString().split('T')[0],
      hatchBatchId: '',
      boxType: '',
      typeOfChicks: '',
      fullBoxes: 0,
      unfullBoxes: 0,
      unfullBoxCount: 0,
      chicksPacked: 0,
      status: 'pending',
      assignedTo: '',
      notes: '',
    });
    setIsEditing(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditItem = (item: PackagingFormData) => {
    setCurrentBatch(item);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDeleteItem = (id: number) => {
    setBatches(batches.filter(batch => batch.id !== id));
  };

  const handleSave = () => {
    if (isEditing) {
      setBatches(batches.map(batch => 
        batch.id === currentBatch.id ? currentBatch : batch
      ));
    } else {
      setBatches([...batches, currentBatch]);
    }
    setOpen(false);
  };

  // Function to automatically calculate packaging details based on hatch batch and box type
  const calculatePackagingDetails = (hatchBatchId: string, boxType: string) => {
    // Find the selected hatch batch
    const selectedBatch = hatchBatches.find(batch => batch.id === hatchBatchId);
    
    if (!selectedBatch || selectedBatch.status !== 'completed') {
      return null;
    }
    
    // Find box capacity from either manufactured boxes or default box types
    let boxCapacity = 0;
    const manufacturedBox = manufacturedBoxes.find(box => box.boxType === boxType);
    const defaultBox = boxTypes.find(box => box.id === boxType);
    
    if (manufacturedBox) {
      boxCapacity = manufacturedBox.totalCapacity;
    } else if (defaultBox) {
      boxCapacity = defaultBox.defaultCapacity;
    } else {
      return null;
    }
    
    // Calculate how many full boxes can be made
    const chicksToPackage = selectedBatch.quantity;
    const fullBoxes = Math.floor(chicksToPackage / boxCapacity);
    const remainingChicks = chicksToPackage % boxCapacity;
    
    // If there are remaining chicks, we need an unfull box
    const unfullBoxes = remainingChicks > 0 ? 1 : 0;
    const unfullBoxCount = remainingChicks;
    
    // Calculate total chicks packed
    const chicksPacked = (fullBoxes * boxCapacity) + unfullBoxCount;
    
    return {
      typeOfChicks: selectedBatch.typeOfChicks || '',
      fullBoxes,
      unfullBoxes,
      unfullBoxCount,
      chicksPacked
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    
    // If selecting a hatch batch, auto-calculate everything
    if (name === 'hatchBatchId') {
      const selectedBatch = hatchBatches.find(batch => batch.id === value);
      
      if (selectedBatch) {
        // Set the basic batch info
        const updatedBatch = {
          ...currentBatch,
          [name as string]: value,
          batchId: selectedBatch.id, // Use the hatch batch ID directly
          label: `${selectedBatch.typeOfChicks || 'Chicks'} - ${selectedBatch.date}`,
          typeOfChicks: selectedBatch.typeOfChicks || '',
        };
        
        // If box type is already selected, calculate packaging details
        if (currentBatch.boxType) {
          const packagingDetails = calculatePackagingDetails(value as string, currentBatch.boxType);
          if (packagingDetails) {
            Object.assign(updatedBatch, packagingDetails);
          }
        }
        
        setCurrentBatch(updatedBatch);
      } else {
        setCurrentBatch({
          ...currentBatch,
          [name as string]: value,
        });
      }
    } else if (name === 'boxType') {
      // Update the box type
      const updatedBatch = {
        ...currentBatch,
        boxType: value as string,
      };
      
      // If hatch batch is already selected, calculate packaging details
      if (currentBatch.hatchBatchId) {
        const packagingDetails = calculatePackagingDetails(currentBatch.hatchBatchId, value as string);
        if (packagingDetails) {
          Object.assign(updatedBatch, packagingDetails);
        }
      }
      
      setCurrentBatch(updatedBatch);
    } else {
      // For other fields, just update normally
      setCurrentBatch({
        ...currentBatch,
        [name as string]: value,
      });
    }
  };

  // Calculate stats
  const pendingPackaging = batches.filter(batch => batch.status === 'pending').length;
  const totalChicksPackaged = batches.filter(batch => batch.status === 'completed')
    .reduce((sum, batch) => sum + batch.chicksPacked, 0);

  // Box Manufacturing steps
  const steps = ['Select Box Type', 'Configure Capacity', 'Summary'];

  // Sample hatch batches for dropdown - with updated statuses
  const hatchBatches = [
    { id: 'B001', date: '2023-07-01', quantity: 380, status: 'completed', typeOfChicks: 'Broiler', culls: 12, deads: 8 },
    { id: 'B002', date: '2023-07-03', quantity: 352, status: 'completed', typeOfChicks: 'Layer', culls: 15, deads: 5 },
    { id: 'B003', date: '2023-07-06', quantity: 400, status: 'in-progress', typeOfChicks: 'Indigenous' },
    { id: 'B004', date: '2023-07-08', quantity: 320, status: 'completed', typeOfChicks: 'Kienyeji', culls: 10, deads: 7 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Box Manufacturing Section */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <InventoryIcon sx={{ color: 'primary.main', mr: 1.5 }} />
          <Typography variant="h5" color="primary.main" fontWeight={600}>
            Box Manufacturing
          </Typography>
        </Box>
        
        <Typography variant="body1" sx={{ mb: 3 }}>
          Configure box types for packaging chicks. Define the box capacity and bonus capacity to maximize efficiency.
          Box types created here will be available for selection when packaging chicks.
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleBoxDialogOpen}
          sx={{ px: 3, py: 1, minWidth: '200px' }}
        >
          Create New Box Type
        </Button>
        
        {manufacturedBoxes.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Available Box Types for Packaging
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2 }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Box Type</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Box Capacity</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Bonus Capacity</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Total Capacity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {manufacturedBoxes.map((box, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {boxTypes.find(type => type.id === box.boxType)?.name}
                      </TableCell>
                      <TableCell>{box.boxCapacity}</TableCell>
                      <TableCell>{box.bonusCapacity}</TableCell>
                      <TableCell>{box.totalCapacity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Paper>
      
      <Divider sx={{ my: 4 }} />

      {/* Final Packaging Section */}
      <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 600 }}>
        Final Packaging
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderTop: '3px solid #4caf50', borderRadius: 2 }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography color="textSecondary" gutterBottom variant="subtitle1" fontWeight={500}>
                Packaged Chicks
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 600, color: 'primary.main' }}>
                {totalChicksPackaged.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderTop: '3px solid #ff9800', borderRadius: 2 }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography color="textSecondary" gutterBottom variant="subtitle1" fontWeight={500}>
                Pending Packaging
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 600, color: 'warning.main' }}>
                {pendingPackaging}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
          sx={{ px: 3, py: 1, minWidth: '200px' }}
        >
          Add Packaging Batch
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 4, overflow: 'hidden', borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Batch ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Label</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Type of Chicks</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Box Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Full Boxes</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Unfull Boxes</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Unfull Box Count</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Chicks Packed</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {batches.map((batch) => (
              <TableRow key={batch.id}>
                <TableCell>{batch.batchId}</TableCell>
                <TableCell>{batch.label}</TableCell>
                <TableCell>{batch.packagingDate}</TableCell>
                <TableCell>{batch.typeOfChicks}</TableCell>
                <TableCell>
                  {
                    (() => {
                      const boxType = boxTypes.find(box => box.id === batch.boxType);
                      const manufacturedBox = manufacturedBoxes.find(box => box.boxType === batch.boxType);
                      
                      if (manufacturedBox) {
                        return `${boxType?.name || batch.boxType} (Capacity: ${manufacturedBox.totalCapacity})`;
                      } else if (boxType) {
                        return `${boxType.name} (Capacity: ${boxType.defaultCapacity})`;
                      } else {
                        return batch.boxType;
                      }
                    })()
                  }
                </TableCell>
                <TableCell>{batch.fullBoxes}</TableCell>
                <TableCell>{batch.unfullBoxes}</TableCell>
                <TableCell>{batch.unfullBoxCount}</TableCell>
                <TableCell>{batch.chicksPacked}</TableCell>
                <TableCell>
                    <Chip 
                    label={batch.status === 'completed' ? 'Completed' : 'Pending'}
                    color={batch.status === 'completed' ? 'success' : 'warning'}
                      size="small" 
                    />
                </TableCell>
                <TableCell>
                  <IconButton size="small" color="primary" onClick={() => handleEditItem(batch)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDeleteItem(batch.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Box Manufacturing Dialog */}
      <Dialog open={boxDialogOpen} onClose={handleBoxDialogClose} fullWidth maxWidth="md">
        <DialogTitle>
          Create New Box Type
        </DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ mt: 2, mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {/* Step 1: Select Box Type */}
          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Select Box Type
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                Choose a base box type. This will be used as a template for your custom box configuration.
              </Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel>Box Type</InputLabel>
                <Select
                  name="boxType"
                  value={boxData.boxType}
                  onChange={handleBoxTypeChange}
                  label="Box Type"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300
                      }
                    }
                  }}
                >
                  {boxTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id} style={{ whiteSpace: 'normal' }}>
                      {type.name} - {type.description}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
          
          {/* Step 2: Configure Capacity */}
          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Configure Box Capacity
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                Set the capacity for this box type and whether bonus chicks can be added.
              </Typography>
              
              <TextField
                name="boxCapacity"
                label="How many chicks can fit in the box?"
                type="number"
                value={boxData.boxCapacity}
                onChange={handleBoxDataChange}
                fullWidth
                margin="normal"
              />
              
              <FormControl fullWidth margin="normal">
                <Typography variant="body2" gutterBottom>
                  Can bonus chicks fit in the box?
                </Typography>
                <Grid container alignItems="center">
                  <Grid item>
                    <input
                      type="checkbox"
                      name="hasBonusCapacity"
                      checked={boxData.hasBonusCapacity}
                      onChange={handleBoxDataChange}
                      id="bonus-checkbox"
                    />
                  </Grid>
                  <Grid item>
                    <Typography component="label" htmlFor="bonus-checkbox" sx={{ ml: 1 }}>
                      Yes, bonus chicks can fit
                    </Typography>
                  </Grid>
                </Grid>
              </FormControl>
              
              {boxData.hasBonusCapacity && (
                <TextField
                  name="bonusCapacity"
                  label="How many bonus chicks can fit?"
                  type="number"
                  value={boxData.bonusCapacity}
                  onChange={handleBoxDataChange}
                  fullWidth
                  margin="normal"
                />
              )}
            </Box>
          )}
          
          {/* Step 3: Summary */}
          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Box Configuration Summary
              </Typography>
              
              <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Box Type
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {boxTypes.find(type => type.id === boxData.boxType)?.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Base Capacity
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {boxData.boxCapacity} chicks
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Bonus Capacity
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {boxData.hasBonusCapacity ? `${boxData.bonusCapacity} chicks` : 'Not applicable'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Total Capacity
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {boxData.totalCapacity} chicks
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                This box configuration will be available for use in the Packaging section below.
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleBoxDialogClose}>Cancel</Button>
          {activeStep > 0 && (
            <Button onClick={handleBackStep}>Back</Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button 
              onClick={handleNextStep}
              variant="contained" 
              color="primary"
              disabled={activeStep === 0 && !boxData.boxType}
            >
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleFinishBoxSetup}
              variant="contained" 
              color="primary"
            >
              Finish
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Add/Edit Packaging Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>
          {isEditing ? 'Edit Packaging Batch' : 'Add New Packaging Batch'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                name="batchId"
                label="Batch ID"
                value={currentBatch.batchId}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled={true}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="label"
                label="Label"
                value={currentBatch.label}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled={true}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="packagingDate"
                label="Packaging Date"
                type="date"
                value={currentBatch.packagingDate}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Hatch Batch</InputLabel>
                <Select
                  name="hatchBatchId"
                  value={currentBatch.hatchBatchId}
                  onChange={handleChange}
                  label="Hatch Batch"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300
                      }
                    }
                  }}
                >
                  {hatchBatches
                    .filter(batch => batch.status === 'completed')
                    .map((batch) => (
                      <MenuItem key={batch.id} value={batch.id} style={{ whiteSpace: 'normal' }}>
                        {batch.id} - {batch.date} - {batch.typeOfChicks} ({batch.quantity} chicks)
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="typeOfChicks"
                label="Type of Chicks"
                value={currentBatch.typeOfChicks}
                disabled
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Box Type</InputLabel>
                <Select
                  name="boxType"
                  value={currentBatch.boxType}
                  onChange={handleChange}
                  label="Box Type"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300
                      }
                    }
                  }}
                >
                  {manufacturedBoxes.length > 0 ? (
                    manufacturedBoxes.map((box, index) => (
                      <MenuItem key={`manufactured-${index}`} value={box.boxType} style={{ whiteSpace: 'normal' }}>
                        {boxTypes.find(type => type.id === box.boxType)?.name} - Custom (Capacity: {box.totalCapacity})
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled style={{ whiteSpace: 'normal' }}>
                      <em>No box types available - please create one in Box Manufacturing</em>
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
            
            {currentBatch.boxType && (
              <Grid item xs={12} md={6}>
                <TextField
                  label="Box Capacity"
                  value={(() => {
                    const manufacturedBox = manufacturedBoxes.find(box => box.boxType === currentBatch.boxType);
                    const boxType = boxTypes.find(type => type.id === currentBatch.boxType);
                    
                    if (manufacturedBox) {
                      return `${manufacturedBox.totalCapacity} chicks per box`;
                    } else if (boxType) {
                      return `${boxType.defaultCapacity} chicks per box`;
                    } else {
                      return 'Unknown capacity';
                    }
                  })()}
                  disabled
                  fullWidth
                  margin="normal"
                />
              </Grid>
            )}
            
            <Grid item xs={12} md={4}>
              <TextField
                name="fullBoxes"
                label="Full Boxes"
                type="number"
                value={currentBatch.fullBoxes}
                disabled
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                name="unfullBoxes"
                label="Unfull Boxes"
                type="number"
                value={currentBatch.unfullBoxes}
                disabled
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                name="unfullBoxCount"
                label="Unfull Box Count"
                type="number"
                value={currentBatch.unfullBoxCount}
                disabled
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                name="chicksPacked"
                label="Chicks Packed"
                type="number"
                value={currentBatch.chicksPacked}
                disabled
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={currentBatch.status}
                  onChange={handleChange}
                  label="Status"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300
                      }
                    }
                  }}
                >
                  <MenuItem value="pending" style={{ whiteSpace: 'normal' }}>Pending</MenuItem>
                  <MenuItem value="completed" style={{ whiteSpace: 'normal' }}>Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="notes"
                label="Notes"
                multiline
                rows={3}
                value={currentBatch.notes}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 