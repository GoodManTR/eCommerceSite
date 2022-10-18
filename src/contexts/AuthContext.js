import React, { useContext, useEffect, useState } from 'react'
import { auth } from "../firebase"



const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider( {children} ) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)


    async function signup(email, password) {
        return await auth.createUserWithEmailAndPassword(email, password).then(() => {
            //If a user is successfully created with an appropriate email
            if (auth.currentUser != null) {
                auth.currentUser.sendEmailVerification();
            }
        }).catch((error) => console.log(error));     
    }

    function verifyEmail() {
        return auth.currentUser.sendEmailVerification()
    }

    function login (email, password) {
        return auth.signInWithEmailAndPassword(email, password)
    }

    function logout() {
        return auth.signOut()
    }
    
    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email)
    }

    function updateEmail(email) {
        return currentUser.updateEmail(email)
    }

    function updatePassword(password) {
        return currentUser.updatePassword(password)
    }

    
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {            
            setCurrentUser(user)
            setLoading(false)
        })

        return unsubscribe
    }, [])
    

    const value = {
        currentUser,
        login,
        signup,
        logout,
        resetPassword,
        updateEmail,
        updatePassword
    }

  return (
    <AuthContext.Provider value={value}>
        {!loading && children}
    </AuthContext.Provider>
  )
}
