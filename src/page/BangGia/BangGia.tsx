import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    ToggleButton,
    ToggleButtonGroup,
    Chip,
    Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useState } from "react";

const plans = [
    {
        name: "Free",
        monthly: 0,
        yearly: 0,
        color: "#64748b",
        bg: "#f1f5f9",
        features: [
            "Tạo 1 dòng họ",
            "Tối đa 50 thành viên",
            "Cây gia phả cơ bản",
            "Thêm / sửa thành viên",
            "Quản lý hôn nhân",
        ],
    },
    {
        name: "Pro",
        monthly: 20000,
        yearly: 200000,
        color: "#2563eb",
        bg: "#dbeafe",
        features: [
            "Tạo 1 dòng họ",
            "Không giới hạn thành viên",
            "Upload ảnh Cloudinary",
            "Xuất PDF",
            "Zoom nâng cao",
            "Thông báo Email",
        ],
        highlight: true,
    },
    {
        name: "Business",
        monthly: 50000,
        yearly: 500000,
        color: "#7c3aed",
        bg: "#ede9fe",
        features: [
            "Tạo nhiều dòng họ",
            "Quản lý nhiều trưởng họ",
            "Phân quyền nâng cao",
            "Thống kê & báo cáo",
            "Xuất PDF nâng cao",
            "Ưu tiên hỗ trợ",
        ],
    },
    {
        name: "Enterprise",
        monthly: 100000,
        yearly: 1000000,
        color: "#ea580c",
        bg: "#ffedd5",
        features: [
            "Không giới hạn toàn bộ",
            "Server riêng",
            "Backup tự động",
            "Tùy chỉnh theo yêu cầu",
            "Hỗ trợ 24/7",
        ],
    },
];

const BangGiaPage = () => {
    const [billing, setBilling] = useState<"month" | "year">("month");

    return (
        <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", pb: 10 }}>
            {/* Hero */}
            <Box
                sx={{
                    background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                    py: 8,
                    textAlign: "center",
                    color: "white",
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                        Bảng Giá Dịch Vụ
                    </Typography>
                    <Typography variant="h6" sx={{ color: "#94a3b8", mb: 4 }}>
                        Chọn gói phù hợp với quy mô dòng họ của bạn
                    </Typography>

                    <ToggleButtonGroup
                        value={billing}
                        exclusive
                        onChange={(_, value) => value && setBilling(value)}
                        sx={{ bgcolor: "white", borderRadius: 2 }}
                    >
                        <ToggleButton value="month">Thanh toán tháng</ToggleButton>
                        <ToggleButton value="year">
                            Thanh toán năm
                            <Chip
                                label="-20%"
                                size="small"
                                sx={{ ml: 1, bgcolor: "#16a34a", color: "white" }}
                            />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: 6 }}>
                <Divider sx={{ mb: 5 }}>
                    <Chip label="Các gói dịch vụ" />
                </Divider>

                <Grid container spacing={3}>
                    {plans.map((plan) => {
                        const price =
                            billing === "month" ? plan.monthly : plan.yearly;

                        return (
                            <Grid size={{ xs: 12, md: 6, lg: 3 }} key={plan.name}>
                                <Card
                                    sx={{
                                        height: "100%",
                                        borderRadius: 4,
                                        border: plan.highlight
                                            ? "2px solid #2563eb"
                                            : "1px solid #e2e8f0",
                                        boxShadow: plan.highlight
                                            ? "0 8px 30px rgba(37,99,235,0.2)"
                                            : "0 2px 12px rgba(0,0,0,0.06)",
                                        transform: plan.highlight ? "scale(1.03)" : "none",
                                    }}
                                >
                                    <CardContent sx={{ p: 4 }}>
                                        <Typography
                                            variant="h6"
                                            fontWeight="bold"
                                            gutterBottom
                                        >
                                            {plan.name}
                                        </Typography>

                                        <Typography
                                            variant="h4"
                                            fontWeight="bold"
                                            sx={{ my: 2 }}
                                        >
                                            {price === 0
                                                ? "Miễn phí"
                                                : `${price.toLocaleString()}đ`}
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary">
                                            {price === 0
                                                ? ""
                                                : billing === "month"
                                                    ? "/ tháng"
                                                    : "/ năm"}
                                        </Typography>

                                        <Box sx={{ mt: 3, mb: 3 }}>
                                            {plan.features.map((f) => (
                                                <Box
                                                    key={f}
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 1,
                                                        mb: 1,
                                                    }}
                                                >
                                                    <CheckCircleIcon
                                                        sx={{ fontSize: 18, color: plan.color }}
                                                    />
                                                    <Typography variant="body2">{f}</Typography>
                                                </Box>
                                            ))}
                                        </Box>

                                        <Button
                                            fullWidth
                                            variant={plan.highlight ? "contained" : "outlined"}
                                            sx={{
                                                borderRadius: 3,
                                                py: 1.2,
                                                fontWeight: 600,
                                            }}
                                        >
                                            {plan.name === "Free"
                                                ? "Dùng miễn phí"
                                                : "Thanh toán"}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>
        </Box>
    );
};

export default BangGiaPage;