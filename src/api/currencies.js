import axios from 'axios';

export const fetchCurrencies = async (currency) => {
  return await axios.get(`https://api.exchangerate-api.com/v4/latest/${currency}`);
};
