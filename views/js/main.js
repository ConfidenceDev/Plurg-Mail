const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const point = "https://www.plurg.me";

start();

async function start() {
  try {
    await axios.get(`${point}/start`).then((res) => {
      usersCount.innerText =
        res.data.count === 1
          ? `${res.data.count} Subscriber`
          : `${toComma(res.data.count)} Subscribers`;
    });
  } catch (error) {
    console.log(error);
  }
}

joinBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const email = emailField.value;

  if (!email || !email.match(mailformat)) {
    showMsg("Enter a valid email address");
    return;
  }

  joinBtn.enabled = false;
  emailField.enabled = false;

  try {
    await axios
      .get(`${point}/subscription/${email}`)
      .then(() => {
        emailField.value = null;
        showMsg(
          `Verification email sent successfully, check your email inbox!`
        );
      })
      .catch((error) => {
        showMsg(`${error.response.data.error}`);
      });

    joinBtn.enabled = true;
    emailField.enabled = true;
  } catch (error) {
    console.log(error);
  }
});

postDesc.addEventListener("input", (e) => {
  const target = e.currentTarget;
  const currentLength = target.value.length;
  postFieldCount.innerText = `${currentLength}/127`;
});

proceedBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const img = postImg.files[0];
  const category =
    categoryList.options[categoryList.selectedIndex].dataset.category;
  const title = postTitle.value;
  let desc = postDesc.value;
  const url = postUrl.value;
  const email = postEmail.value;
  const amt = 2 * 600;

  if (
    category === "Select" ||
    !title ||
    !desc ||
    !url ||
    !email ||
    !email.match(mailformat)
  ) {
    showMsg("Select a category and fill all fields");
    return;
  }

  desc = desc.replace("\n\n", ". ").replace("\n", " ");
  proceedBtn.enabled = false;

  try {
    await axios
      .get(`${point}/check/${email}`)
      .then((res) => {
        if (res.data.status === "passed") {
          if (img != null) {
            if ((img.size / 1048576).toFixed(2) > 1.0) {
              showMsg("Image size must be less the 1MB");
              return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(img);
            reader.onload = () => {
              const imgByte = reader.result;
              const doc = {
                image: imgByte,
                category: category,
                title: title,
                desc: desc,
                url: url,
                email: email,
              };

              credit(amt, email, doc);
            };
          } else {
            const doc = {
              image: null,
              category: category,
              title: title,
              desc: desc,
              url: url,
              email: email,
            };

            credit(amt, email, doc);
          }
        } else {
          showMsg(res.data.error);
        }
      })
      .catch(() => {
        showMsg(`You need to subscribe first!`);
      });
  } catch (error) {
    console.log(error);
  }
});

function credit(amt, email, doc) {
  const handler = PaystackPop.setup({
    key: payHash(),
    email: email,
    amount: `${amt}00`,
    callback: (response) => {
      if (response.status == "success") {
        axios
          .post(`${point}/posts`, doc)
          .then(() => {
            postTitle.value = null;
            postDesc.value = null;
            postUrl.value = null;
            showMsg(`Congratulations, your post is created!`);
          })
          .catch(() => {
            showMsg(`Oops, something went wrong, try again`);
          });

        proceedBtn.enabled = true;
      } else {
        showMsg("Something went wrong try again");
      }
    },
    onClose: function () {
      proceedBtn.enabled = true;
      showMsg("Transaction cancelled");
    },
  });
  handler.openIframe();
}
