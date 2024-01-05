import React, { useRef, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import Box from '@mui/material/Box';

// Icons
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import ChecklistIcon from '@mui/icons-material/Checklist';
import SettingsIcon from '@mui/icons-material/Settings';
import SupportIcon from '@mui/icons-material/Support';
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

// Components
import WeatherWidget from '@/components/WeatherWidget';


const LINKS = [
    { text: 'Home', href: '/', icon: HomeIcon },
    { text: 'Chat', href: '/chat', icon: ChatIcon },
    { text: 'Tasks', href: '/tasks', icon: ChecklistIcon },
];

const PLACEHOLDER_LINKS = [
    { text: 'Settings', icon: SettingsIcon },
    { text: 'Support', icon: SupportIcon },
    { text: 'Logout', icon: LogoutIcon },
];

const Sidebar = ({ isOpen, toggleDrawer, }: { isOpen: boolean; toggleDrawer: () => void; }): JSX.Element => {
    const drawerRef = useRef<HTMLDivElement>(null);

    // If user clicks anywhere outside the sidebar, close it
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (isOpen && drawerRef.current) {
                if (!drawerRef.current.contains(event.target)) {
                    toggleDrawer();
                }

            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };

    }, [isOpen, toggleDrawer]);

    return (
        <>
            <AppBar position="fixed" sx={{ zIndex: 2000 }} onClick={toggleDrawer}>
                <Toolbar sx={{ backgroundColor: 'background.paper', display: 'flex', justifyContent: 'space-between' }}>
                    <IconButton
                        aria-label="open drawer"
                        sx={{ mr: 2 }}
                    >
                        {isOpen ? <MenuOpenIcon sx={{ color: "#8B0000" }} /> : <MenuIcon />} {/* Toggle Icon if menu open or closed*/}
                    </IconButton>
                    <Typography variant="h6" color="text.primary">
                        Excellent Motivator
                    </Typography>
                    <WeatherWidget />
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        top: ['48px', '56px', '64px'],
                        height: 'auto',
                        bottom: 0,
                        width: "30vw",
                        minWidth: "200px",
                    },
                }}
                variant="temporary"
                anchor="left"
                open={isOpen}
            >
                <Box
                    ref={drawerRef}>
                    <Divider />
                    <List>
                        {LINKS.map(({ text, href, icon: Icon }) => (
                            <ListItem key={href} onClick={toggleDrawer} disablePadding>
                                <ListItemButton component={Link} href={href}>
                                    <ListItemIcon>
                                        <Icon />
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider sx={{ mt: 'auto' }} />
                    <List>
                        {PLACEHOLDER_LINKS.map(({ text, icon: Icon }) => (
                            <ListItem key={text} onClick={toggleDrawer} disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <Icon />
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>

                </Box>
            </Drawer>
        </>
    );
}

export default Sidebar;