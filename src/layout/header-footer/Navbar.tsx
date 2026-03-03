import {Link, NavLink, useLocation, useNavigate} from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { useAuth } from "../../utils/AuthContext";
import { getAvatarByToken, getLastNameByToken, getRoleByToken, isToken, logout } from "../../utils/JwtService";
import { useEffect, useState } from "react";
import { endpointBe } from "../../utils/contant";

interface Notification {
  id: string;
  noiDung: string;
  daDoc: boolean;
  createdAt?: string;
  isGlobal?: boolean;
  chiHoId?: string;
  hoId?: string;
}

type TabType = 'all' | 'new' | 'old';

function Navbar() {

  const { setLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.daDoc).length;

  // Hàm load notifications
  const loadNotifications = () => {
    if (!isToken()) return;

    fetch(endpointBe + "/api/notification/my", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => setNotifications(data))
      .catch(() => console.log("Load notification thất bại"));
  };

  // Load lần đầu
  useEffect(() => {
    loadNotifications();
  }, []);

  // Auto-refresh mỗi 60 giây (background polling)
  useEffect(() => {
    if (!isToken()) return;

    const interval = setInterval(() => {
      loadNotifications();
    }, 60000); // 60 giây

    return () => clearInterval(interval);
  }, []);

  // Load lại khi mở dropdown
  const handleDropdownToggle = () => {
    if (!dropdownOpen) {
      loadNotifications();
    }
    setDropdownOpen(prev => !prev);
  };

  const adminEndpoint = ["/admin"];
  if(adminEndpoint.includes(location.pathname)){
      return null;
  }

  const markAsRead = (id: string) => {
    fetch(endpointBe + `/api/notification/read/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, daDoc: true } : n
      )
    );
  };

  // Lọc và sắp xếp thông báo
  const getFilteredNotifications = () => {
    let filtered = [...notifications];
    
    if (activeTab === 'new') {
      filtered = filtered.filter(n => !n.daDoc);
    } else if (activeTab === 'old') {
      filtered = filtered.filter(n => n.daDoc);
    }
    
    // Sắp xếp theo thời gian mới nhất
    return filtered.sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  };

  const filteredNotifications = getFilteredNotifications();
  console.log("Avatar:", getAvatarByToken());
  return (
   
    <nav className="navbar navbar-expand-lg custom-navbar navbar-yellow bg-yellow">
      <div className="container-fluid">

        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src="/logo_main.png" style={{height:120}} />
        </Link>

        {/* TOGGLE BUTTON CHO MOBILE */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">

            <li className="nav-item">
              <NavLink className="nav-link" to="/">Trang chủ</NavLink>
            </li>

            <li className='nav-item'>
              <NavLink className='nav-link' to='/tinh-nang'>Tính năng </NavLink>
            </li>
            <li className='nav-item'>
              <NavLink className='nav-link' to='/bang-gia'>Bảng giá </NavLink>
            </li>
            {(isToken() && (
             <li className='nav-item'>
              <NavLink className='nav-link' to='/tin-tuc'>Tin tức </NavLink>
            </li>
            ))}
            <li className='nav-item'>
              <Link className='nav-link' to={"/policy"}>Chính sách</Link>
            </li>
            {isToken() && (
            <li className='nav-item'>
              <NavLink className='nav-link' to={"/giapha"}>Gia phả</NavLink>
            </li>
            )}
          </ul>

          {/* PHẦN ĐĂNG NHẬP/ĐĂNG KÝ VÀ USER MENU CHO MOBILE */}
          <div className="d-flex align-items-center">
            {!isToken() && (
              <div className="d-flex flex-column flex-lg-row gap-2">
                <Link to="/dangnhap"><Button>Đăng nhập</Button></Link>
                <Link to="/dangky"><Button>Đăng ký</Button></Link>
              </div>
            )}

            {isToken() && (
              <>
                {/* NOTIFICATION */}
                <div className='dropdown me-3'>
                  <a className='text-reset dropdown-toggle hidden-arrow'
                     data-bs-toggle='dropdown'
                     onClick={handleDropdownToggle}
                     style={{cursor: 'pointer'}}>

                    <IconButton size="small">
                      <Badge badgeContent={unreadCount} color="error">
                        <NotificationsIcon />
                      </Badge>
                    </IconButton>

                  </a>

                  <ul className="dropdown-menu dropdown-menu-end p-0" style={{width: 380, maxHeight: 500, overflow: 'hidden'}}>
                    {/* Header Tabs */}
                    <li className="px-3 pt-3 pb-2 border-bottom">
                      <div className="d-flex gap-2">
                        <button 
                          className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setActiveTab('all');
                          }}
                          style={{flex: 1, fontSize: '0.875rem'}}
                        >
                          Tất cả
                        </button>
                        <button 
                          className={`btn btn-sm ${activeTab === 'new' ? 'btn-primary' : 'btn-outline-secondary'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setActiveTab('new');
                          }}
                          style={{flex: 1, fontSize: '0.875rem'}}
                        >
                          Tin mới ({unreadCount})
                        </button>
                        <button 
                          className={`btn btn-sm ${activeTab === 'old' ? 'btn-primary' : 'btn-outline-secondary'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setActiveTab('old');
                          }}
                          style={{flex: 1, fontSize: '0.875rem'}}
                        >
                          Đã đọc
                        </button>
                      </div>
                    </li>

                    {/* Notification List with Scroll */}
                    <li style={{maxHeight: 400, overflowY: 'auto', overflowX: 'hidden'}}>
                      {filteredNotifications.length === 0 && (
                        <div className="text-center text-muted py-4">
                          Không có thông báo
                        </div>
                      )}

                      {filteredNotifications.map((n: Notification) => (
                        <a 
                          key={n.id}
                          className={`dropdown-item py-3 px-3 border-bottom ${!n.daDoc ? 'bg-light fw-bold' : ''}`}
                          onClick={() => markAsRead(n.id)}
                          style={{
                            cursor: 'pointer',
                            whiteSpace: 'normal',
                            wordWrap: 'break-word'
                          }}
                        >
                          <div className="d-flex align-items-start">
                            <div style={{flex: 1}}>
                              <div style={{fontSize: '0.9rem'}}>{n.noiDung}</div>
                              {n.createdAt && (
                                <small className="text-muted">
                                  {new Date(n.createdAt).toLocaleString('vi-VN')}
                                </small>
                              )}
                              {n.isGlobal && (
                                <span className="badge bg-warning text-dark ms-2" style={{fontSize: '0.6rem'}}>Toàn hệ thống</span>
                              )}
                              {n.hoId && !n.isGlobal && (
                                <span className="badge bg-success text-white ms-2" style={{fontSize: '0.6rem'}}>Dòng họ</span>
                              )}
                              {n.chiHoId && !n.hoId && !n.isGlobal && (
                                <span className="badge bg-info text-white ms-2" style={{fontSize: '0.6rem'}}>Chi họ</span>
                              )}
                            </div>
                            {!n.daDoc && (
                              <span className="badge bg-primary ms-2" style={{fontSize: '0.6rem'}}>Mới</span>
                            )}
                          </div>
                        </a>
                      ))}
                    </li>
                  </ul>
                </div>

                {/* AVATAR */}
                <div className='dropdown'>
                  <a className='dropdown-toggle d-flex align-items-center hidden-arrow'
                     data-bs-toggle='dropdown'>
                    <Avatar
                      alt={getLastNameByToken()?.toUpperCase()}
                      src={getAvatarByToken()}
                      sx={{width:30,height:30}}
                    />
                  </a>
              
                
                  <ul className='dropdown-menu dropdown-menu-end'>
                    <li>
                      <Link to="/profile" className="dropdown-item">
                        Thông tin cá nhân
                      </Link>
                    </li>

                    {getRoleByToken()==="ADMIN" && (
                      <li>
                        <Link to="/admin/dashboard" className="dropdown-item">
                          Quản lý
                        </Link>
                      </li>
                    )}

                    <li>
                      <a className="dropdown-item"
                         style={{cursor: 'pointer'}}
                         onClick={()=>{
                           logout(navigate);
                           setLoggedIn(false);
                         }}>
                        Đăng xuất
                      </a>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </nav>

  );
}

export default Navbar;