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
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  useTheme,
  Tooltip,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  WarningAmber as WarningIcon,
  CalendarMonth as CalendarIcon,
  Egg as EggIcon,
  FilterNone as FilterNoneIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { alpha, Theme } from '@mui/material/styles';

// Interface for egg collection data
interface EggCollectionEntry {
  id: number;
  farmerName: string;
  label: string;
  animalType: string;
  typeOfEggs: string;
  fullTrays: number;
  unfullTrays: number;
  unfullTrayCount: number;
  damagedEggs: number;
  date: string;
}

// List of poultry animals with hatching period
const poultryAnimals = [
  { name: "Chicken", hatchingDays: 21 }
];

// Initial sample data
const initialEntries: EggCollectionEntry[] = [
  {
    id: 1,
    farmerName: "Kikulwe",
    label: "II",
    animalType: "Chicken",
    typeOfEggs: "Broiler eggs",
    fullTrays: 34,
    unfullTrays: 1,
    unfullTrayCount: 22,
    damagedEggs: 3,
    date: "2023-10-15"
  },
  {
    id: 2,
    farmerName: "Namayanja",
    label: "III",
    animalType: "Chicken",
    typeOfEggs: "Layer eggs",
    fullTrays: 59,
    unfullTrays: 1,
    unfullTrayCount: 48,
    damagedEggs: 5,
    date: "2023-10-16"
  },
  {
    id: 3,
    farmerName: "Mukasa",
    label: "I",
    animalType: "Chicken",
    typeOfEggs: "Broiler eggs",
    fullTrays: 44,
    unfullTrays: 1,
    unfullTrayCount: 26,
    damagedEggs: 2,
    date: "2023-10-17"
  },
  {
    id: 4,
    farmerName: "Ssebowa",
    label: "IV",
    animalType: "Chicken",
    typeOfEggs: "Layer eggs",
    fullTrays: 45,
    unfullTrays: 1,
    unfullTrayCount: 31,
    damagedEggs: 4,
    date: "2023-10-18"
  }
];

// Form validation errors interface
interface FormErrors {
  farmerName?: string;
  label?: string;
  animalType?: string;
  typeOfEggs?: string;
  fullTrays?: string;
  unfullTrays?: string;
  unfullTrayCount?: string;
  damagedEggs?: string;
}

