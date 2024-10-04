import "./Orders.css";
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, message, Input } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  GetProductsByMemberId,
  GetOrdersByProductIDAndMemberID,
  DeleteOrder,
  UpProductsById,
} from "../../../services/http/index";
import StarRating from "../../Review/star/starrating";
import axios from 'axios';
import NavbarMember from "../../../component/navbarMember.tsx";

// Define interfaces for Product and Order
interface Product {
  ID: number;
  Title: string;
  Price: number;
  PictureProduct: string;
  Description: string;
  SellerID: number;
  OrderID?: number;
  Quantity?: number;
  Status: string;
  isReviewed?: boolean; // Flag to check if reviewed
}

interface Order {
  ID: number;
  Quantity: number;
  Total_price: number;
  SellerID: number;
}

// Define interface for Review
interface Review {
  ID: number;
  Rating: number;
  Comment: string;
  ProductsID: number;
  MemberID: number;
}

const Index: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const MemberID = Number(localStorage.getItem("id"));
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState<string>();
  const [deleteId, setDeleteId] = useState<number | undefined>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [reviewText, setReviewText] = useState<string>("");
  const [rating, setRating] = useState<number>(5);
  const [reviewedProducts, setReviewedProducts] = useState<number[]>([]);

  // Function to fetch reviews by member ID
  const fetchReviewsByMemberId = async (): Promise<Review[]> => {
    try {
      const response = await axios.get(`http://localhost:8000/review?memberId=${MemberID}`);
      return response.data; // Adjust according to your API response
    } catch (error) {
      console.error("Cannot fetch reviews:", error);
      return [];
    }
  };

  // Function to fetch products with pagination
  const fetchProducts = async (page: number = 1, pageSize: number = 10) => {
    setProducts([]); // Clear products before fetching new ones
    try {
      const result = await GetProductsByMemberId(MemberID, page, pageSize);
      if (result && Array.isArray(result.products)) {
        const updatedProducts: Product[] = [];
        const uniqueProductOrderIds = new Set<number>();
        
        const reviews = await fetchReviewsByMemberId(); // Fetch reviews here

        for (const product of result.products) {
          const orders: Order[] = await GetOrdersByProductIDAndMemberID(MemberID, product.ID);
          if (orders && orders.length > 0) {
            orders.forEach((order: Order) => {
              if (!uniqueProductOrderIds.has(order.ID)) {
                uniqueProductOrderIds.add(order.ID);
                updatedProducts.push({
                  ...product,
                  Price: order.Total_price,
                  OrderID: order.ID,
                  Quantity: order.Quantity,
                  isReviewed: reviews.some(review => review.ProductsID === product.ID && review.MemberID === MemberID), // Check if reviewed
                });
              }
            });
          } else if (!uniqueProductOrderIds.has(product.ID)) {
            uniqueProductOrderIds.add(product.ID);
            updatedProducts.push({
              ...product,
              isReviewed: reviews.some(review => review.ProductsID === product.ID && review.MemberID === MemberID), // Check if reviewed
            });
          }
        }
        setProducts(updatedProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showModal = (product: Product) => {
    setModalText(`คุณต้องการยกเลิกคำสั่งซื้อสำหรับสินค้าชื่อ "${product.Title}" หรือไม่?`);
    setDeleteId(product.OrderID);
    setOpen(true);
    const Productsdata: Product = {
      ...product,
      Status: 'Available',
    };
    UpProductsById(product.ID, Productsdata);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      await DeleteOrder(deleteId!);
      setOpen(false);
      setConfirmLoading(false);
      messageApi.open({
        type: "success",
        content: "ลบข้อมูลคำสั่งซื้อสำเร็จ",
      });
      fetchProducts();
    } catch (error) {
      setConfirmLoading(false);
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการลบคำสั่งซื้อ",
      });
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const showReviewModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleReviewOk = async () => {
    if (selectedProduct) {
      try {
        await axios.post('http://localhost:8000/review', {
          Rating: rating,
          Comment: reviewText,
          ProductsID: selectedProduct.ID,
          MemberID,
        });

        // ถ้าสำเร็จ
        setIsModalVisible(false);
        setReviewText('');
        setRating(5);
        setReviewedProducts((prevReviewed) => [selectedProduct.ID, ...prevReviewed]); // Update state to indicate this product has been reviewed

        messageApi.open({
          type: 'success',
          content: 'บันทึกรีวิวสำเร็จแล้ว',
        });
      } catch (error) {
        // ถ้าเกิดข้อผิดพลาด
        messageApi.open({
          type: 'error',
          content: 'เกิดข้อผิดพลาดในการบันทึกรีวิว',
        });
        console.error('Error saving review:', error);
      }
    }
  };

  const handleReviewCancel = () => {
    setIsModalVisible(false);
  };

  const columns: ColumnsType<Product> = [
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
      render: (price) => `฿${price}`,
    },
    {
      title: "Picture",
      dataIndex: "PictureProduct",
      key: "picture",
      render: (_, record) => (
        <img src={record.PictureProduct} alt={record.Title} width="170" />
      ),
    },
    {
      title: <div style={{ textAlign: 'center' }}>Review</div>,
      key: 'review',
      align: 'center',
      width: 200,
      render: (_, record) => (
        record.isReviewed ? (
          <Button disabled type="primary">
            รีวิวสินค้าแล้ว
          </Button>
        ) : (
          <Button
            onClick={() => showReviewModal(record)}
            type="primary"
            style={{ backgroundColor: '#ff8c1a', borderColor: '#ff8c1a' }}
          >
            รีวิวสินค้า
          </Button>
        )
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          onClick={() => showModal(record)}
          style={{ marginLeft: 10 }}
          shape="circle"
          icon={<DeleteOutlined />}
          size="large"
          danger
        />
      ),
    },
  ];

  return (
    <div className="orderbymember">
      {contextHolder}
      <NavbarMember />
      <h2>รายการคำสั่งซื้อ</h2>
      <Table
        rowKey="ID"
        columns={columns}
        dataSource={products}
        className="columns"
        pagination={{
          pageSize: 2,
          onChange: (page, pageSize) => fetchProducts(page, pageSize),
        }}
      />
      <Modal
        title="ลบข้อมูลคำสั่งซื้อ?"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalText}</p>
      </Modal>

      <Modal
        title={`รีวิวสินค้า: ${selectedProduct?.Title}`}
        visible={isModalVisible}
        onOk={handleReviewOk}
        onCancel={handleReviewCancel}
        okText="ส่งรีวิว"
        cancelText="ยกเลิก"
      >
        <StarRating totalStars={5} onSelect={setRating} />
        <Input.TextArea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows={4}
          placeholder="เขียนรีวิวของคุณที่นี่..."
        />
      </Modal>
    </div>
  );
};

export default Index;
