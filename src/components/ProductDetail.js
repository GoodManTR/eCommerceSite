import { collection, query, where, getDocs, onSnapshot, doc, getDoc, setDoc, deleteDoc, deleteField, updateDoc } from "firebase/firestore";
import { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Breadcrumb, BreadcrumbItem, Badge, Image, Carousel, Tabs, Tab } from 'react-bootstrap';
import { firestoreDb, realtimeDb, auth } from "../firebase";
import { Link, useNavigate } from 'react-router-dom'
import { getDatabase, ref, child, get, update, set, remove, onValue, orderByChild } from "firebase/database";


export default function ProductDetail() {
    const [product, setProduct] = useState()
    const navigate = useNavigate()
    let count
    let isKeyExist
    const inputRef = useRef()

    async function getProduct() {
            if (product != undefined) {
                return
            }
            const q = query(collection(firestoreDb, "products"), where("itemId", "==", (window.location.pathname).replace("/products/", "")));

            const querySnapshot = await getDocs(q);
    
            querySnapshot.forEach((doc) => {
                setProduct(doc.data())
            });
        
        console.log("getting product");
    }

    async function getCount() {
        await get(ref(realtimeDb, "users/" + auth.currentUser.uid + "/shopping_cart/" + (window.location.pathname).replace("/products/", ""))).then((snapshot) => {
            if (snapshot.exists()) {
                count = snapshot.val().count
            }
          }).catch((error) => {
            console.error(error);
        });
    }

    async function checkKey() {
        await get(ref(realtimeDb, "users/" + auth.currentUser.uid + "/shopping_cart/" + (window.location.pathname).replace("/products/", ""))).then((snapshot) => {
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

    async function writeNewPost() {
        checkKey().then(() => {
            if (isKeyExist) {
                getCount().then(() => {
                    const q = query(collection(firestoreDb, `products`), where("itemId", "==", `${(window.location.pathname).replace("/products/", "")}`));
                    onSnapshot(q, (querySnapshot) => {
                        querySnapshot.forEach((docc) => {
                            console.log("written");
                            set(ref(realtimeDb, `users/${auth.currentUser.uid}/shopping_cart/${(window.location.pathname).replace("/products/", "")}`), {
                                count: count += parseInt(inputRef.current.value),
                                itemId: (window.location.pathname).replace("/products/", ""),
                                itemName: docc.data().itemName,
                                itemPrice: docc.data().itemPrice,
                                itemPictureUrl: docc.data().itemPictureUrl
                            });
                        });
                    });
                })
            } else if (!isKeyExist) {
                const q = query(collection(firestoreDb, `products`), where("itemId", "==", `${(window.location.pathname).replace("/products/", "")}`));
                onSnapshot(q, (querySnapshot) => {
                    querySnapshot.forEach((docc) => {
                        set(ref(realtimeDb, `users/${auth.currentUser.uid}/shopping_cart/${(window.location.pathname).replace("/products/", "")}`), {
                            count: count = inputRef.current.value,
                            itemId: (window.location.pathname).replace("/products/", ""),
                            itemName: docc.data().itemName,
                            itemPrice: docc.data().itemPrice,
                            itemPictureUrl: docc.data().itemPictureUrl
                        });
                    });
                });
            }
        })
    }

    function addToCartClicked(event) {
        var button = event.target
        var shopItem = button.parentElement.parentElement
        if(event.target.className == "fa fa-plus") {
            shopItem = button.parentElement.parentElement.parentElement
        }
        shopItem.getElementsByClassName('sayi')[0].value = parseInt(inputRef.current.value) + 1
    }

    function subtractFromCartClicked(event) {
        var button = event.target
        var shopItem = button.parentElement.parentElement
        if(event.target.className == "fa fa-minus") {
            shopItem = button.parentElement.parentElement.parentElement
        }
        shopItem.getElementsByClassName('sayi')[0].value = parseInt(inputRef.current.value) - 1
    }

    function ready() {
        var addToCartButtons = document.getElementsByClassName('arti')
        for (var i = 0; i < addToCartButtons.length; i++) {
            var button = addToCartButtons[i]
            button.onclick = addToCartClicked
        }

        var subtractFromCartButtons = document.getElementsByClassName('eksi')
        for (var i = 0; i < subtractFromCartButtons.length; i++) {
            var button = subtractFromCartButtons[i]
            button.onclick = subtractFromCartClicked
        }
    }

    useEffect(() => {
        ready()
    })

    useEffect(() => {
        getProduct()
    })
    
    return (
        <>
            <Container fluid>
                <Row className='px-xl-5 d-flex justify-content-center align-items-center h-100'>
                    <Col className="col-12" lg="10">
                        <Breadcrumb className='myBreadCrumb bg-light mb-30'>
                            <BreadcrumbItem href='/'>Ana Sayfa</BreadcrumbItem>
                            <BreadcrumbItem href='/products'>Ürünler</BreadcrumbItem>
                            <BreadcrumbItem active>Ürün Detayı</BreadcrumbItem>
                        </Breadcrumb>
                    </Col>
                </Row>
            </Container>

            <Container fluid className='pb-5'>
                <Row className='px-xl-5 d-flex justify-content-center h-100'>
                    <Col lg="3" className='mb-30'>
                        {/* <Carousel className='mb-30' variant='light' fade>
                            <Carousel.Item style={{ height: 430 }} className="d-flex justify-content-center align-items-center b-r-1">
                                
                            </Carousel.Item>
                        </Carousel> */}
                        <Image
                                    className="b-r-1"
                                    src={product != undefined && product.itemPictureUrl}
                                    alt="First slide"
                                    style={{ objectFit: "scale-down"}}
                                />
                    </Col>

                    <Col lg="7" className='h-auto mb-30 ' >
                        <div className="h-100 bg-light p-30 b-r-1" >
                            <h3>{product != undefined && product.itemName}</h3>
                            <div className="d-flex mb-3">
                                <div className="text-primary mr-2">
                                    <small className="fas fa-star" />
                                    <small className="fas fa-star" />
                                    <small className="fas fa-star" />
                                    <small className="fas fa-star-half-alt" />
                                    <small className="far fa-star" />
                                </div>
                                <small className="pt-1">(99 Reviews)</small>
                            </div>
                            <h3 className="font-weight-semi-bold mb-4">{product != undefined && product.itemPrice} TL</h3>
                            <p className="mb-4">
                                Volup erat ipsum diam elitr rebum et dolor. Est nonumy elitr erat diam stet
                                sit clita ea. Sanc ipsum et, labore clita lorem magna duo dolor no sea
                                Nonumy
                            </p>
                            <div className="d-flex align-items-center mb-4 pt-2">
                                <div className="input-group quantity mr-3" style={{ width: 130 }}>
                                    <div className="input-group-btn">
                                        <button className="eksi btn btn-primary btn-minus">
                                            <i className="fa fa-minus" />
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        className="sayi form-control bg-secondary border-0 text-center"
                                        defaultValue={1}
                                        ref={inputRef}
                                    />
                                    <div className="input-group-btn">
                                        <button className="arti btn btn-primary btn-plus">
                                            <i className="fa fa-plus" />
                                        </button>
                                    </div>
                                </div>
                                <button className="btn btn-primary px-3" onClick={writeNewPost}>
                                    <i className="fa fa-shopping-cart mr-1" /> Sepete Ekle
                                </button>
                            </div>
                            <div className="d-flex pt-2">
                                <strong className="text-dark mr-2">Share on:</strong>
                                <div className="d-inline-flex">
                                    <a className="text-dark px-2" href="">
                                        <i className="fab fa-facebook-f" />
                                    </a>
                                    <a className="text-dark px-2" href="">
                                        <i className="fab fa-twitter" />
                                    </a>
                                    <a className="text-dark px-2" href="">
                                        <i className="fab fa-linkedin-in" />
                                    </a>
                                    <a className="text-dark px-2" href="">
                                        <i className="fab fa-pinterest" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>

                <Row className='px-xl-5 d-flex justify-content-center align-items-center h-100'>
                    <Col className='mb-30' lg="10">
                        
                                <div className="bg-light p-30 b-r-1">
                                    <Tabs
                                        defaultActiveKey="Active"
                                        id="uncontrolled-tab-example"
                                        className="mb-3"
                                    >
                                        <Tab eventKey="Active" title="Ürün Açıklaması">
                                            <h4 className="mb-3">Product Description</h4>
                                            <p>Eos no lorem eirmod diam diam, eos elitr et gubergren diam sea. Consetetur vero aliquyam invidunt duo dolores et duo sit. Vero diam ea vero et dolore rebum, dolor rebum eirmod consetetur invidunt sed sed et, lorem duo et eos elitr, sadipscing kasd ipsum rebum diam. Dolore diam stet rebum sed tempor kasd eirmod. Takimata kasd ipsum accusam sadipscing, eos dolores sit no ut diam consetetur duo justo est, sit sanctus diam tempor aliquyam eirmod nonumy rebum dolor accusam, ipsum kasd eos consetetur at sit rebum, diam kasd invidunt tempor lorem, ipsum lorem elitr sanctus eirmod takimata dolor ea invidunt.</p>
                                            <p>Dolore magna est eirmod sanctus dolor, amet diam et eirmod et ipsum. Amet dolore tempor consetetur sed lorem dolor sit lorem tempor. Gubergren amet amet labore sadipscing clita clita diam clita. Sea amet et sed ipsum lorem elitr et, amet et labore voluptua sit rebum. Ea erat sed et diam takimata sed justo. Magna takimata justo et amet magna et.</p>
                                        </Tab>
                                        <Tab eventKey="İncelemeler" title="İncelemeler">
                                            <Row>
                                                <Col md="6">
                                                    <h4 className="mb-4">1 review for "Product Name"</h4>
                                                    <div className="media mb-4">
                                                        <img src="img/user.jpg" alt="Image" className="img-fluid mr-3 mt-1" style={{width: 45}}></img>
                                                        <div className="media-body">
                                                            <h6>John Doe<small> - <i>01 Jan 2045</i></small></h6>
                                                            <div className="text-primary mb-2">
                                                                <i className="fas fa-star"></i>
                                                                <i className="fas fa-star"></i>
                                                                <i className="fas fa-star"></i>
                                                                <i className="fas fa-star-half-alt"></i>
                                                                <i className="far fa-star"></i>
                                                            </div>
                                                            <p>Diam amet duo labore stet elitr ea clita ipsum, tempor labore accusam ipsum et no at. Kasd diam tempor rebum magna dolores sed sed eirmod ipsum.</p>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md="6">
                                                    <h4 className="mb-4">Leave a review</h4>
                                                    <small>Your email address will not be published. Required fields are marked *</small>
                                                    <div className="d-flex my-3">
                                                        <p className="mb-0 mr-2">Your Rating * :</p>
                                                        <div className="text-primary">
                                                            <i className="far fa-star"></i>
                                                            <i className="far fa-star"></i>
                                                            <i className="far fa-star"></i>
                                                            <i className="far fa-star"></i>
                                                            <i className="far fa-star"></i>
                                                        </div>
                                                    </div>
                                                    <form>
                                                        <div className="form-group">
                                                            <label htmlFor="message">Your Review *</label>
                                                            <textarea id="message" cols="30" rows="5" className="form-control"></textarea>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="name">Your Name *</label>
                                                            <input type="text" className="form-control" id="name"></input>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="email">Your Email *</label>
                                                            <input type="email" className="form-control" id="email"></input>
                                                        </div>
                                                        <div className="form-group mb-0">
                                                            <input type="submit" value="Leave Your Review" className="btn btn-primary px-3"></input>
                                                        </div>
                                                    </form>
                                                </Col>
                                            </Row>
                                        </Tab>
                                    </Tabs>
                                </div>
                         

                    </Col>
                </Row>
            </Container>
        </>
    )
}