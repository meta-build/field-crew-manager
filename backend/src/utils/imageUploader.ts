import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

const uploadImg = async (img: any): Promise<string> => {
  const imgName = `${uuidv4()}.jpg`;
  const imgBuffer = fs.readFileSync(img.path);
  const imgBlob = new Blob([imgBuffer], { type: 'image/jpeg' });

  const formData = new FormData();
  formData.append('image', imgBlob, imgName);

  try {
    const resp = await axios.post(
      'https://api.imgur.com/3/image',
      formData,
      { headers: { 'Authorization': `Client-ID ${process.env.IMGUR_CLIENT_ID}` } }
    );
    const url = resp.data.data.link as string;
    return url;
  } catch (error) {
    console.log(error);
    return '';
  }
}

export { uploadImg };