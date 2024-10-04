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
import Re_bar from "../../../component/re_bar";
import NavbarSeller from "../../../component/navbarSeller.tsx";


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
      <NavbarSeller />
      <Re_bar />
      <Table
        rowKey="ID"
        columns={columns}
        dataSource={products}
        className="columns"
        style={{ margin: "0 20px",marginTop:"-200px"}}
        pagination={{
          pageSize: 2,
          onChange: (page, pageSize) => fetchProducts(page, pageSize),
        }}
      />
    </div>
  );
};

export default ProductDisplay;