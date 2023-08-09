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

const createCustomerWithDiscountAndAddresses = async (customer, role, brandDiscountArray, customerDeliveryAddresses) => {
    // Convert array to object
    console.log("customer:" + JSON.stringify(customer));
    console.log("brandDiscountArray:" + JSON.stringify(brandDiscountArray));
    console.log("customerDeliveryAddresses:" + JSON.stringify(customerDeliveryAddresses));

    let brandDiscounts = {};

    if (typeof brandDiscountArray === 'object' && brandDiscountArray !== null) {
        for (const [brand, discount] of Object.entries(brandDiscountArray)) {
            brandDiscounts[brand] = parseFloat(discount);
        }
    }

    console.log("brandDiscounts:" + JSON.stringify(brandDiscounts));

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