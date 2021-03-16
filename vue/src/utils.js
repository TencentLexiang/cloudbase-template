const storage = process.env.PERSISTENCE === 'local' ? localStorage : sessionStorage;

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

export {
  lxStorage,
  randomString,
  arrReduceWidthNumber,
};