import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, ArrowLeft, ShieldAlert } from 'lucide-react';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                backgroundColor: '#f8fafc',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 3
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 4, md: 8 },
                        textAlign: 'center',
                        borderRadius: 4,
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)'
                    }}
                >
                    <Box
                        sx={{
                            display: 'inline-flex',
                            p: 3,
                            borderRadius: '50%',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            mb: 4
                        }}
                    >
                        <ShieldAlert size={64} color="#ef4444" strokeWidth={1.5} />
                    </Box>

                    <Typography variant="h2" fontWeight={800} sx={{ color: '#1e293b', mb: 2, fontSize: { xs: '2.5rem', md: '3.75rem' } }}>
                        404
                    </Typography>
                    
                    <Typography variant="h5" fontWeight={700} sx={{ color: '#475569', mb: 2 }}>
                        Access Restricted or Page Missing
                    </Typography>

                    <Typography variant="body1" sx={{ color: '#64748b', mb: 6 }}>
                        The administrative resource you are trying to access does not exist or has been moved to a different directory.
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<LayoutDashboard size={20} />}
                            onClick={() => navigate('/dashboard')}
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: 2,
                                backgroundColor: '#1e293b',
                                '&:hover': {
                                    backgroundColor: '#0f172a'
                                },
                                textTransform: 'none',
                                fontWeight: 700
                            }}
                        >
                            Return to Dashboard
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<ArrowLeft size={20} />}
                            onClick={() => navigate(-1)}
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: 2,
                                borderColor: '#e2e8f0',
                                color: '#64748b',
                                '&:hover': {
                                    borderColor: '#cbd5e1',
                                    backgroundColor: '#f1f5f9'
                                },
                                textTransform: 'none',
                                fontWeight: 700
                            }}
                        >
                            Previous Page
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default NotFound;
