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

const createCustomerWithDiscountAndAddresses = async (customer, role, brandDiscountArray, customerDeliveryAddresses) => {
  // Convert array to object
  let brandDiscounts = {};
  
  if (typeof brandDiscountArray === 'object' && brandDiscountArray !== null) {
      for (const [brand, discount] of Object.entries(brandDiscountArray)) {
          brandDiscounts[brand] = parseFloat(discount);
      }
  }

  try {
      const requestData = {
          customer,
          userRole: role,
          customerDeliveryAddresses,
      };
      
      // Only include brandDiscounts in the request data if it's not empty
      if (Object.keys(brandDiscounts).length > 0) {
          requestData.brandByDiscountMap = brandDiscounts;
      }

      const response = await axiosInstance.post('klijenti/kreiraj', requestData);
      console.log(response);
      return response.data;
  } catch (error) {
      console.error(error);
      return null;
  }
};

const addDeliveryAddressForClient = async ( deliveryAddress,customerId) => {
  console.log("1 Arghument : "+deliveryAddress);
  console.log("2 Arghument : "+customerId);
  try {
    const requestData = {
      deliveryAddressDTO: deliveryAddress,
      customerId,
    };
    const response = await axiosInstance.post('adrese', requestData);
    console.log(response);
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
  addDeliveryAddressForClient,
  };

export default DeliveryAddressService;
