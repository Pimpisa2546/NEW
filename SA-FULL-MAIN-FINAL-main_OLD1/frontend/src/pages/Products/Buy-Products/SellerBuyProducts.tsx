
// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom"; // เพิ่ม useParams
// import { CreateOrder, CreateProductsOrder, GetProductsById ,CreateRoomChat,GetSellerByMemberId,GetMemberBySeller} from '../../../services/http/index';
// import "./BuyProducts.css";
// import { message ,Avatar ,Button} from "antd";
// import ShopRating from '../../Review/ReviewSeller/ShopRating';
// import NavbarSeller from "../../../component/navbarSeller.tsx";


// interface Products {
//   Title: string;
//   Price: number;
//   PictureProduct: string;
//   Description: string;
//   SellerID: number;
// }

// interface MemberBySeller {
//   MemberID: number;
//   FirstName: string;
//   LastName: string;
//   ProfilePic: string;
//   SellerID: string;
// }

// const Byproduct: React.FC = () => {

//   const [product, setProduct] = useState<Products | null>(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const navigate = useNavigate();
//   const [memberId, setMemberId] = useState<number | null>(null);
//   const MemberID = Number(localStorage.getItem("id"));
//   const [Title, setSearchTitle] = useState<string>("");
//   const [messageApi, contextHolder] = message.useMessage();
//   const [seller, setSeller] = useState<MemberBySeller | null>(null); // เก็บข้อมูลของผู้ขาย
//   const [isShopRatingVisible, setIsShopRatingVisible] = useState(false);


//   const { id } = useParams<{ id: string }>(); // ใช้ useParams เพื่อรับ productId จาก path
//   const productId = Number(id); // แปลงค่า id เป็นตัวเลข

//   useEffect(() => {
//     const fetchProduct = async () => {
//       const data: Products = await GetProductsById(productId);
//       if (data) {
//         setProduct(data);
//       }
//     };
//     fetchProduct();
//     setMemberId(MemberID); // สมมติว่า MemberID ถูกตั้งเป็น 7
//   }, [productId]);


//   const handleShopRating = () => {
//     setIsShopRatingVisible(true); // Open the modal
//   };

//   const closeShopRating = () => {
//     setIsShopRatingVisible(false); // Close the modal
//   };

//   const handleSearch = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && Title.trim()) {
//       navigate(`/search/${Title}`); // นำทางไปยัง path ที่ต้องการ
//     }
//   };

//   useEffect(() => {
//     const fetchProductAndSeller = async () => {
//       const data: Products = await GetProductsById(productId);
//       if (data) {
//         setProduct(data);
//         // ดึงข้อมูลผู้ขายโดยใช้ SellerID
//         const sellerData = await GetMemberBySeller(data.SellerID);
//         if (sellerData) {
//           setSeller(sellerData); // เซ็ตข้อมูลผู้ขายลงใน state
//         }
//       }
//     };
//     fetchProductAndSeller();
//   }, [productId]);
  

//   const handleBuyProduct = () => {
//     setIsModalVisible(true); // Show custom Modal for confirmation
//   };

//   const handleCloseModal = () => {
//     setIsModalVisible(false); // Close the custom Modal without ordering
//   };

//   const handleChatWithSeller = async () => {
//     if (memberId !== null && product) {
//       // เช็คว่ามี memberId และ product หรือไม่
//       // ถ้ามี จะทำการสร้างห้องแชทโดยส่ง MemberID และ SellerID
//       const result = await CreateRoomChat(MemberID, product.SellerID);
      
//       // ตรวจสอบผลลัพธ์จากการสร้างห้องแชท
//       if (result) {
//         if (result.message === "Room already exists") {
//           // ถ้าห้องแชทมีอยู่แล้ว นำทางไปยังหน้า ChatBuyer
//           navigate('/ChatBuyer');
//         } else {
//           // ถ้าสร้างห้องแชทสำเร็จ จะนำทางไปยังหน้า ChatBuyer
//           navigate('/ChatBuyer');
//         }
//       } else {
//         // ถ้ามีข้อผิดพลาด จะตั้งค่าข้อความข้อผิดพลาด
//         setErrorMessage(result.message || "เกิดข้อผิดพลาดในการสร้างห้องแชท");
//       }
//     }
//   };
  

