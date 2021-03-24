const storage = (window._tcbEnv && window._tcbEnv.PERSISTENCE || process.env.PERSISTENCE) === 'local' ? localStorage : sessionStorage;

const lxStorage = {
  getItem: (key) => storage.getItem(key),
  setItem: (key, value) => storage.setItem(key, value),
  clear: () => storage.clear(),
};

const randomString = (len = 8) => {
  return Math.random().toString(36).substr(2, len + 2);
};

function arrReduceWidthNumber(arr, count) {
  return arr.reduce((sum, item, index, arr)=>{
      const curStep = arr.slice(sum.length * count, (sum.length + 1) * count);
      if(!!curStep.length){
          sum.push(curStep);
      }
      return sum;
  },[]);
}

Date.prototype.format = function (fmt) {
  const o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, `${this.getFullYear()}`.substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt))
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length));
  }
  return fmt;
};

export {
  lxStorage,
  randomString,
  arrReduceWidthNumber,
};