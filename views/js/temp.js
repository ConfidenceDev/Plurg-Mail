const unsubscribeBtn = document.querySelector(".link");

unsubscribeBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  unsubscribeBtn.enabled = false;
  try {
    await fetch(unsubscribeBtn.href)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        showMsg(`Unsubscribed successfully!`);
      })
      .catch(() => {
        unsubscribeBtn.enabled = true;
        showMsg(`Oops, something went wrong, try again later`);
      });
  } catch (error) {
    console.log(error);
  }
});

function loadModal(loc) {
  const path = document.location.href.split("/")[0];
  if (path.includes("#")) {
    const tPath = path.split("#");
    window.location.assign(`${tPath[0]}#${loc}`);
  } else {
    window.location.assign(`${path}#${loc}`);
  }
}

function showMsg(msg) {
  popMsg.innerText = msg;
  loadModal("popup_msg");
}
