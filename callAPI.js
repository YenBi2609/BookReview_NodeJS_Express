const axios = require('axios');
const connectToURL = async () => {
    try {
        const response = await axios.get('http://localhost:5000/book');
        console.log(response.data);
    } catch (error) {
        console.error(error.toString());
    }
}
connectToURL();
