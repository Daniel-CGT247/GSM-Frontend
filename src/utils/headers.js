const headers = {
  Authorization: `JWT ${localStorage.getItem("access_token")}`,
};

export default headers;