export default function EggCollection() {
  const theme = useTheme();
  const [entries, setEntries] = useState<EggCollectionEntry[]>(initialEntries);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<number | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  
  // Initial form state
  const emptyForm: EggCollectionEntry = {
    id: 0,
    farmerName: "",
    label: "",
    animalType: "",
    typeOfEggs: "",
    fullTrays: null as unknown as number,
    unfullTrays: null as unknown as number,
    unfullTrayCount: null as unknown as number,
    damagedEggs: null as unknown as number,
    date: new Date().toISOString().split('T')[0]
  };
  
  const [formData, setFormData] = useState<EggCollectionEntry>(emptyForm);

  // Form validation function
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    if (!formData.farmerName.trim()) {
      errors.farmerName = "Farmer Name is required";
      isValid = false;
    }

    if (!formData.label.trim()) {
      errors.label = "Label is required";
      isValid = false;
    }

    if (!formData.animalType) {
      errors.animalType = "Animal Type is required";
      isValid = false;
    }

    if (!formData.typeOfEggs.trim()) {
      errors.typeOfEggs = "Type of Eggs is required";
      isValid = false;
    }

    if (formData.fullTrays === null || formData.fullTrays < 0) {
      errors.fullTrays = "Must be a non-negative number";
      isValid = false;
    }

    if (formData.unfullTrays === null || formData.unfullTrays < 0) {
      errors.unfullTrays = "Must be a non-negative number";
      isValid = false;
    }

    if (formData.unfullTrayCount === null || formData.unfullTrayCount < 0) {
      errors.unfullTrayCount = "Must be a non-negative number";
      isValid = false;
    }

    if (formData.damagedEggs === null || formData.damagedEggs < 0) {
      errors.damagedEggs = "Must be a non-negative number";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Calculate totals for the table footer
  const calculateTotals = () => {
    return entries.reduce(
      (totals, entry) => {
        return {
          fullTrays: totals.fullTrays + entry.fullTrays,
          unfullTrays: totals.unfullTrays + entry.unfullTrays,
          unfullTrayCount: totals.unfullTrayCount + entry.unfullTrayCount,
          damagedEggs: totals.damagedEggs + entry.damagedEggs,
          totalEggs: totals.totalEggs + calculateTotalEggs(entry)
        };
      },
      { fullTrays: 0, unfullTrays: 0, unfullTrayCount: 0, damagedEggs: 0, totalEggs: 0 }
    );
  };

  // Calculate total eggs for a single entry
  const calculateTotalEggs = (entry: EggCollectionEntry): number => {
    // Full trays (30 eggs each) + unfull tray count - damaged eggs
    const fullTraysCount = (entry.fullTrays || 0) * 30;
    const unfullCount = entry.unfullTrayCount || 0;
    const damagedCount = entry.damagedEggs || 0;
    return fullTraysCount + unfullCount - damagedCount;
  };

  const totals = calculateTotals();

  // Open dialog to add new entry
  const handleAddNew = () => {
    setFormData({
      ...emptyForm,
      id: entries.length > 0 ? Math.max(...entries.map(entry => entry.id)) + 1 : 1,
      date: new Date().toISOString().split('T')[0],
      animalType: "Chicken"
    });
    setIsEditing(false);
    setFormErrors({});
    setDialogOpen(true);
  };

  // Open edit dialog for existing entry
  const handleEdit = (entry: EggCollectionEntry) => {
    setFormData({ ...entry });
    setIsEditing(true);
    setFormErrors({});
    setDialogOpen(true);
  };

  // Open delete confirmation dialog
  const handleDeleteConfirm = (id: number) => {
    setEntryToDelete(id);
    setConfirmDeleteOpen(true);
  };

  // Delete an entry
  const handleDelete = () => {
    if (entryToDelete !== null) {
      setEntries(entries.filter(entry => entry.id !== entryToDelete));
      setConfirmDeleteOpen(false);
      setEntryToDelete(null);
    }
  };

  // Handle input changes in the form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    
    if (name) {
      let newValue: string | number | null = value as string;
      
      // Convert string values to numbers for numeric fields
      if (['fullTrays', 'unfullTrays', 'unfullTrayCount', 'damagedEggs'].includes(name)) {
        newValue = value === '' ? null : Number(value);
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: newValue
      }));
    }
  };

  // Save the form data (add new or update existing)
  const handleSave = () => {
    if (validateForm()) {
      if (isEditing) {
        setEntries(entries.map(entry => 
          entry.id === formData.id ? formData : entry
        ));
      } else {
        setEntries([...entries, formData]);
      }
      setDialogOpen(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header Section with improved design */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 2,
          background: (theme: Theme) => `linear-gradient(90deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.light, 0.1)} 100%)`,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2
        }}>
    <Box>
            <Typography variant="h4" component="h1" fontWeight={700} color="primary.main">
        Egg Collection
      </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              Manage and track egg collection records
              </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
            sx={{ 
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 600,
              boxShadow: 2
            }}
          >
            Add New Collection
          </Button>
        </Box>

        {/* Stats/Summary Box */}
        <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Chip 
            icon={<EggIcon />} 
            label={`Total Eggs: ${totals.totalEggs}`} 
            color="primary" 
            variant="outlined"
            sx={{ fontWeight: 500, px: 1 }}
          />
          <Chip 
            icon={<FilterNoneIcon />} 
            label={`Total Full Trays: ${totals.fullTrays}`} 
            color="primary" 
            variant="outlined" 
            sx={{ fontWeight: 500, px: 1 }}
          />
          <Chip 
            icon={<InfoIcon />} 
            label={`Total Damaged: ${totals.damagedEggs}`} 
            color={totals.damagedEggs > 0 ? "warning" : "success"} 
            variant="outlined"
            sx={{ fontWeight: 500, px: 1 }}
          />
        </Box>
      </Paper>

      {/* Enhanced Table Design */}
      <Paper sx={{ 
        width: '100%', 
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        borderRadius: 2,
        mb: 4,
        border: '1px solid',
        borderColor: 'divider'
      }}>
        <Box sx={{ 
          p: 2, 
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.03),
          display: 'flex',
          alignItems: 'center'
        }}>
          <CalendarIcon color="primary" sx={{ mr: 1.5 }} />
          <Typography variant="subtitle1" fontWeight={600}>
            Collection Records
          </Typography>
        </Box>
        <TableContainer sx={{ maxHeight: 650 }}>
          <Table stickyHeader>
          <TableHead>
            <TableRow>
                <TableCell 
                  sx={{ 
                    fontWeight: 700, 
                    backgroundColor: (theme as Theme).palette.primary.main, 
                    color: 'white',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Date
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 700, 
                    backgroundColor: (theme as Theme).palette.primary.main, 
                    color: 'white' 
                  }}
                >
                  Farmer Name
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 700, 
                    backgroundColor: (theme as Theme).palette.primary.main, 
                    color: 'white' 
                  }}
                >
                  Label
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 700, 
                    backgroundColor: (theme as Theme).palette.primary.main, 
                    color: 'white' 
                  }}
                >
                  Animal Type
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 700, 
                    backgroundColor: (theme as Theme).palette.primary.main, 
                    color: 'white' 
                  }}
                >
                  Type of Eggs
                </TableCell>
                <TableCell 
                  align="right" 
                  sx={{ 
                    fontWeight: 700, 
                    backgroundColor: (theme as Theme).palette.primary.main, 
                    color: 'white',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Full Trays
                </TableCell>
                <TableCell 
                  align="right" 
                  sx={{ 
                    fontWeight: 700, 
                    backgroundColor: (theme as Theme).palette.primary.main, 
                    color: 'white',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Unfull Trays
                </TableCell>
                <TableCell 
                  align="right" 
                  sx={{ 
                    fontWeight: 700, 
                    backgroundColor: (theme as Theme).palette.primary.main, 
                    color: 'white',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Unfull Count
                </TableCell>
                <TableCell 
                  align="right" 
                  sx={{ 
                    fontWeight: 700, 
                    backgroundColor: (theme as Theme).palette.primary.main, 
                    color: 'white',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Damaged
                </TableCell>
                <TableCell 
                  align="right" 
                  sx={{ 
                    fontWeight: 700, 
                    backgroundColor: (theme as Theme).palette.primary.main, 
                    color: 'white',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Total Eggs
                </TableCell>
                <TableCell 
                  align="center" 
                  sx={{ 
                    fontWeight: 700, 
                    backgroundColor: (theme as Theme).palette.primary.main, 
                    color: 'white' 
                  }}
                >
                  Actions
                </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              {entries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" color="text.secondary">
                      No collection records found. Add your first record.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {entries.map((entry) => (
                    <TableRow 
                      key={entry.id} 
                      hover
                      sx={{
                        '&:nth-of-type(odd)': {
                          backgroundColor: (theme: Theme) => alpha(theme.palette.primary.light, 0.03),
                        },
                        '&:hover': {
                          backgroundColor: (theme: Theme) => alpha(theme.palette.primary.light, 0.05),
                        }
                      }}
                    >
                      <TableCell 
                        sx={{ 
                          whiteSpace: 'nowrap',
                          borderLeft: '4px solid',
                          borderColor: 'primary.main',
                        }}
                      >
                        {entry.date}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{entry.farmerName}</TableCell>
                      <TableCell>{entry.label}</TableCell>
                      <TableCell>{entry.animalType}</TableCell>
                      <TableCell>{entry.typeOfEggs}</TableCell>
                      <TableCell align="right">{entry.fullTrays}</TableCell>
                      <TableCell align="right">{entry.unfullTrays}</TableCell>
                      <TableCell align="right">{entry.unfullTrayCount}</TableCell>
                      <TableCell 
                        align="right"
                        sx={{
                          color: entry.damagedEggs > 0 ? 'warning.main' : 'inherit'
                        }}
                      >
                        {entry.damagedEggs}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        {calculateTotalEggs(entry)}
                      </TableCell>
                <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Tooltip title="Edit collection">
                            <IconButton 
                              size="small" 
                              color="primary" 
                              onClick={() => handleEdit(entry)}
                              sx={{ 
                                mx: 0.5,
                                '&:hover': { backgroundColor: (theme: Theme) => alpha(theme.palette.primary.main, 0.1) }
                              }}
                            >
                              <EditIcon fontSize="small" />
                  </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete collection">
                            <IconButton 
                              size="small" 
                              color="error" 
                              onClick={() => handleDeleteConfirm(entry.id)}
                              sx={{ 
                                mx: 0.5,
                                '&:hover': { backgroundColor: (theme: Theme) => alpha(theme.palette.error.main, 0.1) }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                  </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
              {/* Enhanced Total row */}
              <TableRow sx={{ 
                backgroundColor: (theme: Theme) => alpha(theme.palette.primary.main, 0.08),
                '&:hover': {
                  backgroundColor: (theme: Theme) => alpha(theme.palette.primary.main, 0.12),
                }
              }}>
                <TableCell 
                  colSpan={5} 
                  sx={{ 
                    fontWeight: 700, 
                    fontSize: '1rem',
                    borderLeft: '4px solid',
                    borderColor: 'primary.dark',
                  }}
                >
                  TOTAL
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>{totals.fullTrays}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>{totals.unfullTrays}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>{totals.unfullTrayCount}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>{totals.damagedEggs}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.dark', fontSize: '1rem' }}>
                  {totals.totalEggs}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      </Paper>

      {/* Enhanced Dialog Design */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          elevation: 8,
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ 
          fontSize: '1.5rem', 
          fontWeight: 700, 
          color: 'primary.main',
          borderBottom: '1px solid',
          borderColor: 'divider',
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5
        }}>
          <EggIcon color="primary" />
          {isEditing ? 'Edit Egg Collection' : 'Add New Egg Collection'}
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 3 }}>
          {/* Form Title and Instructions */}
          <Box 
            sx={{ 
              mb: 4,
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <Typography variant="h6" color="primary" fontWeight={600}>
              {isEditing ? 'Update Egg Collection Details' : 'New Egg Collection Entry'}
            </Typography>
            <Box 
              sx={{ 
                p: 2, 
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
                  Instructions:
                </Typography>
                <Typography variant="body2">
                  Fill in the required information for egg collection. All fields marked with * are required.
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Grid container spacing={3}>
            {/* Section 1: Collection Details */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} color="primary" gutterBottom>
                1. Collection Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="date"
                    label="Collection Date *"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 1,
                        bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.05)
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="farmerName"
                    label="Farmer Name *"
                    value={formData.farmerName}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    error={!!formErrors.farmerName}
                    helperText={formErrors.farmerName}
                    placeholder="e.g. Kikulwe"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 1
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Section 2: Source Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} color="primary" gutterBottom>
                2. Source Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="label"
                    label="Label/House ID *"
                    value={formData.label}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    error={!!formErrors.label}
                    helperText={formErrors.label || "Identifier for the pen/house"}
                    placeholder="e.g. II"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 1,
                        bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.05)
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl 
                    fullWidth 
                    required
                    error={!!formErrors.animalType}
                  >
                    <InputLabel id="animal-type-label">Animal Type *</InputLabel>
                    <Select
                      labelId="animal-type-label"
                      id="animal-type"
                      name="animalType"
                      value={formData.animalType}
                      onChange={handleInputChange}
                      label="Animal Type *"
                      sx={{ 
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: 1,
                          bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.05)
                        }
                      }}
                    >
                      {poultryAnimals.map((animal) => (
                        <MenuItem key={animal.name} value={animal.name}>
                          {animal.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="typeOfEggs"
                    label="Type of Eggs *"
                    value={formData.typeOfEggs}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    error={!!formErrors.typeOfEggs}
                    helperText={formErrors.typeOfEggs}
                    placeholder="e.g. Broiler eggs"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 1
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Section 3: Egg Count Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} color="primary" gutterBottom>
                3. Egg Count Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="fullTrays"
                    label="Full Trays *"
                    type="number"
                    value={formData.fullTrays === null ? '' : formData.fullTrays}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    error={!!formErrors.fullTrays}
                    helperText={formErrors.fullTrays || "Number of complete trays (30 eggs each)"}
                    InputProps={{ inputProps: { min: 0 } }}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 1
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="unfullTrays"
                    label="Unfull Trays"
                    type="number"
                    value={formData.unfullTrays === null ? '' : formData.unfullTrays}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.unfullTrays}
                    helperText={formErrors.unfullTrays || "Number of incomplete trays"}
                    InputProps={{ inputProps: { min: 0 } }}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 1
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="unfullTrayCount"
                    label="Eggs in Unfull Trays"
                    type="number"
                    value={formData.unfullTrayCount === null ? '' : formData.unfullTrayCount}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.unfullTrayCount}
                    helperText={formErrors.unfullTrayCount || "Total eggs in incomplete trays"}
                    InputProps={{ inputProps: { min: 0 } }}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 1
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="damagedEggs"
                    label="Damaged Eggs"
                    type="number"
                    value={formData.damagedEggs === null ? '' : formData.damagedEggs}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.damagedEggs}
                    helperText={formErrors.damagedEggs || "Number of damaged/broken eggs"}
                    InputProps={{ inputProps: { min: 0 } }}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 1
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Total Eggs Summary */}
            <Grid item xs={12}>
              <Box 
                sx={{ 
                  mt: 2,
                  p: 2, 
                  bgcolor: (theme: Theme) => alpha(theme.palette.success.light, 0.1),
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'success.light',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Typography variant="subtitle1" color="success.main" fontWeight={600}>
                  Total Eggs:
                </Typography>
                <Typography variant="h6" color="success.main" fontWeight={700}>
                  {(formData.fullTrays * 30) + formData.unfullTrayCount - formData.damagedEggs}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2.5, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button 
            onClick={() => setDialogOpen(false)}
            variant="outlined"
            color="inherit"
            sx={{ 
              mr: 1,
              px: 3,
              borderRadius: 1,
              textTransform: 'none',
              fontSize: '0.95rem'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            variant="contained"
            color="primary"
            sx={{ 
              px: 4,
              borderRadius: 1,
              textTransform: 'none',
              fontSize: '0.95rem',
              fontWeight: 600
            }}
          >
            {isEditing ? 'Update Collection' : 'Save Collection'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Delete Confirmation Dialog */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        PaperProps={{
          elevation: 8,
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5,
          color: 'error.main',
          borderBottom: '1px solid',
          borderColor: 'divider',
          px: 3,
          py: 2
        }}>
          <WarningIcon color="error" />
          Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ p: 3, minWidth: 400 }}>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Are you sure you want to delete this egg collection record? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider', gap: 1 }}>
          <Button 
            onClick={() => setConfirmDeleteOpen(false)} 
            color="inherit"
            variant="outlined"
            sx={{ borderRadius: 1.5, px: 3 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            autoFocus
            sx={{ borderRadius: 1.5, px: 3 }}
          >
            Delete Record
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}