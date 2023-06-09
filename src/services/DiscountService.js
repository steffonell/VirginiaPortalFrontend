import axiosInstance from '../components/apiService';

const getAll = () => {
  return axiosInstance.get("rabat");
};

const get = (id) => {
  return axiosInstance.get(`rabat/${id}`);
};

const create = (data) => {
  return axiosInstance.post("rabat", data);
};

const createCustomerDiscount = async (customerId, brandName, discount) => {
  console.log("customerId:" + customerId);
  console.log("brandName:" + brandName);
  console.log("discount:" + discount);
  try {
    const response = await axiosInstance.post('rabat', {
      customerId: Number(customerId),
      brandName,
      discount: Number(discount),
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const updateCustomerDiscount = async (customerId, brandName, discount) => {
  console.log("customerId:" + customerId);
  console.log("brandName:" + brandName);
  console.log("discount:" + discount);
  try {
    const response = await axiosInstance.put('rabat', {
      customerId: Number(customerId),
      brandName,
      discount: Number(discount),
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const deleteCustomerDiscount = async (customerId, brandName) => {
  console.log("customerId:" + customerId);
  console.log("brandName:" + brandName);
  try {
    const response = await axiosInstance.delete('rabat', {
      data: {
        customerId: Number(customerId),
        brandName,
        discount: Number(0),
      },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const findClientsDiscounts = async () => {
  try {
    const response = await axiosInstance.get(`rabat/client`);
    console.log('Service Response:', response.data); // Added for debugging
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const findDiscountsOfSpecificClient = async (customerId) => {
  try {
    const response = await axiosInstance.get(`rabat/selectedClient/${customerId}`);
    console.log('Service Response:', response.data); // Added for debugging
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};


const update = (id, data) => {
  return axiosInstance.put(`rabat/${id}`, data);
};

const remove = (id) => {
  return axiosInstance.delete(`rabat/${id}`);
};

const removeAll = () => {
  return axiosInstance.delete("rabat");
};

const BrandService = {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  createCustomerDiscount,
  findClientsDiscounts,
  findDiscountsOfSpecificClient,
  updateCustomerDiscount,
  deleteCustomerDiscount,
};

export default BrandService;
