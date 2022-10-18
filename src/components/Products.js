import React, { useState, useEffect } from 'react'
import '../styles/main.css'
import { ref, child, push, update, set, get, onValue } from "firebase/database";
import { collection, query, where, onSnapshot, doc, getDoc, setDoc } from "firebase/firestore";
import { auth, firestoreDb, realtimeDb } from '../firebase';
import { Container, Row, Col, Breadcrumb, BreadcrumbItem, Badge, Image, Dropdown, DropdownButton, Offcanvas, Button, Toast, ToastContainer } from 'react-bootstrap';

export default function Products() {
    let count
    let isKeyExist
    const [items, setItems] = useState([])

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [show2, setShow2] = useState(false);
    const [position, setPosition] = useState('top-start');
    
    async function checkKey(itemId) {
        get(ref(realtimeDb, "users/" + auth.currentUser.uid + "/shopping_cart/" + itemId)).then((snapshot) => {
            if (snapshot.exists()) {
                isKeyExist = true
                console.log(isKeyExist);
            } else {
                isKeyExist = false
                console.log(isKeyExist);
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    async function getCount(itemId) {
        await get(ref(realtimeDb, "users/" + auth.currentUser.uid + "/shopping_cart/" + itemId)).then((snapshot) => {
            if (snapshot.exists()) {
                count = snapshot.val().count
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    async function writeNewPost(uid, itemId) {
        checkKey(itemId).then(() => {
            if (isKeyExist) {
                getCount(itemId).then(() => {
                    const q = query(collection(firestoreDb, `products`), where("itemId", "==", `${itemId}`));
                    onSnapshot(q, (querySnapshot) => {
                        querySnapshot.forEach((docc) => {
                            console.log("written");
                            set(ref(realtimeDb, `users/${uid}/shopping_cart/${itemId}`), {
                                count: count += 1,
                                itemId: itemId,
                                itemName: docc.data().itemName,
                                itemPrice: docc.data().itemPrice,
                                itemPictureUrl: docc.data().itemPictureUrl
                            });
                        });
                    });
                })
            } else if (!isKeyExist) {
                const q = query(collection(firestoreDb, `products`), where("itemId", "==", `${itemId}`));
                onSnapshot(q, (querySnapshot) => {
                    querySnapshot.forEach((docc) => {
                        set(ref(realtimeDb, `users/${uid}/shopping_cart/${itemId}`), {
                            count: count = 1,
                            itemId: itemId,
                            itemName: docc.data().itemName,
                            itemPrice: docc.data().itemPrice,
                            itemPictureUrl: docc.data().itemPictureUrl
                        });
                    });
                });
            }
        })
    }


    function addToCartButton() {
        document.querySelectorAll('.add-to-cart-btn').forEach(function (addToCartButton) {
            addToCartButton.addEventListener('click', function (event) {
                addToCartButton.classList.add('added');
                setTimeout(function () {
                    addToCartButton.classList.remove('added');
                }, 2000);
            });
        });
    }

    function ready() {
        var addToCartButtons = document.getElementsByClassName('add-to-cart-btn')
        for (var i = 0; i < addToCartButtons.length; i++) {
            var button = addToCartButtons[i]
            button.addEventListener('click', addToCartClicked)
        }
    }

    function addToCartClicked(event) {
        var button = event.target
        var shopItem = button.parentElement
        if (button.className == "fa fa-shopping-cart") {
            shopItem = button.parentElement.parentElement
        }
        var itemId = shopItem.getElementsByClassName('itemId')[0].id
        writeNewPost(auth.currentUser.uid, itemId)
        setShow2(true)
    }

    async function getItems() {
        const q = query(collection(firestoreDb, "products"));
        onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                setItems(items => [...items, doc.data()])
            });
        });
    }

    useEffect(() => {
        getItems()

    }, [])

    useEffect(() => {
        addToCartButton()
        ready()

    })

    return (
        <>
            

            <Container fluid>
                <Row className='px-xl-5'>
                    <Col className="col-12">
                        <Breadcrumb className='myBreadCrumb bg-light mb-30'>
                            <BreadcrumbItem href='/'>Ana Sayfa</BreadcrumbItem>
                            <BreadcrumbItem active>Ürünler</BreadcrumbItem>
                        </Breadcrumb>
                    </Col>
                </Row>
            </Container>

            <Container fluid>
                <Row className='px-xl-5'>
                    <Col lg="3" md="4" className='d-none d-lg-block d-md-block'>
                        <ToastContainer>
                            <Toast bg='success' onClose={() => setShow2(false)} show={show2} delay={3000} style={{ position: "absolute", top: 0, right: 0, margin: 20 }} autohide>
                                <Toast.Header>
                                    <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                                    <strong className="me-auto">Sepet</strong>
                                    <small className="text-muted">Şimdi</small>
                                </Toast.Header>
                                <Toast.Body>Ürün sepete eklendi.</Toast.Body>
                            </Toast>
                        </ToastContainer>
                        <h5 className="section-title position-relative text-uppercase mb-3">
                            <span className="pr-3">Filter by price</span>
                        </h5>
                        <div className="bg-light p-4 mb-30">
                            <form>
                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                    <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        defaultChecked=""
                                        id="price-all"
                                    />
                                    <label className="custom-control-label" htmlFor="price-all">
                                        All Price
                                    </label>
                                    <Badge className='border font-weight-normal'>168</Badge>
                                </div>
                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                    <input type="checkbox" className="custom-control-input" id="price-1" />
                                    <label className="custom-control-label" htmlFor="price-1">
                                        $0 - $100
                                    </label>
                                    <Badge className='border font-weight-normal'>168</Badge>
                                </div>
                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                    <input type="checkbox" className="custom-control-input" id="price-2" />
                                    <label className="custom-control-label" htmlFor="price-2">
                                        $100 - $200
                                    </label>
                                    <Badge className='border font-weight-normal'>168</Badge>
                                </div>
                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                    <input type="checkbox" className="custom-control-input" id="price-3" />
                                    <label className="custom-control-label" htmlFor="price-3">
                                        $200 - $300
                                    </label>
                                    <Badge className='border font-weight-normal'>168</Badge>
                                </div>
                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                    <input type="checkbox" className="custom-control-input" id="price-4" />
                                    <label className="custom-control-label" htmlFor="price-4">
                                        $300 - $400
                                    </label>
                                    <Badge className='border font-weight-normal'>168</Badge>
                                </div>
                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between">
                                    <input type="checkbox" className="custom-control-input" id="price-5" />
                                    <label className="custom-control-label" htmlFor="price-5">
                                        $400 - $500
                                    </label>
                                    <Badge className='border font-weight-normal'>168</Badge>
                                </div>
                            </form>
                        </div>

                        <h5 className="section-title position-relative text-uppercase mb-3">
                            <span className="pr-3">Filter by price</span>
                        </h5>
                        <div className="bg-light p-4 mb-30">
                            <form>
                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                    <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        defaultChecked=""
                                        id="price-all"
                                    />
                                    <label className="custom-control-label" htmlFor="price-all">
                                        All Price
                                    </label>
                                    <Badge className='border font-weight-normal'>168</Badge>
                                </div>
                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                    <input type="checkbox" className="custom-control-input" id="price-1" />
                                    <label className="custom-control-label" htmlFor="price-1">
                                        $0 - $100
                                    </label>
                                    <Badge className='border font-weight-normal'>168</Badge>
                                </div>
                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                    <input type="checkbox" className="custom-control-input" id="price-2" />
                                    <label className="custom-control-label" htmlFor="price-2">
                                        $100 - $200
                                    </label>
                                    <Badge className='border font-weight-normal'>168</Badge>
                                </div>
                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                    <input type="checkbox" className="custom-control-input" id="price-3" />
                                    <label className="custom-control-label" htmlFor="price-3">
                                        $200 - $300
                                    </label>
                                    <Badge className='border font-weight-normal'>168</Badge>
                                </div>
                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                    <input type="checkbox" className="custom-control-input" id="price-4" />
                                    <label className="custom-control-label" htmlFor="price-4">
                                        $300 - $400
                                    </label>
                                    <Badge className='border font-weight-normal'>168</Badge>
                                </div>
                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between">
                                    <input type="checkbox" className="custom-control-input" id="price-5" />
                                    <label className="custom-control-label" htmlFor="price-5">
                                        $400 - $500
                                    </label>
                                    <Badge className='border font-weight-normal'>168</Badge>
                                </div>
                            </form>
                        </div>

                        <h5 className="section-title position-relative text-uppercase mb-3">
                            <span className="pr-3">Filter by price</span>
                        </h5>
                        <div className="bg-light p-4 mb-30">
                            <form>
                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                    <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        defaultChecked=""
                                        id="price-all"
                                    />
                                    <label className="custom-control-label" htmlFor="price-all">
                                        All Price
                                    </label>
                                    <Badge className='border font-weight-normal'>168</Badge>
                                </div>
                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                    <input type="checkbox" className="custom-control-input" id="price-1" />
                                    <label className="custom-control-label" htmlFor="price-1">
                                        $0 - $100
                                    </label>
                                    <Badge className='border font-weight-normal'>168</Badge>
                                </div>
                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                    <input type="checkbox" className="custom-control-input" id="price-2" />
                                    <label className="custom-control-label" htmlFor="price-2">
                                        $100 - $200
                                    </label>
                                    <Badge className='border font-weight-normal'>168</Badge>
                                </div>
                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                    <input type="checkbox" className="custom-control-input" id="price-3" />
                                    <label className="custom-control-label" htmlFor="price-3">
                                        $200 - $300
                                    </label>
                                    <Badge className='border font-weight-normal'>168</Badge>
                                </div>
                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                    <input type="checkbox" className="custom-control-input" id="price-4" />
                                    <label className="custom-control-label" htmlFor="price-4">
                                        $300 - $400
                                    </label>
                                    <Badge className='border font-weight-normal'>168</Badge>
                                </div>
                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between">
                                    <input type="checkbox" className="custom-control-input" id="price-5" />
                                    <label className="custom-control-label" htmlFor="price-5">
                                        $400 - $500
                                    </label>
                                    <Badge className='border font-weight-normal'>168</Badge>
                                </div>
                            </form>
                        </div>
                    </Col>

                    <Col lg="9" md="8">
                        <Row className='pb-3'>
                            <Col className='col-12 pb-1'>
                                <Offcanvas show={show} onHide={handleClose} style={{ width: 300 }} className="d-lg-none d-xl-block d-xl-none d-md-none">
                                    <Offcanvas.Body>
                                        <h5 className="section-title position-relative text-uppercase mb-3">
                                            <span className="pr-3">Filter by price</span>
                                        </h5>
                                        <div className="bg-light p-4 mb-30">
                                            <form>
                                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                                    <input
                                                        type="checkbox"
                                                        className="custom-control-input"
                                                        defaultChecked=""
                                                        id="price-all"
                                                    />
                                                    <label className="custom-control-label" htmlFor="price-all">
                                                        All Price
                                                    </label>
                                                    <Badge className='border font-weight-normal'>168</Badge>
                                                </div>
                                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                                    <input type="checkbox" className="custom-control-input" id="price-1" />
                                                    <label className="custom-control-label" htmlFor="price-1">
                                                        $0 - $100
                                                    </label>
                                                    <Badge className='border font-weight-normal'>168</Badge>
                                                </div>
                                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                                    <input type="checkbox" className="custom-control-input" id="price-2" />
                                                    <label className="custom-control-label" htmlFor="price-2">
                                                        $100 - $200
                                                    </label>
                                                    <Badge className='border font-weight-normal'>168</Badge>
                                                </div>
                                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                                    <input type="checkbox" className="custom-control-input" id="price-3" />
                                                    <label className="custom-control-label" htmlFor="price-3">
                                                        $200 - $300
                                                    </label>
                                                    <Badge className='border font-weight-normal'>168</Badge>
                                                </div>
                                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                                    <input type="checkbox" className="custom-control-input" id="price-4" />
                                                    <label className="custom-control-label" htmlFor="price-4">
                                                        $300 - $400
                                                    </label>
                                                    <Badge className='border font-weight-normal'>168</Badge>
                                                </div>
                                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between">
                                                    <input type="checkbox" className="custom-control-input" id="price-5" />
                                                    <label className="custom-control-label" htmlFor="price-5">
                                                        $400 - $500
                                                    </label>
                                                    <Badge className='border font-weight-normal'>168</Badge>
                                                </div>
                                            </form>
                                        </div>

                                        <h5 className="section-title position-relative text-uppercase mb-3">
                                            <span className="pr-3">Filter by price</span>
                                        </h5>
                                        <div className="bg-light p-4 mb-30">
                                            <form>
                                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                                    <input
                                                        type="checkbox"
                                                        className="custom-control-input"
                                                        defaultChecked=""
                                                        id="price-all"
                                                    />
                                                    <label className="custom-control-label" htmlFor="price-all">
                                                        All Price
                                                    </label>
                                                    <Badge className='border font-weight-normal'>168</Badge>
                                                </div>
                                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                                    <input type="checkbox" className="custom-control-input" id="price-1" />
                                                    <label className="custom-control-label" htmlFor="price-1">
                                                        $0 - $100
                                                    </label>
                                                    <Badge className='border font-weight-normal'>168</Badge>
                                                </div>
                                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                                    <input type="checkbox" className="custom-control-input" id="price-2" />
                                                    <label className="custom-control-label" htmlFor="price-2">
                                                        $100 - $200
                                                    </label>
                                                    <Badge className='border font-weight-normal'>168</Badge>
                                                </div>
                                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                                    <input type="checkbox" className="custom-control-input" id="price-3" />
                                                    <label className="custom-control-label" htmlFor="price-3">
                                                        $200 - $300
                                                    </label>
                                                    <Badge className='border font-weight-normal'>168</Badge>
                                                </div>
                                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                                    <input type="checkbox" className="custom-control-input" id="price-4" />
                                                    <label className="custom-control-label" htmlFor="price-4">
                                                        $300 - $400
                                                    </label>
                                                    <Badge className='border font-weight-normal'>168</Badge>
                                                </div>
                                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between">
                                                    <input type="checkbox" className="custom-control-input" id="price-5" />
                                                    <label className="custom-control-label" htmlFor="price-5">
                                                        $400 - $500
                                                    </label>
                                                    <Badge className='border font-weight-normal'>168</Badge>
                                                </div>
                                            </form>
                                        </div>

                                        <h5 className="section-title position-relative text-uppercase mb-3">
                                            <span className="pr-3">Filter by price</span>
                                        </h5>
                                        <div className="bg-light p-4 mb-30">
                                            <form>
                                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                                    <input
                                                        type="checkbox"
                                                        className="custom-control-input"
                                                        defaultChecked=""
                                                        id="price-all"
                                                    />
                                                    <label className="custom-control-label" htmlFor="price-all">
                                                        All Price
                                                    </label>
                                                    <Badge className='border font-weight-normal'>168</Badge>
                                                </div>
                                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                                    <input type="checkbox" className="custom-control-input" id="price-1" />
                                                    <label className="custom-control-label" htmlFor="price-1">
                                                        $0 - $100
                                                    </label>
                                                    <Badge className='border font-weight-normal'>168</Badge>
                                                </div>
                                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                                    <input type="checkbox" className="custom-control-input" id="price-2" />
                                                    <label className="custom-control-label" htmlFor="price-2">
                                                        $100 - $200
                                                    </label>
                                                    <Badge className='border font-weight-normal'>168</Badge>
                                                </div>
                                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                                    <input type="checkbox" className="custom-control-input" id="price-3" />
                                                    <label className="custom-control-label" htmlFor="price-3">
                                                        $200 - $300
                                                    </label>
                                                    <Badge className='border font-weight-normal'>168</Badge>
                                                </div>
                                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                                    <input type="checkbox" className="custom-control-input" id="price-4" />
                                                    <label className="custom-control-label" htmlFor="price-4">
                                                        $300 - $400
                                                    </label>
                                                    <Badge className='border font-weight-normal'>168</Badge>
                                                </div>
                                                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between">
                                                    <input type="checkbox" className="custom-control-input" id="price-5" />
                                                    <label className="custom-control-label" htmlFor="price-5">
                                                        $400 - $500
                                                    </label>
                                                    <Badge className='border font-weight-normal'>168</Badge>
                                                </div>
                                            </form>
                                        </div>
                                    </Offcanvas.Body>
                                </Offcanvas>
                                <div className="d-flex align-items-center justify-content-between mb-4">
                                    <div>
                                        <Button variant="primary" onClick={handleShow} className="d-lg-none d-xl-block d-xl-none d-md-none">
                                            <i className="fa fa-bars" />
                                        </Button>
                                        <button className="btn btn-sm btn-light ml-2">
                                            <i className="fa fa-th-large" />
                                        </button>
                                        <button className="btn btn-sm btn-light ml-2">
                                            <i className="fa fa-bars" />
                                        </button>
                                    </div>
                                    <div className="ml-2">
                                        <div className="btn-group">
                                            <DropdownButton title="Sorting">
                                                <Dropdown.Item>Latest</Dropdown.Item>
                                                <Dropdown.Item>Popularity</Dropdown.Item>
                                                <Dropdown.Item>Best Rating</Dropdown.Item>
                                            </DropdownButton>
                                        </div>
                                        <div className="btn-group ml-2">
                                            <DropdownButton title="Showing" className=''>
                                                <Dropdown.Item>10</Dropdown.Item>
                                                <Dropdown.Item>20</Dropdown.Item>
                                                <Dropdown.Item>30</Dropdown.Item>
                                            </DropdownButton>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            {items.map((item) => (
                                <Col lg="4" md="6" sm="6" className='pb-1'>
                                    <div className="product-item bg-light mb-4">
                                        <div className="product-img position-relative overflow-hidden child">

                                            <Image fluid className='product-image w-100 child-child' src={item.itemPictureUrl} alt=""></Image>
                                            <div className="product-action">

                                                <a className="btn btn-outline-dark btn-square add-to-cart-btn" id={item.itemId}>
                                                    <i className="fa fa-shopping-cart" />
                                                </a>
                                                <a className="btn btn-outline-dark btn-square" href="">
                                                    <i className="far fa-heart" />
                                                </a>
                                                <a className="btn btn-outline-dark btn-square" href="">
                                                    <i className="fa fa-sync-alt" />
                                                </a>
                                                <a className="btn btn-outline-dark btn-square" href={`/products/${item.itemId}`}>
                                                    <i className="fa fa-search" />
                                                </a>
                                                <span className="itemId" id={item.itemId}></span>
                                            </div>
                                        </div>
                                        <div className="text-center py-4 child">
                                            <a className="h6 text-decoration-none text-truncate child-child" href={`/products/${item.itemId}`}>
                                                {item.itemName}
                                            </a>
                                            <div className="d-flex align-items-center justify-content-center mt-2 child-child">
                                                <h5 className='child-child-child'>{item.itemPrice}TL</h5>
                                                <h6 className="text-muted ml-2">
                                                    <del>{item.itemPrice}TL</del>
                                                </h6>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center mb-1">
                                                <small className="fa fa-star text-primary mr-1" />
                                                <small className="fa fa-star text-primary mr-1" />
                                                <small className="fa fa-star text-primary mr-1" />
                                                <small className="fa fa-star text-primary mr-1" />
                                                <small className="fa fa-star text-primary mr-1" />
                                                <small>(99)</small>
                                            </div>
                                        </div>
                                    </div>

                                </Col>
                            ))}
                            <Col className='col-12'>
                                <nav>
                                    <ul className="pagination justify-content-center">
                                        <li className="page-item disabled">
                                            <a className="page-link" href="#">
                                                Önceki
                                            </a>
                                        </li>
                                        <li className="page-item active">
                                            <a className="page-link" href="#">
                                                1
                                            </a>
                                        </li>
                                        <li className="page-item">
                                            <a className="page-link" href="#">
                                                2
                                            </a>
                                        </li>
                                        <li className="page-item">
                                            <a className="page-link" href="#">
                                                3
                                            </a>
                                        </li>
                                        <li className="page-item">
                                            <a className="page-link" href="#">
                                                Sonraki
                                            </a>
                                        </li>
                                    </ul>
                                </nav>

                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    )
}


