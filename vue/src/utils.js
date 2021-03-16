const storage = process.env.PERSISTENCE === 'local' ? localStorage : sessionStorage;

const lxStorage = {
  getItem: (key) => storage.getItem(key),
  setItem: (key, value) => storage.setItem(key, value),
  clear: () => storage.clear(),
};

const randomString = (len = 8) => {
  return Math.random().toString(36).substr(2, len + 2);
};

export {
  lxStorage,
  randomString,
};