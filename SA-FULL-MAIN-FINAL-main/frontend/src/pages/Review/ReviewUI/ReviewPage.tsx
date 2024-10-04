import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spin, Alert, Button, Modal, Rate } from 'antd';
import { ProductsInterface } from '../../../../src/interfaces/Products';
import Re_bar from "../../../component/re_bar";
import '../../../component/re_bar.css';
import NavbarMember from '../../../component/navbarMember';
import '../../Products/Orders/Orders.css';

interface Review {
  Rating: number;
  Comment: string;
  MemberID: number;
  ProductsID: number; 
}

const ReviewPage: React.FC = () => {
  const [products, setProducts] = useState<ProductsInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductsInterface | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  const MemberID = Number(localStorage.getItem('id'));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<ProductsInterface[]>('http://localhost:8000/products');
        setProducts(response.data);
      } catch (err) {
        setError('Error fetching product data');
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get<Review[]>('http://localhost:8000/review');
        setReviews(response.data);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    fetchReviews();
  }, []);

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

  const productsWithMemberReviews = products.filter((product) =>
    reviews.some((review) => review.ProductsID === product.ID && review.MemberID === MemberID)
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
      render: (price: number) => `฿${price}`,
    },
    {
      title: "Picture",
      dataIndex: "PictureProduct",
      key: "PictureProduct",
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
          onClick={() => showModal(record)} type="primary" style={{ backgroundColor: '#ff8c1a', borderColor: '#ff8c1a' }}
        >
          ดูรีวิว
        </Button>
      ),
    },
  ];

  return (
    <div>
      <NavbarMember />
      <Re_bar />
      <Table
        rowKey="ID"
        columns={columns}
        dataSource={productsWithMemberReviews}
        pagination={false}
        className="columns"
        style={{ margin: "0 20px", marginTop: "-199px" }}  // ปรับ marginTop ให้ตารางอยู่ต่ำลง
      />
      
      <Modal
        title={`คุณกำลังดูรีวิวสินค้า: ${selectedProduct?.Title}`}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        style={{ top: 200 }} // เพิ่มระยะห่างจากด้านบน
      >
        {reviews.length > 0 ? (
          reviews
            .filter((review) => review.ProductsID === selectedProduct?.ID && review.MemberID === MemberID)
            .map((review, index) => (
              <div key={index} style={{ marginBottom: '16px', padding: '10px', border: '1px solid #f0f0f0', borderRadius: '5px', backgroundColor: '#f4f0ec' }}>
                <p>คะแนน: <Rate allowHalf disabled value={review.Rating || 0} /></p>
                <p>ความคิดเห็น: {review.Comment}</p>
              </div>
            ))
        ) : (
          <p>ยังไม่มีรีวิวสำหรับสินค้านี้</p>
        )}
      </Modal>
    </div>
  );
};

export default ReviewPage;