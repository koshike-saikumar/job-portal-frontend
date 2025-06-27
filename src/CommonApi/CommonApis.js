 
const main = {
    url: {
        test:'https://shopease-4-put9.onrender.com/test/',
    }
};
const local = { // 172.16.119.164   172.16.118.40
    url: {
        test:'http://localhost:8080/test/',
    }
};

const hostname = window.location.hostname  
export const config = (() => {
    console.log('location-1:  ',hostname)
        console.log('location-2:  ',process.env.NODE_ENV)

     if ( hostname === 'localhost') {
        return local;
    }  
   else  {
        return main;
    }
})();
