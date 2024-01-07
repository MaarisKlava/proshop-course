import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Form,
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
} from 'react-bootstrap';
import { Rating } from '../components';
// import axios from 'axios';
// import { useState, useEffect } from 'react';
// REDUX
import { useGetProductDetailsQuery } from '../slices/productsApiSlice';
import { useCreateReviewMutation } from '../slices/productsApiSlice';

import { addToCart } from '../slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Loader, Message, Meta } from '../components';
import { toast } from 'react-toastify';

const ProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: productId } = useParams();
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { userInfo } = useSelector((state) => state.auth);

  // const [product, setProduct] = useState([]);

  // useEffect(() => {
  //   const fetchProduct = async (id) => {
  //     const { data } = await axios.get(`/api/products/${id}`);
  //     setProduct(data);
  //   };
  //   fetchProduct(productId);
  // }, []);
  const [createReview, { isLoading: isReviewLoading }] =
    useCreateReviewMutation();

  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useGetProductDetailsQuery(productId);

  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    console.log(error);
    return (
      <Message variant='danger'>{error?.data?.message || error.error}</Message>
    );
  }

  const {
    _id,
    name,
    image,
    description,
    brand,
    category,
    price,
    countInStock,
    rating: productRating,
    numReviews,
  } = product;

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      toast.success('review submitted successfully');
      setRating(0);
      setComment('');
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <>
      <Meta title={name} description={description} />
      <Link className='btn btn-light my-3' to='/'>
        Go Back
      </Link>
      <Row>
        <Col md={5}>
          <Image src={image} alt={name} fluid></Image>
        </Col>
        <Col md={4}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h3>{name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                value={productRating}
                text={`${numReviews} reviews`}
              ></Rating>
            </ListGroup.Item>
            <ListGroup.Item>Price: ${price}</ListGroup.Item>
            <ListGroup.Item>{description}</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>
                    <strong>${price}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    <strong>
                      {countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                    </strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              {countInStock > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Qty</Col>
                    <Col>
                      <Form.Control
                        as='select'
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                      >
                        {[...Array(product.countInStock).keys()].map(
                          (option) => {
                            // add one as it starts with
                            const optionsValue = option + 1;
                            return (
                              <option key={option + 1} value={option + 1}>
                                {option + 1}
                              </option>
                            );
                          }
                        )}
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Button
                  className='btn-block'
                  type='button'
                  disabled={countInStock === 0}
                  onClick={addToCartHandler}
                >
                  Add To Cart
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
      <Row className='review'>
        <Col md={6}>
          <h2>Reviews</h2>
          {product.reviews.length === 0 && <Message>No Reviews</Message>}
          <ListGroup variant='flush'>
            {product.reviews.map((review) => {
              const { _id, name, rating, comment, createdAt } = review;
              return (
                <ListGroup.Item key={_id}>
                  <strong>{name}</strong>
                  <Rating value={rating} />
                  <p>{createdAt.substring(0, 10)}</p>
                  <p>{comment}</p>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </Col>

        <Col md={6}>
          <h2>Write a Customer Review</h2>
          {isReviewLoading && <Loader />}
          {userInfo ? (
            <Form onSubmit={handleSubmitReview}>
              <Form.Group controlId='rating'>
                <Form.Label>Rating</Form.Label>
                <Form.Control
                  as='select'
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  <option value=''>Select...</option>
                  <option value='1'>1 - Poor</option>
                  <option value='2'>2 - Fair</option>
                  <option value='3'>3 - Good</option>
                  <option value='4'>4 - Very Good</option>
                  <option value='5'>5 - Excellent</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId='comment'>
                <Form.Label>Comment</Form.Label>
                <Form.Control
                  as='textarea'
                  row='3'
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Button
                type='submit'
                variant='primary'
                disabled={isReviewLoading}
              >
                Submit
              </Button>
            </Form>
          ) : (
            <Message>
              Please <Link to='/login'>sign in</Link> to write a review
            </Message>
          )}
        </Col>
      </Row>
    </>
  );
};
export default ProductPage;
