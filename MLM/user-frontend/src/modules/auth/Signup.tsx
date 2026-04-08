import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    Box,
    Button,
    TextField,
    Typography,
    InputAdornment,
    IconButton,
    CircularProgress,
} from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import designConfig from "../../config/designConfig";
import { AuthLayout } from "./components/AuthLayout";
import { useCreateUser } from "../../hooks/auth/useCreateUser";
import { toast } from "sonner";
import { signupSchema } from "../../utils/validationSchemas";

/* 🔹 Input Border Styling */
const inputStyle = {
    "& .MuiOutlinedInput-root": {
        "& fieldset": { borderColor: designConfig.colors.background.border },
        "&:hover fieldset": { borderColor: designConfig.colors.primary.light },
        "&.Mui-focused fieldset": {
            borderColor: designConfig.colors.primary.main,
        },
    },
};

const Signup = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { mutate: createUser, isPending } = useCreateUser();
    const [showPassword, setShowPassword] = useState(false);

    /* 🔒 Hidden fields (auto-filled from params if available) */
    const sponsorIdParam = searchParams.get("sponsorId");
    const legParam = searchParams.get("leg");

    const sponsorId = sponsorIdParam ? Number(sponsorIdParam) : undefined;
    const legPosition: "LEFT" | "RIGHT" | undefined =
        legParam === "LEFT" || legParam === "RIGHT" ? legParam : undefined;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(signupSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            mobile: "",
            password: "",
        }
    });

    const handleSignup = (data: any) => {
        createUser(
            {
                ...data,
                sponsorId,
                legPosition,
            },
            {
                onSuccess: () => {
                    toast.success("Signup successful");
                    navigate("/login");
                },
                onError: (err: any) => {
                    toast.error(err.message || "Signup failed. Please try again.");
                },
            }
        );
    };

    return (
        <AuthLayout title="Sign Up" subtitle="Create your account to get started">
            <form onSubmit={handleSubmit(handleSignup)}>
                {/* Name */}
                <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            First Name <span style={{ color: 'red' }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            placeholder="Enter first name"
                            {...register("firstName")}
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                            sx={inputStyle}
                        />
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            Last Name <span style={{ color: 'red' }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            placeholder="Enter last name"
                            {...register("lastName")}
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                            sx={inputStyle}
                        />
                    </Box>
                </Box>

                {/* Email */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        Email <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="example@mail.com"
                        {...register("email")}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        sx={inputStyle}
                    />
                </Box>

                {/* Phone */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        Phone Number <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="10-digit number"
                        {...register("mobile")}
                        inputProps={{ maxLength: 10 }}
                        error={!!errors.mobile}
                        helperText={errors.mobile?.message}
                        sx={inputStyle}
                    />
                </Box>

                {/* Password */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        Password <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <TextField
                        fullWidth
                        type={showPassword ? "text" : "password"}
                        placeholder="At least 6 characters"
                        {...register("password")}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        sx={inputStyle}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {/* Submit */}
                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={isPending}
                    sx={{
                        py: 1.5,
                        borderRadius: "12px",
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "16px",
                    }}
                >
                    {isPending ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
                </Button>
            </form>

            {/* Login Link */}
            <Typography
                variant="body2"
                sx={{
                    mt: 2,
                    textAlign: "center",
                    color: designConfig.colors.text.primary,
                }}
            >
               Already have an account?{" "}
                <span
                    style={{
                        color: designConfig.colors.primary.main,
                        fontWeight: 700,
                        cursor: "pointer",
                    }}
                    onClick={() => navigate("/login")}
                >
                    Sign In
                </span>
            </Typography>
        </AuthLayout>
    );
};

export default Signup;
