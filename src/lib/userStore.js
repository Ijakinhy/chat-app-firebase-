// import { doc, getDoc } from "firebase/firestore";
// import { create } from "zustand";
// import { db } from "./firebase";
// import { useState } from "react";

// // export const useUserStore = create((set) => ({
// //   currentUser: null,
// //   isLoading: true,
// //   fetchUserInfo: async (uid) => {
// //     if (!uid) return set({ currentUser: null, isLoading: false });

// //     try {
// //       const docRef = doc(db, "users ", uid);
// //       const docSnap = await getDoc(docRef);
// //       return set({ currentUser: docSnap.data(), isLoading: false });
// //       if (docSnap) {
// //         console.log("Document data:", docSnap.data());
// //         set({ currentUser: docSnap.data(), isLoading: false });
// //       } else {
// //         set({ currentUser: null, isLoading: false });
// //       }
// //     } catch (error) {
// //       console.log(error.message);
// //       return set({ currentUser: null, isLoading: false });
// //     }
// //   },
// // }));

// export const useUserStore = () => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const fetchUserInfo = async (uid) => {
//     try {
//       if (!uid) {
//         setCurrentUser(null);
//         setIsLoading(false);
//         return;
//       }
//       const docRef = doc(db, "users", uid);
//       const docSnap = await getDoc(docRef);

//       if (docSnap.exists()) {
//         setCurrentUser(docSnap.data());
//         setIsLoading(false);
//         console.log("Document data:", docSnap.data());
//       }
//     } catch (error) {
//       console.log(error.message);

//       setCurrentUser(null);
//       setIsLoading(false);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return { currentUser, setCurrentUser, isLoading, fetchUserInfo };
// };
