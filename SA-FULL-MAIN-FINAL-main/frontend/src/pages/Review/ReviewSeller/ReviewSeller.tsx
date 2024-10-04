import { Alert, Button, Modal, Rate, Spin, Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Navbarproducts from '../../../component/navbarProducts';
import { MemberInterface } from '../../../interfaces/Member'; // import interface สำหรับ Member
import { ProductsInterface } from '../../../interfaces/Products';
import { SellerInterface } from "../../../interfaces/Seller";
import { Review } from '../../../interfaces/review';
import { GetSellerByMemberId } from "../../../services/http/index";
import './ReviewSeller.css'; // นำเข้า CSS

const ReviewSell: React.FC = () => {
  const [products, setProducts] = useState<ProductsInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductsInterface | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [members, setMembers] = useState<MemberInterface[]>([]); // state สำหรับเก็บข้อมูลสมาชิก
  const MemberID = Number(localStorage.getItem("id"));
  const [seller, setSeller] = useState<SellerInterface | null>(null);
  const [sellerID, setSellerId] = useState<number | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<ProductsInterface[]>(`http://localhost:8000/products/seller/${sellerID}`);
        setProducts((response.data as any).products || response.data);
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า');
      }
    };

    const fetchSellerData = async () => {
      try {
        const sellerData = await GetSellerByMemberId(MemberID);
        console.log("Seller data from API: ", sellerData); // ตรวจสอบข้อมูลที่ได้จาก API
        setSeller(sellerData.seller);
        setSellerId(sellerData.seller_id); // เก็บข้อมูล seller ใน state
      } catch (error) {
        console.error("Error fetching seller data:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get<Review[]>('http://localhost:8000/review');
        setReviews(response.data);
      } catch (err) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลรีวิว:', err);
      }
    };

    const fetchMembers = async () => { // ฟังก์ชันสำหรับดึงข้อมูลสมาชิก
      try {
        const response = await axios.get<MemberInterface[]>('http://localhost:8000/member');
        setMembers(response.data);
      } catch (err) {
        console.error('Error fetching members:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
    fetchProducts();
    fetchReviews();
    fetchMembers(); // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูลสมาชิก
  }, [sellerID]);

  const showModal = (product: ProductsInterface) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  if (loading) return <Spin tip="Loading products..." />;
  if (error) return <Alert message={error} type="error" />;

  const productsWithReviews = products.filter((product) =>
    reviews.some((review) => review.ProductsID === product.ID)
  );

  const columns = [
    {
      title: "Title",
      dataIndex: "Title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "Description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "Price",
      key: "price",
      render: (price: number) => `฿${price.toFixed(2)}`,
    },
    {
      title: "Picture",
      dataIndex: "PictureProduct",
      key: "PictureProduct",
      width:'200px',
      render: (text: string) => (
        <img
          src={text}
          alt="product"
          style={{ width: 150, height: 150, objectFit: "cover" }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
          }}
        />
      ),
    },
    {
      title: "Review Status",
      key: "review",
      render: (record: ProductsInterface) => (
        <Button 
          onClick={() => showModal(record)} 
          type="primary" 
          style={{ backgroundColor: '#ff8c1a', borderColor: '#ff8c1a' }}
        >
          ดูรีวิว
        </Button>
      ),
      width: '200px',
    },
  ];

  return (
    <div>
      <Navbarproducts />
      <div className="table-container"> {/* เพิ่ม div นี้ */}
        <Table
          rowKey="ID"
          columns={columns}
          dataSource={productsWithReviews}
          pagination={false}
          className="custom-table"
          style={{ margin: "0 150px", width: '95%' }} // อาจจะลบออกถ้าต้องการให้ CSS จัดการ
        />
      </div>
  
      <Modal
        title={`คุณกำลังดูรีวิวสินค้า: ${selectedProduct?.Title}`}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {reviews.length > 0 ? (
          reviews
            .filter((review) => review.ProductsID === selectedProduct?.ID)
            .map((review, index) => {
              const member = members.find(member => member.ID === review.MemberID);
              return (
                <div key={index} style={{ marginBottom: '16px', padding: '10px', border: '1px solid #f0f0f0', borderRadius: '5px', backgroundColor: '#f4f0ec' }}>
                  <p>คะแนน: <Rate allowHalf disabled value={review.Rating || 0} /></p>
                  <p>ความคิดเห็น: {review.Comment}</p>
                  {member && <p>โดย: {member.Username}</p>}
                </div>
              );
            })
        ) : (
          <p>ยังไม่มีรีวิวสำหรับสินค้านี้</p>
        )}
      </Modal>
    </div>
  );
};  

export default ReviewSell;
