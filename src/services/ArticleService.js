import axiosInstance from '../components/apiService';

const getAll = () => {
  return axiosInstance.get(`artikli`);
};

const getAllActiveArticles = () => {
  return axiosInstance.get(`artikli/aktivni`);
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
    throw new Error(error);
  });
};

const activateArticle = (id) => {
  return axiosInstance.post("artikli/aktiviraj", id)  // send id directly
    .then(response => {
      return response.data;
    }).catch(error => {
      throw new Error(error);
    });
};

const deactivateArticle = (id) => {
  return axiosInstance.post("artikli/deaktiviraj", id)  // send id directly
  .then(response => {
    return response.data;
  }).catch(error => {
    throw new Error(error);
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
  getAllActiveArticles,
  get,
  create,
  update,
  remove,
  removeAll,
  findByName,
  activateArticle,
  deactivateArticle
};

export default ArticleService;
