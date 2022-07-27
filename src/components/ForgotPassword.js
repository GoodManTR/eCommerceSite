import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../styles/main.css'

export default function ForgotPassword() {
    const emailRef = useRef()
    const { resetPassword } = useAuth()
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)




    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setMessage('')
            setError('')
            setLoading(true)
            await resetPassword(emailRef.current.value)
            setMessage('Sıfırlama epostası başarıyla gönderildi.')
        } catch {
            setError('Malesef Bir Hata İle Karşılaştık')
        }

        setLoading(false)     
    }



    return (
        <>
            <div className="main_container">
                <div className='form_Container'>
                    {error && <div className='formError'>{error} </div>}
                    {message && <div className='formMessage'>{message} </div>}
                    <form onSubmit={handleSubmit}>

                        <div className="form__group field">
                            <input type="email" className="form__field" placeholder="Email" name="email" id='email' ref={emailRef} required />
                            <label htmlFor="email" className="form__label">Email</label>
                        </div>

                        <div>
                            <Link to="/login"><button className="bn632-hover bn22" type='button'>Giriş Yap</button></Link>
                            <a href="/"><button className="bn632-hover bn22" disabled={loading} type='Submit'>Şifreyi Sıfırla</button></a>
                        </div>
                    </form>
                    <br />
                    <div className='bottom_link'>
                        Hesaba mı ihtiyacın var?&nbsp; <a href="/signup">Kayıt Ol</a>
                    </div>
                </div>
            </div>
        </>
    )
}


