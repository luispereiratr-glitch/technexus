// Palestrantes: ao rolar a página, a seção fica "presa" na tela e troca de palestrante.
// No celular (ou com "reduzir movimento" ligado) os palestrantes aparecem um embaixo do outro.

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
            slide.classList.toggle("passou", i < indice);   // os anteriores saem para cima
            slide.setAttribute("aria-hidden", i === indice ? "false" : "true");
            slide.inert = i !== indice;
        });
        pontos.forEach((ponto, i) => {
            ponto.classList.toggle("ativo", i === indice);
            ponto.setAttribute("aria-current", i === indice ? "true" : "false");
        });
        secao.classList.toggle("no-ultimo", indice === total - 1);
    }

    // Quanto da seção já foi rolado (0 a 1) define o palestrante da vez
    function aoRolar() {
        if (!modoRolagem.matches) return;
        const caixa = secao.getBoundingClientRect();
        const percurso = secao.offsetHeight - window.innerHeight;
        const progresso = Math.min(Math.max(-caixa.top / percurso, 0), 0.9999);
        ativar(Math.floor(progresso * total));
    }

    // Clicar no indicador rola até o palestrante escolhido
    pontos.forEach(ponto => {
        ponto.addEventListener("click", () => {
            const percurso = secao.offsetHeight - window.innerHeight;
            const alvo = secao.offsetTop + percurso * (Number(ponto.dataset.irPara) + 0.5) / total;
            window.scrollTo({ top: alvo, behavior: "smooth" });
        });
    });

    function configurar() {
        secao.classList.toggle("modo-rolagem", modoRolagem.matches);
        if (modoRolagem.matches) {
            atual = -1;
            aoRolar();
        } else {
            // celular: todos visíveis, sem travar a rolagem
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
    modoRolagem.addEventListener("change", configurar);
    configurar();
})();
