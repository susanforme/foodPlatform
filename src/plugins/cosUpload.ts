import fs from 'fs';
import sha512 from 'crypto-js/sha512';
import { PATH_ENV } from '.';
import COS from 'cos-nodejs-sdk-v5';
import { errMap, ServerError } from './errors';

const cos = new COS({
  SecretId: PATH_ENV?.MY_TENCENT_ID,
  SecretKey: PATH_ENV?.MY_TENCENT_KEY,
});

async function cosUpload(options: Options) {
  const { fileName, extname, filePath } = options;
  const timeHash = sha512(new Date().toUTCString()).toString();
  const time = new Date().toLocaleDateString().replace(/\//g, '.');
  const result = await cos.putObject({
    Bucket: 'food-1256396014' /* 必须 */,
    Region: 'ap-chengdu' /* 必须 */,
    Key: `/img/public/${time}/${fileName + timeHash}${extname}` /* 必须 */,
    StorageClass: 'STANDARD',
    // 上传文件对象
    Body: fs.createReadStream(filePath),
  });
  if (result.statusCode != 200) {
    throw new ServerError(errMap.upload.U1001);
  }
  return {
    // 客户端自行拼接
    url: `${time}/${fileName + timeHash}${extname}`,
  };
}

export default cosUpload;

interface Options {
  fileName: string;
  hash: string;
  extname: string;
  filePath: string;
}
