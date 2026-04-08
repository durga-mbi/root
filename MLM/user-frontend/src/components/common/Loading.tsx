import { Box, CircularProgress, Typography } from "@mui/material";
import designConfig from "../../config/designConfig";

export default function Loading() {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            width: '100%',
            bgcolor: designConfig.colors.background.light || '#f8f9fa'
        }}>
            <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                <CircularProgress 
                    size={60} 
                    thickness={4} 
                    sx={{ color: designConfig.colors.primary.main }} 
                />
                <Box sx={{
                    position: 'absolute',
                    top: 0, left: 0, bottom: 0, right: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <Box sx={{ 
                        width: 10, height: 10, borderRadius: '50%', 
                        bgcolor: designConfig.colors.secondary.main,
                        animation: 'pulse 1.5s infinite ease-in-out'
                    }} />
                </Box>
            </Box>
            <Typography variant="body2" sx={{ 
                fontWeight: 800, color: 'text.secondary', 
                letterSpacing: '1px', textTransform: 'uppercase', fontSize: 10
            }}>
                Loading...
            </Typography>

            <style>{`
                @keyframes pulse {
                    0% { transform: scale(0.8); opacity: 0.5; }
                    50% { transform: scale(1.2); opacity: 1; }
                    100% { transform: scale(0.8); opacity: 0.5; }
                }
            `}</style>
        </Box>
    );
}