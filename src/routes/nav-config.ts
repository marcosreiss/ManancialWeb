// nav-config.ts
import {
  Home,
  Category,
  People,
  Store,
  Business,
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
    title: 'Cadastros',
    icon: Category,
    children: [
      { title: 'Categorias', path: '/categorias' },
      { title: 'Clientes', path: '/clientes' },
      { title: 'Produtos', path: '/produtos' },
    ],
  },
  {
    title: 'Tabelas',
    path: '/tabelas',
    icon: Store,
  },
  {
    title: 'Gestão',
    path: '/gestao',
    icon: Business,
  },
  {
    title: 'Relatórios',
    path: '/relatorios',
    icon: People,
  },
];
