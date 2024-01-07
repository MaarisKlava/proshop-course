import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { Message, Loader } from '../components';
// PAYPAL
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
// REDUX
import { useDispatch, useSelector } from 'react-redux';
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useDeliverOrderMutation,
} from '../slices/ordersApiSlice';
//TOASTIFY
import { toast } from 'react-toastify';

const OrderPage = () => {
  const { id: orderId } = useParams();
  const dispatch = useDispatch();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const {
    data: paypal,
    isLoading: loadingPaypal,
    error: errorPaypal,
  } = useGetPayPalClientIdQuery();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!errorPaypal && !loadingPaypal && paypal?.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            clientId: paypal?.clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, loadingPaypal, errorPaypal]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details }).unwrap();
        refetch();
        toast.success('Payment successful');
      } catch (error) {
        toast.error(error?.data?.message || error?.message);
      }
    });
  }

  async function onApproveTest() {
    await payOrder({ orderId, details: { payer: {} } });
    refetch();
    toast.success('Payment successful');
  }

  function onError(error) {
    toast.error(error?.message);
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: order?.totalPrice,
            },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  }

  const deliverOrderHandler = async () => {
    try {
      console.log(orderId);
      await deliverOrder(orderId);
      refetch();
      toast.success('Order delivered');
    } catch (error) {
      toast.error(error?.data?.message || error?.message);
    }
  };

  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    return (
      <Message variant='danger'>
        {error?.data?.message || error?.message}
      </Message>
    );
  }

  return (
    <>
      <h1>Order {order?._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order?.user?.name}
              </p>
              <p>
                <strong>Email: </strong> {order?.user?.email}
              </p>
              <p>
                <strong>Address: </strong>
                {order?.shippingAddress?.address},{' '}
                {order?.shippingAddress?.city}{' '}
                {order?.shippingAddress?.postalCode},{' '}
                {order?.shippingAddress?.country}
              </p>
              {order?.isDelivered ? (
                <Message variant='success'>
                  Delivered on {order?.deliveredAt}
                </Message>
              ) : (
                <Message variant='danger'>Not Delivered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order?.paymentMethod}
              </p>
              {order?.isPaid ? (
                <Message variant='success'>Paid on {order?.paidAt}</Message>
              ) : (
                <Message variant='danger'>Not Paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order?.orderItems?.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order?.orderItems?.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          ></Image>
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${order?.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order?.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order?.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order?.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* PAY ORDER PLACEHOLDER */}
              {!order?.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {isPending ? (
                    <Loader />
                  ) : (
                    <div>
                      {/* <Button
                        onClick={onApproveTest}
                        style={{ marginBottom: '10px' }}
                      >
                        Test Pay Order
                      </Button> */}
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          error={onError}
                        ></PayPalButtons>
                      </div>
                    </div>
                  )}
                </ListGroup.Item>
              )}
              {/* DELIVER ORDER PLACEHOLDER */}
              {loadingDeliver && <Loader />}
              {userInfo?.isAdmin && order?.isPaid && !order?.isDelivered && (
                <ListGroup.Item>
                  <Button
                    type='button'
                    className='btn btn-block'
                    onClick={deliverOrderHandler}
                  >
                    Mark As Delivered
                  </Button>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default OrderPage;
