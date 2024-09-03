const btnsLike = document.querySelectorAll(".btn-like-dlike");
const formUsuario = document.querySelector("#form-usuario");
const formReview = document.querySelector("#form-review");

btnsLike.forEach((btn) => {
  btn.addEventListener("click", async () => {
    let idReview = btn.getAttribute("data-review-id");
    let idUsuario = btn.getAttribute("data-usuario-id");
    let bLike = Boolean(btn.getAttribute("data-like"));

    try {
      let resposta = await fetch(`reviews/${!bLike ? "dis" : ""}like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewId: idReview,
          usuarioId: idUsuario,
        }),
      });

      if (resposta.ok) {
        let qtdAtualizada = await resposta.json();

        let qtdLike = document.getElementById(`qtd-like-${idReview}`);
        let qtdDislike = document.getElementById(`qtd-dislike-${idReview}`);

        qtdLike.innerHTML = qtdAtualizada.qtds.qtdLikes;
        qtdDislike.innerHTML = qtdAtualizada.qtds.qtdDislikes;
      }
    } catch (error) {
      console.log(`erro ao ${!bLike ? "des" : ""}curtir a review: ` + error);
    }
  });
});

if (formUsuario) {
  formUsuario.addEventListener("submit", onValidarFormUsuario);
}

console.log(formReview);
if (formReview) {
  formReview.addEventListener("submit", onValidarFormReview);
}

function onValidarFormReview(event) {
  try {
    let valid = true;
    const musica = document.querySelector("#musica");
    const artista = document.querySelector("#artista");
    const review = document.querySelector("#txt-area-review");

    musica.classList.remove("form-control-invalido");
    artista.classList.remove("form-control-invalido");
    review.classList.remove("form-control-invalido");

    // musica
    if (musica.value.trim() === "") {
      valid = false;
      musica.classList.add("form-control-invalido");
    }

    // artista
    if (artista.value.trim() === "") {
      valid = false;
      artista.classList.add("form-control-invalido");
    }

    // review
    if (review.value.trim() === "") {
      valid = false;
      review.classList.add("form-control-invalido");
    }

    if (!valid) {
      event.preventDefault();
    }
  } catch (error) {
    console.log("erro ao executar a validação do formulario: " + error);
  }
}

function onValidarFormUsuario(event) {
  try {
    let valid = true;
    const name = document.querySelector("#nome");
    const email = document.querySelector("#email");
    const login = document.querySelector("#login");
    const senha = document.querySelector("#senha");

    const spanMsgEmail = document.querySelector("#msg-email");
    const spanMsgLogin = document.querySelector("#msg-login");

    //remove invalidações se tiver
    spanMsgEmail.innerHTML = "";
    spanMsgLogin.innerHTML = "";

    name.classList.remove("form-control-invalido");
    email.classList.remove("form-control-invalido");
    login.classList.remove("form-control-invalido");
    senha.classList.remove("form-control-invalido");

    // Nome
    if (name.value.trim() === "") {
      valid = false;
      name.classList.add("form-control-invalido");
    }

    // Email
    const emailPattern =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi;
    if (email.value.trim() === "") {
      valid = false;
      email.classList.add("form-control-invalido");
    } else if (!emailPattern.test(email.value.trim())) {
      valid = false;
      email.classList.add("form-control-invalido");
      spanMsgEmail.innerHTML = "O e-mail digitado não é valido.";
    }

    // Login
    const loginPattern = /^[a-zA-Z0-9_.]+$/; // Alfanumérico e underline permitido
    if (login.value.trim() === "") {
      valid = false;
      login.classList.add("form-control-invalido");
    } else if (!loginPattern.test(login.value.trim())) {
      valid = false;
      email.classList.add("form-control-invalido");
      spanMsgLogin.innerHTML =
        "O login não pode conter espaços ou caracteres especiais.";
    }

    // Nome
    if (senha.value.trim() === "") {
      valid = false;
      senha.classList.add("form-control-invalido");
    }

    if (!valid) {
      event.preventDefault();
    }
  } catch (error) {
    console.log("erro ao executar a validação do formulario: " + error);
  }
}
