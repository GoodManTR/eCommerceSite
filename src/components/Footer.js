import { Container, Row, Col, Footer as ReactFooter } from "react-bootstrap";
import { useAuth } from '../contexts/AuthContext'

export default function Footer() {
    const { currentUser, logout } = useAuth()

    const handleLogout = async () => {
        console.log("logged out");
        try {
            console.log("asddas");
            await logout()
            window.location.reload();
        } catch {
        }
    }
    

    return (
        <>
            <footer>
                <Container className="bg-dark text-secondary mt-5 pt-5" fluid>
                    <Row className="px-xl-5 pt-5">
                        <Col lg="4" md="12" className="mb-5 pr-3 pr-xl-5">
                            <h5 className="text-secondary text-uppercase mb-4">İLETİŞİME GEÇİN</h5>
                            <p className="mb-4">No dolore ipsum accusam no lorem. Invidunt sed clita kasd clita et et dolor sed dolor. Rebum tempor no vero est magna amet no</p>
                            <p className="mb-2"><i className="fa fa-map-marker-alt text-primary mr-3"></i>123 Street, New York, USA</p>
                            <p className="mb-2"><i className="fa fa-envelope text-primary mr-3"></i>info@example.com</p>
                            <p className="mb-0"><i className="fa fa-phone-alt text-primary mr-3"></i>+012 345 67890</p>
                        </Col>
                        <Col lg="8" md="12">
                            <Row>
                                <Col md="4" className="mb-5">
                                    <h5 className="text-secondary mb-4">HIZLI ALIŞVERİŞ</h5>
                                    <div className="d-flex flex-column justify-content-start">
                                        <a className="text-secondary mb-2" href="/"><i className="fa fa-angle-right mr-2"></i>Ana Sayfa</a>
                                        <a className="text-secondary mb-2" href="/products"><i className="fa fa-angle-right mr-2"></i>Ürünler</a>
                                        <a className="text-secondary" href="/communication"><i className="fa fa-angle-right mr-2"></i>Bize Ulaşın</a>
                                    </div>
                                </Col>
                                <Col md="4" className="mb-5">
                                    <h5 className="text-secondary text-uppercase mb-4">Hesabım</h5>
                                    <div className="d-flex flex-column justify-content-start">
                                        {currentUser && <a className="text-secondary mb-2" href="/shopping-cart"><i className="fa fa-angle-right mr-2"></i>Sepet</a>}
                                        {currentUser && <a className="text-secondary mb-2" href="/orders"><i className="fa fa-angle-right mr-2"></i>Siparişlerim</a>}
                                        {currentUser && <a className="text-secondary mb-2" href="/profile-info"><i className="fa fa-angle-right mr-2"></i>Kullanıcı Bilgilerim</a>}
                                        {currentUser && <a className="text-secondary mb-2" onClick={handleLogout}><i className="fa fa-angle-right mr-2"></i>Çıkış Yap</a>}
                                        {!currentUser && <a className="text-secondary mb-2" href="/signup"><i className="fa fa-angle-right mr-2"></i>Kayıt Ol</a>}
                                        {!currentUser && <a className="text-secondary mb-2" href="/login"><i className="fa fa-angle-right mr-2"></i>Giriş Yap</a>}
                                    </div>
                                </Col>
                                <Col md="4" className="mb-5">
                                    <h5 className="text-secondary text-uppercase mb-4">Bülten</h5>
                                    <p>Yeni ürünler ve haberleri mail olarak alın.</p>
                                    <form action="">
                                        <div className="input-group">
                                            <input type="text" className="form-control" placeholder="Email Adresiniz"></input>
                                            <div className="input-group-append">
                                                <button className="btn btn-primary">Kayıt Ol</button>
                                            </div>
                                        </div>
                                    </form>
                                    <h6 className="text-secondary text-uppercase mt-4 mb-3">BİZİ TAKİP EDİN</h6>
                                    <div className="d-flex">
                                        <a className="btn btn-primary btn-square mr-2" href="#"><i className="fab fa-twitter"></i></a>
                                        <a className="btn btn-primary btn-square mr-2" href="#"><i className="fab fa-facebook-f"></i></a>
                                        <a className="btn btn-primary btn-square mr-2" href="#"><i className="fab fa-linkedin-in"></i></a>
                                        <a className="btn btn-primary btn-square" href="#"><i className="fab fa-instagram"></i></a>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className="border-top mx-xl-5 py-4">
                        <Col md="6" className="px-xl-0">
                            <p className="mb-md-0 text-center text-md-left text-secondary">
                                &copy; <a className="text-primary" href="#">Domain</a>. Tüm Hakları Saklıdır.
                            </p>
                        </Col>
                        <Col md="6" className="px-xl-0 text-center text-md-right">
                            <img className="img-fluid" src={require('../assets/payments.png')} alt=""></img>
                        </Col>
                    </Row>
                </Container>
            </footer>

        </>
    )
}