import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Alert, CircularProgress, Button, Container, Typography, Box } from '@mui/material';
import { CheckCircle, Error } from '@mui/icons-material';
import { endpointBe } from '../../utils/contant';

function KichHoatTaiKhoan() {
    // Lấy từ path params: /active/:code/:userId
    const { code, userId } = useParams<{code: string; userId: string}>();
    
    const [daKichHoat, setDaKichHoat] = useState<boolean | null>(null); // null = đang loading
    const [thongBao, setThongBao] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (code && userId) {
            thucHienKichHoat(code, userId);
        } else {
            setThongBao("Thiếu thông tin kích hoạt. Vui lòng kiểm tra lại đường link.");
            setDaKichHoat(false);
            setLoading(false);
        }
    }, [code, userId]);

    const thucHienKichHoat = async (activationCode: string, userId: string) => {
        try {
            setLoading(true);
            
            // Gọi API theo backend hiện tại
            const url = `${endpointBe}/activate`;
            
            const requestBody = {
                userId: userId,
                activationCode: activationCode
            };

            console.log('Gửi request kích hoạt:', requestBody);

            const response = await fetch(url, { 
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();
            console.log('Response từ server:', data);

            if (response.ok && data.isSuccess) {
                setDaKichHoat(true);
                setThongBao("Kích hoạt tài khoản thành công!");
            } else {
                const errorMessage = data.errorMessage || "Không thể kích hoạt tài khoản";
                
                // Xử lý các trường hợp lỗi cụ thể
                if (errorMessage.includes("đã được kích hoạt")) {
                    setDaKichHoat(true);
                    setThongBao("Tài khoản đã được kích hoạt trước đó. Bạn có thể đăng nhập!");
                } else if (errorMessage.includes("không hợp lệ") || errorMessage.includes("hết hạn")) {
                    setDaKichHoat(false);
                    setThongBao("Mã kích hoạt không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu gửi lại mã kích hoạt.");
                } else if (errorMessage.includes("không tìm thấy")) {
                    setDaKichHoat(false);
                    setThongBao("Không tìm thấy tài khoản. Vui lòng kiểm tra lại thông tin.");
                } else {
                    setDaKichHoat(false);
                    setThongBao("Kích hoạt tài khoản không thành công: " + errorMessage);
                }
            }
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
            setDaKichHoat(false);
            setThongBao("Có lỗi xảy ra khi kết nối đến server. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Đang kích hoạt tài khoản...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Vui lòng chờ trong giây lát
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Kích hoạt tài khoản
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                {daKichHoat ? (
                    <CheckCircle sx={{ fontSize: 80, color: 'success.main' }} />
                ) : (
                    <Error sx={{ fontSize: 80, color: 'error.main' }} />
                )}
            </Box>

            <Alert 
                severity={daKichHoat ? "success" : "error"} 
                sx={{ mb: 3, textAlign: 'center' }}
            >
                <Typography variant="body1">
                    {thongBao}
                </Typography>
            </Alert>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                {daKichHoat ? (
                    <Button 
                        component={Link}
                        to="/dangnhap"
                        variant="contained" 
                        color="primary"
                        size="large"
                    >
                        Đăng nhập ngay
                    </Button>
                ) : (
                    <>
                        <Button 
                            component={Link}
                            to="/dangky"
                            variant="outlined"
                            color="primary"
                        >
                            Đăng ký lại
                        </Button>
                        <Button 
                            component={Link}
                            to="/"
                            variant="contained"
                            color="primary"
                        >
                            Trang chủ
                        </Button>
                    </>
                )}
            </Box>

            {/* Debug info - chỉ hiện trong development */}
            {import.meta.env.MODE === 'development' && (
                <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="caption" display="block">
                        Debug Info:
                    </Typography>
                    <Typography variant="caption" display="block">
                        Activation Code: {code}
                    </Typography>
                    <Typography variant="caption" display="block">
                        User ID: {userId}
                    </Typography>
                </Box>
            )}
        </Container>
    );
}

export default KichHoatTaiKhoan;