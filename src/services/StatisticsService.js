import axiosInstance from '../components/apiService';

const getAll = () => {
  return axiosInstance.get("statistika");
};

const StatisticsService = {
  getAll,
};

export default StatisticsService;
