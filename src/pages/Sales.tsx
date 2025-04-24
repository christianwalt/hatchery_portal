import React, { useState } from 'react';
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
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PictureAsPdf as InvoiceIcon,
  LocalShipping as ChicksIcon,
  Egg as EggsIcon,
  AttachMoney as RevenueIcon,
  CheckCircle as CompletedIcon,
  Pending as PendingIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';

// Sample data for sales
const initialSales = [
  {
    id: 1,
    batchId: 'B001',
    label: 'Broilers Batch 1',
    date: '2023-04-15',
    customer: 'Sunshine Farms',
    productType: 'Chicks',
    typeOfChicks: 'Broiler',
    quantity: 350,
    unitPrice: 2.5,
    totalAmount: 875,
    paid: 875,
    balance: 0,
    status: 'completed',
    paymentMethod: 'Bank Transfer',
    notes: 'Delivered on time'
  },
  {
    id: 2,
    batchId: 'B002',
    label: 'Layers Batch 1',
    date: '2023-05-02',
    customer: 'Meadow Poultry',
    productType: 'Chicks',
    typeOfChicks: 'Layer',
    quantity: 320,
    unitPrice: 2.45,
    totalAmount: 784,
    paid: 600,
    balance: 184,
    status: 'pending',
    paymentMethod: 'Credit Card',
    notes: 'Scheduled for delivery next week'
  },
  {
    id: 3,
    batchId: 'E001',
    label: 'House I',
    date: '2023-05-10',
    customer: 'Green Valley Farms',
    productType: 'Fertilized Eggs',
    damagedEggs: 23,
    clearEggs: 117,
    unhatchedEggs: 42,
    totalEggs: 182,
    unitPrice: 1.2,
    totalAmount: 218.4,
    paid: 218.4,
    balance: 0,
    status: 'completed',
    paymentMethod: 'Cash',
    notes: 'Bulk order discount applied'
  }
];

// Sample completed packaging batches
const completedPackagingBatches: {
  id: number;
  batchId: string;
  label: string;
  packagingDate: string;
  typeOfChicks: string;
  chicksPacked: number;
  status: string;
}[] = [
  {
    id: 1,
    batchId: 'B001',
    label: 'Broilers Batch 1',
    packagingDate: '2023-07-05',
    typeOfChicks: 'Broiler',
    chicksPacked: 350,
    status: 'completed'
  },
  {
    id: 2,
    batchId: 'B002',
    label: 'Layers Batch 1',
    packagingDate: '2023-07-07',
    typeOfChicks: 'Layer',
    chicksPacked: 320,
    status: 'completed'
  },
  {
    id: 4,
    batchId: 'B004',
    label: 'Kienyeji Batch 1',
    packagingDate: '2023-07-10',
    typeOfChicks: 'Kienyeji',
    chicksPacked: 280,
    status: 'completed'
  }
];

// Sample completed egg batches with rejected eggs data
const completedEggBatches = [
  {
    id: 1,
    batchId: 'E001',
    label: 'House I',
    date: '2023-05-05',
    damagedEggs: 23,
    clearEggs: 117,
    unhatchedEggs: 42,
    totalEggs: 182,
    status: 'completed'
  },
  {
    id: 2,
    batchId: 'E002',
    label: 'House II',
    date: '2023-05-15',
    damagedEggs: 15,
    clearEggs: 84,
    unhatchedEggs: 36,
    totalEggs: 135,
    status: 'completed'
  },
  {
    id: 3,
    batchId: 'E003',
    label: 'House III',
    date: '2023-05-20',
    damagedEggs: 18,
    clearEggs: 94,
    unhatchedEggs: 28,
    totalEggs: 140,
    status: 'completed'
  }
];

