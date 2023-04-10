import axiosInstance from '../components/apiService';

const getAll = () => {
  return axiosInstance.get(`artikli`);
};

const get = (id) => {
  return axiosInstance.get(`artikli/${id}`);
};

const create = (article, brandName) => {
  return axiosInstance.post("artikli", article, {
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
  return axiosInstance.put(`artikli/${id}`, data);
};

const remove = (id) => {
  return axiosInstance.delete(`artikli/${id}`);
};

const removeAll = () => {
  return axiosInstance.delete(`artikli`);
};

const findByName = (articleName) => {
  return axiosInstance.get(`artikli/findByArticleName?articleName=${articleName}`);
};

const ArticleService = {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  findByName,
};

export default ArticleService;
