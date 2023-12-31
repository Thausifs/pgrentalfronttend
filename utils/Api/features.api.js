import axios from "axios";
import config from "../config";

const getAllAminites = async () => {
  const response = await axios.get(`${config.url}/api/listing/feature`);
  return response.data;
};
const addNewFeatures = async (body, token) => {
  const response = await axios.post(`${config.url}/api/listing/feature`, body, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
const deleteFeatureById = async (id, token) => {
  const response = await axios.delete(
    `${config.url}/api/listing/feature/${id}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const featureApi = {
  getAllAminites,
  addNewFeatures,
  deleteFeatureById,
};
export default featureApi;
