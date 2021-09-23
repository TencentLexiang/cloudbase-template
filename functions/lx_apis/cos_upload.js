const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const getCosSign = async (attributes, headers) => {
  const {filename, type} = attributes;
  return axios.post(process.env.LX_API_URL + "v1/docs/cos-param", {
    filename,
    type
  }, {
    "headers": {
      "Authorization": "Bearer " + headers.corp_token,
      "StaffID": headers.staff_id,
    }
  })
  .then((response) => {
      console.log(response.data);
      let {status, data} = response;
      return {status, data};
  })
  .catch((err) => {
      console.log(err.response.data);
      let {status, data} = err.response;
      return {status, data};
  });
}

exports.upload = async(attributes, headers) => {
    const {file} = attributes;
    const signData = await getCosSign(attributes, headers);
    if (signData.status === 200) {
      const {options, object} = signData.data;
      const cosUrl = `http://${options.Bucket}.cos.${options.Region}.myqcloud.com/${object.key}`;
      const cosHeader = {
        "Authorization": object.auth.Authorization,
        "x-cos-security-token": object.auth.XCosSecurityToken
      }
      const config = {
        url: cosUrl,
        method: 'put',
        data: file,
        headers: cosHeader
      };
      const cosPut = await axios(config)
      .then((response) => {
        console.log(response);
        let {status, data} = response;
        return {status, data};
      })
      .catch((err) => {
          console.log(err.response.data);
          let {status, data} = err.response;
          return {status, data};
      });
      return cosPut;
    } else {
      return signData;
    }
}

exports.mediaUpload = async (attributes, headers) => {
  console.log('===================== params');
  console.log(attributes);
  const {isPublic, type, file} = attributes;
  return axios.post(process.env.LX_API_URL + "v1/assets", {
    file,
    type,
    is_public: isPublic
  }, {
    "headers": {
      "Authorization": "Bearer " + headers.corp_token,
      "StaffID": headers.staff_id,
    }
  })
  .then((response) => {
      console.log(response.data);
      let {status, data} = response;
      return {status, data};
  })
  .catch((err) => {
    console.log('error =================== ');
      console.log(err.response.data);
      let {status, data} = err.response;
      return {status, data};
  });
}

const downloadImg = async (originUrl, fileFullPath) => {
  await axios.get(originUrl, {
    responseType: 'stream'
  }).then((res) => {
    // return Buffer.from(res.data);
    return new Promise((resolve, reject) => {
      res.data.pipe(fs.createWriteStream(fileFullPath))
      .on('finish', () => resolve())
      .on('error', e => reject(e));
    })
  });
}

const showTmpFiles = (folder) => {
  fs.readdir(folder, (err, files) => {
    files.forEach(file => {
      console.log(file);
    });
  });
}

exports.mediaUploadSuit = async (attributes, headers) => {
  console.log('===================== params');
  console.log(attributes);
  const {type, url} = attributes;
  const originUrl = url;
  const fileName = originUrl.substring(originUrl.lastIndexOf('/') + 1);
  const fileFullPath = `/tmp/${fileName}`;
  await downloadImg(originUrl, fileFullPath);
  showTmpFiles('/tmp/');
  const postData = new FormData();
  postData.append('type', type);
  postData.append('file', fs.createReadStream(fileFullPath));
  return axios({
    method: 'post',
    url: `${process.env.LX_API_URL}v1/assets`,
    headers: {
      "Authorization": "Bearer " + headers.corp_token,
      "StaffID": headers.staff_id,
      ...postData.getHeaders()
    },
    data : postData
  })
  .then((response) => {
    console.log(response.data);
    let {status, data} = response;
    return {status, data};
  })
  .catch((err) => {
    console.log(err.response.data);
    let {status, data} = err.response;
    return {status, data};
  });
}
