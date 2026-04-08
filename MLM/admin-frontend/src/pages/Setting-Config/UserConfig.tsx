import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Switch,
    FormControlLabel,
    TextField,
    Button,
    Divider,
    Alert,
    CircularProgress,
    Card,
    CardHeader,
    CardContent,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput,
    Chip,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useConfig } from "../../hooks/Config/useConfig";
import type { ConfigPayload } from "../../types/config";
import { getConfigApi, resetDatabaseApi } from "../../api/adminConfig.api";
import { getPlansApi } from "../../api/plan.api";
import { useLogout } from "../../hooks/Auth/useLogout";
import WarningIcon from "@mui/icons-material/Warning";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";

export default function UserConfig() {
    const { mutateAsync, isPending } = useConfig();
    const { mutate: logoutMutate } = useLogout();

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFetching, setIsFetching] = useState(true);
    const [allPlans, setAllPlans] = useState<any[]>([]);
    const [resetDialogOpen, setResetDialogOpen] = useState(false);
    const [isResetting, setIsResetting] = useState(false);

    const [form, setForm] = useState<ConfigPayload>({
        autoMemId: "STATIC",
        userRegistrationNo: 0,
        prefixMemId: "BMPL",
        minLength: 6,
        incomeCommission: 10,
        royaltyCommission: 5,
        plan_config_value: "0",
        tds: 5,
        admincharges: 2,
        royalPlanIds: [],
        activePlanIds: [],
    });

    useEffect(() => {
        const init = async () => {
            try {
                setIsFetching(true);
                const [configRes, plansRes] = await Promise.all([
                    getConfigApi(),
                    getPlansApi(),
                ]);

                let extractedPlans: any[] = [];
                if (plansRes) {
                    extractedPlans = Array.isArray(plansRes) 
                        ? plansRes 
                        : (plansRes.plan || plansRes.data || []);
                    setAllPlans(extractedPlans);
                }

                if (configRes) {
                    setForm({
                        autoMemId: configRes.autoMemId,
                        userRegistrationNo: configRes.userRegistrationNo,
                        prefixMemId: configRes.prefixMemId,
                        minLength: configRes.minLength,
                        incomeCommission: Number(configRes.incomeCommission),
                        royaltyCommission: Number(configRes.royaltyCommission),
                        plan_config_value: configRes.plan_config_value,
                        tds: Number(configRes.tds),
                        admincharges: Number(configRes.admincharges),
                        royalPlanIds: configRes.royalQualifierPlans?.map((p: any) => p.planid) || [],
                        activePlanIds: extractedPlans.filter((p: any) => p.status === "ACTIVE").map((p: any) => p.id),
                    });
                }
            } catch (err) {
                console.error("Failed to initialize config:", err);
            } finally {
                setIsFetching(false);
            }
        };
        init();
    }, []);

    const handleChange =
        (field: keyof ConfigPayload) =>
            (e: React.ChangeEvent<HTMLInputElement>) => {
                const value =
                    typeof form[field] === "number"
                        ? Number(e.target.value)
                        : e.target.value;

                setForm((p) => ({ ...p, [field]: value }));
                setError(null);
                setSuccess(false);
            };

    const handlePlanChange = (event: any) => {
        const { value } = event.target;
        setForm((p) => ({
            ...p,
            royalPlanIds: typeof value === "string" ? value.split(",").map(Number) : value,
        }));
    };

    const handleActivePlanChange = (event: any) => {
        const { value } = event.target;
        setForm((p) => ({
            ...p,
            activePlanIds: typeof value === "string" ? value.split(",").map(Number) : value,
        }));
    };

    const handleSave = async () => {
        setError(null);
        setSuccess(false);

        try {
            const res: any = await mutateAsync(form);

            // 🔥 backend returns latest config — sync UI
            setForm({
                autoMemId: res.autoMemId,
                userRegistrationNo: res.userRegistrationNo,
                prefixMemId: res.prefixMemId,
                minLength: res.minLength,
                incomeCommission: Number(res.incomeCommission),
                royaltyCommission: Number(res.royaltyCommission),
                plan_config_value: res.plan_config_value,
                tds: Number(res.tds),
                admincharges: Number(res.admincharges),
                royalPlanIds: res.royalQualifierPlans?.map((p: any) => p.planid) || [],
                activePlanIds: form.activePlanIds, // Keep current selection since backend doesn't return plan statuses here
            });

            setSuccess(true);
        } catch {
            setError("Failed to save configuration");
        }
    };

    return (
        <Box sx={{ maxWidth: 1200, mx: "auto", py: 4 }}>
            <Typography variant="h4" fontWeight={700} mb={2}>
                System Configuration
            </Typography>

            {isFetching ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {(error || success) && (
                        <Alert severity={error ? "error" : "success"} sx={{ mb: 3 }}>
                            {error || "Configuration saved successfully"}
                        </Alert>
                    )}

                    <Card sx={{ mb: 4 }}>
                        <CardHeader title="Member ID & Commission Settings" />
                        <CardContent>
                            <Stack spacing={3}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={form.autoMemId === "STATIC"}
                                            onChange={(e) =>
                                                setForm((p) => ({
                                                    ...p,
                                                    autoMemId: e.target.checked ? "STATIC" : "DYNAMIC",
                                                }))
                                            }
                                        />
                                    }
                                    label={`Member ID Mode: ${form.autoMemId}`}
                                />

                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={form.plan_config_value === "0"}
                                            onChange={(e) =>
                                                setForm((p) => ({
                                                    ...p,
                                                    plan_config_value: e.target.checked ? "0" : "1",
                                                }))
                                            }
                                        />
                                    }
                                    label={`Plan Approval Mode: ${form.plan_config_value === "0" ? "AUTO (0)" : "MANUAL (1)"}`}
                                />

                                <Divider />

                                <TextField
                                    label="Prefix"
                                    value={form.prefixMemId}
                                    onChange={handleChange("prefixMemId")}
                                />

                                <TextField
                                    label="Minimum Length"
                                    type="number"
                                    value={form.minLength}
                                    onChange={handleChange("minLength")}
                                />

                                <Stack direction="row" spacing={2}>
                                    <TextField
                                        fullWidth
                                        label="Income Commission (%)"
                                        type="number"
                                        value={form.incomeCommission}
                                        onChange={handleChange("incomeCommission")}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Royalty Commission (%)"
                                        type="number"
                                        value={form.royaltyCommission}
                                        onChange={handleChange("royaltyCommission")}
                                    />
                                </Stack>

                                <Stack direction="row" spacing={2}>
                                    <TextField
                                        fullWidth
                                        label="TDS (%)"
                                        type="number"
                                        value={form.tds}
                                        onChange={handleChange("tds")}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Admin Charges (%)"
                                        type="number"
                                        value={form.admincharges}
                                        onChange={handleChange("admincharges")}
                                    />
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>

                    <Card sx={{ mb: 4 }}>
                        <CardHeader title="Plan Activation Configuration" subheader="Select which plans should be ACTIVE and visible to users" />
                        <CardContent>
                            <Stack spacing={3}>
                                <FormControl fullWidth>
                                    <InputLabel id="active-plans-label">Active Plans</InputLabel>
                                    <Select
                                        labelId="active-plans-label"
                                        multiple
                                        value={form.activePlanIds}
                                        onChange={handleActivePlanChange}
                                        input={<OutlinedInput label="Active Plans" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((id: string | number) => (
                                                    <Chip key={id} label={allPlans.find(p => p.id === id)?.planName || id} />
                                                ))}
                                            </Box>
                                        )}
                                    >
                                        {allPlans.map((plan) => (
                                            <MenuItem key={plan.id} value={plan.id}>
                                                {plan.planName} (₹{plan.price})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Stack>
                        </CardContent>
                    </Card>

                    <Card sx={{ mb: 4 }}>
                        <CardHeader title="Royalty Configuration" subheader="Define which plans qualify for royalty income" />
                        <CardContent>
                            <Stack spacing={3}>
                                <FormControl fullWidth>
                                    <InputLabel id="royal-plans-label">Royalty Qualifier Plans</InputLabel>
                                    <Select
                                        labelId="royal-plans-label"
                                        multiple
                                        value={form.royalPlanIds}
                                        onChange={handlePlanChange}
                                        input={<OutlinedInput label="Royalty Qualifier Plans" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((id: string | number) => (
                                                    <Chip key={id} label={allPlans.find(p => p.id === id)?.planName || id} />
                                                ))}
                                            </Box>
                                        )}
                                    >
                                        {allPlans.map((plan) => (
                                            <MenuItem key={plan.id} value={plan.id}>
                                                {plan.planName} (₹{plan.price})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Stack>
                        </CardContent>
                    </Card>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={
                                isPending ? <CircularProgress size={18} /> : <SaveIcon />
                            }
                            disabled={isPending}
                            onClick={handleSave}
                            sx={{ px: 6, py: 1.5, borderRadius: 2, fontWeight: 700 }}
                        >
                            {isPending ? "Saving..." : "Save Configuration"}
                        </Button>
                    </Box>

                    <Divider sx={{ my: 4 }} />

                    <Card sx={{ borderColor: 'error.main', border: 1, bgcolor: 'error.lighter' }}>
                        <CardHeader 
                            title={
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <WarningIcon color="error" />
                                    <Typography variant="h6" color="error.main" fontWeight={700}>
                                        Danger Zone
                                    </Typography>
                                </Stack>
                            }
                            subheader="Perform critical system actions. These changes are irreversible."
                        />
                        <CardContent>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        Factory Reset Database
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Wipe all users, orders, wallet data and re-initialize with default settings.
                                    </Typography>
                                </Box>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<RestartAltIcon />}
                                    onClick={() => setResetDialogOpen(true)}
                                    sx={{ fontWeight: 700 }}
                                >
                                    Reset Everything
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>

                    <Dialog
                        open={resetDialogOpen}
                        onClose={() => !isResetting && setResetDialogOpen(false)}
                    >
                        <DialogTitle sx={{ color: 'error.main', fontWeight: 700 }}>
                            Irreversible Action!
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you absolutely sure you want to perform a factory reset? 
                                This will <strong>DELETE ALL DATA</strong> in the system. 
                                You will be logged out and the system will re-initialize with default credentials.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions sx={{ p: 3 }}>
                            <Button 
                                onClick={() => setResetDialogOpen(false)} 
                                disabled={isResetting}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleReset}
                                color="error"
                                variant="contained"
                                disabled={isResetting}
                                startIcon={isResetting ? <CircularProgress size={18} color="inherit" /> : <RestartAltIcon />}
                            >
                                {isResetting ? "Resetting..." : "Yes, Reset Everything"}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </Box>
    );

    async function handleReset() {
        setIsResetting(true);
        try {
            await resetDatabaseApi({
                config: {
                    autoMemId: form.autoMemId,
                    userRegistrationNo: form.userRegistrationNo,
                    prefixMemId: form.prefixMemId,
                    minLength: form.minLength,
                    incomeCommission: form.incomeCommission,
                    royaltyCommission: form.royaltyCommission,
                    planConfigKey: "PLAN_APPROVAL_MODE",
                    planConfigValue: form.plan_config_value === "0" ? "AUTO" : "MANUALADMIN",
                    tds: form.tds,
                    admincharges: form.admincharges
                },
                rootUser: {
                    firstName: "Root",
                    lastName: "User",
                    mobile: "9937406469",
                    email: "root@example.com",
                    password: "Root@123"
                },
                defaultAdmin: {
                    firstName: "Super",
                    lastName: "Admin",
                    mobile: "9937406469",
                    email: "admin@example.com",
                    username: "superadmin",
                    password: "Admin@123",
                    adminType: "SUPERADMIN"
                }
            });

            // On success, force logout
            logoutMutate({}, {
                onSuccess: () => {
                    window.location.href = "/login";
                },
                onError: () => {
                    // Fallback redirect if logout api fails
                    window.location.href = "/login";
                }
            });
        } catch (err: any) {
            setError(err.message || "Failed to reset database");
            setResetDialogOpen(false);
        } finally {
            setIsResetting(false);
        }
    }
}
