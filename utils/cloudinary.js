import { sendToast } from "@/lib/helper";

const { default: axios } = require("axios");

export const handleUploadToCloudinary = async (file) => {
  console.log(file.size);
  if (file?.size > 9999999) {
    return sendToast({
      variant: "destructive",
      title: "File too large",
      desc: "Image size should not exceed 10MB",
    });
  }
  const uploadPreset = "ml_default";
  // const cloud_name = process.env.CLOUDINARY_CLOUD_NAME
  const cloud_name = "dnlbx1kqu";
  // setLoading(true);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;
  try {
    const response = await axios.post(cloudinaryUrl, formData);
    const imageUrl = response.data.secure_url;
    // setLoading(false);
    // message.success("Upload successful!");
    console.log(imageUrl);
    return imageUrl;
  } catch (error) {
    // setLoading(false);
    // message.error("Upload failed!");
    sendToast({
      variant: "destructive",
      title: "Upload to cloudinary failed",
      desc: "Upload failed",
    });
    console.error("Error uploading image:", error);
  }
};
