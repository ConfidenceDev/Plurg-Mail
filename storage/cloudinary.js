const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploads = (file, folder) =>
  new Promise((resolve) => {
    try {
      cloudinary.uploader.upload(
        file,
        (result) => {
          resolve({
            status: "success",
            data: {
              url: result.url,
              id: result.public_id,
            },
          });
        },
        {
          resource_type: "auto",
          folder,
        }
      );
    } catch (error) {
      console.log(error);
    }
  });
