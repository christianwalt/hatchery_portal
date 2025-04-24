import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Divider,
  Switch,
  FormControlLabel,
  FormGroup,
  Alert,
  Snackbar,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';

export default function Settings() {
  const [activeSection, setActiveSection] = useState('company');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    companyName: 'ABC Hatchery Inc.',
    address: '123 Egg Lane, Chicken Town',
    email: 'info@abchatchery.com',
    phone: '+1 234 567 8900',
    username: 'admin',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    smsNotifications: false,
    alertThreshold: 10,
    language: 'English',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSaveSettings = () => {
    console.log('Saving settings:', formValues);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const renderCompanySettings = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Company Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Company Name"
              name="companyName"
              value={formValues.companyName}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formValues.email}
              onChange={handleChange}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formValues.address}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formValues.phone}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
        </Grid>
        <Box mt={3}>
          <Button variant="contained" color="primary" onClick={handleSaveSettings}>
            Save Company Settings
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderUserSettings = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          User Profile
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formValues.username}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Change Password
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Current Password"
              name="currentPassword"
              type="password"
              value={formValues.currentPassword}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}></Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="New Password"
              name="newPassword"
              type="password"
              value={formValues.newPassword}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formValues.confirmPassword}
              onChange={handleChange}
              margin="normal"
              error={formValues.newPassword !== formValues.confirmPassword && formValues.confirmPassword !== ''}
              helperText={formValues.newPassword !== formValues.confirmPassword && formValues.confirmPassword !== '' ? 'Passwords do not match' : ''}
            />
          </Grid>
        </Grid>
        <Box mt={3}>
          <Button variant="contained" color="primary" onClick={handleSaveSettings}>
            Save User Settings
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderNotificationSettings = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Notification Preferences
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={formValues.emailNotifications}
                onChange={handleChange}
                name="emailNotifications"
                color="primary"
              />
            }
            label="Email Notifications"
          />
          <FormControlLabel
            control={
              <Switch
                checked={formValues.smsNotifications}
                onChange={handleChange}
                name="smsNotifications"
                color="primary"
              />
            }
            label="SMS Notifications"
          />
        </FormGroup>

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Alert Settings
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Low Inventory Alert Threshold (%)"
              name="alertThreshold"
              type="number"
              value={formValues.alertThreshold}
              onChange={handleChange}
              margin="normal"
              InputProps={{
                inputProps: { min: 0, max: 100 }
              }}
            />
          </Grid>
        </Grid>
        <Box mt={3}>
          <Button variant="contained" color="primary" onClick={handleSaveSettings}>
            Save Notification Settings
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderSystemSettings = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          System Preferences
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Language"
              name="language"
              value={formValues.language}
              onChange={handleChange}
              margin="normal"
              SelectProps={{
                native: true,
              }}
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </TextField>
          </Grid>
        </Grid>
        <Box mt={3}>
          <Button variant="contained" color="primary" onClick={handleSaveSettings}>
            Save System Settings
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const settingsSections = [
    { id: 'company', label: 'Company Information', icon: <BusinessIcon />, component: renderCompanySettings },
    { id: 'user', label: 'User Profile', icon: <PersonIcon />, component: renderUserSettings },
    { id: 'notifications', label: 'Notifications', icon: <NotificationsIcon />, component: renderNotificationSettings },
    { id: 'system', label: 'System Settings', icon: <LanguageIcon />, component: renderSystemSettings },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Settings Navigation */}
        <Grid item xs={12} md={3}>
          <Card>
            <List component="nav">
              {settingsSections.map((section) => (
                <ListItemButton
                  key={section.id}
                  selected={activeSection === section.id}
                  onClick={() => setActiveSection(section.id)}
                >
                  <ListItemIcon>{section.icon}</ListItemIcon>
                  <ListItemText primary={section.label} />
                </ListItemButton>
              ))}
            </List>
          </Card>
        </Grid>

        {/* Settings Content */}
        <Grid item xs={12} md={9}>
          {settingsSections.find(section => section.id === activeSection)?.component()}
        </Grid>
      </Grid>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Settings saved successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
} 