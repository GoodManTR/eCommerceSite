import React, { useRef, useState } from 'react'
import { Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getDatabase, ref, child, get, set } from "firebase/database";
import { auth } from '../firebase';
import '../styles/main.css'
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { firestoreDb, realtimeDb } from '../firebase';
import { Container, Nav, Navbar, NavDropdown, Form, Button, Row, Col, Carousel, FormGroup } from 'react-bootstrap';

export default function Signup() {
    const nameRef = useRef()
    const lastNameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { signup } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const db = firestoreDb;

    // FIRESTORE
    async function writeUserData(userId, name, lastname, email) {
        Date.prototype.yyyymmdd = function () {
            var mm = this.getMonth() + 1; // getMonth() is zero-based
            var dd = this.getDate();

            return [(dd > 9 ? '' : '0') + dd,
            (mm > 9 ? '' : '0') + mm,
            this.getFullYear(),
            ].join('');
        };

        var date = new Date();

        try {
            const docRef = await setDoc(doc(db, "users", userId), {
                email: email,
                lastname: lastname,
                username: name,
                userId: userId,
                signUpDate: date.yyyymmdd()
            });
            set(ref(realtimeDb, 'users/' + userId), {
                email: email,
                lastname: lastname,
                username: name,
                userId: userId,
                signUpDate: date.yyyymmdd()
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Password do not match!')
        }

        try {
            setError('')
            setLoading(true)
            await signup(emailRef.current.value, passwordRef.current.value)
            writeUserData(auth.currentUser.uid, nameRef.current.value, lastNameRef.current.value, emailRef.current.value)
            navigate("/")
        } catch {
            setError('Failed to create an account')
        }

        setLoading(false)
    }



    return (
        <>
            <Container style={{ marginBottom: "10vh", marginTop: "8vh" }}>
                <Row>
                    <Col md="5" className='mx-auto'>
                        <div id="first" >
                            <div className="myform form">
                                <div className="logo mb-3">
                                    <Col md="12" className="text-center mt-1">
                                        <h1>Kayıt Ol</h1>
                                    </Col>
                                </div>
                                {error && <div className='formError'>{error} </div>}
                                <form onSubmit={handleSubmit}>
                                    <>
                                        <FormGroup>
                                            <label className='mb-2' htmlFor="firstname">Ad</label>
                                            <input
                                                type="text"
                                                name="firstname"
                                                className="form-control mb-3"
                                                id="firstname"
                                                aria-describedby="emailHelp"
                                                placeholder="Adınızı Giriniz"
                                                ref={nameRef}
                                                required
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <label className='mb-2' htmlFor="lastname">Soyad</label>
                                            <input
                                                type="text"
                                                name="lastname"
                                                className="form-control mb-3"
                                                id="lastname"
                                                aria-describedby="emailHelp"
                                                placeholder="Soyadınızı Giriniz"
                                                ref={lastNameRef}
                                                required
                                            />
                                        </FormGroup>
                                    </>
                                    <FormGroup>
                                        <label className='mb-2' htmlFor="email">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control mb-3"
                                            id="email"
                                            placeholder="Emailinizi Giriniz"
                                            ref={emailRef}
                                            required
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <label className='mb-2' htmlFor="password">Şifre</label>
                                        <input
                                            type="password"
                                            name="password"
                                            id="password"
                                            className="form-control mb-3"
                                            placeholder="Şifrenizi Giriniz"
                                            ref={passwordRef}
                                            required
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <label className='mb-2' htmlFor="passwordConfirm">Şifreyi Onayla</label>
                                        <input
                                            type="password"
                                            name="passwordConfirm"
                                            id="passwordConfirm"
                                            className="form-control mb-3"
                                            placeholder="Şifrenizi Giriniz"
                                            ref={passwordConfirmRef}
                                            required
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <p className="text-center">
                                            Kayıt olarak <a href="#">Kullanım Şartlarını</a> kabul edersiniz.
                                        </p>
                                    </FormGroup>
                                    <Col md="12" className="text-center ">
                                        <button
                                            type="submit"
                                            className="btn mybtn btn-primary "
                                            style={{ width: "95%" }}
                                        >
                                            Kayıt Ol
                                        </button>
                                    </Col>
                                    <Col md="12">
                                        <div className="login-or">
                                            <hr className="hr-or" />
                                            <span className="span-or">veya</span>
                                        </div>
                                    </Col>
                                    <div className="form-group">
                                        <p className="text-center">
                                            Zaten hesabın var mı?{" "}
                                            <a href="/login" id="signup">
                                                Buradan Giriş Yap
                                            </a>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>

                    </Col>
                </Row>
            </Container>
        </>
    )
}