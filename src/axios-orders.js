import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-burger-app-d02b2-default-rtdb.europe-west1.firebasedatabase.app/'
});

export default instance;