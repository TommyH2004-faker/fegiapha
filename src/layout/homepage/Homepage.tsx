
import HeaderTop3Ho from '../header-footer/Header';
import CarouselHo from './components/Carousel';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import LockIcon from '@mui/icons-material/Lock';
import type { SvgIconComponent } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { isToken } from '../../utils/JwtService';

interface Feature {
  icon: SvgIconComponent;
  color: string;
  title: string;
  desc: string;
}

const features: Feature[] = [
  {
    icon: AccountTreeIcon,
    color: '#16a34a',
    title: 'Cây Gia Phả',
    desc: 'Xây dựng và trực quan hoá cây gia phả nhiều thế hệ một cách sinh động',
  },
  {
    icon: MenuBookIcon,
    color: '#2563eb',
    title: 'Lịch Sử Dòng Họ',
    desc: 'Ghi chép và lưu giữ lịch sử, sự kiện quan trọng của dòng tộc',
  },
  {
    icon: NotificationsActiveIcon,
    color: '#d97706',
    title: 'Thông Báo',
    desc: 'Nhận thông báo kịp thời về các sự kiện, thông tin mới từ dòng họ',
  },
  {
    icon: LockIcon,
    color: '#7c3aed',
    title: 'Bảo Mật',
    desc: 'Thông tin gia tộc được bảo mật, phân quyền rõ ràng theo vai trò',
  },
];

function HomePage() {
  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section
        className="py-5 text-center text-white"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          minHeight: '340px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="container">
          <h1 className="fw-bold display-5 mb-3">Hệ Thống Quản Lý Gia Phả Dòng Họ</h1>
          <p className="lead mb-4" style={{ maxWidth: 600, margin: '0 auto 24px' }}>
            Gìn giữ và phát huy giá trị văn hoá truyền thống của gia tộc qua từng thế hệ
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            {isToken() ? (
              <Link to="/giapha" className="btn btn-warning fw-bold px-4 py-2">
                Xem Gia Phả Của Tôi
              </Link>
            ) : (
              <>
                <Link to="/dangky" className="btn btn-warning fw-bold px-4 py-2">
                  Tạo tài khoản
                </Link>
                <Link to="/dangnhap" className="btn btn-outline-light px-4 py-2">
                  Đăng nhập
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ===== TOP 3 HỌ NỔI BẬT ===== */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center fw-bold mb-2">Các Dòng Họ Nổi Bật</h2>
          <p className="text-center text-muted mb-4">Những dòng họ tiêu biểu trong hệ thống</p>
          <HeaderTop3Ho />
        </div>
      </section>

      {/* ===== CAROUSEL TẤT CẢ DÒNG HỌ ===== */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-2">Tất Cả Dòng Họ</h2>
          <p className="text-center text-muted mb-4">Khám phá các dòng họ đang có mặt trong hệ thống</p>
          <CarouselHo />
        </div>
      </section>

      {/* ===== TÍNH NĂNG NỔI BẬT ===== */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-2">Tính Năng Nổi Bật</h2>
          <p className="text-center text-muted mb-5">Mọi thứ bạn cần để quản lý thông tin gia tộc</p>
          <div className="row g-4">
            {features.map((f) => (
              <div className="col-12 col-sm-6 col-lg-3" key={f.title}>
                <div
                  className="card h-100 border-0 text-center p-4"
                  style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: `${f.color}18`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                    }}
                  >
                    <f.icon sx={{ fontSize: 34, color: f.color }} />
                  </div>
                  <h5 className="fw-bold mb-2">{f.title}</h5>
                  <p className="text-muted mb-0">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CALL TO ACTION ===== */}
      <section
        className="py-5 text-center text-white"
        style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
      >
        <div className="container">
          <h2 className="fw-bold mb-3">Bắt Đầu Ngay Hôm Nay</h2>
          <p className="lead mb-4">Đăng ký miễn phí và kết nối với dòng tộc của bạn</p>
          {isToken() ? (
            <Link to="/giapha" className="btn btn-dark fw-bold px-5 py-2" style={{ borderRadius: 30 }}>
              Vào Gia Phả Ngay
            </Link>
          ) : (
            <Link to="/tinh-nang" className="btn btn-dark fw-bold px-5 py-2" style={{ borderRadius: 30 }}>
              Khám phá ngay
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}

export default HomePage;

