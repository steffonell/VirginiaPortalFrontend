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

const createCustomerWithDiscountAndAddresses = async (customer, brandDiscountArray, customerDeliveryAddresses) => {
  // Convert array to object
  console.log("customer:" + JSON.stringify(customer));
  console.log("brandDiscountArray:" + JSON.stringify(brandDiscountArray));
  console.log("customerDeliveryAddresses:" + JSON.stringify(customerDeliveryAddresses));

/*   let brandDiscounts = brandDiscountArray.reduce((map, item) => {
    map[item.selectedBrand] = parseFloat(item.brandDiscount);
    return map;
  }, {}); */

  console.log("brandDiscounts:" + JSON.stringify(brandDiscountArray));

  try {
    const response = await axiosInstance.post('klijenti/kreiraj', {
      customer,
      brandByDiscountMap: brandDiscountArray,
      customerDeliveryAddresses,
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
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

const findByEmail = (email) => {
  return axiosInstance.get(`klijenti/findByEmail?email=${email}`);
};

const ClientService = {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  findByName,
  findByEmail,
  createCustomerWithDiscountAndAddresses
};

export default ClientService;