const axios = require('axios');
const connectToURL =  () => {
    axios.get('http://localhost:5000/book').then((response) => {
        console.log(response.data);
    }).catch((error)=> {
        console.error(error.toString());

    })
}
connectToURL();