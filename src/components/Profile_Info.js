import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/main.css'
import React, { useRef, useState, useEffect } from 'react'
import { setDoc, doc, getDoc } from "firebase/firestore"; 
import { auth, firestoreDb } from "../firebase"


export default function Profile_Info() {

    const { currentUser, logout, updateEmail, updatePassword } = useAuth()
    const navigate = useNavigate()
    const nameRef = useRef()
    const lastNameRef = useRef()
    const emailRef = useRef()
    const emailConfirmRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')


    // function updateUserData(userId, name, lastname, email) {
    //     const db = getDatabase();
    //     set(ref(db, 'users/' + userId), {
    //         username: name,
    //         userlastname: lastname,
    //         email: email,
    //     });
    // }

    async function updateUserData(userId, name, lastname, email) {   
        try {
            const docRef = await setDoc(doc(firestoreDb, "users", userId), {
                email: email,
                lastname: lastname,
                username: name    
              }, { merge: true });
              console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }


    function handleSubmit(e) {
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Password do not match!')
        }

        if (nameRef == "" || lastNameRef == "") {
            return setError('Name or Lastname cannot be empty!')
        }

        if (emailRef.current.value !== emailConfirmRef.current.value && emailConfirmRef.current.value !== "") {
            return setError('Emails do not match!')
        }

        const promises = []
        setLoading(true)
        setError('')
        if (emailRef.current.value !== currentUser.email) {
            promises.push(updateEmail(emailRef.current.value))
        }

        if (passwordRef.current.value) {
            promises.push(updatePassword(passwordRef.current.value))
        }

        updateUserData(auth.currentUser.uid, nameRef.current.value, lastNameRef.current.value, emailRef.current.value)

        Promise.all(promises).then(() => {
            setMessage("Değişikler Başarıyla Kaydedildi.")
            setTimeout(function () {
                setMessage("")
            }, 3000);
        }).catch((e) => {
            if (e == "FirebaseError: Firebase: This operation is sensitive and requires recent authentication. Log in again before retrying this request. (auth/requires-recent-login).") 
                setError('Bu işlemi gerçekleştirebilmek için tekrar oturum açın.');
            else
                setError('Maalesef bir hatayla karşılaştık.')
                
        }).finally(() => {
            setLoading(false)     
        })
    }

    useEffect(() => {
        const getName = async () => {
            const docRef = doc(firestoreDb, "users", auth.currentUser.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                nameRef.current.value = docSnap.data().username
                lastNameRef.current.value = docSnap.data().lastname
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }
        getName()
    }, []);

    return (
        <>
            <div className='profile_main'>
                <div className='profile-inner-container'>
                    <div className='profile-navigation'>
                    {currentUser.email === "b.kurul@outlook.com" &&
                            <a href="/add-product">
                                <button className="profile-navigation-item">Ürün Ekle</button>
                            </a>}
                        <a href="/orders">
                            <button className="profile-navigation-item">Siparişler</button>
                        </a>
                        <a href="/profile-info">
                            <button className="profile-navigation-item  selected-one">Kullanıcı Bilgilerim</button>
                        </a>
                    </div>
                    &nbsp;&nbsp;
                    <div className="profile-vertical-line"></div>

                    <div className='profile-data-div'>
                        
                        <form onSubmit={handleSubmit}>
                            <div className='profile-info-name'>
                                <div className="form__group field" style={{ marginRight: 20, minWidth: 300, marginTop: 50 }}>
                                    <input type="name" className="form__field" placeholder="Ad" name="name" id='name' ref={nameRef} defaultValue="" required />
                                    <label htmlFor="name" className="form__label">Ad</label>
                                </div>

                                <div className="form__group field" style={{ marginRight: 20, minWidth: 300, marginTop: 50 }}>
                                    <input type="input" className="form__field" placeholder="Soyad" name="lastname" id='lastname' ref={lastNameRef} defaultValue="" required />
                                    <label htmlFor="lastname" className="form__label">Soyad</label>
                                </div>
                            </div>

                            <div className='profile-info-name'>
                                <div className="form__group field" style={{ marginRight: 20, minWidth: 300, marginTop: 50 }}>
                                    <input type="email" className="form__field" placeholder="Email" name="email" id='email' ref={emailRef} defaultValue={currentUser.email} required />
                                    <label htmlFor="email" className="form__label">Email</label>
                                </div>

                                <div className="form__group field" style={{ marginRight: 20, minWidth: 300, marginTop: 50 }}>
                                    <input type="email" className="form__field" placeholder="Email'i Onayla" name="emailConfirm" id='emailConfirm' ref={emailConfirmRef} />
                                    <label htmlFor="emailConfirm" className="form__label">Email'i Onayla</label>
                                </div>
                            </div>

                            <div className='profile-info-name'>
                                <div className="form__group field" style={{ marginRight: 20, minWidth: 300, marginTop: 50 }}>
                                    <input type="password" className="form__field" placeholder="Password" name="password" id='password' ref={passwordRef} />
                                    <label htmlFor="password" className="form__label">Şifre</label>
                                </div>

                                <div className="form__group field" style={{ marginRight: 20, minWidth: 300, marginTop: 50 }}>
                                    <input type="password" className="form__field" placeholder="Confirm Password" name="passwordconfirm" id='passwordconfirm' ref={passwordConfirmRef} />
                                    <label htmlFor="passwordconfirm" className="form__label">Şifreyi Onayla</label>
                                </div>
                            </div>

                            <div>
                            <Link to="/"><button className="bn632-hover bn22">Cancel</button></Link>
                            <a href="/"><button className="bn632-hover bn22" disabled={loading} type='Submit'>Apply Changes</button></a>
                            </div>
                            {error && <div className='formError' style={{ marginTop: 20}}>{error} </div>}
                            {message && <div className='formMessage' style={{ marginTop: 20}}>{message} </div>}
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}