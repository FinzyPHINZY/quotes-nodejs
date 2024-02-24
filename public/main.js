const deleteText = document.querySelectorAll(".fa-trash");
const thumbText = document.querySelectorAll(".fa-thumbs-up");

Array.from(deleteText).forEach((element) => {
  element.addEventListener("click", deleteQuote);
});

Array.from(thumbText).forEach((element) => {
  element.addEventListener("click", addLike);
});

async function deleteQuote() {
  const sName = this.parentNode.childNodes[3].innerText;
  const sQuote = this.parentNode.childNodes[5].innerText;
  try {
    const res = await fetch("deleteQuote", {
      method: "delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nameS: sName,
        quoteS: sQuote,
      }),
    });
    const data = await res.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

async function addLike() {
  const name = this.parentNode.childNodes[3].innerText;
  const quote = this.parentNode.childNodes[5].innerText;
  const tLikes = Number(this.parentNode.childNodes[7].innerText);

  console.log(this.parentNode);
  console.log(tLikes);

  try {
    const response = await fetch("addOneLike", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nameS: name,
        quoteS: quote,
        likesS: tLikes,
      }),
    });
    const data = await response.json();
    console.log(data);
    // location.reload();
  } catch (err) {
    console.log(err);
  }
}
