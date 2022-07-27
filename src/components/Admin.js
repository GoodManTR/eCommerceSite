import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/main.css'
import React, { useRef, useState, useEffect } from 'react'
import { getStorage, ref as storageRefer, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import $ from "jquery";
import { storage } from '../firebase';
import { setDoc, doc, getDoc } from "firebase/firestore"; 
import { firestoreDb } from "../firebase"

export default function Admin() {
    const { currentUser, updateEmail, updatePassword } = useAuth()
    const navigate = useNavigate()
    const itemNameRef = useRef()
    const itemPriceRef = useRef()
    const itemIdRef = useRef()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [imgUrl, setImgUrl] = useState(null);
    const [progresspercent, setProgresspercent] = useState(0);





    async function uploadToStorage() {
        var file = $("#uploadZip").prop("files")[0];
        if (!file) return;

        const storageRef = storageRefer(storage, `product-images/${itemIdRef.current.value}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        await uploadTask.on("state_changed",
            (snapshot) => {
                const progress =
                    Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgresspercent(progress);
                console.log("storage");
            },
            (error) => {
                setError(error)
            },
             () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    writeNewPost(itemNameRef.current.value, itemPriceRef.current.value, itemIdRef.current.value, downloadURL)
                    setImgUrl(downloadURL)
                    setLoading(false)
                });
            }
        )
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        uploadToStorage()
            
      }

    // function writeNewPost(itemName, itemPrice, itemId, itemPictureUrl) {

    //     const db = getDatabase();
    //     const updates = {}

    //     const postData = {
    //         itemName: itemName,
    //         itemPrice: itemPrice,
    //         itemId: itemId,
    //         itemPictureUrl: itemPictureUrl
    //     };
    //     updates['/products/' + itemId] = postData;
    //     return update(databaseRef(db), updates);
    // }

    async function writeNewPost(itemName, itemPrice, itemId, itemPictureUrl) {   
        try {
            const docRef = await setDoc(doc(firestoreDb, "products", itemId), {
                itemName: itemName,
                itemPrice: itemPrice,
                itemId: itemId,
                itemPictureUrl: itemPictureUrl
              }, { merge: true });
              console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
    
    function generateId() {
        const idGenerator = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()))
        itemIdRef.current.value = idGenerator
    }

    return (
        <>
        <div className='profile_main'>
                <div className='profile-inner-container'>
                    <div className='profile-navigation'>
                        {currentUser.email === "b.kurul@outlook.com" &&
                            <a href="/add-product">
                                <button className="profile-navigation-item selected-one">Ürün Ekle</button>
                            </a>}
                        <a href="/orders">
                            <button className="profile-navigation-item">Siparişler</button>
                        </a>
                        <a href="/profile-info">
                            <button className="profile-navigation-item">Kullanıcı Bilgilerim</button>
                        </a>
                    </div>
                    &nbsp;&nbsp;
                    <div className="profile-vertical-line"></div>
                    <div className='profile-data-div'>
                    <form onSubmit={handleSubmit}>
                            <div className='profile-info-name'>
                                <div className="form__group field" style={{ marginRight: 20, minWidth: 300, marginTop: 50 }}>
                                    <input type="name" className="form__field" placeholder="Ürün Adı" name="name" id='name' ref={itemNameRef} defaultValue="" required />
                                    <label htmlFor="name" className="form__label">Ürün Adı</label>
                                </div>

                                <div className="form__group field" style={{ marginRight: 20, minWidth: 300, marginTop: 50 }}>
                                    <input type="input" className="form__field" placeholder="Fiyatı" name="price" id='price' ref={itemPriceRef} defaultValue="" required />
                                    <label htmlFor="price" className="form__label">Fiyatı</label>
                                </div>
                            </div>

                            <div className='profile-info-name'>
                                <div className="form__group field" style={{ marginRight: 20, minWidth: 300, marginTop: 50 }}>
                                    <input readOnly  type="text" className="form__field" placeholder="Ürün ID" name="emailConfirm" id='emailConfirm' ref={itemIdRef} defaultValue="" required />
                                    <label htmlFor="emailConfirm" className="form__label">Ürün ID</label>
                                </div>


                                <div className="input_container">
                                    <label htmlFor='icon' className='file_input_label'>Ürün Fotoğrafı</label>
                                    <input type="file" id='uploadZip' name='icon' className='file_input' required></input>
                                </div>
                            </div>

                            <div className='form_button_container'>
                                <button className="bn632-hover bn22" onClick={generateId}>Generate ID</button>
                                <a href="/"><button className="bn632-hover bn22" disabled={loading} type='Submit'>Ürün Ekle</button></a>
                            </div>
                            {error && <div className='formError' style={{ marginTop: 20 }}>{error} </div>}
                            {message && <div className='formMessage' style={{ marginTop: 20 }}>{message} </div>}
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}