import axios from 'axios'
import {Message} from 'element-ui';
import router from '../router'


// 请求超时时间
axios.defaults.timeout = 10000;
// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';

axios.interceptors.response.use(success => {
  console.log(success)
  // 后端有全局异常捕获，后端异常前端接到仍是200，错误信息错误码在data中
  if (success.status && success.status == 200 && success.data.code == 500) {
    Message.error({message: success.data.desc})
  }
  return success.data;
}, error => {
  console.log(error)
  if (error.response.status == 504 || error.response.status == 404) {
    Message.error({message: '服务器被吃了( ╯□╰ )'})
  } else if (error.response.status == 403) {
    Message.error({message: '权限不足，请联系管理员'})
  } else if (error.response.status == 401) {
    Message.error({message: '尚未登录，请登录'})
    router.replace('/');
  } else {
    if (error.response.data.desc) {
      Message.error({message: error.response.data.desc})
    } else {
      Message.error({message: '未知错误!'})
    }
  }
  return error.data;
})

let base = '';

export const jsonPost = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
  });
}

export const getRequest = (url, params) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      params: params,
      url: `${base}${url}`
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

export const uploadFileRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
export const putRequest = (url, params) => {
  return axios({
    method: 'put',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export const deleteRequest = (url) => {
  return axios({
    method: 'delete',
    url: `${base}${url}`
  });
}
export const formPost = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      // Do whatever you want to transform the data
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
