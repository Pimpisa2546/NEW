// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';
// // import { Table, Spin, Alert, Button, Modal, Input } from 'antd';
// // import { useNavigate } from 'react-router-dom';
// // import StarRating from '../star/starrating';
// // import { ProductsInterface } from '../../../interfaces/Products';
// // import { Review } from '../../../interfaces/review';
// // import Navbar from "../../../component/NavbarReview";
// // import Re_bar from "../../../component/re_bar";

// // const ProductDisplay: React.FC = () => {
// //   const [products, setProducts] = useState<ProductsInterface[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [isModalVisible, setIsModalVisible] = useState(false);
// //   const [selectedProduct, setSelectedProduct] = useState<ProductsInterface | null>(null);
// //   const [reviewText, setReviewText] = useState<string>('');
// //   const [rating, setRating] = useState<number>(5);
// //   const navigate = useNavigate();

// //   // กำหนด MemberID เป็น 4
// //   const getMemberByID = () => {
// //     return 4; // ตั้งค่า MemberID เป็น 4
// //   };

// //   useEffect(() => {
// //     const fetchProductsAndReviews = async () => {
// //       try {
// //         const productsResponse = await axios.get<ProductsInterface[]>('http://localhost:8000/products');
// //         const reviewsResponse = await axios.get<Review[]>('http://localhost:8000/review');

// //         const reviewedProductIds = new Set(reviewsResponse.data.map(review => review.ProductsID));
// //         const filteredProducts = productsResponse.data.filter(product => !reviewedProductIds.has(product.ID!));

// //         setProducts(filteredProducts);
// //       } catch (err) {
// //         setError('Error fetching product data');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchProductsAndReviews();
// //   }, []);

// //   const showModal = (product: ProductsInterface) => {
// //     setSelectedProduct(product);
// //     setIsModalVisible(true);
// //   };

// //   const handleOk = async () => {
// //     const memberID = getMemberByID(); // ดึง MemberID ที่นี่
// //     if (selectedProduct) {
// //       try {
// //         await axios.post('http://localhost:8000/review', {
// //           Rating: rating,
// //           Comment: reviewText,
// //           ProductsID: selectedProduct.ID,
// //           MemberID: memberID, // ส่ง MemberID
// //         });

// //         navigate('/review', { state: selectedProduct });

// //         setIsModalVisible(false);
// //         setReviewText('');
// //         setRating(5);
// //       } catch (err) {
// //         console.error('Error submitting review:', err);
// //       }
// //     }
// //   };

// //   const handleCancel = () => {
// //     setIsModalVisible(false);
// //   };

// //   if (loading) return <Spin tip="Loading products..." />;
// //   if (error) return <Alert message={error} type="error" />;

// //   return (
// //     <div>
// //       <Navbar />
// //       <Re_bar />
// //       <Table
// //         dataSource={products}
// //         columns={[
// //           {
// //             title: <div style={{ textAlign: 'center' }}>Picture</div>,
// //             dataIndex: 'PictureProduct',
// //             key: 'PictureProduct',
// //             align: 'center',
// //             width: 200,
// //             render: (text: string) => (
// //               <img
// //                 src={text}
// //                 alt="product"
// //                 style={{ width: 100, height: 100, objectFit: 'cover' }}
// //                 onError={(e) => {
// //                   (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100';
// //                 }}
// //               />
// //             ),
// //           },
// //           {
// //             title: <div style={{ textAlign: 'center' }}>Description</div>,
// //             dataIndex: 'Description',
// //             key: 'Description',
// //             width: 800,
// //           },
// //           {
// //             title: <div style={{ textAlign: 'center' }}>Title</div>,
// //             dataIndex: 'Title',
// //             key: 'Title',
// //             width: 800,
// //           },
// //           {
// //             title: <div style={{ textAlign: 'center' }}>Price</div>,
// //             dataIndex: 'Price',
// //             key: 'Price',
// //             align: 'center',
// //             width: 200,
// //             render: (text: number) => (text !== undefined ? `฿${text.toFixed(2)}` : 'N/A'),
// //           },
// //           {
// //             title: <div style={{ textAlign: 'center' }}>Review</div>,
// //             key: 'review',
// //             align: 'center',
// //             width: 200,
// //             render: (_, record) => (
// //               <Button onClick={() => showModal(record)} type="primary" style={{ backgroundColor: '#ff8c1a', borderColor: '#ff8c1a' }}>
// //                 รีวิวสินค้า
// //               </Button>
// //             ),
// //           },
// //         ]}
// //         rowKey="ID"
// //         pagination={false}
// //       />

