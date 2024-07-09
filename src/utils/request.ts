import axios from "axios";
const baseURL = 'http://127.0.0.1:8080/'
// const baseURL = 'http://desktop-b975agl:9090/api'
const request = axios.create({
    baseURL:baseURL,
    timeout:5000,//超过时间不在访问
})
// 配置请求拦截
request.interceptors.request.use((config) => {
    // 登录之后就可以获取到token
    // const store = useUserStore()
    // let token = store.user.token
    // config.headers["token"] = token;
  
    return config;
  },
    () => {
      alert('发送请求失败')
    }
  );
  
  // 配置响应拦截
  request.interceptors.response.use(
    (res) => {
      return res
    },
    () => {
      alert("网络异常,请稍后再试");
    }
  );
  
  export default request