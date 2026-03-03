import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../layout/admin/components/RequireAdmin";
import type { NavigateFunction } from "react-router-dom";

export function isTokenExpired(token: string) {
   const decodedToken = jwtDecode(token);

   if (!decodedToken.exp) {
      return false;
   }
   const currentTime = Date.now() / 1000;
   return currentTime < decodedToken.exp;
}

export function isToken() {
   const token = localStorage.getItem('token');
   if (token) {
      return true;
   }
   return false;
}


export function getAvatarByToken() {
   const token = localStorage.getItem('token');
   if (token) {
      const decodedToken = jwtDecode(token) as JwtPayload;
      return decodedToken.avatar;
   }
}
export function getLastNameByToken() {
   const token = localStorage.getItem('token');
   if (token) {
      const decodedToken = jwtDecode(token) as JwtPayload;
      const fullName = decodedToken.sub;
      const nameParts = fullName.split(" ");
      return nameParts[nameParts.length - 1];
   }
}

export function getUsernameByToken() {
   const token = localStorage.getItem('token');
   if (token) {
      return jwtDecode(token).sub;
   }
}

export function getIdUserByToken() {
   const token = localStorage.getItem('token');
   if (token) {
      const decodedToken = jwtDecode(token) as JwtPayload;
      return decodedToken.sub;
   }
}

export function getCurrentHoIdByToken(): string | null {
   const token = localStorage.getItem('token');
   if (token) {
      const decodedToken = jwtDecode(token) as JwtPayload;
      return decodedToken.currentHoId || null;
   }
   return null;
}

export function getRoleInHoByToken(): number {
   const token = localStorage.getItem('token');
   if (token) {
      const decodedToken = jwtDecode(token) as JwtPayload;
      return decodedToken.roleInHo ? parseInt(decodedToken.roleInHo, 10) : 0; // Mặc định là ThanhVien (1)
   }
   return 1;
}

export function getRoleByToken() {
   const token = localStorage.getItem('token');
   if (token) {
      const decodedToken = jwtDecode(token) as JwtPayload;
      return decodedToken.role;
   }
}

export function logout(navigate: NavigateFunction) {
   navigate("/dangnhap");
   localStorage.removeItem('token');
}