// //       <Modal
// //         title={`รีวิวสินค้า: ${selectedProduct?.Title}`}
// //         visible={isModalVisible}
// //         onOk={handleOk}
// //         onCancel={handleCancel}
// //         okText="ส่งรีวิว"
// //         cancelText="ยกเลิก"
// //       >
// //         <StarRating totalStars={5} onSelect={setRating} />
// //         <Input.TextArea
// //           value={reviewText}
// //           onChange={(e) => setReviewText(e.target.value)}
// //           rows={4}
// //           placeholder="เขียนรีวิวของคุณที่นี่..."
// //         />
// //       </Modal>
// //     </div>
// //   );
// // };

// // export default ProductDisplay;


// import "../../../pages/Products/Orders/Orders.css";
// import React, { useState, useEffect } from "react";
// import { Table, message } from "antd";
// import { GetProductsByMemberId, GetOrdersByProductIDAndMemberID } from "../../../services/http/index";
// import NavbarMember from "../../../component/navbarMember.tsx"; 
// import Re_bar from "../../../component/re_bar";

// interface Product {
//   ID: number;
//   Title: string;
//   Price: number;
//   PictureProduct: string;
//   Description: string;
//   SellerID: number;
//   Quantity?: number;
//   Status: string;
// }

// const ProductDisplay: React.FC = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [messageApi, contextHolder] = message.useMessage();
//   const MemberID = Number(localStorage.getItem("id"));

//   // ฟังก์ชันเพื่อดึงสินค้าที่สั่งซื้อโดยสมาชิก
//   const fetchProducts = async (page: number = 1, pageSize: number = 10) => {
//     setProducts([]); // ล้างข้อมูลสินค้าก่อนการดึงข้อมูลใหม่
//     try {
//       const result = await GetProductsByMemberId(MemberID, page, pageSize);
//       if (result && Array.isArray(result.products)) {
//         const updatedProducts: Product[] = [];

//         for (const product of result.products) {
//           const orders = await GetOrdersByProductIDAndMemberID(MemberID, product.ID);
//           // const reviews = await GetReviewByProductID(product.ID); // ตรวจสอบว่าสินค้ามีการรีวิวหรือไม่

//           updatedProducts.push({
//             ...product,
//             Price: orders.length > 0 ? orders[0].Total_price : product.Price, // ใช้ราคาจากคำสั่งซื้อ
//             Quantity: orders.length > 0 ? orders[0].Quantity : product.Quantity,
//             // HasReview: reviews.length == 0, // ระบุว่าสินค้ามีการรีวิวหรือไม่
//           });
//         }

