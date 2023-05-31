import Statistics from '../statistics/page'
import Users from '../users/page'
import Teams from '../teams/page'
import Projects from '../projects/page'
import Link from 'next/link'
import {
   Drawer, 
   Toolbar, 
   Divider, 
   Box,
   ListItem, 
   ListItemIcon, 
   ListItemText,
   ListItemButton,
   List,
   Typography
  } from '@mui/material'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import PersonIcon from '@mui/icons-material/Person'
import Groups2Icon from '@mui/icons-material/Groups2'
import AssignmentIcon from '@mui/icons-material/Assignment'
import LogoutIcon from '@mui/icons-material/Logout'

const drawerWidth = 200

const  Sidebar = () => {
    
    const itemList = [
      {
        text: 'Statistics',
        icon: <QueryStatsIcon />,
        href: '/dashboard/'
      },
      {
        text: 'Users',
        icon: <PersonIcon />,
        href: '/users/'
      },
      {
        text: 'Teams',
        icon: <Groups2Icon />,
        href: '/teams/'
      },
      {
        text: 'Projects',
        icon: <AssignmentIcon />,
        href: '/projects/'
      }
    ]

   
    return (
      <Drawer variant="permanent"
        sx={{
          bgcolor: '#f3f4f6',
          width: {
            xs: 80,
            lg: drawerWidth
          },
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: {xs: 80, lg: drawerWidth} }
        }}
     >
      <Toolbar />
      <Box sx={{ overflow: 'auto'}}>
       <List>
          {itemList.map((item, index) => {
            const { text, icon, href } = item
            return (
           
            <ListItem key={text} disablePadding>
                <ListItemButton href={href}>
                  {icon && <ListItemIcon style={{color: '#4f46e5'}}> {icon} </ListItemIcon>}
                  <ListItemText primary={text} sx={{display: {xs: 'none', lg: 'block'}}}/> 
                </ListItemButton>
            </ListItem> 
          )})}
        </List> 
        </Box>
      </Drawer>
    )
}

export default Sidebar