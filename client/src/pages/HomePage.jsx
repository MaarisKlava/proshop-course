import { useEffect, useState } from 'react';
// import axios from 'axios';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
// REDUX
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { Loader, Message, Meta } from '../components';
import { useParams } from 'react-router-dom';
import Paginate from '../components/Paginate';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ProductCarousel from '../components/ProductCarousel';

const HomePage = () => {
  // const [products, setProducts] = useState([]);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const { data } = await axios.get('/api/products');
  //     console.log(data);
  //     setProducts(data);
  //   };
  //   fetchProducts();
  // }, []);
  const { userInfo } = useSelector((state) => state.auth);
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    return (
      <Message variant='danger'>{error?.data?.message || error.error}</Message>
    );
  }

  return (
    <>
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link className='btn btn-light my-3' to='/'>
          Go Back
        </Link>
      )}
      <Meta title='Hello' />
      <h1>Latest Products</h1>
      <Row>
        {data.products.map((product) => {
          return (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          );
        })}
      </Row>
      <Paginate
        pages={data.pages}
        page={data.page}
        keyword={keyword && ''}
        isAdmin={userInfo?.isAdmin || false}
      />
    </>
  );
};
export default HomePage;
