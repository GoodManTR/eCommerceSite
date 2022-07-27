import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../styles/main.css'
import { Container, Nav, Navbar, NavDropdown, Form, Button, Row, Col, Carousel, FormGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()



    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setError('')
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)

            navigate("/")
        } catch {
            setError('Failed to log in')
        }

        setLoading(false)
    }



    return (
        <>
            <Container style={{marginBottom: "10vh", marginTop: "8vh"}}>
                <Row>
                    <Col md="5" className='mx-auto'>
                        <div id="first" >
                            <div className="myform form">
                                <div className="logo mb-3">
                                    <Col md="12" className="text-center mt-1">
                                        <h1>Giriş Yap</h1>
                                    </Col>
                                </div>
                                {error && <div className='formError'>{error} </div>}
                                <form onSubmit={handleSubmit}>
                                    
                                        <FormGroup>
                                        <label className='mb-2' htmlFor="exampleInputEmail1">Email</label>
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
                                        <label className='mb-2' htmlFor="exampleInputEmail1">Şifre</label>
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
                                        <p className="text-center">
                                            Giriş yaparak <a href="#">Kullanım Şartlarını</a> kabul edersiniz.
                                        </p>
                                    </FormGroup>
                                    <Col md="12" className="text-center ">
                                        <button
                                            type="submit"
                                            className="btn mybtn btn-primary "
                                            style={{width: "95%"}}
                                        >
                                            Giriş Yap
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
                                            Hesabın Mı Yok?{" "}
                                            <a href="/signup" id="signup">
                                                Buradan Kayıt Ol
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


{/* <div className="main_container">
                <div className='form_Container'>
                    {error && <div className='formError'>{error} </div>}
                    <form onSubmit={handleSubmit}>

                        <div className="form__group field">
                            <input type="email" className="form__field" placeholder="Email" name="email" id='email' ref={emailRef} required />
                            <label htmlFor="email" className="form__label">Email</label>
                        </div>

                        <div className="form__group field">
                            <input type="password" className="form__field" placeholder="Password" name="password" id='password' ref={passwordRef} required />
                            <label htmlFor="password" className="form__label">Şifre</label>
                        </div>

                        <div>
                            <Link to="/forgot-password"><button className="bn632-hover bn22">Şifreni Mi Unuttun?</button></Link>
                            <a href="/"><button className="bn632-hover bn22" disabled={loading} type='Submit'>Giriş Yap</button></a>
                        </div>
                    </form>
                    <br />
                    <div className='bottom_link'>
                        Hesaba mı ihtiyacın var?&nbsp; <a href="/signup">Kayıt Ol</a>
                    </div>
                </div>
            </div> */}