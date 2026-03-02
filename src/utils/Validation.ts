import { endpointBe } from "./contant";

// Type định nghĩa cho function setter
type SetErrorFunction = (message: string) => void;

// Hàm check email xem tồn tại chưa
export const checkExistEmail = async (setErrorEmail: SetErrorFunction, email: string) => {
   const endpoint = endpointBe + `/api/ControllerLogin/check-email?email=${email}`;
   
   try {
      const response = await fetch(endpoint);
      const data = await response.json();
      
      if (data === true) {
         setErrorEmail("Email đã tồn tại!");
         return true;
      }
      return false;
   } catch {
      console.log("Lỗi api khi gọi hàm kiểm tra email");
      return false;
   }
};

// Hàm check username xem tồn tại chưa
export const checkExistUsername = async (setErrorUsername: SetErrorFunction, username: string) => {
   if (username.trim() === "") {
      return false;
   }
   if (username.trim().length < 8) {
      setErrorUsername("Tên đăng nhập phải chứa ít nhất 8 ký tự");
      return true;
   }
   
   const endpoint = endpointBe + `/api/ControllerLogin/check-username?username=${username}`;
   
   try {
      const response = await fetch(endpoint);
      const data = await response.json();

      if (data === true) {
         setErrorUsername("Username đã tồn tại!");
         return true;
      }
      return false;
   } catch {
      console.log("Lỗi api khi gọi hàm kiểm tra username");
      return false;
   }
};

// Hàm check mật khẩu có đúng định dạng không
export const checkPassword = (setErrorPassword: SetErrorFunction, password: string) => {
   const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
   if (password === "") {
      return false;
   } else if (!passwordRegex.test(password)) {
      setErrorPassword(
         "Mật khẩu phải có ít nhất 8 ký tự và bao gồm chữ và số."
      );
      return true;
   } else {
      setErrorPassword("");
      return false;
   }
};

// Hàm check mật khẩu nhập lại
export const checkRepeatPassword = (setErrorRepeatPassword: SetErrorFunction, repeatPassword: string, password: string) => {
   if (repeatPassword !== password) {
      setErrorRepeatPassword("Mật khẩu không khớp.");
      return true;
   } else {
      setErrorRepeatPassword("");
      return false;
   }
};

// Hàm check số điện thoại có đúng định dạng không
export const checkPhoneNumber = (setErrorPhoneNumber: SetErrorFunction, phoneNumber: string) => {
   const phoneNumberRegex = /^(0[1-9]|84[1-9])[0-9]{8}$/;
   if (phoneNumber.trim() === "") {
      return false;
   } else if (!phoneNumberRegex.test(phoneNumber.trim())) {
      setErrorPhoneNumber("Số điện thoại không đúng.");
      return true;
   } else {
      setErrorPhoneNumber("");
      return false;
   }
};