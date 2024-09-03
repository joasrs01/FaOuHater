let btnsLike = document.querySelectorAll(".btn-like-dlike");

console.log("arquivo style carregado");

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
