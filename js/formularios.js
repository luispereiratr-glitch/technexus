// Máscaras e validação dos formulários da TechNexus
// Uso: coloque data-mascara="telefone|cpf|cnpj|cep|cartao|validade" no <input>

(function () {
    const mascaras = {
        telefone: v => v.slice(0, 11)
            .replace(/^(\d{2})(\d)/, "($1) $2")
            .replace(/(\d)(\d{4})$/, "$1-$2"),
        cpf: v => v.slice(0, 11)
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2"),
        cnpj: v => v.slice(0, 14)
            .replace(/^(\d{2})(\d)/, "$1.$2")
            .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1/$2")
            .replace(/(\d{4})(\d)/, "$1-$2"),
        cep: v => v.slice(0, 8).replace(/^(\d{5})(\d)/, "$1-$2"),
        cartao: v => v.slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 "),
        validade: v => v.slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2")
    };

    document.querySelectorAll("[data-mascara]").forEach(campo => {
        const formatar = mascaras[campo.dataset.mascara];
        if (!formatar) return;
        // "input" também dispara quando o navegador preenche sozinho (autocomplete)
        campo.addEventListener("input", () => {
            campo.value = formatar(campo.value.replace(/\D/g, ""));
        });
    });

    // Validação no estilo do Bootstrap (.was-validated)
    document.querySelectorAll("form").forEach(form => {
        form.setAttribute("novalidate", "");
        form.addEventListener("submit", evento => {
            if (!form.checkValidity()) {
                evento.preventDefault();
                evento.stopPropagation();
                const primeiroErro = form.querySelector(":invalid");
                if (primeiroErro) primeiroErro.focus();
            }
            form.classList.add("was-validated");
        });
    });
})();
