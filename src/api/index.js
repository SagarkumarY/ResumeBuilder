import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import { auth, db } from '../config/firebase.config';

export const getUserDetail = () => {
    return new Promise((resolve, reject) => {
        // Listen for authentication state changes
        const authUnsubscribe = auth.onAuthStateChanged((userCred) => {
            if (userCred) {
                const userData = userCred.providerData[0];
                if (!userData || !userData.uid) {
                    reject(new Error("User data is malformed"));
                    return;
                }

                const userDocRef = doc(db, "users", userData.uid);

                const docUnsubscribe = onSnapshot(userDocRef, (_doc) => {
                    if (_doc.exists()) {
                        resolve(_doc.data());
                    } else {
                        // console.log("Document does not exist, creating new document with data:", userData);
                        setDoc(userDocRef, userData)
                            .then(() => {
                                // console.log("Document created successfully with data:", userData);
                                resolve(userData); // Resolve with the created data
                            })
                            .catch((err) => {
                                console.error("Error creating document:", err.message);
                                reject(err);
                            });
                    }
                });

                // Clean up the Firestore onSnapshot listener when auth state changes
                return () => docUnsubscribe();
            } else {
                reject(new Error("User is not authenticated"));
            }

            // Unsubscribe from the auth state listener to avoid memory leaks
            return () => authUnsubscribe();
        });
    });
};

// "{api/index.js}"

export const getTemplates = () => {
    return new Promise((resolve, reject) => {
        const templateQuery = query(
            collection(db,"templates"),
            orderBy("timestamp", "asc")
        );

        const unsubscribe = onSnapshot(templateQuery, (querySnap) => {
            const templates = querySnap.docs.map((doc)=> doc.data());
            resolve(templates);

        });
        return () => unsubscribe();
    });
}

































// {"Second function"}

// import { doc, onSnapshot, setDoc } from "firebase/firestore";
// import { auth, db } from "../config/firebase.config";

// export const getUserDetail = () => {
//     return new Promise((resolve, reject) => {
//         // Listen for authentication state changes
//         const unsubscribeAuth = auth.onAuthStateChanged((userCred) => {
//             if (userCred) {
//                 const userData = userCred.providerData[0];
//                 console.log("User data: ", userData.uid);
//                 const userDocRef = doc(db, "users", userData?.uid);

//                 // Listen for changes to the user's document in Firestore
//                 const unsubscribeSnapshot = onSnapshot(userDocRef, async (_doc) => {
//                     if (_doc.exists()) {
//                         console.log("Document exists:", _doc.data());
//                         resolve(_doc.data());
//                     } else {
//                         try {
//                             console.log("Document does not exist. Creating new document...");
//                             await setDoc(userDocRef, userData);
//                             console.log("Document created with data:", userData);
//                             resolve(userData);
//                         } catch (error) {
//                             console.error("Error creating document:", error);
//                             reject(error);
//                         }
//                     }
                    
//                     // Cleanup Firestore listener
//                     unsubscribeSnapshot();
//                 }, (error) => {
//                     console.error("Error listening to snapshot:", error);
//                     reject(error);
//                     // Cleanup Firestore listener in case of error
//                     unsubscribeSnapshot();
//                 });

//                 // Cleanup auth listener
//                 unsubscribeAuth();
//             } else {
//                 console.error("User is not authenticated");
//                 reject(new Error("User is not authenticated"));
//                 // Cleanup auth listener
//                 unsubscribeAuth();
//             }
//         });
//     });
// };


