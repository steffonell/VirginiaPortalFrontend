import axiosInstance from '../components/apiService';

const getAll = () => {
  return axiosInstance.get("brendovi");
};

const get = (id) => {
  return axiosInstance.get(`brendovi/${id}`);
};

const create = (data) => {
  return axiosInstance.post("brendovi", data);
};

const update = (id, data) => {
  const jsonData = JSON.stringify(data);
  return axiosInstance.put(`brendovi/${id}`, jsonData);
};

const remove = (id) => {
  return axiosInstance.delete(`brendovi/${id}`);
};

const removeAll = () => {
  return axiosInstance.delete("brendovi");
};

const findByName = (brandName) => {
  return axiosInstance.get(`brendovi/findByBrandName?brandName=${brandName}`);
};

const BrandService = {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  findByName,
};

export default BrandService;
