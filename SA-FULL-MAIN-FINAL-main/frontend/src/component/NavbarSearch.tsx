
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logonew.png";
import "./navbarMember.css";
import { useState, useEffect} from "react";
import { message, } from "antd";
import { MemberInterface } from '../interfaces/Member';
import {GetMemberById,GetSellerByMemberId} from '../services/http/index'
import SongThor from "../component/LogoText"

const NavbarMember = () => {
    const [uid , setUid] = useState<number | null>(Number(localStorage.getItem("id")))
    const [messageApi, contextHolder] = message.useMessage();
    const [users, setUsers] = useState<MemberInterface | null>(null);
    const [Title, setSearchTitle] = useState<string>("");
    const MemberID = Number(localStorage.getItem("id"));
    const GetMemberid = async (user_id:number) => {

        let res = await GetMemberById(user_id);
        
        if (res.status == 200) {
    
          setUsers(res.data);
    
        } else {
    
    
          messageApi.open({
    
            type: "error",
    
            content: res.data.error,
    
          });
    
        }
    
      };
    
      useEffect(() => {
        setUid(Number(localStorage.getItem("id")))
        console.log(uid);
        GetMemberid(uid); // ดึงข้อมูลผู้ใช้เมื่อหน้าโหลด
      }, []);

    // State to manage the sidebar collapse
    const [isCollapsed, setIsCollapsed] = useState(true);
    const navigate = useNavigate(); // Hook for navigation

    // Toggle sidebar function
    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleHome = async () => {
      if (MemberID === null) {
        messageApi.open({ type: "error", content: "ไม่พบ ID สมาชิก" });
        return;
      }
    
      try {
        const sellerData = await GetSellerByMemberId(MemberID);
        if (sellerData && sellerData.error) {
          messageApi.open({
            type: "error",
            content: sellerData.error,
          });
          navigate('/HomeMember');
        } else if (sellerData) {
          navigate('/HomeSeller');
        } else {
          navigate('/HomeMember');
        }
      } catch (error) {
        messageApi.open({
          type: "error",
          content: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ขาย",
        });
      }
    };

    const Logout = () => {
        localStorage.clear();
        messageApi.success("Logout successful");
        setTimeout(() => {
          location.href = "/";
        }, 2000);
    };

    const handleToOrder = () => {
      navigate('/Card'); // Navigate to ApplyToSeller page
      };

    
      const handleSearch = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && Title.trim()) {
          navigate(`/search/${Title}`); // นำทางไปยัง path ที่ต้องการ
        }
      };

    return (
        <html lang="en" dir="ltr">
        {contextHolder}
        <head>
            <meta charSet="utf-8"></meta>
            <title>Sidebar Dashboard Template with Sub Menu</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"></link>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/brands.min.css" charSet="utf-8"></script>
        </head>
        <body>
            <div className={`wrappermem ${isCollapsed ? 'collapsemem' : ''}`}>
                <div className="headermem">
                    <div className="header-menumem">
                        <div className="titlemem">
                            <img src={Logo} className="navmemlogo" alt="logo" />
                            <SongThor/>
                        </div>
                        <div className="sidebar-btnmem" onClick={toggleSidebar}>
                            <i className="fa-solid fa-bars"></i>
                            <i className="fas fa-house" onClick={handleHome} style={{marginLeft:"30px"}}></i> <span></span>
                        </div>

                        <ul>
                            <li>
                                <div className="navbar-searchmem">
                                <input
                                      type="text"
                                      placeholder="ค้นหา"
                                      value={Title}
                                      onChange={(e) => setSearchTitle(e.target.value)} // อัปเดตคำค้นหา
                                      onKeyPress={handleSearch} // เรียกใช้ฟังก์ชันเมื่อกด Enter
                                    />
                                </div>
                            </li>
                            <li><a href="#"><i className="fa-solid fa-search"> </i> </a></li>
                            <li>
                            </li>
                            <li><a onClick={handleToOrder}><i className="fa-solid fa-cart-shopping"> </i> </a></li>
                            <li><a ><i className="fa-solid fa-power-off" onClick={Logout}> </i> </a></li>
                        </ul>
                    </div>
                </div>

                <div className="main-containermem"></div>
            </div>
        </body>
        </html>
    );
};

export default NavbarMember;
