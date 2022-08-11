const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const util = require("util");
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const cheerio = require("cheerio");
const cloudinary = require("../storage/cloudinary");
const {
  findAll,
  checkEmail,
  newPost,
  findUser,
  newUser,
  deleteUser,
} = require("../models/main");

const STORAGE_NAME = "plurg";
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const site = "https://www.plurg.me";
const textDefault = `Unfortunately, your email client does not support HTML. 
          You can register with a different email, see ${site} for more info`;

async function onStart(req, res) {
  try {
    const total = await findAll();
    const doc = {
      count: total.length ? total.length : 0,
    };

    return res.status(200).json(doc);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
}

async function checkEmailIfExists(data, res) {
  try {
    const exists = await checkEmail(data);
    if (!exists) {
      return res
        .status(403)
        .json({ status: "failed", error: "You need to subscribe first!" });
    } else {
      return res.status(200).json({ status: "passed", msg: "User exists!" });
    }
  } catch (error) {
    console.log(error);
  }
}

async function createPost(data, res) {
  try {
    if (data.image == null || data.image == undefined) {
      data.image =
        "https://res.cloudinary.com/confidencedev/image/upload/v1659802482/res/blank.jpg";
    } else {
      const uploader = async (imgByte) =>
        await cloudinary.uploads(imgByte, STORAGE_NAME);
      const imgUrl = await uploader(data.image);
      data.image = imgUrl.data.url;
      data.imageId = imgUrl.data.id;
    }

    newPost(data)
      .then(() => {
        return res.status(200).json({ status: "passed", msg: "Success" });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          status: "failed",
          error: "Oops, something went wrong, try again",
        });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "failed",
      error: "Oops, something went wrong, try again",
    });
  }
}

async function subscribeUser(data, res) {
  try {
    const exists = await findUser(data);
    if (!exists) {
      const tempPath = "./template/subscribe.html";
      const url = `${site}/join/`;
      const file = await readFile(tempPath, "utf8");
      const $ = cheerio.load(file);

      $("a.link").attr("href", `${url}${data.email}`);
      await writeFile(tempPath, $.html(), "utf8");

      sendMail(data.email, "Complete Subscription", textDefault, tempPath)
        .then(() => {
          return res.status(200).json({ status: "passed", msg: "Success" });
        })
        .catch((error) => {
          console.log(error.message);
          return res
            .status(500)
            .json({ status: "failed", error: "Something went wrong" });
        });
      return;
    } else {
      return res
        .status(409)
        .json({ status: "failed", error: "User is already subscribed!" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "failed", error: "Something went wrong, try again!" });
  }
}

async function unsubscribeUser(data, res) {
  try {
    const p = "./views/unsubscribe.html";
    const url = `${site}/remove/`;
    const file = await readFile(p, "utf8");
    const $ = cheerio.load(file);

    $("a.link").attr("href", `${url}${data.email}`);
    await writeFile(p, $.html(), "utf8");
    const to = await readFile(p, "utf8");
    return res.send(to);
  } catch (error) {
    console.log(error);
  }
}

async function joinUser(data, res) {
  try {
    const exists = await findUser(data);
    if (!exists) {
      newUser(data)
        .then(() => {
          return res.sendFile(path.join(__dirname, "../views", "verify.html"));
        })
        .catch((err) => {
          console.log(err);
          return res
            .status(500)
            .json({ status: "failed", error: "Something went wrong" });
        });
      return;
    } else {
      return res
        .status(409)
        .json({ status: "failed", error: "User is already subscribed" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "failed", error: "Something went wrong, try again!" });
  }
}

async function removeUser(data, res) {
  try {
    const p = "./views/removed.html";
    const file = await readFile(p, "utf8");
    const $ = cheerio.load(file);

    deleteUser(data)
      .then(async () => {
        $("label.desc").text("Unsubscribe successful!");
        await writeFile(p, $.html(), "utf8");
        const to = await readFile(p, "utf8");
        return res.send(to);
      })
      .catch(async (err) => {
        console.log(err);
        $("label.desc").text("Something went wrong try again!");
        await writeFile(p, $.html(), "utf8");
        const to = await readFile(p, "utf8");
        return res.send(to);
      });
  } catch (error) {
    console.log(error);
  }
}

async function loadMail(data, res) {
  try {
    if (data[0].password !== process.env.PASSWORD) {
      return res
        .status(400)
        .json({ status: "failed", error: "Password mismatch" });
    }

    const mailPath = "./template/mail.html";
    const file = await readFile(mailPath, "utf8");
    const $ = cheerio.load(file);
    $("ul.list li").remove();
    for (let i = 2; i < data.length; i++) {
      const post = data[i];
      $("ul.list").append(`
      <li class="list_item">
      <a href="${post.url}" target="_blank" class="link">
        <div class="content">
          <img src="${post.image}" alt="Not Available" class="thumbnail">
          <h4 class="category">${post.category}</h4>
          <h4 class="title">${post.title}</h4>
          <h4 class="desc">${post.desc}</h4>
        </div>
      </a>
    </li>`);
    }
    await writeFile(mailPath, $.html(), "utf8");

    findAll()
      .then((result) => {
        if (result.length > 0) {
          Promise.allSettled(
            result.map(async (item) => {
              const tempPath = "./template/mail.html";
              const url = `${site}/unsubscribe/`;
              const file = await readFile(tempPath, "utf8");
              const $ = cheerio.load(file);

              $("a.unsubscribe").attr("href", `${url}${item.email}`);
              await writeFile(tempPath, $.html(), "utf8");

              sendMail(item.email, data[1].theme, textDefault, tempPath).catch(
                (error) => {
                  console.log(error.message);
                }
              );
            })
          )
            .then(() => {
              console.log("Completed!");
              return res
                .status(200)
                .json({ status: "passed", msg: "Completed!" });
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          return res
            .status(403)
            .json({ status: "failed", error: "No available user!" });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
}

async function sendMail(to, subject, text, file) {
  try {
    const owner = "listreon@gmail.com";
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: owner,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: `Plurg <${owner}>`,
      to: to,
      subject: subject,
      text: text,
      html: await readFile(file, "utf8"),
    };

    return await transport.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  onStart,
  checkEmailIfExists,
  createPost,
  subscribeUser,
  unsubscribeUser,
  joinUser,
  removeUser,
  loadMail,
};
