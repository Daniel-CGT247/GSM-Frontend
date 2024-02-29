// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import endpoint from "../utils/endpoint";
// import headers from "../utils/headers";

// export default function useAuth() {
//   const [user, setUser] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkAuth = async () => {
//       if (
//         localStorage.getItem("access_token") === null &&
//         window.location.pathname !== "/login" &&
//         window.location.pathname !== "/register"
//       ) {
//         navigate("/login");
//       }
//       if (
//         localStorage.getItem("access_token") !== null &&
//         window.location.pathname !== "/login" &&
//         window.location.pathname !== "/register"
//       ) {
//         await getUserData();
//       }
//     };

//     checkAuth();
//   }, [navigate]);

//   const getUserData = async () => {
//     try {
//       const res = await axios.get(`${endpoint}/auth/users/me/`, {
//         headers,
//       });
//       setUser(res.data);
//     } catch (error) {
//       // Handle error or redirect to login if necessary
//       console.error("Error fetching user data:", error);
//       navigate("/login");
//     }
//   };

//   return user;
// }
