// nav-config.ts
import {
  Home,
  Store,
  AdminPanelSettings,
  People
  
} from '@mui/icons-material';
import type { SvgIconComponent } from '@mui/icons-material';

export type NavItem = {
  title: string;
  path?: string;
  icon: SvgIconComponent;
  children?: { title: string; path: string }[];
};

export const navData: NavItem[] = [
  {
    title: 'Página Inicial',
    path: '/',
    icon: Home,
  },
  {
    title: 'Produtos',
    path: '/produtos',
    icon: Store,
  },
  {
    title: "Admin",
    path: "/admin",
    icon: AdminPanelSettings,
  },
  {
    title: "Clientes",
    path: "clientes",
    icon: People,
  }
];
