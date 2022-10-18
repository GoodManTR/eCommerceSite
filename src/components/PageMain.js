import React, { useState, useEffect } from 'react'
import '../styles/main.css'
import '../styles/style.css'
import { getDatabase, ref, child, push, update, set, get, onValue } from "firebase/database";
import { collection, query, where, onSnapshot, doc, getDoc, setDoc } from "firebase/firestore";
import { auth, firestoreDb } from '../firebase';
import { Container, Nav, Navbar, NavDropdown, Form, Button, Row, Col, Carousel } from 'react-bootstrap';


export default function PageMain() {

    return (
        <>
            <link rel="preconnect" href="https://fonts.gstatic.com"></link>
            <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet"></link>
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet"></link>

            <Container fluid style={{ marginTop: 35 }}>
                <Row className='px-xl-5'>
                    <div className='col-lg-6 b-r-1'>
                        <Carousel className='mb-30 b-r-1' variant='light' fade>
                            <Carousel.Item className='b-r-1' style={{ height: 430 }}>
                                <img
                                    className="position-absolute w-100 h-100 b-r-1"
                                    src="https://firebasestorage.googleapis.com/v0/b/ihsanceyizpro.appspot.com/o/321.jpg?alt=media&token=7276592d-1911-4a5e-a911-05a3d67b5bdc"
                                    alt="First slide"
                                    style={{ objectFit: "fit" }}
                                />
                                <Carousel.Caption className='b-r-1'>
                                    <h3>Special Offers</h3>
                                    <h6 className="text-white text-uppercase">Save 20%</h6>
                                </Carousel.Caption>
                            </Carousel.Item>
                        </Carousel>

                    </div>
                    <div className='col-lg-6'>
                        <div className="product-offer mb-30" style={{ height: 200 }}>
                            <img className="img-fluid" src="https://firebasestorage.googleapis.com/v0/b/ihsanceyizpro.appspot.com/o/kinamalzemeleri5.jpg?alt=media&token=1d725351-e62d-4bfa-990c-ab7dee7e3bdc" alt="" />
                            <div className="offer-text">
                                <h6 className="text-white text-uppercase">Save 20%</h6>
                                <h3 className="text-white mb-3">Special Offer</h3>
                                <a href="" className="btn btn-primary">
                                    Shop Now
                                </a>
                            </div>
                        </div>
                        <div className="product-offer mb-30" style={{ height: 200 }}>
                            <img className="img-fluid" src="https://firebasestorage.googleapis.com/v0/b/ihsanceyizpro.appspot.com/o/123.jpg?alt=media&token=fc7d90b2-7e9f-4229-a31d-5ae96f28cc75" alt="" />
                            <div className="offer-text">
                                <h6 className="text-white text-uppercase">Save 20%</h6>
                                <h3 className="text-white mb-3">Special Offer</h3>
                                <a href="" className="btn btn-primary">
                                    Shop Now
                                </a>
                            </div>
                        </div>

                    </div>
                </Row>
            </Container>


            <Container fluid>
                <h2 className="section-title position-relative mx-xl-5 mb-4">
                    <span className="pr-3">KATEGORİLER</span>
                </h2>
                <Row className='px-xl-5 pb-3'>
                    <div className="col-lg-3 col-md-4 col-sm-6 pb-1">
                        <a className="text-decoration-none" href="">
                            <div className="cat-item d-flex align-items-center mb-4">
                                <div className="overflow-hidden" style={{ width: 100, height: 100 }}>
                                    <img className="img-fluid" src="https://firebasestorage.googleapis.com/v0/b/ihsanceyizpro.appspot.com/o/letter_c_PNG26.png?alt=media&token=25c109d3-db80-4e95-afd9-b783cf6ab993" alt="" />
                                </div>
                                <div className="flex-fill pl-3">
                                    <h6 className='myImageText'>Category Name</h6>
                                    <small className="text-body myImageText">100 Products</small>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6 pb-1">
                        <a className="text-decoration-none" href="">
                            <div className="cat-item d-flex align-items-center mb-4">
                                <div className="overflow-hidden" style={{ width: 100, height: 100 }}>
                                    <img className="img-fluid myImage" src="https://firebasestorage.googleapis.com/v0/b/ihsanceyizpro.appspot.com/o/letter_c_PNG26.png?alt=media&token=25c109d3-db80-4e95-afd9-b783cf6ab993" alt="" />
                                </div>
                                <div className="flex-fill pl-3">
                                    <h6 className='myImageText'>Category Name</h6>
                                    <small className="text-body myImageText">100 Products</small>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6 pb-1">
                        <a className="text-decoration-none" href="">
                            <div className="cat-item d-flex align-items-center mb-4">
                                <div className="overflow-hidden" style={{ width: 100, height: 100 }}>
                                    <img className="img-fluid myImage" src="https://firebasestorage.googleapis.com/v0/b/ihsanceyizpro.appspot.com/o/letter_c_PNG26.png?alt=media&token=25c109d3-db80-4e95-afd9-b783cf6ab993" alt="" />
                                </div>
                                <div className="flex-fill pl-3">
                                    <h6 className='myImageText'>Category Name</h6>
                                    <small className="text-body myImageText">100 Products</small>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6 pb-1">
                        <a className="text-decoration-none" href="">
                            <div className="cat-item d-flex align-items-center mb-4">
                                <div className="overflow-hidden" style={{ width: 100, height: 100 }}>
                                    <img className="img-fluid myImage" src="https://firebasestorage.googleapis.com/v0/b/ihsanceyizpro.appspot.com/o/letter_c_PNG26.png?alt=media&token=25c109d3-db80-4e95-afd9-b783cf6ab993" alt="" />
                                </div>
                                <div className="flex-fill pl-3">
                                    <h6 className='myImageText'>Category Name</h6>
                                    <small className="text-body myImageText">100 Products</small>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6 pb-1">
                        <a className="text-decoration-none" href="">
                            <div className="cat-item d-flex align-items-center mb-4">
                                <div className="overflow-hidden" style={{ width: 100, height: 100 }}>
                                    <img className="img-fluid myImage" src="https://firebasestorage.googleapis.com/v0/b/ihsanceyizpro.appspot.com/o/letter_c_PNG26.png?alt=media&token=25c109d3-db80-4e95-afd9-b783cf6ab993" alt="" />
                                </div>
                                <div className="flex-fill pl-3">
                                    <h6 className='myImageText'>Category Name</h6>
                                    <small className="text-body myImageText">100 Products</small>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6 pb-1">
                        <a className="text-decoration-none" href="">
                            <div className="cat-item d-flex align-items-center mb-4">
                                <div className="overflow-hidden" style={{ width: 100, height: 100 }}>
                                    <img className="img-fluid myImage" src="https://firebasestorage.googleapis.com/v0/b/ihsanceyizpro.appspot.com/o/letter_c_PNG26.png?alt=media&token=25c109d3-db80-4e95-afd9-b783cf6ab993" alt="" />
                                </div>
                                <div className="flex-fill pl-3">
                                    <h6 className='myImageText'>Category Name</h6>
                                    <small className="text-body myImageText">100 Products</small>
                                </div>
                            </div>
                        </a>
                    </div>
                </Row>
            </Container>

            <Container fluid className='pt-5 pb-3'>
                <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="pr-3">Featured Products</span></h2>
                <Row className='px-xl-5'>
                    <div className="col-lg-3 col-md-4 col-sm-6 pb-1">
                        <div className="product-item bg-light mb-4">
                            <div className="product-img position-relative overflow-hidden">
                                <img className="img-fluid w-100 featured-product-image" src="https://firebasestorage.googleapis.com/v0/b/ihsanceyizpro.appspot.com/o/product-images%2F1056790685407?alt=media&token=8c79810b-5174-43bf-bc45-9011ed26231e" alt=""></img>
                                <div className="product-action">
                                    <a className="btn btn-outline-dark btn-square" href=""><i className="fa fa-shopping-cart"></i></a>
                                    <a className="btn btn-outline-dark btn-square" href=""><i className="far fa-heart"></i></a>
                                    <a className="btn btn-outline-dark btn-square" href=""><i className="fa fa-sync-alt"></i></a>
                                    <a className="btn btn-outline-dark btn-square" href=""><i className="fa fa-search"></i></a>
                                </div>
                            </div>
                            <div className="text-center py-4">
                                <a className="h6 text-decoration-none text-truncate" href="">Product Name Goes Here</a>
                                <div className="d-flex align-items-center justify-content-center mt-2">
                                    <h5>$123.00</h5><h6 className="text-muted ml-2"><del>$123.00</del></h6>
                                </div>
                                <div className="d-flex align-items-center justify-content-center mb-1">
                                    <small className="fa fa-star text-primary mr-1"></small>
                                    <small className="fa fa-star text-primary mr-1"></small>
                                    <small className="fa fa-star text-primary mr-1"></small>
                                    <small className="fa fa-star text-primary mr-1"></small>
                                    <small className="fa fa-star text-primary mr-1"></small>
                                    <small>(99)</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </Row>
            </Container>
        </>
    )
}
