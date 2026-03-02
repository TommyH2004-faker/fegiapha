import React, { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  Paper,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Phone,
  Person,
  PhotoCamera,
  Save,
  Lock,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import useScrollToTop from "../../hooks/ScrollToTop";
import { useAuth } from "../../utils/AuthContext";
import { getIdUserByToken } from "../../utils/JwtService";
import { getUserById } from "../../api/UserApi";

interface User {
  id: string;
  tenDangNhap: string;
  gmail: string;
  enabled: boolean;
  avatar: string;
  gioiTinh: boolean;
  soDienThoai: string;
  availableHos: { id: string; tenHo: string; role: string }[];
}

const ProfilePage: React.FC = () => {
  useScrollToTop();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [tabValue, setTabValue] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewAvatar, setPreviewAvatar] = useState("");
  const [, setSelectedFile] = useState<File | null>(null);

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  // Redirect nếu chưa login
  useEffect(() => {
    if (!isLoggedIn) navigate("/dangnhap");
  }, [isLoggedIn, navigate]);

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const id = getIdUserByToken();
        if (!id) throw new Error("Không lấy được ID từ token");

       const response = await getUserById(id);
       console.log("User data:", response);
      const userData = await getUserById(id);
      console.log("User data:", userData);

      setUser({
        id: userData.id,
        tenDangNhap: userData.tenDangNhap ?? "",
        gmail: userData.gmail ?? "",
        enabled: userData.enabled,
        avatar: userData.avatar ?? "",
        gioiTinh: userData.gioiTinh,
        soDienThoai: userData.soDienThoai ?? "",
        availableHos: userData.availableHos ?? [],
      });

      setPreviewAvatar(userData.avatar ?? "");
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) fetchUser();
  }, [isLoggedIn]);

  // Update field
  const handleChange = (field: keyof User, value: unknown) => {
    if (!user) return;
    setUser({ ...user, [field]: value });
  };

  // Upload avatar preview
  const handleAvatarChange = (file: File) => {
    setSelectedFile(file);
    setPreviewAvatar(URL.createObjectURL(file));
  };

  // Update profile
  const handleUpdateProfile = async () => {
    if (!user) return;

    try {
      // TODO: Gọi API update profile
      // TODO: Nếu có selectedFile -> upload avatar

      toast.success("Cập nhật thông tin thành công");
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  // Change password
  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = passwords;

    if (!oldPassword || !newPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      // TODO: gọi API change password
      toast.success("Đổi mật khẩu thành công");
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      toast.error("Đổi mật khẩu thất bại");
    }
  };

  if (!isLoggedIn || loading) {
    return (
      <Box textAlign="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) return null;

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", my: 6 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Hồ Sơ Cá Nhân
        </Typography>

        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 3 }}>
          <Tab label="Thông tin cá nhân" />
          <Tab label="Đổi mật khẩu" />
        </Tabs>

        {tabValue === 0 && (
          <>
            {/* Avatar */}
            <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
              <Box position="relative">
                <Avatar
                  src={previewAvatar}
                  sx={{ width: 120, height: 120 }}
                />

                <IconButton
                  component="label"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    backgroundColor: "#1976d2",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#1565c0" },
                  }}
                >
                  <PhotoCamera />
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleAvatarChange(file);
                    }}
                  />
                </IconButton>
              </Box>
            </Box>

            {/* Username */}
            <TextField
              fullWidth
              label="Tên đăng nhập"
              value={user.tenDangNhap}
              disabled
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />

            {/* Email */}
            <TextField
              fullWidth
              label="Email"
              value={user.gmail}
              margin="normal"
              onChange={(e) => handleChange("gmail", e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />

            {/* Phone */}
            <TextField
              fullWidth
              label="Số điện thoại"
              value={user.soDienThoai}
              margin="normal"
              onChange={(e) => handleChange("soDienThoai", e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone />
                  </InputAdornment>
                ),
              }}
            />

            <Box textAlign="center" mt={3}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleUpdateProfile}
              >
                Lưu thông tin
              </Button>
            </Box>
          </>
        )}

        {tabValue === 1 && (
          <form onSubmit={handlePasswordChange}>
            {["oldPassword", "newPassword", "confirmPassword"].map((field, i) => (
              <TextField
                key={field}
                fullWidth
                type={showPassword ? "text" : "password"}
                label={
                  i === 0
                    ? "Mật khẩu cũ"
                    : i === 1
                    ? "Mật khẩu mới"
                    : "Xác nhận mật khẩu"
                }
                value={passwords[field as keyof typeof passwords]}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    [field]: e.target.value,
                  })
                }
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            ))}

            <Box textAlign="center" mt={3}>
              <Button variant="contained" type="submit">
                Đổi mật khẩu
              </Button>
            </Box>
          </form>
        )}
      </Paper>
    </Box>
  );
};

export default ProfilePage;