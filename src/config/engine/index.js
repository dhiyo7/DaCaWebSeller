import axios from "axios";
import {objectString, getData, storeData, removeData} from "@utils";

const req = axios.create({
    baseURL: process.env.REACT_APP_URL
})

req.interceptors.request.use(
    async (config) => {
        await getData('token').then((res) => {
            if (res && config.url !== 'v1/account/login') {
                return (config.headers['Authorization'] = 'Bearer ' + res.replace(/\"|\\/g, ''));
            }
        });

        config.headers['Content-Type'] = 'application/json';
        config.headers['Accept'] = 'application/json';

        return config;
    },
    (error) => {
        return error;
    }
);

req.interceptors.response.use(
    (response) => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    },
    (err) => {
        // console.log('--ERROR: ', error.config);
        const error = err.response;
        error.config.__isRetryRequest = false;

        if (error.status === 401 && error.config && !error.config.__isRetryRequest) {
            getData('email').then((res) => {
                if (res) {
                    removeData('account_id').then(() => {
                        removeData('token').then(async () => {
                            await req
                                .post('v1/account/login', {
                                    email: res.replace(/\"|\\/g, ''),
                                })
                                .then((newData) => {
                                    storeData('token', newData.data.data.jwt_token);
                                    storeData('email', newData.data.data.email);
                                    storeData('account_id', newData.data.data.account_id);
                                });
                        });
                    });
                }
            });

            error.config.__isRetryRequest = true;
            return req.request({
                method: error.config.method,
                headers: {
                    Authorization: getData('token').then((newResponse) => {
                        return 'Bearer ' + newResponse.replace(/\"|\\/g, '');
                    }),
                },
                url: error.config.url,
                params: error.config.params,
            });
        }

        return Promise.reject(error);
    }
);

export const requestPost = (url, params) => {
    return new Promise((resolve, reject) => {
        req.post(`${url}`, params)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const requestGet = (url, params) => {
    return new Promise((resolve, reject) => {
        req.get(`${url}${params ? objectString(params) : ''}`)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const requestPut = (url, params, body) => {
    return new Promise((resolve, reject) => {
        req.put(`${url}${params ? objectString(params) : ''}`, body)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const requestDelete = (url, body) => {
    return new Promise((resolve, reject) => {
        req.delete(`${url}`, {
            data: body,
        })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const requestAnyGet = (url, params, headers) => {
    return new Promise((resolve, reject) => {
        req.get(
            `${url}${objectString(params)}`,
            headers && {
                headers: headers,
            }
        )
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const requestPostMultipart = (url, params, headers) => {
    return new Promise((resolve, reject) => {
        req.post(
            `${url}`,
            params,
            headers && {
                headers: headers,
            }
        )
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};
