import axios from 'axios';


const BASE_URL = 'https://pixabay.com/api/';
const key = '38696454-43480fd362a27eec631fe306e';
let page = 1 ;

export const client = axios.create({
  baseURL: BASE_URL,
  params: { key, per_page: 40, page },
});


export const increasePage = () => {
  page += 1;
  client.defaults.params.page = page;
};
