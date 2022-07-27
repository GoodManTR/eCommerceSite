import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { collection, addDoc, setDoc, doc, getDoc, query, onSnapshot, where } from "firebase/firestore";
import { auth } from '../firebase';
import { getDatabase, ref, child, get, set, onValue } from "firebase/database";
import { firestoreDb, realtimeDb } from '../firebase';
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';
import { Container, Row, Col, Breadcrumb, BreadcrumbItem, NavDropdown, Badge,ProgressBar, Image, Dropdown, Nav, DropdownButton, Navbar, Form, Button, Card,  } from 'react-bootstrap';



let searchItems = []
let inputRefText

const SearchbarDropdown = (props) => {
    const { options, onInputChange } = props;
    const ulRef = useRef();
    const inputRef = useRef();
    const navigate = useNavigate();

    


    useEffect(() => {
        
        inputRef.current.addEventListener('click', (event) => {
            event.stopPropagation();
            ulRef.current.style.display = 'flex';
            onInputChange(event);
        });
        document.addEventListener('click', (event) => {
            ulRef.current.style.display = 'none';
        });
    }, []);


    

    return (
        <div className="search-bar-dropdown">
            <Form className="d-flex w-100">
                <Form.Control
                    id="search-bar"
                    type="search"
                    placeholder="Ürün Ara"
                    ref={inputRef}
                    onChange={onInputChange}
                    aria-label="Search"
                    autoComplete="off"
                />
            </Form>
            
            <ul id="results" className="list-group" ref={ulRef}>

                {options.map((option, index) => {
                    return (

                        <button
                            type="button"
                            key={index}
                            onClick={(e) => {
                                navigate(`/products/${option.itemId}`)
                                window.location.reload()
                            }}
                            className="list-group-item list-group-item-action"
                            style={{padding:0, border: "none"}}
                        >
                            <Card className=''>
                                <Card.Body>
                                    <Row>
                                        <Col md="2">
                                            <Image
                                                src={option.itemPictureUrl}
                                                alt="Phone"
                                                style={{ border: "1px solid rgba(0, 0, 0, 0.2)", borderRadius: "0.4rem", padding: "0.4rem"}}
                                                fluid
                                            />
                                        </Col>
                                        <Col md="8" className='text-center d-flex justify-content-center align-items-center'>
                                            <p className="text-muted mb-0">{option.itemName}</p>
                                        </Col>
                                        <Col md="2" className='text-center d-flex justify-content-center align-items-center'>
                                            <p className="text-muted mb-0">{option.itemPrice}TL</p>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </button>


                    );
                })}

            </ul>
        </div>
    );
};




