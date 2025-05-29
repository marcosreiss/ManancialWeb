import { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Divider,
  Tooltip,
} from '@mui/material';
import { ExpandLess, ExpandMore, Menu as MenuIcon, PinDrop } from '@mui/icons-material';
import { navData } from '@/routes/nav-config';
import { useRouter } from '@/routes/hooks';

const drawerWidthOpen = 240;
const drawerWidthClosed = 64;

type SidebarProps = {
  open: boolean;
  toggleDrawer: () => void;
};

const Sidebar = ({ open, toggleDrawer }: SidebarProps) => {
  const router = useRouter();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        position: 'fixed',
        width: open ? drawerWidthOpen : drawerWidthClosed,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        '& .MuiDrawer-paper': {
          width: open ? drawerWidthOpen : drawerWidthClosed,
          transition: 'width 0.5s ease',
          overflowX: 'hidden',
          boxSizing: 'border-box',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e0e0e0',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', p: 1, justifyContent: open ? 'space-between' : 'center' }}>
        <Tooltip title="Menu">
          <IconButton onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider />

      <List>
        {navData.map((item) => {
          const Icon = item.icon;
          const hasChildren = !!item.children;

          return (
            <Box key={item.title}>
              <ListItemButton
                onClick={() => {
                  if (hasChildren) {
                    toggleMenu(item.title);
                  } else if (item.path) {
                    handleNavigate(item.path);
                  }
                }}
              >
                <ListItemIcon><Icon color="primary" /></ListItemIcon>
                {open && <ListItemText primary={item.title} />}
                {open && hasChildren && (openMenus[item.title] ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>

              {hasChildren && (
                <Collapse in={openMenus[item.title] && open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ pl: 4 }}>
                    {item.children?.map((child) => (
                      <ListItemButton key={child.title} onClick={() => handleNavigate(child.path)}>
                        <ListItemIcon><PinDrop fontSize="small" /></ListItemIcon>
                        {open && <ListItemText primary={child.title} />}
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </Box>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