//         setProducts(updatedProducts);
//       }
//     } catch (error) {
//       messageApi.open({
//         type: "error",
//         content: "เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า",
//       });
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   return (
//     <div>
//       <NavbarMember />
//       <Re_bar />
//       <Table
//         dataSource={products}
//         columns={[
//           {
//             title: <div style={{ textAlign: 'center' }}>รูปภาพ</div>,
//             dataIndex: 'PictureProduct',
//             key: 'PictureProduct',
//             align: 'center',
//             width: 200,
//             render: (text: string) => (
//               <img
//                 src={text}
//                 alt="product"
//                 style={{ width: 100, height: 100, objectFit: 'cover' }}
//                 onError={(e) => {
//                   (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100';
//                 }}
//               />
//             ),
//           },
//           {
//             title: <div style={{ textAlign: 'center' }}>ชื่อสินค้า</div>,
//             dataIndex: 'Title',
//             key: 'Title',
//             width: 800,
//           },
//           {
//             title: <div style={{ textAlign: 'center' }}>ราคา</div>,
//             dataIndex: 'Price',
//             key: 'Price',
//             align: 'center',
//             width: 200,
//             render: (text: number) => (text !== undefined ? `฿${text.toFixed(2)}` : 'N/A'),
//           },
//           {
//             title: <div style={{ textAlign: 'center' }}>สถานะรีวิว</div>,
//             dataIndex: 'HasReview',
//             key: 'HasReview',
//             align: 'center',
//             width: 200,
//             render: (hasReview: boolean) => (hasReview ? "รีวิวแล้ว" : "ยังไม่ได้รีวิว"), // แสดงสถานะการรีวิว
//           },
//         ]}
//         rowKey="ID"
//         pagination={false}
//       />
//       {contextHolder}
//     </div>
//   );
// };

// export default ProductDisplay;

//ใช้ได้ดี

// import "../../../pages/Products/Orders/Orders.css";
// import React, { useState, useEffect } from "react";
// import { Table, message } from "antd";
// import type { ColumnsType } from "antd/es/table";
// import {
//   GetProductsByMemberId,
//   GetOrdersByProductIDAndMemberID,
// } from "../../../services/http/index";
// import axios from 'axios';
// import NavbarMember from "../../../component/navbarMember.tsx";
// import Re_bar from "../../../component/re_bar";

// // Define interfaces for Product and Order
// interface Product {
//   ID: number;
//   Title: string;
//   Price: number;
//   PictureProduct: string;
//   Description: string;
//   SellerID: number;
//   OrderID?: number;
//   Quantity?: number;
//   Status: string;
//   isReviewed?: boolean; // Flag to check if reviewed
// }

// interface Order {
//   ID: number;
//   Quantity: number;
//   Total_price: number;
//   SellerID: number;
// }

// // Define interface for Review
// interface Review {
//   ID: number;
//   Rating: number;
//   Comment: string;
//   ProductsID: number;
//   MemberID: number;
// }

// const ProductDisplay: React.FC = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const MemberID = Number(localStorage.getItem("id"));

//   // Function to fetch reviews by member ID
//   const fetchReviewsByMemberId = async (): Promise<Review[]> => {
//     try {
//       const response = await axios.get(`http://localhost:8000/review?memberId=${MemberID}`);
//       return response.data; // Adjust according to your API response
//     } catch (error) {
//       console.error("Cannot fetch reviews:", error);
//       return [];
//     }
//   };

//   // Function to fetch products with pagination
//   const fetchProducts = async (page: number = 1, pageSize: number = 10) => {
//     setProducts([]); // Clear products before fetching new ones
//     try {
//       const result = await GetProductsByMemberId(MemberID, page, pageSize);
//       if (result && Array.isArray(result.products)) {
//         const updatedProducts: Product[] = [];
//         const uniqueProductOrderIds = new Set<number>();
        
//         const reviews = await fetchReviewsByMemberId(); // Fetch reviews here

//         for (const product of result.products) {
//           const orders: Order[] = await GetOrdersByProductIDAndMemberID(MemberID, product.ID);
//           if (orders && orders.length > 0) {
//             orders.forEach((order: Order) => {
//               if (!uniqueProductOrderIds.has(order.ID)) {
//                 uniqueProductOrderIds.add(order.ID);
//                 const isReviewed = reviews.some(review => review.ProductsID === product.ID && review.MemberID === MemberID);
                
//                 // Only add the product if it has not been reviewed
//                 if (!isReviewed) {
//                   updatedProducts.push({
//                     ...product,
//                     Price: order.Total_price,
//                     OrderID: order.ID,
//                     Quantity: order.Quantity,
//                     isReviewed: false, // Set to false because it hasn't been reviewed
//                   });
//                 }
//               }
//             });
//           } else if (!uniqueProductOrderIds.has(product.ID)) {
//             uniqueProductOrderIds.add(product.ID);
//             const isReviewed = reviews.some(review => review.ProductsID === product.ID && review.MemberID === MemberID);
            
//             // Only add the product if it has not been reviewed
//             if (!isReviewed) {
//               updatedProducts.push({
//                 ...product,
//                 isReviewed: false, // Set to false because it hasn't been reviewed
//               });
//             }
//           }
//         }
//         setProducts(updatedProducts);
//       }
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   // Move columns definition here
//   const columns: ColumnsType<Product> = [
//     {
//       title: "Title",
//       dataIndex: "Title",
//       key: "title",
//     },
//     {
//       title: "Description",
//       dataIndex: "Description",
//       key: "description",
//     },
//     {
//       title: "Price",
//       dataIndex: "Price",
//       key: "price",
//       render: (price) => `฿${price}`,
//     },
//     {
//       title: "Picture",
//       dataIndex: "PictureProduct",
//       key: "picture",
//       render: (_, record) => (
//         <img src={record.PictureProduct} alt={record.Title} width="170" />
//       ),
//     },
//     {
//       title: "Review Status",
//       key: "reviewStatus",
//       render: (_, record) => (
//         record.isReviewed ? (
//           <span>รีวิวแล้ว</span>
//         ) : (
//           <span>ยังไม่ได้รีวิว</span>
//         )
//       ),
//     },
//   ];

//   return (
//     <div>
//       <NavbarMember />
//       <Re_bar />
//       <Table
//         rowKey="ID"
//         columns={columns}
//         dataSource={products}
//         className="columns"
//         pagination={{
//           pageSize: 2,
//           onChange: (page, pageSize) => fetchProducts(page, pageSize),
//         }}
//       />
//     </div>
//   );
// };

// export default ProductDisplay;


import "../../../pages/Products/Orders/Orders.css";
import React, { useState, useEffect } from "react";
import { Table, Button } from "antd"; // Import Button
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  GetProductsByMemberId,
  GetOrdersByProductIDAndMemberID,
} from "../../../services/http/index";
import axios from 'axios';
import NavbarMember from "../../../component/navbarMember.tsx";
import Re_bar from "../../../component/re_bar";


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

