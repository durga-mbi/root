import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import PercentIcon from '@mui/icons-material/Percent';
import SaveIcon from '@mui/icons-material/Save';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Divider,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Typography,
    Chip,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getConfigApi, postConfigApi } from '../../api/adminConfig.api';
import { getPlansApi } from '../../api/plan.api';

// ────────────────────────────────────────────────
interface Plan {
    id: number;
    planName: string;
}

interface RoyaltySettings {
    royaltyCommission: number;
    royalPlanIds: number[];
}

export default function RoyaltyCommission() {
    const [settings, setSettings] = useState<RoyaltySettings>({
        royaltyCommission: 0,
        royalPlanIds: [],
    });

    const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [configData, plansResponse] = await Promise.all([
                    getConfigApi(),
                    getPlansApi()
                ]);

                console.log("Config Data fetched:", configData);
                console.log("Plans Response fetched:", plansResponse);

                if (configData) {
                    setSettings({
                        royaltyCommission: configData.royaltyCommission || 0,
                        royalPlanIds: Array.isArray(configData.royalQualifierPlans)
                            ? configData.royalQualifierPlans.map((p: any) => p.id)
                            : [],
                    });
                }

                // Robust extraction: check for .plan, .data, or if it's already an array
                const extractedPlans = Array.isArray(plansResponse)
                    ? plansResponse
                    : (plansResponse?.plan || plansResponse?.data || []);

                console.log("Extracted plans for state:", extractedPlans);
                setAvailablePlans(extractedPlans);

                if (extractedPlans.length === 0) {
                    console.warn("No plans found in response or unexpected format", plansResponse);
                }
            } catch (err: any) {
                setError(err.message || "Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handlePercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value) || 0;
        setSettings(prev => ({ ...prev, royaltyCommission: value }));
        setSuccess(false);
    };

    const handlePlansChange = (event: SelectChangeEvent<number[]>) => {
        const {
            target: { value },
        } = event;
        setSettings(prev => ({
            ...prev,
            royalPlanIds: typeof value === 'string' ? value.split(',').map(Number) : value,
        }));
        setSuccess(false);
    };

    const handleSave = async () => {
        setError(null);
        setSuccess(false);

        console.log("Saving settings:", settings);

        if (settings.royaltyCommission < 0 || settings.royaltyCommission > 100) {
            setError("Royalty commission must be between 0 and 100%");
            return;
        }

        setSaving(true);
        try {
            const payload = {
                royaltyCommission: settings.royaltyCommission,
                royalPlanIds: settings.royalPlanIds
            };
            console.log("Sending payload to API:", payload);
            await postConfigApi(payload);
            setSuccess(true);
        } catch (err: any) {
            console.error("Save error:", err);
            setError(err.message || "Failed to save royalty settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Box sx={{
            width: '100%',
            minHeight: '100vh',
            bgcolor: 'grey.50',
            py: { xs: 3, md: 4 }
        }}>
            <Box sx={{ maxWidth: 1000, mx: 'auto', px: { xs: 2, sm: 3, md: 4 } }}>
                <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 1 }}>
                    Royalty Income Settings
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Configure royalty commission and qualifying plans for Royal Club
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(false)}>
                        Royalty settings saved successfully
                    </Alert>
                )}

                <Card
                    elevation={3}
                    sx={{
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        overflow: 'hidden'
                    }}
                >
                    <CardHeader
                        title="Royalty Commission Configuration"
                        titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
                        sx={{
                            bgcolor: 'info.dark',
                            color: 'white',
                            py: 1.5,
                            px: 3
                        }}
                    />

                    <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                        <Stack spacing={3.5}>
                            {/* Royalty Commission */}
                            <TextField
                                fullWidth
                                label="Royalty Commission (%)"
                                type="number"
                                value={settings.royaltyCommission}
                                onChange={handlePercentChange}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end"><PercentIcon /></InputAdornment>,
                                    inputProps: { min: 0, max: 100, step: 0.1 },
                                }}
                                helperText="Percentage of total turnover distributed to Royal Club qualifiers"
                            />

                            <Divider>
                                <Chip icon={<CardGiftcardIcon />} label="Qualifying Plans" variant="outlined" />
                            </Divider>

                            {/* Plans Selection */}
                            <FormControl fullWidth>
                                <InputLabel id="plans-select-label">Qualifying Plans for Royalty</InputLabel>
                                <Select
                                    labelId="plans-select-label"
                                    multiple
                                    value={settings.royalPlanIds}
                                    onChange={handlePlansChange}
                                    input={<OutlinedInput label="Qualifying Plans for Royalty" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip
                                                    key={value}
                                                    label={availablePlans.find(p => p.id === value)?.planName || `Plan ID: ${value}`}
                                                />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {availablePlans.length === 0 ? (
                                        <MenuItem disabled value="">
                                            <em>No plans available. Please create plans first.</em>
                                        </MenuItem>
                                    ) : (
                                        availablePlans.map((plan) => (
                                            <MenuItem key={plan.id} value={plan.id}>
                                                {plan.planName} (ID: {plan.id})
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, ml: 1.5 }}>
                                    Select the plans that users must purchase to qualify for royalty income
                                </Typography>
                            </FormControl>

                            {/* Save Button */}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    startIcon={saving ? <CircularProgress size={22} color="inherit" /> : <SaveIcon />}
                                    onClick={handleSave}
                                    disabled={saving}
                                    sx={{ minWidth: 180, px: 5, py: 1.4 }}
                                >
                                    {saving ? 'Saving...' : 'Save Royalty Settings'}
                                </Button>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}
