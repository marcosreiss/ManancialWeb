import { Box, Typography } from "@mui/material";

const Home = () => {
    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Typography variant="h3" fontWeight="bold">
                Home Page
            </Typography>
        </Box>
    );
};

export default Home;
