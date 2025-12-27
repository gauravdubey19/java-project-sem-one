import axios from "axios";

const cloudName = import.meta.env.VITE_CLOUD_NAME;

export const uploadInvoiceThumbnail = async (imageData, uploadPreset = "invoices-thumbnail") => {
  const formData = new FormData();
  formData.append("file", imageData);
  formData.append("upload_preset", uploadPreset);
  formData.append("cloud_name", cloudName);

  const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);

  return res.data.secure_url;
};

export const uploadCompanyLogo = async (file, uploadPreset = "company-logos") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("cloud_name", cloudName);

  const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);

  return res.data.secure_url;
};
