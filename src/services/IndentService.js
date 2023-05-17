import axiosInstance from '../components/apiService';

const getAll = () => {
  return axiosInstance.get("porudzbine");
};

const get = (id) => {
  return axiosInstance.get(`porudzbine/${id}`);
};

const create = (indent, clientLegalName) => {
  return axiosInstance.post("porudzbine", indent, {
    params: {
      clientLegalName: clientLegalName,
    },
  })
  .then(response => {
    return response.data;
  })
  .catch(error => {
    throw new Error("Client with that legal name not found");
  });
};

const update = (id, data) => {
  return axiosInstance.put(`porudzbine/${id}`, data);
};

const remove = (id) => {
  return axiosInstance.delete(`porudzbine/${id}`);
};

const activateIndent = (indentCode) => {
  return axiosInstance.put("porudzbine/aktiviraj", indentCode);
};

const confirmIndentDelivery = (indentCode) => {
  return axiosInstance.put("porudzbine/potvrdiIsporuku", indentCode);
};

const removeAll = () => {
  return axiosInstance.delete("porudzbine");
};

const findByCode = (code) => {
  return axiosInstance.get("porudzbine/pretragaPrekoSifrePorudzbine", {
    params: {
      indentCode: code,
    },
  });
};

const IndentService = {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  activateIndent,
  findByCode,
  confirmIndentDelivery
};

export default IndentService;
