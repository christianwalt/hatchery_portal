import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Chip,
  Tooltip,
  Alert,
  Divider,
  useTheme,
  Stack,
  CircularProgress,
  Autocomplete
} from '@mui/material';
import { alpha, Theme } from '@mui/material/styles';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  CalendarMonth as CalendarIcon,
  Egg as EggIcon,
  Add as AddIcon
} from '@mui/icons-material';

// Import the EggCollectionEntry type from EggCollection for integration
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

// Interface for egg setting data
interface EggSettingEntry {
  id: number;
  batchId: string;
  settingDate: string;
  collectionIds: number[];  // IDs of egg collections used
  typeOfEggs: string;
  fullSetters: number;
  unfullSetters: number;
  unfullSetterEggs: number;
  eggsSet: number;
  dirtyEggs: number;
  damageEggs: number;
  rejectEggs: number;
  cumulativeRejectEggs: number;
  notes: string;
}

// Sample data for egg collection (in a real app, this would come from an API or context)
const sampleEggCollections: EggCollectionEntry[] = [
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

// Sample initial egg setting data
const initialSettings: EggSettingEntry[] = [
  {
    id: 1,
    batchId: 'B9201',
    settingDate: '2023-10-16',
    collectionIds: [1],
    typeOfEggs: 'Broiler eggs',
    fullSetters: 10,
    unfullSetters: 1,
    unfullSetterEggs: 45,
    eggsSet: 1065,
    dirtyEggs: 5,
    damageEggs: 3,
    rejectEggs: 8,
    cumulativeRejectEggs: 8,
    notes: 'First setting of the month'
  },
  {
    id: 2,
    batchId: 'A9831',
    settingDate: '2023-10-17',
    collectionIds: [2],
    typeOfEggs: 'Layer eggs',
    fullSetters: 16,
    unfullSetters: 1,
    unfullSetterEggs: 78,
    eggsSet: 1710,
    dirtyEggs: 10,
    damageEggs: 5,
    rejectEggs: 15,
    cumulativeRejectEggs: 23,
    notes: 'Higher quality eggs'
  }
];

// Incubator list for dropdown
const incubators = [
  { id: 'INC-01', name: 'Incubator 1', capacity: 600 },
  { id: 'INC-02', name: 'Incubator 2', capacity: 600 },
  { id: 'INC-03', name: 'Incubator 3', capacity: 600 },
  { id: 'INC-04', name: 'Incubator 4', capacity: 600 },
];

// Flock sources for dropdown
const flocks = ['Flock A', 'Flock B', 'Flock C', 'Flock D'];

// Interface for setting form data
interface SettingFormData {
  id: number;
  batchId: string;
  settingDate: string;
  quantity: number;
  incubatorId: string;
  expectedHatchDate: string;
  flockSource: string;
  notes: string;
}

// Helper function to generate a random batch ID
function generateBatchId(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomLetter = letters[Math.floor(Math.random() * letters.length)];
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  return `${randomLetter}${randomNumber}`;
}

// Helper function to calculate total eggs from a collection
function calculateTotalEggs(entry: EggCollectionEntry): number {
  return (entry.fullTrays * 30) + entry.unfullTrayCount - entry.damagedEggs;
}

// Helper function to calculate total eggs available for setting
function getAvailableEggsFromCollections(collections: EggCollectionEntry[], usedCollectionIds: number[] = []): number {
  return collections
    .filter(collection => !usedCollectionIds.includes(collection.id))
    .reduce((sum, collection) => sum + calculateTotalEggs(collection), 0);
}

export default function EggSetting() {
  const theme = useTheme();

  // State for egg settings and form
  const [settings, setSettings] = useState<EggSettingEntry[]>(initialSettings);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // State for available egg collections
  const [eggCollections, setEggCollections] = useState<EggCollectionEntry[]>(sampleEggCollections);
  const [selectedCollections, setSelectedCollections] = useState<EggCollectionEntry[]>([]);
  
  // Combined list of all collection IDs that are already assigned to egg settings
  const usedCollectionIds = settings.flatMap(setting => setting.collectionIds);
  
  // State for the current item being edited
  const [formData, setFormData] = useState<EggSettingEntry>({
    id: 0,
    batchId: generateBatchId(),
    settingDate: new Date().toISOString().split('T')[0],
    collectionIds: [],
    typeOfEggs: '',
    fullSetters: 0,
    unfullSetters: 0,
    unfullSetterEggs: 0,
    eggsSet: 0,
    dirtyEggs: 0,
    damageEggs: 0,
    rejectEggs: 0,
    cumulativeRejectEggs: 0,
    notes: ''
  });

  // Form validation state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Effect to reset form errors when dialog closes
  useEffect(() => {
    if (!dialogOpen) {
      setFormErrors({});
    }
  }, [dialogOpen]);

  // Calculate stats
  const totalEggsSet = settings.reduce((sum, item) => sum + item.eggsSet, 0);
  const totalCumulativeRejects = settings.length > 0 
    ? settings[settings.length - 1].cumulativeRejectEggs 
    : 0;
  const availableEggsForSetting = getAvailableEggsFromCollections(eggCollections, usedCollectionIds);

  // Handle edit of an egg setting
  const handleEdit = (item: EggSettingEntry) => {
    // Find the collections associated with this setting
    const itemCollections = eggCollections.filter(collection => 
      item.collectionIds.includes(collection.id)
    );
    
    setFormData({ ...item });
    setSelectedCollections(itemCollections);
    setDialogOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (id: number) => {
    setCurrentItemId(id);
    setDeleteDialogOpen(true);
  };

  // Delete an egg setting
  const handleDelete = () => {
    if (currentItemId !== null) {
      setSettings(settings.filter(item => item.id !== currentItemId));
      setDeleteDialogOpen(false);
      setCurrentItemId(null);
    }
  };

  // Validate the form before saving
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (selectedCollections.length === 0) {
      errors.collections = "Must select at least one collection";
      isValid = false;
    }

    if (!formData.typeOfEggs) {
      errors.typeOfEggs = "Type of eggs is required";
      isValid = false;
    }

    // No need to validate setter fields as they're auto-calculated now
    
    // Validate that reject fields are non-negative
    if (formData.dirtyEggs < 0) {
      errors.dirtyEggs = "Must be a non-negative number";
      isValid = false;
    }

    if (formData.damageEggs < 0) {
      errors.damageEggs = "Must be a non-negative number";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Handle input changes in the form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    
    if (name) {
      let newValue: any = value;
      
      // Convert string values to numbers for numeric fields
      if ([
        'fullSetters', 
        'unfullSetters', 
        'unfullSetterEggs', 
        'dirtyEggs', 
        'damageEggs', 
        'rejectEggs'
      ].includes(name)) {
        newValue = value === '' ? 0 : Number(value);
      }
      
      setFormData(prev => {
        const updated = { ...prev, [name]: newValue };
        
        // Auto-calculate eggs set when fullSetters or unfullSetterEggs changes
        if (name === 'fullSetters' || name === 'unfullSetterEggs') {
          updated.eggsSet = (updated.fullSetters * 102) + updated.unfullSetterEggs;
        }
        
        // Auto-calculate cumulative reject eggs
        if (name === 'rejectEggs' || name === 'dirtyEggs' || name === 'damageEggs') {
          updated.rejectEggs = updated.dirtyEggs + updated.damageEggs;
          
          // Get the previous setting's cumulative rejects
          const prevCumulativeRejects = settings.length > 0 && updated.id !== settings[0].id
            ? settings.find(s => s.id < updated.id)?.cumulativeRejectEggs || 0
            : 0;
            
          updated.cumulativeRejectEggs = prevCumulativeRejects + updated.rejectEggs;
        }
        
        return updated;
      });
    }
  };

  // Handle collection selection changes
  const handleCollectionChange = (_event: React.SyntheticEvent, newValues: EggCollectionEntry[]) => {
    setSelectedCollections(newValues);
    
    // Calculate total eggs from selected collections
    const totalEggsAvailable = newValues.reduce(
      (sum, collection) => sum + calculateTotalEggs(collection), 
      0
    );
    
    // Calculate how many full setters (102 eggs per setter)
    const fullSettersCount = Math.floor(totalEggsAvailable / 102);
    
    // Calculate remaining eggs for unfull setters
    const remainingEggs = totalEggsAvailable % 102;
    
    // Set unfull setters to 1 if there are remaining eggs, otherwise 0
    const unfullSettersCount = remainingEggs > 0 ? 1 : 0;
    
    // Update the form data with calculated values
    setFormData(prev => ({
      ...prev,
      collectionIds: newValues.map(collection => collection.id),
      // Use type from first collection if not already set
      typeOfEggs: prev.typeOfEggs || (newValues.length > 0 ? newValues[0].typeOfEggs : ''),
      // Set the calculated values
      fullSetters: fullSettersCount,
      unfullSetters: unfullSettersCount,
      unfullSetterEggs: remainingEggs,
      // Calculate total eggs set
      eggsSet: (fullSettersCount * 102) + remainingEggs
    }));
  };

  // Save the egg setting
  const handleSave = () => {
    if (validateForm()) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        if (formData.id === 0) {
          // This is a new entry
          const newItem: EggSettingEntry = {
            ...formData,
            id: settings.length > 0 ? Math.max(...settings.map(s => s.id)) + 1 : 1,
            collectionIds: selectedCollections.map(c => c.id),
            // Calculate reject eggs
            rejectEggs: formData.dirtyEggs + formData.damageEggs,
            // Update cumulative rejects based on previous settings
            cumulativeRejectEggs: (settings.length > 0 
              ? settings[settings.length - 1].cumulativeRejectEggs 
              : 0) + formData.dirtyEggs + formData.damageEggs
          };
          
          setSettings([...settings, newItem]);
        } else {
          // This is an edit
          const updatedSettings = settings.map(setting => {
            if (setting.id === formData.id) {
              return {
                ...formData,
                collectionIds: selectedCollections.map(c => c.id),
                // Recalculate reject eggs
                rejectEggs: formData.dirtyEggs + formData.damageEggs,
              };
            }
            return setting;
          });
          
          // Recalculate cumulative rejects for all settings after this one
          const recalculatedSettings = updatedSettings.sort((a, b) => a.id - b.id)
            .map((setting, index, array) => {
              if (index === 0) {
                return { ...setting, cumulativeRejectEggs: setting.rejectEggs };
              } else {
                return { 
                  ...setting, 
                  cumulativeRejectEggs: array[index - 1].cumulativeRejectEggs + setting.rejectEggs 
                };
              }
            });
          
          setSettings(recalculatedSettings);
        }
        
        setIsLoading(false);
        setDialogOpen(false);
      }, 500);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight={600} color="primary.main" gutterBottom>
        Egg Setting
      </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage eggs transferred from collection to setters
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            elevation={0}
            sx={{ 
              p: 2, 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              bgcolor: theme => alpha(theme.palette.success.main, 0.05)
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EggIcon sx={{ color: 'success.main', mr: 1 }} />
                <Typography variant="h6" color="success.main">
                Total Eggs Set
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {totalEggsSet.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                From {settings.length} batches
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            elevation={0}
            sx={{ 
              p: 2, 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              bgcolor: theme => alpha(theme.palette.primary.main, 0.05) 
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <InfoIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" color="primary.main">
                  Eggs Available
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {availableEggsForSetting.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Ready for setting from collection
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            elevation={0}
            sx={{ 
              p: 2, 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              bgcolor: theme => alpha(theme.palette.warning.main, 0.05) 
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <WarningIcon sx={{ color: 'warning.main', mr: 1 }} />
                <Typography variant="h6" color="warning.main">
                  Cumulative Rejects
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {totalCumulativeRejects.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Total rejected eggs to date
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Table Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          borderRadius: 2, 
          overflow: 'hidden', 
          border: '1px solid', 
          borderColor: 'divider',
          mb: 4
        }}
      >
        <Box sx={{ 
          p: 2, 
          bgcolor: theme => alpha(theme.palette.primary.main, 0.05),
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarIcon color="primary" sx={{ mr: 1.5 }} />
            <Typography variant="h6" fontWeight={600}>
              Egg Setting Records
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              setFormData({
                id: 0,
                batchId: generateBatchId(),
                settingDate: new Date().toISOString().split('T')[0],
                collectionIds: [],
                typeOfEggs: '',
                fullSetters: 0,
                unfullSetters: 0,
                unfullSetterEggs: 0,
                eggsSet: 0,
                dirtyEggs: 0,
                damageEggs: 0,
                rejectEggs: 0,
                cumulativeRejectEggs: 0,
                notes: ''
              });
              setSelectedCollections([]);
              setDialogOpen(true);
            }}
            sx={{ 
              borderRadius: 1.5,
              px: 3,
              py: 1,
              fontWeight: 600
            }}
          >
            Add New Setting
          </Button>
        </Box>
        
        {settings.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No egg setting records found.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Click the "Add New Setting" button to start setting eggs from the available collection records.
            </Typography>
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
          <TableHead>
            <TableRow>
                  <TableCell sx={{ fontWeight: 700, bgcolor: theme.palette.primary.main, color: 'white' }}>
                    Batch ID
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: theme.palette.primary.main, color: 'white' }}>
                    Setting Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: theme.palette.primary.main, color: 'white' }}>
                    Labels
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: theme.palette.primary.main, color: 'white' }}>
                    Type of Eggs
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, bgcolor: theme.palette.primary.main, color: 'white' }}>
                    Full Setters
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, bgcolor: theme.palette.primary.main, color: 'white' }}>
                    Unfull Setters
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, bgcolor: theme.palette.primary.main, color: 'white' }}>
                    Unfull Eggs
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, bgcolor: theme.palette.primary.main, color: 'white' }}>
                    Eggs Set
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, bgcolor: theme.palette.primary.main, color: 'white' }}>
                    Reject Eggs
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, bgcolor: theme.palette.primary.main, color: 'white' }}>
                    Cumulative Reject
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, bgcolor: theme.palette.primary.main, color: 'white' }}>
                    Actions
                  </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
                {settings.map((setting, index) => {
                  // Get collection labels for this setting
                  const sourceLabels = eggCollections
                    .filter(collection => setting.collectionIds.includes(collection.id))
                    .map(collection => collection.label)
                    .join(", ");

                  return (
                    <TableRow 
                      key={setting.id} 
                      hover
                      sx={{
                        '&:nth-of-type(odd)': {
                          backgroundColor: theme => alpha(theme.palette.primary.light, 0.03),
                        }
                      }}
                    >
                      <TableCell 
                        sx={{ 
                          fontWeight: 600, 
                          color: 'primary.main', 
                          borderLeft: '4px solid', 
                          borderColor: 'primary.main',
                        }}
                      >
                        {setting.batchId}
                      </TableCell>
                <TableCell>{setting.settingDate}</TableCell>
                      <TableCell>{sourceLabels}</TableCell>
                      <TableCell>{setting.typeOfEggs}</TableCell>
                      <TableCell align="right">{setting.fullSetters}</TableCell>
                      <TableCell align="right">{setting.unfullSetters}</TableCell>
                      <TableCell align="right">{setting.unfullSetterEggs}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        {setting.eggsSet}
                      </TableCell>
                      <TableCell 
                        align="right" 
                        sx={{ 
                          color: setting.rejectEggs > 0 ? 'warning.main' : 'inherit',
                          fontWeight: setting.rejectEggs > 0 ? 600 : 400
                        }}
                      >
                        {setting.rejectEggs}
                      </TableCell>
                      <TableCell 
                        align="right" 
                        sx={{ 
                          color: setting.cumulativeRejectEggs > 0 ? 'warning.main' : 'inherit',
                          fontWeight: 600
                        }}
                      >
                        {setting.cumulativeRejectEggs}
                      </TableCell>
                <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Tooltip title="Edit setting">
                            <IconButton 
                              color="primary" 
                              size="small" 
                              onClick={() => handleEdit(setting)}
                              sx={{ 
                                mx: 0.5,
                                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) }
                              }}
                            >
                              <EditIcon fontSize="small" />
                  </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete setting">
                            <IconButton 
                              color="error" 
                              size="small" 
                              onClick={() => handleDeleteConfirm(setting.id)}
                              sx={{ 
                                mx: 0.5,
                                '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.1) }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                  </IconButton>
                          </Tooltip>
                        </Box>
                </TableCell>
              </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </TableContainer>
        )}
      </Paper>

      {/* Edit Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle 
          sx={{ 
            borderBottom: '1px solid', 
            borderColor: 'divider',
            p: 2,
            pb: 2
          }}
        >
          <Typography variant="h6" component="div" fontWeight={600}>
            {formData.id === 0 ? 'New Egg Setting' : 'Edit Egg Setting'}
          </Typography>
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
              {isEditing ? 'Update Egg Setting Details' : 'New Egg Setting Entry'}
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
                  Fill in the required information for egg setting. All fields marked with * are required.
                </Typography>
              </Box>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {/* Section 1: Basic Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} color="primary" gutterBottom>
                1. Basic Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="settingDate"
                    label="Setting Date *"
                    type="date"
                    value={formData.settingDate}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 1
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="batchId"
                    label="Batch ID *"
                    value={formData.batchId}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    error={!!formErrors.batchId}
                    helperText={formErrors.batchId}
                    placeholder="e.g. BATCH-001"
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

            {/* Section 2: Egg Collection Selection */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} color="primary" gutterBottom>
                2. Egg Collection Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    id="collection-ids"
                    options={availableCollections}
                    getOptionLabel={(option) => `${option.date} - ${option.farmerName} (${option.typeOfEggs})`}
                    value={selectedCollections}
                    onChange={(event, newValue) => {
                      setSelectedCollections(newValue);
                      handleCollectionChange(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Egg Collections *"
                        placeholder="Choose collections"
                        error={!!formErrors.collectionIds}
                        helperText={formErrors.collectionIds}
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          key={option.id}
                          label={`${option.date} - ${option.farmerName}`}
                          {...getTagProps({ index })}
                          color="primary"
                          variant="outlined"
                        />
                      ))
                    }
                  />
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

            {/* Section 3: Setter Details */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} color="primary" gutterBottom>
                3. Setter Machine Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="fullSetters"
                    label="Full Setters *"
                    type="number"
                    value={formData.fullSetters === null ? '' : formData.fullSetters}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    error={!!formErrors.fullSetters}
                    helperText={formErrors.fullSetters || "Number of full setter trays"}
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
                    name="unfullSetters"
                    label="Unfull Setters"
                    type="number"
                    value={formData.unfullSetters === null ? '' : formData.unfullSetters}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.unfullSetters}
                    helperText={formErrors.unfullSetters || "Number of incomplete setter trays"}
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
                    name="unfullSetterEggs"
                    label="Eggs in Unfull Setters"
                    type="number"
                    value={formData.unfullSetterEggs === null ? '' : formData.unfullSetterEggs}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.unfullSetterEggs}
                    helperText={formErrors.unfullSetterEggs || "Total eggs in incomplete setters"}
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

            {/* Section 4: Egg Quality Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} color="primary" gutterBottom>
                4. Egg Quality Assessment
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="dirtyEggs"
                    label="Dirty Eggs"
                    type="number"
                    value={formData.dirtyEggs === null ? '' : formData.dirtyEggs}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.dirtyEggs}
                    helperText={formErrors.dirtyEggs || "Number of dirty eggs"}
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
                    name="damageEggs"
                    label="Damaged Eggs"
                    type="number"
                    value={formData.damageEggs === null ? '' : formData.damageEggs}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.damageEggs}
                    helperText={formErrors.damageEggs || "Number of damaged eggs"}
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
                    name="rejectEggs"
                    label="Rejected Eggs"
                    type="number"
                    value={formData.rejectEggs === null ? '' : formData.rejectEggs}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!formErrors.rejectEggs}
                    helperText={formErrors.rejectEggs || "Number of rejected eggs"}
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

            {/* Section 5: Additional Notes */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} color="primary" gutterBottom>
                5. Additional Notes
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="notes"
                    label="Notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Add any additional notes or observations"
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

            {/* Summary Box */}
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
                  Total Eggs Set:
                </Typography>
                <Typography variant="h6" color="success.main" fontWeight={700}>
                  {formData.eggsSet || 0}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, gap: 1, borderTop: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
            {selectedCollections.length > 0 && (
              <Typography variant="body2" color="primary.main" fontWeight={600}>
                {formData.eggsSet} of {selectedCollections.reduce(
                  (sum, item) => sum + calculateTotalEggs(item), 0
                )} eggs selected
              </Typography>
            )}
          </Box>
          <Button 
            onClick={() => setDialogOpen(false)} 
            color="inherit"
            variant="outlined"
            sx={{ borderRadius: 1 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            color="primary" 
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : null}
            sx={{ borderRadius: 1 }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ 
          color: 'error.main',
          borderBottom: '1px solid',
          borderColor: 'divider',
          p: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningIcon color="error" />
            <Typography variant="h6" component="div" fontWeight={600}>
              Confirm Deletion
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3, minWidth: 400 }}>
          <Typography variant="body1">
            Are you sure you want to delete this egg setting record? This action cannot be undone.
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Deleting this record will release all associated egg collections.
          </Alert>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, gap: 1, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            color="inherit"
            variant="outlined"
            sx={{ borderRadius: 1 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            sx={{ borderRadius: 1 }}
          >
            Delete Record
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}