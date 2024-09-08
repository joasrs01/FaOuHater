const btnsLike = document.querySelectorAll(".btn-like-dlike");
const formUsuario = document.querySelector("#form-usuario");
const formReview = document.querySelector("#form-review");
const btnsEnviarComentario = document.querySelectorAll(
  "#btn-enviar-comentario"
);
const btnsCarregarComentarios = document.querySelectorAll(
  "#btn-carregar-comentarios"
);

btnsLike.forEach((btn) => {
  btn.addEventListener("click", async () => {
    let idReview = btn.getAttribute("data-review-id");
    let idUsuario = btn.getAttribute("data-usuario-id");
    let bLike = Boolean(btn.getAttribute("data-like"));

    fetch(`reviews/${!bLike ? "dis" : ""}like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reviewId: idReview,
        usuarioId: idUsuario,
      }),
    })
      .then(async (resposta) => {
        if (resposta.ok) {
          let resultado = await resposta.json();

          let qtdLike = document.querySelector(`#qtd-like-${idReview}`);
          let qtdDislike = document.querySelector(`#qtd-dislike-${idReview}`);

          let iconLike = document.querySelector(
            `#lr-${idReview}u-${idUsuario}`
          );
          let iconDisLike = document.querySelector(
            `#dr-${idReview}u-${idUsuario}`
          );

          if (resultado.jsnRetorno.like) {
            iconLike.classList.remove("bi-hand-thumbs-up");
            iconLike.classList.add("bi-hand-thumbs-up-fill");
          } else {
            iconLike.classList.remove("bi-hand-thumbs-up-fill");
            iconLike.classList.add("bi-hand-thumbs-up");
          }

          if (resultado.jsnRetorno.dislike) {
            iconDisLike.classList.remove("bi-hand-thumbs-down");
            iconDisLike.classList.add("bi-hand-thumbs-down-fill");
          } else {
            iconDisLike.classList.remove("bi-hand-thumbs-down-fill");
            iconDisLike.classList.add("bi-hand-thumbs-down");
          }

          qtdLike.innerHTML = resultado.jsnRetorno.qtds.qtdLikes;
          qtdDislike.innerHTML = resultado.jsnRetorno.qtds.qtdDislikes;
        }
      })
      .catch((err) => console.log("erro ao adicionar comentario: " + err));
  });
});

if (formUsuario) {
  formUsuario.addEventListener("submit", onValidarFormUsuario);
}

if (formReview) {
  formReview.addEventListener("submit", onValidarFormReview);
}

async function removerComentario(event) {
  let idComentario = event.target.getAttribute("data-comentario");

  if (idComentario && idComentario > 0) {
    let resposta = await fetch(
      `../../reviews/comentario/remover/${idComentario}`
    );

    if (resposta.ok) {
      carregarComentarios(event.target.getAttribute("data-review"));
    }
  }
}

function verificarComentarioInformado(idReview) {
  let valido = true;
  let comentario = document.querySelector(`#cmr-${idReview}`);
  comentario.classList.remove("form-control-invalido");

  if (comentario.value.trim() === "") {
    valido = false;
    comentario.classList.add("form-control-invalido");
  }

  return valido;
}

