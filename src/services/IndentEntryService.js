import axiosInstance from '../components/apiService';

const getAll = () => {
  return axiosInstance.get("unosi");
};

const get = (id) => {
  return axiosInstance.get(`unosi/${id}`);
};

const createIndentEntries = async (items, comment) => {
  const requestData = {
    indentEntryRequests: items,
    comment,
  };
  try {
    const response = await axiosInstance.post('unosi', requestData);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const update = (id, data) => {
  return axiosInstance.put(`unosi/${id}`, data);
};

const findIndentEntries = (indentCode) => {
  return axiosInstance.get('unosi/porudzbine', {
    params: {
      indentCode: indentCode,
    },
  });
};

const remove = (id) => {
  return axiosInstance.delete(`unosi/${id}`);
};

const removeAll = () => {
  return axiosInstance.delete("unosi");
};

const findByName = (indentEntryName) => {
  return axiosInstance.get(`unosi/findByIndentEntryName`, {
    params: {
      indentEntryName: indentEntryName,
    },
  });
};

const IndentEntryService = {
  getAll,
  get,
  createIndentEntries,
  update,
  remove,
  removeAll,
  findByName,
  findIndentEntries,
};

export default IndentEntryService;
