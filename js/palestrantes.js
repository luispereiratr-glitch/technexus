// troca os palestrantes conforme rola a pagina
// no celular fica um embaixo do outro

(function () {
    const secao = document.querySelector("[data-palestrantes]");
    if (!secao) return;

    const slides = [...secao.querySelectorAll(".palestrante-slide")];
    const pontos = [...secao.querySelectorAll("[data-ir-para]")];
    const total = slides.length;
    const modoRolagem = window.matchMedia("(min-width: 992px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)");
    let atual = -1;

    secao.style.setProperty("--total", total);

    function ativar(indice) {
        if (indice === atual) return;
        atual = indice;
        slides.forEach((slide, i) => {
            slide.classList.toggle("ativo", i === indice);
            slide.classList.toggle("passou", i < indice);
            slide.setAttribute("aria-hidden", i === indice ? "false" : "true");
            slide.inert = i !== indice;
        });
        pontos.forEach((ponto, i) => {
            ponto.classList.toggle("ativo", i === indice);
            ponto.setAttribute("aria-current", i === indice ? "true" : "false");
        });
        secao.classList.toggle("no-ultimo", indice === total - 1);
    }

    // ve qual palestrante mostrar pela rolagem
    function aoRolar() {
        if (!modoRolagem.matches) return;
        const caixa = secao.getBoundingClientRect();
        const percurso = secao.offsetHeight - window.innerHeight;
        const progresso = Math.min(Math.max(-caixa.top / percurso, 0), 0.9999);
        ativar(Math.floor(progresso * total));
    }

    // rola ate o slide
    function irPara(indice, comportamento) {
        const percurso = secao.offsetHeight - window.innerHeight;
        const alvo = secao.getBoundingClientRect().top + window.scrollY + percurso * (indice + 0.5) / total;
        window.scrollTo({ top: alvo, behavior: comportamento });
    }

    pontos.forEach(ponto => {
        ponto.addEventListener("click", () => irPara(Number(ponto.dataset.irPara), "smooth"));
    });

    // link com # abre no slide certo
    function abrirPeloEndereco() {
        if (!modoRolagem.matches || !location.hash) return;
        const indice = slides.findIndex(slide => "#" + slide.id === location.hash);
        if (indice < 0) return;
        // arruma a rolagem
        secao.querySelector(".palestrantes-palco").scrollTop = 0;
        irPara(indice, "instant"); // com "auto" ficava suave
        aoRolar();
    }

    function configurar() {
        secao.classList.toggle("modo-rolagem", modoRolagem.matches);
        if (modoRolagem.matches) {
            atual = -1;
            aoRolar();
        } else {
            // celular
            slides.forEach(slide => {
                slide.classList.add("ativo");
                slide.classList.remove("passou");
                slide.removeAttribute("aria-hidden");
                slide.inert = false;
            });
            atual = -1;
        }
    }

    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar);
    window.addEventListener("hashchange", abrirPeloEndereco);
    modoRolagem.addEventListener("change", configurar);
    configurar();
    // espera carregar tudo antes de pular pro slide
    window.addEventListener("load", () => setTimeout(abrirPeloEndereco, 50));
})();
