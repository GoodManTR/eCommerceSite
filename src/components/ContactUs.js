import '../styles/main.css'
import Iframe from "react-iframe"
import React, { useState, useEffect } from 'react'
import { Container, Nav, Navbar, NavDropdown, Form, Button, Row, Col, Carousel, Breadcrumb, Table, BreadcrumbItem, ToastHeader, ToastBody } from 'react-bootstrap';

export default function ContactUs() {

    return (
        <>
            <Container fluid>
                <Row className='px-xl-5'>
                    <Col>
                        <Breadcrumb className='myBreadCrumb bg-light mb-30'>
                            <BreadcrumbItem href='/'>Ana Sayfa</BreadcrumbItem>
                            <BreadcrumbItem active>Bize Ulaşın</BreadcrumbItem>
                        </Breadcrumb>
                    </Col>
                </Row>
            </Container>

            <Container fluid>
                <h2 class="section-title position-relative text-uppercase mx-xl-5 mb-4"><span class="pr-3">BİZE ULAŞIN</span></h2>
                <Row className='px-xl-5'>
                    <Col lg="7" className='mb-5'>
                        <div className="contact-form bg-light p-30">
                            <div id="success" />
                            <form name="sentMessage" id="contactForm" noValidate="novalidate">
                                <div className="control-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        placeholder="Adınız"
                                        required="required"
                                        data-validation-required-message="Please enter your name"
                                    />
                                    <p className="help-block text-danger" />
                                </div>
                                <div className="control-group">
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="Emailiniz"
                                        required="required"
                                        data-validation-required-message="Please enter your email"
                                    />
                                    <p className="help-block text-danger" />
                                </div>
                                <div className="control-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="subject"
                                        placeholder="Konu"
                                        required="required"
                                        data-validation-required-message="Please enter a subject"
                                    />
                                    <p className="help-block text-danger" />
                                </div>
                                <div className="control-group">
                                    <textarea
                                        className="form-control"
                                        rows={8}
                                        id="message"
                                        placeholder="Mesaj"
                                        required="required"
                                        data-validation-required-message="Please enter your message"
                                        defaultValue={""}
                                    />
                                    <p className="help-block text-danger" />
                                </div>
                                <div>
                                    <button
                                        className="btn btn-primary py-2 px-4"
                                        type="submit"
                                        id="sendMessageButton"
                                    >
                                        Mesaj Gönder
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Col>

                    <Col lg="5" className='mb-5'>
                        <div className="bg-light p-30 mb-30 b-r-1">
                            <iframe
                                style={{ width: "100%", height: 250 }}
                                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2183.3551786513026!2d28.973396995470214!3d41.010933979101566!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x71bb30a7c5aaac9d!2zxLBoc2FuIMOHZXlpeiBCaW5kYWxsxLE!5e0!3m2!1str!2str!4v1658001193641!5m2!1str!2str"
                                frameBorder={0}
                                allowFullScreen=""
                                aria-hidden="false"
                                tabIndex={0}
                                className="b-r-1"
                            />
                        </div>
                        <div className="bg-light mb-3 p-30 b-r-1">
                            <p className="mb-2">
                                <i className="fa fa-map-marker-alt text-primary mr-3" />
                                Kürkçü Han, İstanbul / Fatih
                            </p>
                            <p className="mb-2">
                                <i className="fa fa-envelope text-primary mr-3" />
                                info@example.com
                            </p>
                            <p className="mb-2">
                                <i className="fa fa-phone-alt text-primary mr-3" />
                                +90 0123 456 78 89
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

// <Iframe
//                             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.5669213967913!2d28.967891215856525!3d41.012851327091546!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab92ec520681f%3A0x71bb30a7c5aaac9d!2zxLBoc2FuIMOHZXlpeiBCaW5kYWxsxLE!5e0!3m2!1str!2str!4v1654635231721!5m2!1str!2str"
//                             width="400" height="300" style="border:0;" allowFullScreen="" loading="lazy"
//                             referrerPolicy="no-referrer-when-downgrade"></Iframe>
