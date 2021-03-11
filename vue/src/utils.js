const storage = process.env.PERSISTENCE === 'local' ? localStorage : sessionStorage;

const lxStorage = {
  getItem: (key) => storage.getItem(key),
  setItem: (key, value) => storage.setItem(key, value),
  clear: () => storage.clear(),
};

export {
  lxStorage,
};