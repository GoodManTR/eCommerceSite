import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/main.css'
import React, { useRef, useState, useEffect } from 'react'
import { getDatabase, ref, child, get, update, set, remove, onValue, orderByChild } from "firebase/database";
import { auth, firestoreDb, realtimeDb } from "../firebase"
import { collection, query, where, onSnapshot, doc, getDoc, setDoc, deleteDoc, getDocs, deleteField, updateDoc } from "firebase/firestore";
import { Container, Nav, Navbar, NavDropdown, Form, Button, Row, Col, Carousel, Breadcrumb, Table, BreadcrumbItem, ToastHeader, ToastBody, Modal, Toast, ToastContainer } from 'react-bootstrap';
import { render } from 'react-dom';

function MyVerticallyCenteredModal(props) {

    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className='myModal'
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Ürünü kaldırmak istediğine emin misin?
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Kaldırmak için evete, vazgeçmek için iptal tuşuna basabilirsin.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>
                    İptal
                </Button>
                <Button variant="danger" onClick={() => {
                    props.onHide()
                    remove(ref(realtimeDb, 'users/' + auth.currentUser.uid + "/shopping_cart/" + props.itemId))
                }}>
                    Kaldır
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default function ShoppingCart() {
    const [ cartItems , setCartItems ] = useState([])
    const [error, setError] = useState('')
    const [modalShow, setModalShow] = useState(false);
    const [itemId, setItemId] = useState()
    const [show2, setShow2] = useState(false);
    let count

    

    async function getCount(itemId) {
        await get(ref(realtimeDb, "users/" + auth.currentUser.uid + "/shopping_cart/" + itemId)).then((snapshot) => {
            if (snapshot.exists()) {
                count = snapshot.val().count
            }
          }).catch((error) => {
            console.error(error);
        });
    }

    function addToCart(uid, itemId) {
        getCount(itemId).then(() => {
            update(ref(realtimeDb, 'users/' + uid + "/shopping_cart/" + itemId), {
                count: count += 1
              });
        })
    }

    function subtractFromCart(uid, itemId) {
        getCount(itemId).then(() => {
            if (count > 1) {
                update(ref(realtimeDb, 'users/' + uid + "/shopping_cart/" + itemId), {
                    count: count -= 1
                  });
            } else {
                setItemId(itemId)
                setModalShow(true)
            }
        })
    }

    function addToCartClicked(event) {
        var button = event.target
        var shopItem = button.parentElement
        if(event.target.className == "fa fa-plus") {
            shopItem = button.parentElement.parentElement
        }
        var itemId = shopItem.getElementsByClassName('arti')[0].id
   
        getCount(itemId).then(addToCart(auth.currentUser.uid, itemId))
    }

    function subtractFromCartClicked(event) {
        var button = event.target
        var shopItem = button.parentElement
        if(event.target.className == "fa fa-minus") {
            shopItem = button.parentElement.parentElement
        }
        var itemId = shopItem.getElementsByClassName('eksi')[0].id
        getCount(itemId).then(subtractFromCart(auth.currentUser.uid, itemId))
    }

    function deleteItemButtonClicked(event) {
        var button = event.target
        var shopItem = button.parentElement
        if(event.target.className == "fa fa-times") {
            shopItem = button.parentElement.parentElement
        }
        setItemId(shopItem.getElementsByClassName('delete-item')[0].id)
        setModalShow(true)
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

        var deleteFromCartButtons = document.getElementsByClassName('delete-item')
        for (var i = 0; i < deleteFromCartButtons.length; i++) {
            var button = deleteFromCartButtons[i]
            button.onclick = deleteItemButtonClicked
        }
    }

    function getTotal() {
        let total = 0
        let stringTotal = ""
        cartItems.map((item, index) => {
            if (item.count !== undefined) {
                const count = parseFloat(item.count)
                const cost = parseFloat(item.itemPrice.replace("TL", "").replace(",", "."))
                total += count * cost
                stringTotal = `${total}`    
            }

        })
        return total.toFixed(2).replace('.', ',')
    }

    async function getCartItems() {
        const starCountRef = ref(realtimeDb, 'users/' + auth.currentUser.uid + '/shopping_cart');

        onValue(starCountRef, (snapshot) => {
            setCartItems([])
            snapshot.forEach((childSnapshot) => {
                setCartItems(cartItems => [...cartItems, childSnapshot.val()])
            });
          });
    }

    async function writeNewPost() {
        const idGenerator = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()))
        const starCountRef = ref(realtimeDb, 'users/' + auth.currentUser.uid + '/shopping_cart');

        var today  = new Date();
        console.log();

        onValue(starCountRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                try {
                    const docRef = setDoc(doc(firestoreDb, "orders", `${idGenerator}/items/${childSnapshot.val().itemId}`), {
                        count: childSnapshot.val().count,
                        itemId: childSnapshot.val().itemId,
                        itemName: childSnapshot.val().itemName,
                        itemPrice: childSnapshot.val().itemPrice,
                        itemPictureUrl: childSnapshot.val().itemPictureUrl,
                        orderId: idGenerator
                    }, { merge: true });
                    console.log("Document written with ID: ", docRef.id);
                } catch (e) {
                    console.error("Error adding document: ", e);
                }
            });
          });
        try {
            const orderData = setDoc(doc(firestoreDb, "orders", `${idGenerator}`), {
                total: parseFloat(getTotal().replace(",", ".")) + 10,
                orderedBy: auth.currentUser.uid,
                orderId: idGenerator,
                orderDate: today.toLocaleDateString("tr-TR", { day: 'numeric' })  + " " + today.toLocaleDateString("tr-TR", { month: 'long' })  + " " + today.toLocaleDateString("tr-TR", { year: 'numeric' }) + ", " + today.toLocaleDateString("tr-TR", { weekday: 'long' })

            }, { merge: true });
            const orderData2 = setDoc(doc(firestoreDb, "users", `${auth.currentUser.uid}/orders/${idGenerator}`), {
                orderId: idGenerator
            }, { merge: true });
            console.log("Document written with ID: ", orderData.id);
            console.log("Document written with ID: ", orderData2.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
    
    function createOrder() {
        writeNewPost()
            .then(async () => {
                await remove(ref(realtimeDb, 'users/' + auth.currentUser.uid + "/shopping_cart/"))
            }).then(() => {
                //window.location.reload();
            })
    }

    useEffect(() => {
        getCartItems()
    }, [])

    useEffect(() => {
        ready()
    })


    return (
        <>
            <ToastContainer>
                <Toast bg='success' onClose={() => setShow2(false)} show={show2} delay={3000} style={{ position: "absolute", top: 0, right: 0, margin: 20, opacity: 0.9 }}>
                    <Toast.Header>
                        <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                        <strong className="me-auto">Sipariş</strong>
                        <small className="text-muted">Şimdi</small>
                    </Toast.Header>
                    <Toast.Body>Siparişiniz alındı. <a href='/orders'>Buradan</a> kontrol edebilirsiniz.</Toast.Body>
                </Toast>
            </ToastContainer>

            <Container fluid>
                <Row className='px-xl-5'>
                    <Col>
                        <Breadcrumb className='myBreadCrumb bg-light mb-30'>
                            <BreadcrumbItem href='/'>Ana Sayfa</BreadcrumbItem>
                            <BreadcrumbItem href='/products'>Ürünler</BreadcrumbItem>
                            <BreadcrumbItem active>Sepet</BreadcrumbItem>
                        </Breadcrumb>
                    </Col>
                </Row>
            </Container>
            <Container fluid>
                <Row className='px-xl-5'>
                    <Col className='col-lg-8 table-responsive mb-5'>
                        <Table className=" table-hover text-center">
                            <thead className="bg-dark" style={{color: "white"}} >
                                <tr>
                                    <th>Resim</th>
                                    <th>Ürünler</th>
                                    <th>Fiyat</th>
                                    <th>Adet</th>
                                    <th>Toplam</th>
                                    <th>Kaldır</th>
                                </tr>
                            </thead>
                            <tbody className="align-middle" style={{backgroundColor: "rgb(248,249,250)"}}>
                                {cartItems.map((item, index) => (
                                <tr style={{marginTop: 30}}>
                                    <td className="align-middle"><img src={item.itemPictureUrl} alt="" style={{ width: 50 }}></img></td>
                                    <td>{item.itemName}</td>
                                    <td className="align-middle">{item.itemPrice} TL</td>
                                    <td className="align-middle">
                                        <div className="input-group quantity mx-auto" style={{ width: 100 }}>
                                            <div className="input-group-btn">
                                                <button id={item.itemId} className="eksi btn btn-sm btn-primary btn-minus" >
                                                    <i className="fa fa-minus"></i>
                                                </button>
                                            </div>
                                            <input type="text" className="form-control form-control-sm border-0 text-center" value={item.count} readOnly></input>
                                            <div className="input-group-btn">
                                                <button id={item.itemId} className="arti btn btn-sm btn-primary btn-plus">
                                                    <i className="fa fa-plus"></i>
                                                </button>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="align-middle">{(parseFloat(item.itemPrice) * parseFloat(item.count)).toFixed(2).replace('.', ',')} TL</td>

                                        <td className="align-middle"><Button id={item.itemId} type="submit" className="delete-item btn-sm btn-danger"><i className="fa fa-times"></i></Button></td>
                                        <MyVerticallyCenteredModal
                                            show={modalShow}
                                            onHide={() => setModalShow(false)}
                                            itemId={itemId != undefined && itemId}
                                        />
                                    </tr>

                                ))}
                            </tbody>
                        </Table>
                    </Col>

                    <Col lg="4">
                        <form className="mb-30" action="">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control border-0 customPadding"
                                    placeholder="Kupon Kodu"
                                />
                                <div className="input-group-append">
                                    <button className="btn btn-primary customPadding">Kuponu Uygula</button>
                                </div>
                            </div>
                        </form>
                        <h5 className="section-title position-relative mb-3"><span className="pr-3">SEPET ÖZETİ</span></h5>
                        <div className="proceed-checkout bg-light p-30 mb-5">
                            <div className="border-bottom pb-2">
                                <div className="d-flex justify-content-between mb-3">
                                    <h6>Ürünler</h6>
                                    <h6>{getTotal()} TL</h6>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <h6 className="font-weight-medium">Kargo</h6>
                                    <h6 className="font-weight-medium">10,00 TL</h6>
                                </div>
                            </div>
                            <div className="pt-2">
                                <div className="d-flex justify-content-between mt-2">
                                    <h5>Toplam</h5>
                                    <h5>{(parseFloat(getTotal()) + 10).toFixed(2).replace('.',',')} TL</h5>
                                </div>
                                <button onClick={() => {
                                    createOrder()
                                    setShow2(true)
                                }} type="submit" className="btn btn-block btn-primary font-weight-bold my-3 py-3">
                                    Sipariş Oluştur
                                </button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}