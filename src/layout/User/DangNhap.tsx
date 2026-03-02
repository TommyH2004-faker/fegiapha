import React, { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import {
  Button,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import useScrollToTop from "../../hooks/ScrollToTop";
import { useAuth } from "../../utils/AuthContext";
import { endpointBe } from "../../utils/contant";
import { jwtDecode } from "jwt-decode";


const DangNhap: React.FC = () => {
  useScrollToTop();
  const navigate = useNavigate();
  const { setLoggedIn } = useAuth();

  const [tenDangNhap, setTenDangNhap] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(endpointBe + "/api/ControllerLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenDangNhap,
          matKhau,
        }),
      });

      const result = await res.json();
      console.log("RESULT LOGIN:", result);
      console.log("HTTP STATUS:", res.status);
      if (!res.ok || !result.isSuccess) {
        switch (result.errorMessage) {
          case "ACCOUNT_NOT_FOUND":
            toast.error("Tài khoản không tồn tại");
            return;

          case "ACCOUNT_NOT_ACTIVATED":
            toast.warning("Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email!");
            return;

          case "WRONG_PASSWORD":
            toast.error("Mật khẩu không đúng");
            return;

          default:
            toast.error("Đăng nhập thất bại");
            return;
        }
      }

      const token = result.data?.token;

      if (!token) {
        toast.error("Không nhận được token từ server");
        return;
      }

      // Lưu token
      localStorage.setItem("token", token);
      // decode token 
      // ✅ Decode token
const decoded: unknown = jwtDecode(token);

console.log("DECODED TOKEN:", decoded);
      
      // permissionService.setPermission() không còn cần thiết
      // vì roleInHo và currentHoId đã có trong JWT token
      
      setLoggedIn(true);

      toast.success("Đăng nhập thành công!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Không thể kết nối tới server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container my-5 py-4 rounded-5 shadow bg-light"
      style={{ maxWidth: "450px" }}
    >
      <h1 className="text-center mb-4">ĐĂNG NHẬP</h1>

      <form onSubmit={handleSubmit} style={{ padding: "0 20px" }}>
        <TextField
          fullWidth
          required
          label="Tên đăng nhập"
          value={tenDangNhap}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTenDangNhap(e.target.value)
          }
          disabled={loading}
        />

        <TextField
          fullWidth
          required
          type={showPassword ? "text" : "password"}
          label="Mật khẩu"
          value={matKhau}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setMatKhau(e.target.value)
          }
          sx={{ mt: 2 }}
          disabled={loading}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <div className="d-flex justify-content-end mt-2 px-3">
          <span>
            Bạn chưa có tài khoản? <Link to="/dangky">Đăng ký</Link>
          </span>
        </div>

        <div className="text-center my-3">
          <Button fullWidth variant="outlined" type="submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </div>
      </form>

      <div className="d-flex justify-content-end mt-2 px-3">
        <Link to="/forgot-password">Quên mật khẩu?</Link>
      </div>
    </div>
  );
};

export default DangNhap;
