// import axios from "axios";
// import { useEffect, useState } from "react";
// import headers from "../utils/headers";

// export default function useGet(endpoint, params, deps) {
//   const [data, setData] = useState([]);
//   const [isLoading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     setLoading(true);
//     getData();
//   }, [deps]);

//   let getData = async () => {
//     try {
//       let res = await axios.get(`${endpoint}`, {
//         params: params,
//         headers: headers,
//       });
//       setData(res.data);
//       setLoading(false);
//     } catch (error) {
//       setError(error.message);
//       setLoading(false);
//     }
//   };

//   return { isLoading, data, error, setData };
// }