// Interface for sales form data
interface SaleFormData {
  id?: string;
  invoiceNumber?: string;
  date: string;
  customer: string;
  productType: string;
  quantity?: number;
  batchId?: string;
  label?: string;
  typeOfChicks?: string;
  unitPrice: number;
  totalAmount: number;
  paid: number;
  balance: number;
  paymentMethod: string;
  status: string;
  damagedEggs?: number;
  clearEggs?: number;
  unhatchedEggs?: number;
  totalEggs?: number;
}

// Tab Panel component
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
      id={`sales-tabpanel-${index}`}
      aria-labelledby={`sales-tab-${index}`}
      {...other}
      style={{ width: '100%' }}
    >
      {value === index && (
        <Box sx={{ width: '100%' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Sales() {
  const theme = useTheme();
  const [sales, setSales] = useState<SaleFormData[]>(initialSales);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [currentSale, setCurrentSale] = useState<SaleFormData>({
    id: 0,
    batchId: '',
    label: '',
    date: new Date().toISOString().split('T')[0],
    customer: '',
    productType: tabValue === 0 ? 'Chicks' : 'Fertilized Eggs',
    typeOfChicks: '',
    quantity: 0,
    unitPrice: 0,
    totalAmount: 0,
    paid: 0,
    balance: 0,
    status: 'pending',
    paymentMethod: '',
    notes: ''
  });

  // Filter sales based on product type
  const chicksSales = sales.filter(sale => sale.productType === 'Chicks');
  const eggsSales = sales.filter(sale => sale.productType === 'Fertilized Eggs');

  // Calculate total sales metrics for all sales
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const completedSales = sales.filter(sale => sale.status === 'completed');
  const pendingSales = sales.filter(sale => sale.status === 'pending');
  
  // Metrics for chicks
  const totalChicksSold = chicksSales
    .filter(sale => sale.status === 'completed')
    .reduce((sum, sale) => sum + (sale.quantity || 0), 0);
  
  // Metrics for eggs
  const totalEggsSold = eggsSales
    .filter(sale => sale.status === 'completed')
    .reduce((sum, sale) => sum + (sale.totalEggs || 0), 0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleClickOpen = () => {
    if (tabValue === 0) {
      // For chicks sales, don't set an invoice number
      setCurrentSale({
        id: sales.length + 1,
        batchId: '',
        label: '',
        date: new Date().toISOString().split('T')[0],
        customer: '',
        productType: 'Chicks',
        typeOfChicks: '',
        quantity: 0,
        unitPrice: 0,
        totalAmount: 0,
        paid: 0,
        balance: 0,
        status: 'pending',
        paymentMethod: '',
        notes: ''
      });
    } else {
      // For eggs sales, set batch fields
      setCurrentSale({
        id: sales.length + 1,
        batchId: '',
        label: '',
        date: new Date().toISOString().split('T')[0],
        customer: '',
        productType: 'Fertilized Eggs',
        damagedEggs: 0,
        clearEggs: 0,
        unhatchedEggs: 0,
        totalEggs: 0,
        unitPrice: 0,
        totalAmount: 0,
        paid: 0,
        balance: 0,
        status: 'pending',
        paymentMethod: '',
        notes: ''
      });
    }
    setIsEditing(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditItem = (item: SaleFormData) => {
    setCurrentSale(item);
    setIsEditing(true);
    setOpen(true);
  };

  const handleSave = () => {
    if (isEditing) {
      setSales(sales.map(item => 
        item.id === currentSale.id ? currentSale : item
      ));
    } else {
      setSales([...sales, currentSale]);
    }
    setOpen(false);
  };

  const handleDelete = (id: number) => {
    setSales(sales.filter(item => item.id !== id));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    
    // For numeric fields that affect total calculation
    if (name === 'unitPrice') {
      // For unit price changes, calculate based on the appropriate quantity
      setCurrentSale(prev => {
        const newUnitPrice = Number(value);
        let newTotal = 0;
        
        if (prev.productType === 'Chicks' && prev.quantity) {
          newTotal = prev.quantity * newUnitPrice;
        } else if (prev.productType === 'Fertilized Eggs' && prev.totalEggs) {
          newTotal = prev.totalEggs * newUnitPrice;
        }
        
        const newBalance = newTotal - prev.paid;
        return {
          ...prev,
          unitPrice: newUnitPrice,
          totalAmount: newTotal,
          balance: newBalance > 0 ? newBalance : 0
        };
      });
    } else if (name === 'paid') {
      // When paid amount changes, recalculate balance
      setCurrentSale(prev => {
        const paidAmount = Number(value);
        const newBalance = prev.totalAmount - paidAmount;
        return {
          ...prev,
          paid: paidAmount,
          balance: newBalance > 0 ? newBalance : 0
        };
      });
    } else if (name === 'batchId' && tabValue === 0) {
      // When selecting a batch for chicks sales, load data from completed packaging batch
      const selectedBatch = completedPackagingBatches.find(batch => batch.batchId === value);
      if (selectedBatch) {
        setCurrentSale(prev => {
          const quantity = selectedBatch.chicksPacked;
          const totalAmount = quantity * prev.unitPrice;
          const newBalance = totalAmount - prev.paid;
          
          return {
            ...prev,
            batchId: selectedBatch.batchId,
            label: selectedBatch.label,
            typeOfChicks: selectedBatch.typeOfChicks,
            quantity: quantity,
            totalAmount: totalAmount,
            balance: newBalance > 0 ? newBalance : 0
          };
        });
      }
    } else if (name === 'batchId' && tabValue === 1) {
      // When selecting a batch for eggs sales, load data from completed egg batches
      const selectedBatch = completedEggBatches.find(batch => batch.batchId === value);
      if (selectedBatch) {
        setCurrentSale(prev => {
          const totalAmount = selectedBatch.totalEggs * prev.unitPrice;
          const newBalance = totalAmount - prev.paid;
          
          return {
            ...prev,
            batchId: selectedBatch.batchId,
            label: selectedBatch.label,
            damagedEggs: selectedBatch.damagedEggs,
            clearEggs: selectedBatch.clearEggs,
            unhatchedEggs: selectedBatch.unhatchedEggs,
            totalEggs: selectedBatch.totalEggs,
            totalAmount: totalAmount,
            balance: newBalance > 0 ? newBalance : 0
          };
        });
      }
    } else {
      // For other fields, just update normally
      setCurrentSale({
        ...currentSale,
        [name as string]: value
      });
    }
  };

  // Render sales table based on product type
  const renderSalesTable = (salesData: SaleFormData[]) => (
    <TableContainer 
      component={Paper} 
      sx={{ 
        mb: 4, 
        borderRadius: 2, 
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
      }}
    >
      <Table>
        <TableHead sx={{ 
          bgcolor: tabValue === 0 
            ? alpha(theme.palette.primary.main, 0.08) 
            : alpha(theme.palette.secondary.main, 0.08) 
        }}>
          <TableRow>
            {tabValue === 0 ? (
              // Chicks sales columns
              <>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Batch ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Label</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Type of Chicks</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }} align="right">Chicks Taken</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }} align="right">Unit Price</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }} align="right">Total Price</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }} align="right">Paid</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }} align="right">Balance</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }} align="center">Actions</TableCell>
              </>
            ) : (
              // Eggs sales columns
              <>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Batch ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Label</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }} align="right">Damaged Eggs</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }} align="right">Clear Eggs</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }} align="right">Unhatched Eggs</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }} align="right">Total Eggs</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }} align="right">Unit Price</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }} align="right">Total Price</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }} align="right">Paid</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }} align="right">Balance</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', py: 2 }} align="center">Actions</TableCell>
              </>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {salesData.length > 0 ? (
            salesData.map((sale) => (
              <TableRow 
                key={sale.id}
                sx={{
                  '&:hover': { 
                    bgcolor: tabValue === 0 
                      ? alpha(theme.palette.primary.main, 0.03) 
                      : alpha(theme.palette.secondary.main, 0.03)
                  },
                  bgcolor: sale.status === 'pending' ? alpha(theme.palette.warning.light, 0.07) : 'inherit',
                  transition: 'background-color 0.2s'
                }}
              >
                {tabValue === 0 ? (
                  // Chicks sales row
                  <>
                    <TableCell sx={{ borderLeft: sale.status === 'completed' ? `3px solid ${theme.palette.success.main}` : `3px solid ${theme.palette.warning.main}` }}>
                      <Typography variant="body2" fontWeight={500}>{sale.batchId}</Typography>
                    </TableCell>
                    <TableCell>{sale.label}</TableCell>
                    <TableCell>{sale.typeOfChicks}</TableCell>
                    <TableCell align="right">{sale.quantity?.toLocaleString()}</TableCell>
                    <TableCell align="right">{sale.unitPrice.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600}>
                        {sale.totalAmount.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{sale.paid.toLocaleString()}</TableCell>
                    <TableCell align="right">{sale.balance.toLocaleString()}</TableCell>
                    <TableCell>
                      {sale.status === 'completed' ? (
                        <Chip 
                          label="Completed" 
                          color="success" 
                          size="small" 
                          sx={{ 
                            fontWeight: 500,
                            borderRadius: 1
                          }}
                        />
                      ) : (
                        <Chip 
                          label="Pending" 
                          color="warning" 
                          size="small"
                          sx={{ 
                            fontWeight: 500,
                            borderRadius: 1
                          }} 
                        />
                      )}
                    </TableCell>
                  </>
                ) : (
                  // Eggs sales row
                  <>
                    <TableCell sx={{ borderLeft: sale.status === 'completed' ? `3px solid ${theme.palette.success.main}` : `3px solid ${theme.palette.warning.main}` }}>
                      <Typography variant="body2" fontWeight={500}>{sale.batchId}</Typography>
                    </TableCell>
                    <TableCell>{sale.label}</TableCell>
                    <TableCell align="right">{sale.damagedEggs?.toLocaleString()}</TableCell>
                    <TableCell align="right">{sale.clearEggs?.toLocaleString()}</TableCell>
                    <TableCell align="right">{sale.unhatchedEggs?.toLocaleString()}</TableCell>
                    <TableCell align="right">{sale.totalEggs?.toLocaleString()}</TableCell>
                    <TableCell align="right">{sale.unitPrice.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600}>
                        {sale.totalAmount.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{sale.paid.toLocaleString()}</TableCell>
                    <TableCell align="right">{sale.balance.toLocaleString()}</TableCell>
                    <TableCell>
                      {sale.status === 'completed' ? (
                        <Chip 
                          label="Completed" 
                          color="success" 
                          size="small" 
                          sx={{ 
                            fontWeight: 500,
                            borderRadius: 1
                          }}
                        />
                      ) : (
                        <Chip 
                          label="Pending" 
                          color="warning" 
                          size="small"
                          sx={{ 
                            fontWeight: 500,
                            borderRadius: 1
                          }} 
                        />
                      )}
                    </TableCell>
                  </>
                )}
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEditItem(sale)}
                      sx={{ 
                        '&:hover': { 
                          bgcolor: alpha(theme.palette.primary.main, 0.1) 
                        } 
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(sale.id)}
                      sx={{ 
                        '&:hover': { 
                          bgcolor: alpha(theme.palette.error.main, 0.1) 
                        } 
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="info"
                      sx={{ 
                        '&:hover': { 
                          bgcolor: alpha(theme.palette.info.main, 0.1) 
                        } 
                      }}
                    >
                      <InvoiceIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={tabValue === 0 ? 10 : 12} align="center" sx={{ py: 4 }}>
                <Typography color="text.secondary">No sales data available</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ 
      width: '100%', 
      p: { xs: 2, md: 3 },
      backgroundColor: alpha(theme.palette.background.default, 0.8)
    }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'flex-start',
        mb: 4
      }}>
        <Typography variant="h4" component="h1" sx={{ 
          mb: 1, 
          fontWeight: 700,
          color: theme.palette.text.primary,
          letterSpacing: '-0.5px'
        }}>
          Sales Management
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Track and manage all sales transactions for chicks and eggs
        </Typography>
        <Divider sx={{ width: '100%', mt: 1 }} />
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            height: '100%', 
            borderRadius: 2, 
            boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)', 
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 8px 24px 0 rgba(0,0,0,0.1)'
            },
            borderTop: `4px solid ${theme.palette.primary.main}` 
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  mr: 2
                }}>
                  <RevenueIcon />
                </Box>
                <Typography variant="subtitle1" color="text.secondary" fontWeight={500}>
                  Total Revenue
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                ${totalRevenue.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ 
            height: '100%', 
            borderRadius: 2, 
            boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)', 
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 8px 24px 0 rgba(0,0,0,0.1)'
            },
            borderTop: `4px solid ${theme.palette.success.main}` 
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  color: theme.palette.success.main,
                  mr: 2
                }}>
                  <CompletedIcon />
                </Box>
                <Typography variant="subtitle1" color="text.secondary" fontWeight={500}>
                  Completed Sales
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                {completedSales.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ 
            height: '100%', 
            borderRadius: 2, 
            boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)', 
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 8px 24px 0 rgba(0,0,0,0.1)'
            },
            borderTop: `4px solid ${theme.palette.warning.main}` 
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: alpha(theme.palette.warning.main, 0.1),
                  color: theme.palette.warning.main,
                  mr: 2
                }}>
                  <PendingIcon />
                </Box>
                <Typography variant="subtitle1" color="text.secondary" fontWeight={500}>
                  Pending Sales
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>
                {pendingSales.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ 
            height: '100%', 
            borderRadius: 2, 
            boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)', 
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 8px 24px 0 rgba(0,0,0,0.1)'
            },
            borderTop: `4px solid ${theme.palette.error.main}` 
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                  color: theme.palette.error.main,
                  mr: 2
                }}>
                  <InventoryIcon />
                </Box>
                <Typography variant="subtitle1" color="text.secondary" fontWeight={500}>
                  {tabValue === 0 ? 'Total Chicks Sold' : 'Total Eggs Sold'}
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.error.main }}>
                {tabValue === 0 ? totalChicksSold.toLocaleString() : totalEggsSold.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ 
        width: '100%', 
        bgcolor: 'background.paper', 
        mb: 3, 
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        overflow: 'hidden'
      }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: tabValue === 0 ? theme.palette.primary.main : theme.palette.secondary.main,
              height: 3
            },
            '& .MuiTab-root': {
              transition: 'all 0.2s',
              py: 2
            }
          }}
        >
          <Tab 
            icon={<ChicksIcon />} 
            iconPosition="start" 
            label="Chicks Sales" 
            sx={{ 
              fontWeight: 600,
              color: tabValue === 0 ? theme.palette.primary.main : theme.palette.text.primary,
              '&.Mui-selected': {
                backgroundColor: alpha(theme.palette.primary.main, 0.05)
              }
            }} 
          />
          <Tab 
            icon={<EggsIcon />} 
            iconPosition="start" 
            label="Eggs Sales" 
            sx={{ 
              fontWeight: 600,
              color: tabValue === 1 ? theme.palette.secondary.main : theme.palette.text.primary,
              '&.Mui-selected': {
                backgroundColor: alpha(theme.palette.secondary.main, 0.05)
              }
            }} 
          />
        </Tabs>
      </Box>

      {/* Add Sale Button */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color={tabValue === 0 ? "primary" : "secondary"}
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
          sx={{ 
            px: 3, 
            py: 1.2,
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
            }
          }}
        >
          Add New {tabValue === 0 ? "Chicks" : "Eggs"} Sale
        </Button>
      </Box>

      {/* Tab Content */}
      <TabPanel value={tabValue} index={0}>
        {renderSalesTable(chicksSales)}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {renderSalesTable(eggsSales)}
      </TabPanel>

      {/* Add/Edit Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        fullWidth 
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: `1px solid ${theme.palette.divider}`,
          px: 3,
          py: 2.5,
          bgcolor: tabValue === 0 
            ? alpha(theme.palette.primary.main, 0.05) 
            : alpha(theme.palette.secondary.main, 0.05)
        }}>
          <Typography variant="h6" fontWeight={600}>
            {isEditing ? 'Edit Sale Record' : `Add New ${tabValue === 0 ? 'Chicks' : 'Eggs'} Sale`}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 3 }}>
          <Grid container spacing={2.5}>
            {tabValue === 0 ? (
              // Chicks Sales Form Fields
              <>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Batch ID</InputLabel>
                    <Select
                      name="batchId"
                      value={currentSale.batchId || ''}
                      onChange={handleChange}
                      label="Batch ID"
                      sx={{ borderRadius: 1.5 }}
                    >
                      {completedPackagingBatches
                        .filter(batch => 
                          batch.status === 'completed' && 
                          !eggsSales.some(sale => 
                            sale.status === 'completed' && sale.batchId === batch.batchId
                          )
                        )
                        .map((batch) => (
                          <MenuItem key={batch.batchId} value={batch.batchId}>
                            {batch.batchId} - {batch.label}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="label"
                    label="Label"
                    value={currentSale.label || ''}
                    disabled
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      sx: {
                        borderRadius: 1.5
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="date"
                    label="Sale Date"
                    type="date"
                    value={currentSale.date}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      sx: {
                        borderRadius: 1.5
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="customer"
                    label="Customer"
                    value={currentSale.customer}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      sx: {
                        borderRadius: 1.5
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="typeOfChicks"
                    label="Type of Chicks"
                    value={currentSale.typeOfChicks || ''}
                    disabled
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      sx: {
                        borderRadius: 1.5
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="quantity"
                    label="Chicks Taken"
                    type="number"
                    value={currentSale.quantity}
                    disabled
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      sx: {
                        borderRadius: 1.5
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="unitPrice"
                    label="Unit Price"
                    type="number"
                    value={currentSale.unitPrice}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      sx: {
                        borderRadius: 1.5
                      }
                    }}
                    inputProps={{ step: 0.01 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="totalAmount"
                    label="Total Price"
                    type="number"
                    value={currentSale.totalAmount}
                    disabled
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      sx: {
                        borderRadius: 1.5
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="paid"
                    label="Amount Paid"
                    type="number"
                    value={currentSale.paid}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      sx: {
                        borderRadius: 1.5
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="balance"
                    label="Balance"
                    type="number"
                    value={currentSale.balance}
                    disabled
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      sx: {
                        borderRadius: 1.5,
                        bgcolor: alpha(theme.palette.primary.main, 0.03)
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      name="paymentMethod"
                      value={currentSale.paymentMethod}
                      onChange={handleChange}
                      label="Payment Method"
                      sx={{ borderRadius: 1.5 }}
                    >
                      <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                      <MenuItem value="Credit Card">Credit Card</MenuItem>
                      <MenuItem value="Cash">Cash</MenuItem>
                      <MenuItem value="Check">Check</MenuItem>
                      <MenuItem value="Mobile Money">Mobile Money</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={currentSale.status}
                      onChange={handleChange}
                      label="Status"
                      sx={{ borderRadius: 1.5 }}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            ) : (
              // Eggs Sales Form Fields
              <>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Batch ID</InputLabel>
                    <Select
                      name="batchId"
                      value={currentSale.batchId || ''}
                      onChange={handleChange}
                      label="Batch ID"
                      sx={{ borderRadius: 1.5 }}
                    >
                      {completedEggBatches
                        .filter(batch => 
                          batch.status === 'completed' && 
                          !eggsSales.some(sale => 
                            sale.status === 'completed' && sale.batchId === batch.batchId
                          )
                        )
                        .map((batch) => (
                          <MenuItem key={batch.batchId} value={batch.batchId}>
                            {batch.batchId} - {batch.label} ({batch.totalEggs} eggs)
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="label"
                    label="Label"
                    value={currentSale.label || ''}
                    disabled
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      sx: {
                        borderRadius: 1.5
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="date"
                    label="Sale Date"
                    type="date"
                    value={currentSale.date}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      sx: {
                        borderRadius: 1.5
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="customer"
                    label="Customer"
                    value={currentSale.customer}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      sx: {
                        borderRadius: 1.5
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    name="damagedEggs"
                    label="Damaged Eggs"
                    type="number"
                    value={currentSale.damagedEggs || 0}
                    disabled
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      sx: {
                        borderRadius: 1.5
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    name="clearEggs"
                    label="Clear Eggs"
                    type="number"
                    value={currentSale.clearEggs || 0}
                    disabled
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      sx: {
                        borderRadius: 1.5
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    name="unhatchedEggs"
                    label="Unhatched Eggs"
                    type="number"
                    value={currentSale.unhatchedEggs || 0}
                    disabled
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      sx: {
                        borderRadius: 1.5
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="totalEggs"
                    label="Total Eggs"
                    type="number"
                    value={currentSale.totalEggs || 0}
                    disabled
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      sx: {
                        borderRadius: 1.5
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="unitPrice"
                    label="Unit Price"
                    type="number"
                    value={currentSale.unitPrice}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      sx: {
                        borderRadius: 1.5
                      }
                    }}
                    inputProps={{ step: 0.01 }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    name="totalAmount"
                    label="Total Price"
                    type="number"
                    value={currentSale.totalAmount}
                    disabled
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      sx: {
                        borderRadius: 1.5
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    name="paid"
                    label="Amount Paid"
                    type="number"
                    value={currentSale.paid}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      sx: {
                        borderRadius: 1.5
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    name="balance"
                    label="Balance"
                    type="number"
                    value={currentSale.balance}
                    disabled
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      sx: {
                        borderRadius: 1.5,
                        bgcolor: alpha(theme.palette.primary.main, 0.03)
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      name="paymentMethod"
                      value={currentSale.paymentMethod}
                      onChange={handleChange}
                      label="Payment Method"
                      sx={{ borderRadius: 1.5 }}
                    >
                      <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                      <MenuItem value="Credit Card">Credit Card</MenuItem>
                      <MenuItem value="Cash">Cash</MenuItem>
                      <MenuItem value="Check">Check</MenuItem>
                      <MenuItem value="Mobile Money">Mobile Money</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={currentSale.status}
                      onChange={handleChange}
                      label="Status"
                      sx={{ borderRadius: 1.5 }}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <TextField
                name="notes"
                label="Notes"
                value={currentSale.notes}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: 1.5
                  }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ 
          px: 3, 
          py: 2.5,
          borderTop: `1px solid ${theme.palette.divider}` 
        }}>
          <Button 
            onClick={handleClose}
            variant="outlined"
            sx={{ 
              px: 3,
              borderRadius: 1.5,
              borderColor: theme.palette.grey[300],
              color: theme.palette.text.primary
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            color={tabValue === 0 ? "primary" : "secondary"}
            disabled={!currentSale.customer || (tabValue === 0 ? !currentSale.batchId : !currentSale.productType) || currentSale.unitPrice <= 0}
            sx={{ 
              px: 3,
              borderRadius: 1.5,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 