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

const createCustomerWithAddressesViaRegistrationPrompt = async (customer, role, customerDeliveryAddresses) => {
  try {
    const requestData = {
      customer,
      userRole: role,
      customerDeliveryAddresses,
    };

    const response = await axiosInstance.post('klijenti/kreirajPrekoRegistracionogUpita', requestData);
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
    return response.data;
  } catch (error) {
    return null;
  }
};

const sendRegistrationPrompt = (nameOfTheLegalEntity, email) => {
  return axiosInstance.post("klijenti/slanjeRegistracionogUpita", { nameOfTheLegalEntity: nameOfTheLegalEntity, email: email })
    .then(response => {
      return response.data;
    }).catch(error => {
      throw new Error("Error while sending registration prompt " + error);
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
  createCustomerWithDiscountAndAddresses,
  sendRegistrationPrompt,
  createCustomerWithAddressesViaRegistrationPrompt
};

export default ClientService;