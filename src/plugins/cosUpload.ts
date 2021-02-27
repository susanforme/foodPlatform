import { ReadStream } from 'fs';
import sha512 from 'crypto-js/sha512';
import { PATH_ENV } from '.';
import COS from 'cos-nodejs-sdk-v5';
import { errMap, ServerError } from './errors';
import path from 'path';
import url from 'url';

const cos = new COS({
  SecretId: PATH_ENV?.MY_TENCENT_ID,
  SecretKey: PATH_ENV?.MY_TENCENT_KEY,
});

async function cosUpload(options: Options) {
  const { filename, file } = options;
  const timeHash = sha512(new Date().toUTCString()).toString();
  const time = new Date().toLocaleDateString().replace(/\//g, '.');
  const extname = path.extname(filename);
  const result = await cos.putObject({
    Bucket: 'chengcheng-1256396014' /* 必须 */,
    Region: 'ap-guangzhou' /* 必须 */,
    Key: `/img/public/${time}/${filename + timeHash + extname}` /* 必须 */,
    StorageClass: 'STANDARD',
    // 上传文件对象
    Body: file,
  });
  if (result.statusCode != 200) {
    throw new ServerError(errMap.upload.U1001);
  }
  return {
    url: new url.URL('https://' + result.Location).pathname,
  };
}

export default cosUpload;

interface Options {
  filename: string;
  file: ReadStream;
}
