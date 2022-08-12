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

async function checkCredit(email) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await Users.find({ email: email });
      if (user.length > 0) {
        if (user[0].credit > 0) {
          user[0].credit = user[0].credit - 1;

          Users.findOneAndUpdate({ _id: user[0]._id }, user[0], {
            new: true,
            useFindAndModify: false,
          })
            .then(() => {
              resolve({ hasCredit: true, value: user[0].credit });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          resolve({
            hasCredit: false,
          });
        }
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

async function getPosts(size) {
  return new Promise((resolve, reject) => {
    try {
      Posts.find({ sent: false })
        .sort({ createdAt: 1 })
        .limit(size)
        .then((data) => {
          resolve(data);
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

async function updatePost(data) {
  return new Promise((resolve, reject) => {
    try {
      Posts.findOneAndUpdate({ _id: data._id }, data, {
        new: true,
        useFindAndModify: false,
      })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          console.log(err);
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
  checkCredit,
  getPosts,
  updatePost,
  findUser,
  newUser,
  deleteUser,
};
