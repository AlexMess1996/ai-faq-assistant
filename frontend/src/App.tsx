// frontend/src/App.tsx
import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  Avatar,
  Typography,
  Paper,
  Container,
  Stack,
} from '@mui/material';
import {
  Home as HomeIcon,
  Search as SearchIcon,
  Notifications as BellIcon,
  Settings as SettingsIcon,
  AccessTime as ClockIcon,
} from '@mui/icons-material';
import { UploadForm } from './components/UploadForm';
import { Chat } from './components/Chat';

export default function App() {
  const [ingestedChunks, setIngestedChunks] = useState<number | null>(null);
  const icons = [
    <HomeIcon key="home" color="inherit" />,
    <SearchIcon key="search" color="inherit" />,
    <BellIcon key="bell" color="inherit" />,
    <SettingsIcon key="settings" color="inherit" />,
    <ClockIcon key="clock" color="inherit" />,
  ];

  return (
    <Box display="flex" height="100vh">
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        PaperProps={{ sx: { width: 80, backgroundColor: 'background.paper' } }}
      >
        <List sx={{ pt: 4, flex: 1 }}>
          {icons.map((icon, i) => (
            <ListItemButton key={i} sx={{ justifyContent: 'center', py: 2 }}>
              <ListItemIcon sx={{ justifyContent: 'center', color: 'text.secondary' }}>
                {icon}
              </ListItemIcon>
            </ListItemButton>
          ))}
        </List>
        <Box sx={{ pb: 4, textAlign: 'center' }}>
          <Avatar
            sx={{ mx: 'auto', width: 56, height: 56, border: '2px solid', borderColor: 'primary.main' }}
          />
        </Box>
      </Drawer>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Typography variant="h3" align="center">
          AI FAQ Assistant
        </Typography>

        {/* Panels in a horizontal stack */}
        <Stack direction="row" spacing={4} justifyContent="center" flexGrow={1}>
          {/* Upload Panel */}
          <Paper sx={{ p: 3, width: 300 }} elevation={3}>
            <Typography variant="h6" align="center" gutterBottom>
              Upload Document
            </Typography>
            <UploadForm onUploaded={setIngestedChunks} />
            {ingestedChunks !== null && (
              <Typography align="center" sx={{ mt: 2 }} color="text.secondary">
                Ingested <strong>{ingestedChunks}</strong> chunk{ingestedChunks > 1 ? 's' : ''}.
              </Typography>
            )}
          </Paper>

          {/* Chat Panel */}
          <Paper sx={{ p: 3, flexGrow: 1, maxWidth: 600 }} elevation={3}>
            <Typography variant="h6" align="center" gutterBottom>
              Ask the Assistant
            </Typography>
            <Chat />
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
