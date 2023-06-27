import axiosInstance from '../components/apiService';

const getAll = () => {
  return axiosInstance.get("adrese");
};

const get = (id) => {
  console.log("Getting Delivery Address under ID "+id);
  return axiosInstance.get(`adrese/${id}`);
};

const findClientsDeliveryAddresses = async () => {
  try {
    const response = await axiosInstance.get(`adrese/client`);
    console.log('Service Response:', response.data); // Added for debugging
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const findDeliveryAddressesOfSpecificClient = async (customerId) => {
  try {
    const response = await axiosInstance.get(`adrese/selectedClient/${customerId}`);
    console.log('Service Response:', response.data); // Added for debugging
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
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
  console.log("ID "+id);
  console.log("Data : "+JSON.stringify(data));
  return axiosInstance.put(`adrese/${id}`, data);
};

const remove = (id) => {
  return axiosInstance.delete(`adrese/${id}`);
};

const DeliveryAddressService = {
  getAll,
  get,
  create,
  update,
  remove,
  findClientsDeliveryAddresses,
  findDeliveryAddressesOfSpecificClient,
  };

export default DeliveryAddressService;
