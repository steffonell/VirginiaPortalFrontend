import axiosInstance from '../components/apiService';

const getAll = () => {
  return axiosInstance.get("adrese");
};

const get = (id) => {
  return axiosInstance.get(`adrese/${id}`);
};

const create = (data, customerName) => {
  return axiosInstance.post("adrese", data, {
    params: {
      customerName: customerName,
    },
  }).then(response => {
    return response.data;
  }).catch(error => {
    throw new Error(error);
  });
};

const update = (id, data) => {
  return axiosInstance.put(`adrese/${id}`, data);
};

const remove = (id) => {
  return axiosInstance.delete(`adrese/${id}`);
};

const removeAll = () => {
  return axiosInstance.delete("adrese");
};

const DeliveryAddressService = {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
};

export default DeliveryAddressService;
