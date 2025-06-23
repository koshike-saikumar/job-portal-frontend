 
const dev = {
    url: {
        Esharm_URL:'https://swapi.dev.nidhi.apcfss.in/eshram/',
        // DMS_URL:"https://swapi.dev.nidhi.apcfss.in/socialwelfaredms/user-defined-path/file-upload/",
             DMS_URL:"https://swapi.dev.nidhi.apcfss.in/eshram/file-upload", 
        DMS_DOWNLOAD_URL:"https://swapi.dev.nidhi.apcfss.in/socialwelfaredms/user-defined-path/file-download/",
        frontend_url: 'eshram.dev.nidhi.apcfss.in',
    }
};
const local = { // 172.16.119.164   172.16.118.40
    url: {
        test:'http://localhost:8080/test/',
    }
};

const hostname = window.location.hostname  
export const config = (() => {
     if (process.env.NODE_ENV === 'main' && hostname === dev.url.frontend_url) {
        return dev;
    }  
   else  {
        return local;
    }
})();
