import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/main.css'
import { getDatabase, ref, child, get, onValue } from "firebase/database";
import { auth, firestoreDb,realtimeDb } from '../firebase';
import React, { useState, useEffect } from 'react'
import { collection, query, onSnapshot, where, getDocs, doc } from "firebase/firestore";
import { Container, Nav, Navbar, NavDropdown, Form, Button, Row, Col, Carousel, Card, Image, ProgressBar, Tab, BreadcrumbItem, Breadcrumb } from 'react-bootstrap';

export default function Profile_Orders() {
    const [name, setName] = useState('loading...')
    const { currentUser } = useAuth()
    const [orders, setOrders] = useState([])
    const [orderDetails, setOrderDetails] = useState([])



    async function getOrders() {
        const q = query(collection(firestoreDb, "orders"), where("orderedBy", "==", `${auth.currentUser.uid}`));
        const querySnapshot = await getDocs(q);
        setOrders([])
        querySnapshot.forEach((doc) => {
            setOrders(orders => [...orders, doc.data()])
        });
    }

    async function getOrderDetails(orderId) {
        const q = query(collection(firestoreDb, `orders/${orderId}/items`));
        const querySnapshot = await getDocs(q);
        setOrderDetails([])
        querySnapshot.forEach((doc) => {
            setOrderDetails(orderDetails => [...orderDetails, doc.data()])
        });
    }

    async function getName() {
        // if (name != undefined) {
        //     return
        // }
        await get(ref(realtimeDb, "users/" + auth.currentUser.uid)).then((snapshot) => {
            if (snapshot.exists()) {
                const name = snapshot.val().username + " " + snapshot.val().lastname
                setName(name)
                console.log("get Name");
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    useEffect(() => {
        getOrders()
        getName()
    }, [])


    

    return (
        <>
            <Container fluid>
                <Row className=' d-flex justify-content-center align-items-center px-xl-5'>
                    <Col className="col-12" lg="9">
                        <Breadcrumb className='myBreadCrumb bg-light mb-30'>
                            <BreadcrumbItem href='/'>Ana Sayfa</BreadcrumbItem>
                            <BreadcrumbItem active>Siparişlerim</BreadcrumbItem>
                        </Breadcrumb>
                    </Col>
                </Row>
            </Container>

            <Container fluid>
                <Row className='d-flex justify-content-center align-items-center h-100 px-xl-5'>
                    <Col lg="9">
                        <Tab.Container defaultActiveKey="fSirst" >
                            <Row >
                                <Col lg="4">
                                    <div className='p-30 bg-light b-r-1' style={{ marginBottom: 30 }}>
                                        <h5 className="section-title position-relative text-uppercase mb-3">
                                            <span className="pr-3">SİPARİŞLERİM</span>
                                        </h5>
                                        <Nav variant="pills" className=" flex-column ">
                                            {orders.map((order) => (
                                                <Nav.Item>
                                                    <Nav.Link eventKey={order.orderId} href="#" onClick={() => getOrderDetails(order.orderId)}>
                                                        <Container fluid>
                                                            <Row>
                                                                <Col md="8">
                                                                    <Row>Sipariş Numarası: {order.orderId}</Row>
                                                                    <Row>{order.orderDate}</Row>
                                                                </Col>
                                                                <Col>
                                                                    {(order.total + 10 ).toFixed(2).replace('.', ',')} TL
                                                                </Col>
                                                            </Row>
                                                        </Container>
                                                    </Nav.Link>
                                                </Nav.Item>
                                            ))}
                                        </Nav>
                                    </div>
                                </Col>
                                <Col>
                                    <Tab.Content>
                                        {orders.map((order) => (
                                            <Tab.Pane eventKey={order.orderId}>
                                                <Col >
                                                    <Card style={{ borderRadius: 10 }}>
                                                        <Card.Header className='px-4 py-5'>
                                                            <h5 className="text-muted mb-0">
                                                                Siparişin için teşekkürler, <span style={{ color: "#a8729a" }}>{name}</span>!
                                                            </h5>
                                                        </Card.Header>
                                                        <Card.Body className='p-4'>
                                                            <div className="d-flex justify-content-between align-items-center mb-4">
                                                                <p className="lead fw-normal mb-0" style={{ color: "#a8729a" }}>
                                                                    Fiş
                                                                </p>
                                                                <p className="small text-muted mb-0">Sipariş Numarası : {order.orderId}</p>
                                                            </div>
                                                            <div className='order-items-container'>
                                                            {orderDetails.map((orderDetail) => (
                                                                <Card className='shadow-0 border mb-4'>
                                                                    <Card.Body>
                                                                        <Row>
                                                                            <Col md="1">
                                                                                <a href={`/products/${orderDetail.itemId}`}>
                                                                                <Image
                                                                                    src={orderDetail.itemPictureUrl}
                                                                                    className="img-fluid"
                                                                                    alt="Product"
                                                                                    fluid
                                                                                />
                                                                                </a>
                                                                            </Col>
                                                                            <Col md="3" className='text-center d-flex justify-content-center align-items-center'>
                                                                                <p className="text-muted mb-0">{orderDetail.itemName}</p>
                                                                            </Col>
                                                                            <Col md="4" className='text-center d-flex justify-content-center align-items-center'>
                                                                                <p className="text-muted mb-0">Ürün Kodu: {orderDetail.itemId}</p>
                                                                            </Col>
                                                                            <Col md="2" className='text-center d-flex justify-content-center align-items-center'>
                                                                                <p className="text-muted mb-0">{orderDetail.count} Adet</p>
                                                                            </Col>
                                                                            <Col md="2" className='text-center d-flex justify-content-center align-items-center'>
                                                                                <p className="text-muted mb-0">{orderDetail.itemPrice} TL</p>
                                                                            </Col>
                                                                        </Row>
                                                                        <hr className="mb-4" style={{ backgroundColor: "#e0e0e0", opacity: 1 }} />
                                                                        <Row className='d-flex align-items-center'>
                                                                            <Col md="2">
                                                                                <p className="text-muted mb-2 small">Sipariş Takibi</p>
                                                                            </Col>
                                                                            <Col md="10">
                                                                                <ProgressBar now={60} style={{ height: 6, borderRadius: 16 }}>

                                                                                </ProgressBar>
                                                                                <div className="d-flex justify-content-around mb-1">
                                                                                    <p className="text-muted mt-1 mb-0 small ms-xl-5">Kargoya Verildi</p>
                                                                                    <p className="text-muted mt-1 mb-0 small ms-xl-5">Teslim Edildi</p>
                                                                                </div>

                                                                            </Col>
                                                                        </Row>
                                                                    </Card.Body>
                                                                </Card>
                                                            ))}
                                                            </div>
                                                            <div className="d-flex justify-content-between pt-2">
                                                                <p className="fw-bold mb-0">Sipariş Detayları</p>
                                                                
                                                            </div>
                                                            <div className="d-flex justify-content-between pt-2">
                                                                <p className="text-muted mb-0">Sipariş Numarası : {order.orderId}</p>
                                                                <p className="text-muted mb-0">
                                                                    <span className="fw-bold me-4">Ürünler</span> {(order.total - (((order.total)*18)/100)).toFixed(2).replace('.', ',')} TL 
                                                                </p>
                                                            </div>
                                                            <div className="d-flex justify-content-between pt-2">
                                                                <p className="text-muted mb-0">Oluşturma Tarihi : {order.orderDate}</p>
                                                                <p className="text-muted mb-0">
                                                                    <span className="fw-bold me-4">KDV 18%</span> {(((order.total)*18)/100).toFixed(2).replace('.', ',')} TL
                                                                </p>
                                                            </div>
                                                            <div className="d-flex justify-content-between pt-2 mb-5">
                                                                <div></div>
                                                                <p className="text-muted mb-0">
                                                                    <span className="fw-bold me-4">Kargo Ücreti</span> 10,00 TL
                                                                </p>
                                                            </div>

                                                        </Card.Body>
                                                        <Card.Footer className='border-0 px-4 py-5' style={{
                                                            backgroundColor: "#a8729a",
                                                            borderBottomLeftRadius: 10,
                                                            borderBottomRightRadius: 10
                                                        }}>
                                                            <h5 className="d-flex align-items-center justify-content-end text-white text-uppercase mb-0">
                                                                Ödenen Tutar: <span className="h2 mb-0 ms-2">{(order.total +10).toFixed(2).replace('.', ',')} TL</span>
                                                            </h5>
                                                        </Card.Footer>
                                                    </Card>

                                                </Col>
                                            </Tab.Pane>
                                        ))}

                                    </Tab.Content>
                                </Col>
                            </Row>
                        </Tab.Container>
                    </Col>
                </Row>
            </Container>
        </>
    )
}





