import axiosInstance from '../components/apiService';

//proces environment variable https://create-react-app.dev/docs/adding-custom-environment-variables/
const getAll = () => {
  return axiosInstance.get(`klijenti`);
};

const get = (id) => {
  return axiosInstance.get(`klijenti/${id}`);
};

const create = (client, brandName) => {
  return axiosInstance.post("klijenti", client, {
    params: {
      brandName: brandName
    }
  }).then(response => {
    return response.data;
  }).catch(error => {
    throw new Error("Brand not found");
  });
};

const update = (id, data) => {
  return axiosInstance.put(`klijenti/${id}`, data);
};

const remove = (id) => {
  return axiosInstance.delete(`klijenti/${id}`);
};

const removeAll = () => {
  return axiosInstance.delete(`klijenti`);
};

const findByName = (clientName) => {
  return axiosInstance.get(`klijenti/findByClientName?clientName=${clientName}`);
};

const ClientService = {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  findByName,
};

export default ClientService;