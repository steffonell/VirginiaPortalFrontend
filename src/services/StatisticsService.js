import axiosInstance from '../components/apiService';

const getOrderedQuantityAndRevenueForGivenYearByMonths = async (year) => {
  try {
    const response = await axiosInstance.post('statistika/kvantitetPrihodiPoMesecimaZaDatuGodinu', year);
    const responseData = JSON.stringify(response.data, null, 2);
    console.log("Response data : " + responseData);
    return responseData;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getCompareAllClientsForChosenYear = async (year) => {
  try {
    const response = await axiosInstance.post('statistika/kvantitetPrihodiZaSveKlijenteZaIzabranuGodinu', year);
    const responseData = JSON.stringify(response.data, null, 2);
    console.log("Response data : " + responseData);
    return responseData;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getCompareAllBrandsForChosenYear = async (year) => {
  try {
    const response = await axiosInstance.post('statistika/kvantitetPrihodiZaSveBrendoveZaIzabranuGodinu', year);
    const responseData = JSON.stringify(response.data, null, 2);
    console.log("Response data : " + responseData);
    return responseData;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/* const getCompareAllArticlesForChosenYear = (year, article) => {
  return axiosInstance.post("statistika/kvantitetPoMesecimaZaArtikal");
};
 */

const getOrderedQuantityAndRevenueForChosenYearAndClientByMonths = async (year, customer) => {
  try {
    const requestData = {
      year: year,
      customer: customer,
    };
    const response = await axiosInstance.post('statistika/kvantitetPrihodiPoMesecimaZaDatuGodinuiKlijenta', requestData);
    const responseData = JSON.stringify(response.data, null, 2);
    console.log("Response data : " + responseData);
    return responseData;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getOrderedQuantityAndRevenueForChosenYearAndBrandByMonths = async (year, brand) => {
  try {
    const requestData = {
      year: year,
      brand: brand,
    };
    console.log("REQUEST DATA : "+requestData);
    const response = await axiosInstance.post('statistika/kvantitetIPrihodiPoMesecimaZaBrend', requestData);
    const responseData = JSON.stringify(response.data, null, 2);
    console.log("Response data : " + responseData);
    return responseData;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getOrderedQuantityAndRevenueForClientTotal = async (customer) => {
  try {
    const response = await axiosInstance.post('statistika/kvantitetPrihodiZaKlijenta', customer);
    const responseData = JSON.stringify(response.data, null, 2);
    console.log("Response data : " + responseData);
    return responseData;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getOrderedQuantityForSelectedArticleTotal = async (article) => {
  try {
    const response = await axiosInstance.post('statistika/kvantitetZaArtikal', article);
    const responseData = JSON.stringify(response.data, null, 2);
    console.log("Response data : " + responseData);
    return responseData;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getOrderedQuantityForSelectedArticleAndYear = async (year, article) => {
  try {
    const requestData = {
      year: year,
      article: article,
    };
    const response = await axiosInstance.post('statistika/kvantitetPoMesecimaZaArtikal', requestData);
    const responseData = JSON.stringify(response.data, null, 2);
    console.log("Response data : " + responseData);
    return responseData;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getCompareAllArticlesForChosenYear = (year, article) => {
  return axiosInstance.post("statistika/kvantitetZaArtikal");
};


const getComparedYears = () => {
  return axiosInstance.post("statistika/uporediGodine");
};

const getYears = () => {
  return axiosInstance.get("statistika/godineStatistike");
};

const StatisticsService = {
  getOrderedQuantityAndRevenueForGivenYearByMonths,
  getYears,
  getCompareAllClientsForChosenYear,
  getComparedYears,
  getCompareAllArticlesForChosenYear,
  getOrderedQuantityAndRevenueForChosenYearAndClientByMonths,
  getOrderedQuantityAndRevenueForClientTotal,
  getOrderedQuantityForSelectedArticleTotal,
  getOrderedQuantityForSelectedArticleAndYear,
  getCompareAllBrandsForChosenYear,
  getOrderedQuantityAndRevenueForChosenYearAndBrandByMonths,
};

export default StatisticsService;
