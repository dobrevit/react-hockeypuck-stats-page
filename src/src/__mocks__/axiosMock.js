const axios = jest.requireActual('axios');

axios.get = jest.fn();
axios.create = jest.fn(() => axios);

export default axios;