import React from 'react';
import {
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';

interface RowActionsMenuProps<T> {
    anchorEl: HTMLElement | null;
    open: boolean;
    entity: T | null;
    onClose: () => void;
    options: {
        label: string;
        icon: React.ReactNode;
        onClick: (entity: T) => void;
        color?: string;
    }[];
}

export default function RowActionsMenu<T>({
    anchorEl,
    open,
    entity,
    onClose,
    options,
}: RowActionsMenuProps<T>) {
    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            {entity &&
                options.map((option, index) => (
                    <MenuItem
                        key={index}
                        onClick={() => {
                            onClose();
                            option.onClick(entity);
                        }}
                        sx={{ color: option.color ?? 'inherit' }}
                    >
                        <ListItemIcon>{option.icon}</ListItemIcon>
                        <ListItemText primary={option.label} />
                    </MenuItem>
                ))}
        </Menu>
    );
}