export default function Header() {
    const [name, setName] = useState('loading...')
    const { currentUser, logout } = useAuth()
    const [itemCounts, setItemCounts] = useState([])

    const [options, setOptions] = useState([]);

    async function getSearchItems() {
        if (inputRefText == "") {
            setOptions([])
            searchItems = []
            return
        }
        console.log("getting Search Items");
        console.log(inputRefText);
        const q = query(collection(firestoreDb, "products"), where("itemName", ">=", inputRefText), where("itemName", "<=", inputRefText + '\uf8ff'));

        onSnapshot(q, (querySnapshot) => {
            searchItems = []
            querySnapshot.forEach((doc) => {
                searchItems.push(doc.data())
                // console.log(doc.data().itemName);
                setOptions(searchItems)
            });
            return
        });
        setOptions([])
    }

     const onInputChange = async (event) => {
        inputRefText = event.target.value
        getSearchItems()
    };


    const handleLogout = async () => {
        console.log("logged out");
        try {
            console.log("asddas");
            await logout()
            window.location.reload();
        } catch {
        }
    }

    function getFirstLetters(str) {
        const firstLetters = str
            .split(' ')
            .map(word => word[0])
            .join('');

        return firstLetters;
    }

    async function getName() {
        if (name != "loading...") {
            return
        }
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

    async function getCartItemsCount() {
        const starCountRef = ref(realtimeDb, 'users/' + auth.currentUser.uid + '/shopping_cart');
        onValue(starCountRef, (snapshot) => {
            setItemCounts([])
            snapshot.forEach((childSnapshot) => {
                setItemCounts(itemCounts => [...itemCounts, childSnapshot.val()])
            });
        });
    }

    useEffect(() => {
        getCartItemsCount()

    }, [])

    useEffect(() => {
        getName()
    })

    return (
        <>
            <header>
                <Container fluid>
                    <Row className='py-1 px-xl-5'>
                        <Col lg="6" className='d-none d-lg-block'>
                            <div className="d-inline-flex align-items-center h-100">
                                <a className="text-body mr-3" style={{ padding: "0.3rem" }} href="">
                                    Hakkımızda
                                </a>
                                <a className="text-body mr-3" style={{ padding: "0.3rem" }} href="/communication">
                                    Bize Ulaşın
                                </a>
                            </div>
                        </Col>
                        <Col lg="6" className='text-center text-lg-right'>
                            <Row className="">
                                <div className='d-lg-none d-xl-block d-xl-none topbar-container-right'>
                                    {currentUser &&
                                        <DropdownButton id="dropdown-basic-button" style={{ marginRight: 15 }} title={(
                                            <>
                                                <i className="fas fa-user" style={{ color: "white" }}></i>
                                                <span style={{ paddingInline: "0.5rem", color: 'white', }}>{getFirstLetters(name)}</span>
                                            </>
                                        )}>
                                            {currentUser.email == "b.kurul@outlook.com" && <NavDropdown.Item href="/add-product">Ürün Ekle</NavDropdown.Item>}
                                            <Dropdown.Item href="/orders">Siparişlerim</Dropdown.Item>
                                            <Dropdown.Item href="/profile-info">Kullanıcı Bilgilerim</Dropdown.Item>
                                            <Dropdown.Divider></Dropdown.Divider>
                                            <Dropdown.Item onClick={handleLogout}>Çıkış Yap</Dropdown.Item>
                                        </DropdownButton>
                                    }
                                    {!currentUser &&
                                        <DropdownButton id="dropdown-basic-button" title={"Hesap"}>
                                            <Dropdown.Item href="/signup">Kayıt Ol</Dropdown.Item>
                                            <Dropdown.Item href="/login">Giriş Yap</Dropdown.Item>
                                        </DropdownButton>
                                    }
                                    {currentUser &&
                                        <a href="/shopping-cart" className="btn px-0 ml-2">
                                            <i className="fas fa-shopping-cart text-dark" />
                                            <span
                                                className="badge text-dark border border-dark rounded-circle"
                                                style={{ paddingBottom: 2 }}
                                            >
                                                {itemCounts.length}
                                            </span>
                                        </a>}
                                </div>
                            </Row>
                        </Col>
                    </Row>

                    <Row className='align-items-center bg-light py-3 px-xl-5 d-none d-lg-flex'>
                        <Col lg="4">
                            <a href="/" className="text-decoration-none">
                                <span className="h1 text-uppercase text-primary bg-dark px-2">İhsan</span>
                                <span className="h1 text-uppercase text-dark bg-primary px-2 ml-n1">
                                    Çeyiz
                                </span>
                            </a>
                        </Col>
                        <Col lg="4" className='col-6 text-left'>
                            <Form className="d-flex">
                                {/* <Form.Control
                                    type="search"
                                    placeholder="Ürün Ara"
                                    className="me-2"
                                    aria-label="Search"
                                /> */}
                                <SearchbarDropdown options={options} onInputChange={onInputChange} />
                                <Button className='bg-transparent text-primary'><i className="fa fa-search" /></Button>
                            </Form>
                        </Col>
                        <Col lg="4" className='col-6 text-right'>
                            <p className="m-0">Müşteri Hizmetleri</p>
                            <h5 className="m-0">+012 345 6789</h5>
                        </Col>
                    </Row>
                </Container>

                <Navbar expand="lg" style={{ paddingTop: 0 }}>
                    <Container fluid className="bg-dark">
                        <Navbar.Brand className='d-none d-lg-block' style={{ marginLeft: "3rem" }}>
                            <Dropdown>
                                <Dropdown.Toggle style={{ height: 65, padding: 30, minWidth: "10rem" }} className='d-flex align-items-center justify-content-between w-100'>
                                    <h6 className="text-dark m-0"><i className="fa fa-bars mr-2"></i>Kategoriler</h6>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                    <Dropdown.Item href="#/action-3" >Something else</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Navbar.Brand>

                        <Navbar.Brand className='d-lg-none d-xl-block d-xl-none' >
                            <a href="/" className="text-decoration-none">
                                <span className="h1 text-uppercase text-primary bg-dark px-2">İhsan</span>
                                <span className="h1 text-uppercase text-dark bg-primary px-2 ml-n1">
                                    Çeyiz
                                </span>
                            </a>
                        </Navbar.Brand>

                        <Navbar.Toggle aria-controls="navbarScroll" />
                        <Navbar.Collapse id="navbarScroll" className='p-0'>
                            <Nav className="me-auto my-2" >
                                <Nav.Link style={{ color: 'white' }} href="/">Ana Sayfa</Nav.Link>
                                <Nav.Link style={{ color: 'white' }} href="/products">Ürünler</Nav.Link>
                                <Nav.Link style={{ color: 'white' }} href="/communication" className='d-lg-none d-xl-block d-xl-none'>Bize Ulaşın</Nav.Link>
                            </Nav>

                            {currentUser &&
                                <>
                                    <Nav className='ml-auto py-0 d-none d-lg-block'>

                                        <NavDropdown title={(
                                            <>
                                                <i className="fas fa-user text-primary"></i>
                                                <span style={{ paddingInline: "0.5rem", color: 'white', }}>{name}</span>
                                            </>
                                        )} id="navbarScrollingDropdown" className='px-0 ml-3' style={{ marginRight: "1rem" }}>
                                            {currentUser.email == "b.kurul@outlook.com" && <NavDropdown.Item href="/add-product">Ürün Ekle</NavDropdown.Item>}
                                            <NavDropdown.Item href="/orders">Siparişlerim</NavDropdown.Item>
                                            <NavDropdown.Item href="/profile-info">
                                                Kullanıcı Bilgilerim
                                            </NavDropdown.Item>
                                            <NavDropdown.Divider />
                                            <NavDropdown.Item onClick={handleLogout}>
                                                Çıkış Yap
                                            </NavDropdown.Item>
                                        </NavDropdown>
                                    </Nav>
                                    <Nav className='ml-auto py-0 d-none d-lg-block'>
                                        <Nav.Item style={{ marginRight: "1rem" }}>
                                            <a href="/shopping-cart" className="btn px-0 ml-3">
                                                <i className="fas fa-shopping-cart text-primary" />
                                                <span style={{ color: 'white', paddingInline: "0.5rem" }}>Sepet</span>
                                                <span
                                                    className="badge text-secondary border border-secondary rounded-circle"
                                                    style={{ paddingBottom: 2 }}
                                                >
                                                    {itemCounts.length}
                                                </span>
                                            </a>
                                        </Nav.Item>
                                    </Nav></>}
                            {!currentUser &&
                                <>
                                    <Nav className="ml-auto py-0 d-none d-lg-block" >
                                        <Nav.Link style={{ color: 'white' }} href="/signup">Kayıt Ol</Nav.Link>
                                    </Nav>
                                    <Nav className="ml-auto py-0 d-none d-lg-block" style={{ marginRight: "3rem" }}>
                                        <Nav.Link style={{ color: 'white' }} href="/login">Giriş Yap</Nav.Link>
                                    </Nav>
                                </>}

                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </header>

        </>
    )
}