//   const confirmOrder = async () => {
//     try {
//       if (product && memberId !== null) {
//         const orderData = {
//           MemberID: memberId,
//           SellerID: product.SellerID,
//           Quantity: 1,
//           Total_price: product.Price,
//         };
  
//         const result = await CreateOrder(orderData);
  
//         if (result) {
//           const OrderID = result.data.ID;
//           const productsOrderData = {
//             OrderID: OrderID,
//             ProductID: productId,
//           };
  
//           await CreateProductsOrder(productsOrderData);
//           message.success("ซื้อสินค้าสำเร็จ!");
//         } else {
//           throw new Error("ไม่สามารถสร้างคำสั่งซื้อได้");
//         }
//       }
//     } catch (error) {
//       console.error("Error during order creation:", error);
//       message.error("เกิดข้อผิดพลาดในการซื้อสินค้า กรุณาลองใหม่อีกครั้ง");
//     } finally {
//       setIsModalVisible(false);
//     }
//   };
  

  

//   if (!product) {
//     return <div>Loading...</div>;
//   }

//   return (
//       <div className='Buyproducts'>
//       {/* Custom Modal */}
//       {isModalVisible && (
//         <div className="custom-modal">
//           <div className="modal-content">
//             <p>ต้องการซื้อสินค้าใช่หรือไม่</p>
//             <div className="modal-actions">
//               <button onClick={handleCloseModal} className="cancel-button" >ยกเลิก</button>
//               <button onClick={confirmOrder} className="confirm-button">ยืนยัน</button>
//             </div>
//           </div>
//         </div>
//       )}
//       <NavbarSeller/>
//       <h1
//       style={{
//         marginTop:"40px",
//         fontSize:"30px",
//         fontWeight:"bold"
//       }}
//       >{product.Title}</h1>
//       <h2>฿{product.Price}</h2>
//           <div className="frame-1">
//             <img src={product.PictureProduct}  alt='Product' />
//           </div>

//           <button className="Buy-products" onClick={handleBuyProduct}>ซื้อสินค้า</button>
//           <button className="Chat" onClick={handleChatWithSeller}>แชทกับผู้ขาย</button>

//           <div className="rectangle">
//             <h1>{product.Description}</h1>
//           </div>
//           <div className="seller-info">
//             {seller && (
//               <div className="seller-container">
//                 <Avatar
//                   src={seller?.ProfilePic}
//                   alt={`Contact ${seller?.FirstName || 'Unknown Seller'}`}
//                   className="custom-avatar" // เพิ่ม class สำหรับ CSS
//                 />
//                 <p className="seller-name">{seller?.FirstName} {seller?.LastName}</p>
//               </div>

//             )}
//           </div >
//             <Button onClick={handleShopRating} className="buttonreview" type="primary">
//                 ดูรีวิว
//             </Button>
//           <ShopRating
//             sellerID={product.SellerID} // You can replace this with the actual seller ID
//             visible={isShopRatingVisible}
//             onClose={closeShopRating}
//           />
//           </div>

    
//   );
// };

// export default Byproduct;
// function setErrorMessage(arg0: any) {
//   throw new Error("Function not implemented.");
// }





import { Avatar, Rate, message } from "antd";
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // เพิ่ม useParams
import NavbarMember from "../../../component/navbarSeller";
import { CreateOrder, CreateProductsOrder, CreateRoomChat, GetMemberBySeller, GetProductsById, UpProductsById } from '../../../services/http/index';
import '../../Review/ReviewSeller/ReviewSeller.css';
import "./BuyProducts.css";


interface Products {
  Title: string;
  Price: number;
  PictureProduct: string;
  Description: string;
  SellerID: number;
  Status: String;

}

