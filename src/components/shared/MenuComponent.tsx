import {
    ClickAwayListener,
    Grow,
    MenuItem,
    MenuList,
    Paper,
    Popper,
    ListItemIcon,
    ListItemText,
} from '@mui/material';

interface MenuItemOption<T> {
    label: string;
    icon: React.ReactNode;
    onClick: (entity: T) => void;
    color?: string;
}

interface MenuComponentProps<T> {
    anchorEl: null | HTMLElement;
    open: boolean;
    entity: T | null;
    onClose: () => void;
    options: MenuItemOption<T>[];
}

export default function MenuComponent<T>({
    anchorEl,
    open,
    entity,
    onClose,
    options,
}: MenuComponentProps<T>) {
    return (
        <Popper
            open={open}
            anchorEl={anchorEl}
            transition
            placement="bottom-end"
            modifiers={[
                { name: 'flip', enabled: true, options: { fallbackPlacements: ['top'] } },
                { name: 'preventOverflow', enabled: true, options: { altBoundary: true, tether: true } },
            ]}
        >
            {({ TransitionProps }) => (
                <Grow {...TransitionProps} style={{ transformOrigin: 'top right' }}>
                    <Paper sx={{ borderRadius: 2, minWidth: 160 }}>
                        <ClickAwayListener onClickAway={onClose}>
                            <MenuList autoFocusItem={open}>
                                {options.map((opt, idx) => (
                                    <MenuItem
                                        key={idx}
                                        onClick={() => {
                                            if (entity) opt.onClick(entity);
                                            onClose();
                                        }}
                                        sx={opt.color ? { color: opt.color } : undefined}
                                    >
                                        <ListItemIcon sx={opt.color ? { color: opt.color } : undefined}>
                                            {opt.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={opt.label} />
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </ClickAwayListener>
                    </Paper>
                </Grow>
            )}
        </Popper>
    );
}
