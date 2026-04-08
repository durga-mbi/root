import React from 'react';
import { Box, Typography, Button, Container, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    py: 4
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Box
                        sx={{
                            fontSize: { xs: '120px', md: '200px' },
                            fontWeight: 900,
                            lineHeight: 1,
                            color: theme.palette.primary.main,
                            opacity: 0.1,
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: -1,
                            userSelect: 'none'
                        }}
                    >
                        404
                    </Box>

                    <Box sx={{ position: 'relative', mb: 4 }}>
                        <motion.div
                            animate={{ 
                                rotate: [0, 5, -5, 0],
                                y: [0, -10, 0]
                            }}
                            transition={{ 
                                repeat: Infinity, 
                                duration: 4,
                                ease: "easeInOut"
                            }}
                        >
                            <Search size={100} color={theme.palette.primary.main} strokeWidth={1} />
                        </motion.div>
                    </Box>

                    <Typography variant="h3" fontWeight={900} gutterBottom sx={{ color: '#1e293b' }}>
                        Oops! Page Not Found
                    </Typography>
                    
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 6, maxWidth: '500px', mx: 'auto' }}>
                        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<Home size={20} />}
                            onClick={() => navigate('/home')}
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: 3,
                                boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
                                textTransform: 'none',
                                fontWeight: 700
                            }}
                        >
                            Back to Home
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<ArrowLeft size={20} />}
                            onClick={() => navigate(-1)}
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: 3,
                                textTransform: 'none',
                                fontWeight: 700
                            }}
                        >
                            Go Back
                        </Button>
                    </Box>
                </motion.div>
            </Box>
        </Container>
    );
};

export default NotFound;