interface MemberBySeller {
  MemberID: number;
  FirstName: string;
  LastName: string;
  ProfilePic: string;
  SellerID: string;
}

interface Review {
  ID: number;
  Rating: number;
  ProductsID: number;
  Comment: string;
  MemberID: number;
}

interface Member {
  ID: number;
  Username: string;
  ProfilePic: string;
}



const Byproduct: React.FC = () => {
  const [product, setProduct] = useState<Products | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const [memberId, setMemberId] = useState<number | null>(null);
  const MemberID = Number(localStorage.getItem("id"));
  const [Title, setSearchTitle] = useState<string>("");
  const [messageApi, contextHolder] = message.useMessage();
  const [seller, setSeller] = useState<MemberBySeller | null>(null); // เก็บข้อมูลของผู้ขาย
  const [isShopRatingVisible, setIsShopRatingVisible] = useState(false);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [members, setMembers] = useState<Member[]>([]);


  const { id } = useParams<{ id: string }>(); // ใช้ useParams เพื่อรับ productId จาก path
  const productId = Number(id); // แปลงค่า id เป็นตัวเลข


  useEffect(() => {
    const fetchProduct = async () => {
      const data: Products = await GetProductsById(productId);
      if (data) {
        setProduct(data);
      }
    };
    fetchProduct();
    setMemberId(MemberID); // สมมติว่า MemberID ถูกตั้งเป็น 7
  }, [productId]);


  useEffect(() => {
    const fetchProductAndSeller = async () => {
      const data: Products = await GetProductsById(productId);
      if (data) {
        setProduct(data);
        // ดึงข้อมูลผู้ขายโดยใช้ SellerID
        const sellerData = await GetMemberBySeller(data.SellerID);
        if (sellerData) {
          setSeller(sellerData); // เซ็ตข้อมูลผู้ขายลงใน state
        }
      }
    };
    fetchProductAndSeller();
  }, [productId]);
  

  const handleBuyProduct = () => {
    setIsModalVisible(true); // Show custom Modal for confirmation
  };

  const handleCloseModal = () => {
    setIsModalVisible(false); // Close the custom Modal without ordering
  };

  const handleChatWithSeller = async () => {
    if (memberId !== null && product) {
      const result = await CreateRoomChat(MemberID, product.SellerID);
      if (result) {
        if (result.message === "Room already exists") {
          navigate('/ChatBuyer');
        } else {
          navigate('/ChatBuyer');
        }
      } else {
        setErrorMessage(result.message || "เกิดข้อผิดพลาดในการสร้างห้องแชท");
      }
    }
  };

  //-------------------------

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (product?.SellerID) { // ตรวจสอบว่า product มีข้อมูลก่อน
          const response = await axios.get<Review[]>(`http://localhost:8000/review/seller/${product.SellerID}`);
          if (Array.isArray(response.data)) {
            setReviews(response.data);
          } else {
            console.error('Data is not an array:', response.data);
          }
        }
      } catch (error) {
        console.error('Error fetching reviews', error);
      }
    };

    const fetchMembers = async () => {
      try {
        const response = await axios.get<Member[]>(`http://localhost:8000/member`);
        if (Array.isArray(response.data)) {
          setMembers(response.data);
        } else {
          console.error('Data is not an array:', response.data);
        }
      } catch (error) {
        console.error('Error fetching members', error);
      }
    };

    fetchReviews();
    fetchMembers();
  }, [product?.SellerID]);


  const calculateAverageRating = () => {
    let totalRating = 0;
    let totalReviews = reviews.length;

    reviews.forEach((review) => {
      totalRating += review.Rating;
    });

    if (totalReviews > 0) {
      setAverageRating(totalRating / totalReviews);
      setReviewCount(totalReviews);
    } else {
      setAverageRating(null);
      setReviewCount(0);
    }
  };

  useEffect(() => {
    if (true) {
      calculateAverageRating();
    }
  }, [, reviews]);


  

  const confirmOrder = async () => {
    try {
      if (product && memberId !== null) {
        const orderData = {
          MemberID: memberId,
          SellerID: product.SellerID,
          Quantity: 1,
          Total_price: product.Price,
        };
        
        const result = await CreateOrder(orderData);
  
        if (result) {
          const OrderID = result.data.ID;
          const productsOrderData = {
            OrderID: OrderID,
            ProductID: productId,
          };
  
          await CreateProductsOrder(productsOrderData);
  
          // อัปเดตสถานะสินค้า หลังจากคำสั่งซื้อสำเร็จ
          const Productsdata: Products = {
            ...product,
            Status: 'NonAvailable',
          };
          await UpProductsById(productId, Productsdata);
  
          message.success("ซื้อสินค้าสำเร็จ!");
        } else {
          throw new Error("ไม่สามารถสร้างคำสั่งซื้อได้");
        }
      }
    } catch (error) {
      console.error("Error during order creation:", error);
      message.error("เกิดข้อผิดพลาดในการซื้อสินค้า กรุณาลองใหม่อีกครั้ง");
    } finally {
      // ปิด Modal หลังจากที่ทำงานเสร็จแล้ว ไม่ว่ากรณีใดๆ
      setIsModalVisible(false);
    }
  };
  
  
  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="Buyproducts">
      <NavbarMember />
      <h1
        style={{
          marginTop: "40px",
          fontSize: "30px",
          fontWeight: "bold",
        }}
      >
        {isModalVisible && (
        <div className="custom-modal">
          <div className="modal-content">
            <p>ต้องการซื้อสินค้าใช่หรือไม่</p>
            <div className="modal-actions">
              <button onClick={handleCloseModal} className="cancel-button" >ยกเลิก</button>
              <button onClick={confirmOrder} className="confirm-button">ยืนยัน</button>
            </div>
          </div>
        </div>
      )}
        {product.Title}
      </h1>
      <h2>฿{product.Price}</h2>
      <div className="frame-1">
        <img src={product.PictureProduct} alt="Product" />
      </div>
      <button className="Buy-products" onClick={handleBuyProduct}>
        ซื้อสินค้า
      </button>
      <button className="Chat" onClick={handleChatWithSeller}>
        แชทกับผู้ขาย
      </button>

      <div className="rectangle">
        <h1>{product.Description}</h1>
      </div>

      <div className="seller-info">
        {seller && (
          <div className="seller-container">
            <Avatar
              src={seller?.ProfilePic}
              alt={`Contact ${seller?.FirstName || "Unknown Seller"}`}
              className="custom-avatar" // เพิ่ม class สำหรับ CSS
            />
            <p className="seller-name">
              {seller?.FirstName} {seller?.LastName}
            </p>
          </div>
        )}
      </div>

      {/* ส่วนแสดงรีวิวแบบตลอดเวลา */}
      <div className="review-page-Bymember">
  <p>คะแนนเฉลี่ย: {averageRating?.toFixed(2)} ⭐</p>
  <Rate allowHalf disabled value={averageRating || 0} />
  <p>จำนวนรีวิว: {reviewCount}</p>
  <div className="review-container">
    {reviews.map((review) => {
      const member = members.find((m) => m.ID === review.MemberID);
      return (
        <div
          key={review.ID}
          style={{
            margin: "10px 0",
            padding: "10px",
            border: "1px solid #f0f0f0",
            borderRadius: "5px",
            backgroundColor: "#f4f0ec",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={member ? member.ProfilePic : "https://via.placeholder.com/10"} 
              alt={member?.Username || "Unknown User"}
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                marginRight: "8px",
                objectFit: "cover",
              }}
            />
            <p style={{ margin: 0 }}>
              <strong>{member ? member.Username : "Unknown User"}</strong>
            </p>
          </div>
          <p>คะแนน: <Rate allowHalf disabled value={review.Rating} /></p>
          <p>ความคิดเห็น: {review.Comment}</p>
        </div>
      );
    })}
  </div>
</div>

    </div>
  );
};

export default Byproduct;
function setErrorMessage(arg0: any) {
  throw new Error("Function not implemented.");
}

