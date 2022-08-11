const Users = require("../schema/users");
const Posts = require("../schema/posts");

async function findAll() {
  return new Promise(async (resolve, reject) => {
    try {
      const users = await Users.find({});
      resolve(users);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

async function checkEmail(data) {
  return new Promise(async (resolve, reject) => {
    try {
      const item = await Users.find({ email: data.email });
      if (item.length < 1) {
        resolve(false);
      } else {
        resolve(true);
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

async function newPost(data) {
  return new Promise((resolve, reject) => {
    try {
      new Posts(data)
        .save()
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

async function findUser(data) {
  return new Promise(async (resolve, reject) => {
    try {
      const item = await Users.find({ email: data.email });
      if (item.length < 1) {
        resolve(false);
      } else {
        resolve(true);
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

async function newUser(data) {
  return new Promise((resolve, reject) => {
    try {
      new Users(data)
        .save()
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

async function deleteUser(data) {
  return new Promise(async (resolve, reject) => {
    try {
      await Users.deleteMany({ email: data.email }, async (err, data) => {
        if (err) {
          reject(err);
        }

        resolve(data);
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

module.exports = {
  findAll,
  checkEmail,
  newPost,
  findUser,
  newUser,
  deleteUser,
};
