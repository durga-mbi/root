import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
    Box,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import designConfig from "../../config/designConfig";
import { useLogin } from "../../hooks/auth/useLogin";
import { AuthLayout } from "./components/AuthLayout";
import { loginSchema } from "../../utils/validationSchemas";

const Login = () => {
    const navigate = useNavigate();
    const { mutate: login, isPending } = useLogin();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginSchema),
        defaultValues: {
            mobile: "",
            password: "",
        }
    });

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const onSubmit = (data: any) => {
        login(
            data,
            {
                onSuccess: () => {
                    toast.success("Login Successful");
                    navigate("/home");
                },
                onError: (err: any) => {
                    toast.error(err?.message || "Invalid credentials");
                },
            }
        );
    };

    return (
        <AuthLayout title="Sign In" subtitle="Please enter your details to sign in">
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Mobile Number */}
                <Box sx={{ mb: 3 }}>
                    <Typography
                        variant="body2"
                        sx={{ color: designConfig.colors.text.primary, mb: 1, fontWeight: 500 }}
                    >
                        Mobile Number <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="Enter 10-digit mobile number"
                        {...register("mobile")}
                        inputProps={{ maxLength: 10 }}
                        error={!!errors.mobile}
                        helperText={errors.mobile?.message}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                backgroundColor: "#ffffff",
                                borderRadius: "8px",
                                "& fieldset": { borderColor: designConfig.colors.background.border },
                                "&:hover fieldset": { borderColor: designConfig.colors.primary.light },
                                "&.Mui-focused fieldset": { borderColor: designConfig.colors.primary.main },
                            },
                        }}
                    />
                </Box>

                {/* Password */}
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="body2"
                        sx={{ color: designConfig.colors.text.primary, mb: 1, fontWeight: 500 }}
                    >
                        Password <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <TextField
                        fullWidth
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...register("password")}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                backgroundColor: "#ffffff",
                                borderRadius: "8px",
                                "& fieldset": { borderColor: designConfig.colors.background.border },
                                "&:hover fieldset": { borderColor: designConfig.colors.primary.light },
                                "&.Mui-focused fieldset": { borderColor: designConfig.colors.primary.main },
                            },
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleTogglePasswordVisibility}
                                        edge="end"
                                        sx={{ color: "#757575" }}
                                    >
                                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {/* Login Button */}
                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={isPending}
                    sx={{
                        background:
                            (designConfig.colors as any).gradients?.primary ||
                            designConfig.colors.primary.main,
                        color: "#ffffff",
                        py: 1.5,
                        borderRadius: "12px",
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "16px",
                        boxShadow: designConfig.shadows.primary,
                        "&:hover": {
                            background:
                                (designConfig.colors as any).gradients?.primary ||
                                designConfig.colors.primary.main,
                            opacity: 0.9,
                        },
                    }}
                >
                    {isPending ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
                </Button>
            </form>

            {/* New User */}
            <Typography
                variant="body2"
                sx={{
                    mt: 2,
                    textAlign: "center",
                    color: designConfig.colors.text.primary,
                }}
            >
                New user?{" "}
                <span
                    style={{
                        color: designConfig.colors.primary.main,
                        fontWeight: 700,
                        cursor: "pointer",
                    }}
                    onClick={() => navigate("/signup")}
                >
                    Create Account
                </span>
            </Typography>
        </AuthLayout>
    );
};

export default Login;
