import { Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Loader, Message } from '../components';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';

const ProductCarousel = () => {
  const { data: topProducts, isLoading, error } = useGetTopProductsQuery();

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message>{error}</Message>
  ) : (
    <Carousel pause='hover' className='bg-dark'>
      {topProducts.map((product) => {
        return (
          <Carousel.Item key={product._id}>
            <Link to={`/product/${product._id}`}>
              <img
                className='d-block w-100'
                src={product.image}
                alt={product.name}
              />
              <Carousel.Caption className='carousel-caption'>
                <h2>
                  {product.name} (${product.price})
                </h2>
              </Carousel.Caption>
            </Link>
          </Carousel.Item>
        );
      })}
    </Carousel>
  );
};
export default ProductCarousel;