if (btnsEnviarComentario) {
  btnsEnviarComentario.forEach((btn) => {
    btn.addEventListener("click", async () => {
      let idReview = btn.getAttribute("data-review-id");

      if (idReview && verificarComentarioInformado(idReview)) {
        let comentario = document.querySelector(`#cmr-${idReview}`);
        let tipoOrigem = "review";
        let idOrigem = btn.getAttribute("data-review-id");

        let resultado = await fetch(`../reviews/comentario/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comentario: comentario.value,
            tipoOrigem: tipoOrigem,
            idOrigem: idOrigem,
          }),
        });

        if (resultado.ok && idReview) {
          console.log("entrou carregar automatico");
          carregarComentarios(idReview);
        }

        comentario.value = "";
      }
    });
  });
}

if (btnsCarregarComentarios) {
  btnsCarregarComentarios.forEach((btn) => {
    btn.addEventListener("click", async () => {
      let idReview = btn.getAttribute("data-review-id");

      if (idReview) {
        carregarComentarios(idReview);
      }
    });
  });
}

async function carregarComentarios(idReview) {
  fetch(`../../reviews/comentarios/${idReview}`)
    .then(async (resposta) => {
      if (resposta.ok) {
        let respostaJson = await resposta.json();

        if (respostaJson) {
          const divTempExistente = document.querySelectorAll(
            `#temp-cr${idReview}`
          );

          // vai apagar o que ja tinha sido carregado para recriar
          if (divTempExistente) {
            divTempExistente.forEach((e) => e.remove());
          }

          const divPai = document.querySelector(`#comr-${idReview}`);

          respostaJson.comentarios.forEach((e) => {
            //div conteudo do comentario
            const divConteudo = document.createElement("div");
            divConteudo.classList.add("comentario-conteudo");

            //span comentario
            const spanComentario = document.createElement("span");
            spanComentario.classList.add("comentario-comentario");
            spanComentario.innerHTML = e.comentario;

            divConteudo.appendChild(spanComentario);

            if (e.apresentarOpcoes) {
              //imagem
              const imagem = document.createElement("i");
              imagem.classList.add("bi");
              imagem.classList.add("bi-three-dots-vertical");
              imagem.classList.add("fs-5");
              imagem.classList.add("icone-opcoes");

              //botao opçoes
              const btnOpcoes = document.createElement("button");
              btnOpcoes.classList.add("btn-padrao-h");
              btnOpcoes.classList.add("btn-opcoes");
              btnOpcoes.id = "dropdownMenuButton";
              btnOpcoes.setAttribute("data-toggle", "dropdown");
              btnOpcoes.setAttribute("aria-haspopup", "true");
              btnOpcoes.setAttribute("aria-expanded", "false");

              btnOpcoes.appendChild(imagem);

              //div dropdown opçoes
              const divOpcoes = document.createElement("div");
              divOpcoes.classList.add("opcoes");
              divOpcoes.classList.add("dropdown");

              const botaoOpcoes = document.createElement("input");
              botaoOpcoes.type = "button";
              botaoOpcoes.value = "Remover";
              botaoOpcoes.id = "btn-opcoes-comentario";
              botaoOpcoes.addEventListener("click", removerComentario);
              botaoOpcoes.setAttribute("data-comentario", e.id);
              botaoOpcoes.setAttribute("data-review", e.idOrigem);
              botaoOpcoes.classList.add("drop-menu");
              botaoOpcoes.classList.add("dropdown-menu");
              botaoOpcoes.classList.add("remover-review");
              botaoOpcoes.setAttribute(
                "daria-labelledby",
                "dropdownMenuButton"
              );

              divOpcoes.appendChild(btnOpcoes);
              divOpcoes.appendChild(botaoOpcoes);

              divConteudo.appendChild(divOpcoes);
            }

            //span usuario
            const spanUsuario = document.createElement("span");
            spanUsuario.classList.add("comentario-usuario");
            spanUsuario.innerHTML = "fh/ " + e["Usuario.login"];

            //span data
            const spanData = document.createElement("span");
            spanData.classList.add("comentario-data");
            spanData.innerHTML = e.modDataAtualizacao;

            const divHeadComentario = document.createElement("div");
            divHeadComentario.classList.add("h-card-comentario");

            divHeadComentario.appendChild(spanUsuario);
            divHeadComentario.appendChild(spanData);

            const divCardComentario = document.createElement("div");
            divCardComentario.classList.add("card-comentario");
            divCardComentario.id = `temp-cr${idReview}`;

            divCardComentario.appendChild(divHeadComentario);
            divCardComentario.appendChild(divConteudo);

            divPai.appendChild(divCardComentario);
          });
        }
      }

      const divAddComentario = document.querySelector(
        `#div-com-add-${idReview}`
      );

      divAddComentario.hidden = false;
    })
    .catch((err) => console.log("erro ao adicionar comentario: " + err));
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