const ProductDisplay: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const MemberID = Number(localStorage.getItem("id"));
  const navigate = useNavigate(); // Initialize useNavigate

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
                const isReviewed = reviews.some(review => review.ProductsID === product.ID && review.MemberID === MemberID);
                
                // Only add the product if it has not been reviewed
                if (!isReviewed) {
                  updatedProducts.push({
                    ...product,
                    Price: order.Total_price,
                    OrderID: order.ID,
                    Quantity: order.Quantity,
                    isReviewed: false, // Set to false because it hasn't been reviewed
                  });
                }
              }
            });
          } else if (!uniqueProductOrderIds.has(product.ID)) {
            uniqueProductOrderIds.add(product.ID);
            const isReviewed = reviews.some(review => review.ProductsID === product.ID && review.MemberID === MemberID);
            
            // Only add the product if it has not been reviewed
            if (!isReviewed) {
              updatedProducts.push({
                ...product,
                isReviewed: false, // Set to false because it hasn't been reviewed
              });
            }
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

  // Move columns definition here
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
      title: "Review Status",
      key: "reviewStatus",
      render: () => (
          <Button 
            type="primary" 
            style={{ backgroundColor: '#ff8c1a'}} // เปลี่ยนสีปุ่ม
            onClick={() => navigate(`/Card`)} // Navigate to Order page with product ID
          >
            ยังไม่ได้รีวิว
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
        dataSource={products}
        className="columns"
        pagination={{
          pageSize: 2,
          onChange: (page, pageSize) => fetchProducts(page, pageSize),
        }}
      />
    </div>
  );
};

export default ProductDisplay;