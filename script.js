// Importa módulos do Node para escrever em arquivo (requer nodeIntegration no Electron)
const fs = require("fs");
const path = require("path");

// Caminho do arquivo de resultados (ficará ao lado do executável)
const configPath = path.join(__dirname, "config.json");
const resultadosFile = path.join(__dirname, "resultados.txt");

// Função auxiliar para ordinais em português
/*const ordinais = [
  "Primeiro",
  "Segundo",
  "Terceiro",
  "Quarto",
  "Quinto",
  "Sexto",
  "Sétimo",
  "Oitavo",
  "Nono",
  "Décimo",
];*/
let sessionCount = 0;
//iniciarArquivo();
// Ao iniciar, cria ou abre o arquivo e adiciona cabeçalho do primeiro sorteio
/*function iniciarArquivo() {
  sessionCount = 0;
  const header = `${ordinais[sessionCount]} Sorteio\n`;
  fs.appendFileSync(resultadosFile, header);
}*/
let rowId = 1;

carregarDados();
function carregarDados() {
  let lista = [];

  if (fs.existsSync(resultadosFile)) {
    const conteudo = fs.readFileSync(resultadosFile, "utf-8").trim();
    if (conteudo.length > 0) {
      lista = conteudo.split("\n").map((linha) => {
        const [idParte, resto] = linha.split("|").map((s) => s.trim());
        const [numeroSorteado, horaSorteada, tipoSorteio] = resto
          .split(" - ")
          .map((s) => s.trim());

        return {
          id: parseInt(idParte),
          numeroSorteado,
          horaSorteada,
          tipoSorteio,
        };
      });
    } else {
      console.log("O arquivo está vazio.");
    }
  } else {
    console.log("Arquivo não encontrado.");
  }

  console.log("Lista de resultados:", lista);

  // Criar elementos na tabela (isso precisa rodar em um ambiente que suporte DOM, como Electron ou browser via preload)
  for (let registro of lista) {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${registro.id}|${registro.numeroSorteado}</td>
      <td>${registro.horaSorteada}</td>
      <td>${registro.tipoSorteio}</td>
    `;
    document.querySelector("#resultTable tbody").prepend(linha);
  }

  rowId = lista.length > 0 ? Math.max(...lista.map((r) => r.id)) + 1 : 1;
}

function toggleBox(boxId) {
  const box = document.getElementById(boxId);
  box.style.display =
    box.style.display === "none" || box.style.display === "" ? "block" : "none";
}

// Alterna visibilidade do painel de configurações do aside esquerdo
document.getElementById("btnConfig").addEventListener("click", () => {
  const configContent = document.getElementById("configContent");
  configContent.style.display =
    configContent.style.display === "none" ? "block" : "none";
});

// Alterna visibilidade das seções usando a função genérica
document
  .getElementById("btnOcultar")
  .addEventListener("click", () => toggleBox("boxOcultar"));
document
  .getElementById("btnVariaveis")
  .addEventListener("click", () => toggleBox("boxVariaveis"));
document
  .getElementById("btnPaleta")
  .addEventListener("click", () => toggleBox("boxPaleta"));
document
  .getElementById("btntextos")
  .addEventListener("click", () => toggleBox("boxTextos"));

// Função para gerar número aleatório entre min e max
function gerarNumeroAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + parseInt(min);
}

// Valores padrão de cada campo
let config = {
  campo1: { min: 0, max: 9 },
  campo2: { min: 0, max: 9 },
  campo3: { min: 0, max: 9 },
  campo4: { min: 0, max: 99 },
  campo5: { min: 0, max: 999 },
};

const defaultMax = {
  campo1: 9,
  campo2: 9,
  campo3: 9,
  campo4: 99,
  campo5: 999,
};

// Atualiza as configurações de min e max de cada campo
document.getElementById("updateConfig").addEventListener("click", () => {
  for (let i = 1; i <= 5; i++) {
    const minInput = document.getElementById("min" + i);
    const maxInput = document.getElementById("max" + i);
    let minVal = parseInt(minInput.value);
    let maxVal = parseInt(maxInput.value);
    if (isNaN(minVal)) {
      minVal = 0;
      minInput.value = 0;
    }
    if (isNaN(maxVal)) {
      maxVal = defaultMax["campo" + i];
      maxInput.value = defaultMax["campo" + i];
    }
    minVal = Math.max(minVal, 0);
    maxVal = Math.min(maxVal, 999);
    if (minVal > maxVal) {
      showError("O valor mínimo não pode ser maior que o valor máximo!");
      return;
    }
    config["campo" + i] = { min: minVal, max: maxVal };
  }
  showError("Configurações atualizadas com sucesso!");
  salvarConfiguracoes();
});

// Oculta ou exibe os campos conforme os checkboxes
document.getElementById("applyHide").addEventListener("click", () => {
  for (let i = 1; i <= 5; i++) {
    const checkbox = document.getElementById("hide" + i);
    const campoContainer = document
      .getElementById("campo" + i)
      .closest(".campo-container");
    campoContainer.style.display = checkbox.checked ? "none" : "block";
  }
  showError("Aplicado");
  salvarConfiguracoes();
});

// Aplica as cores escolhidas
document.getElementById("applyColors").addEventListener("click", () => {
  const bg = document.getElementById("colorBg").value;
  const btn = document.getElementById("colorBtn").value;
  const campo = document.getElementById("colorCampo").value;
  const text = document.getElementById("colorText").value;
  const aside = document.getElementById("colorAside").value;
  const tableHeader = document.getElementById("colorTableHeader").value;
  const btnTextColor = document.getElementById("colorBtnText").value;
  const tableHeaderTextColor = document.getElementById(
    "colorTableHeaderText"
  ).value;
  const campoTextColor = document.getElementById("campoTextColor").value;
  const resultTableBg = document.getElementById("resultTableBg").value;
  const tableInceridosColor = document.getElementById(
    "tableInceridosColor"
  ).value;
  const tituloBg = document.getElementById("colorTituloBg").value;
  const tituloText = document.getElementById("colorTituloText").value;
  const celulaBg = document.getElementById("colorCelulaBg").value;
  const celulaText = document.getElementById("colorCelulaText").value;
  const tabelaBg = document.getElementById("colorTabelaBg").value;

  document.documentElement.style.setProperty("--titulo-bg", tituloBg);
  document.documentElement.style.setProperty("--titulo-text", tituloText);
  document.documentElement.style.setProperty("--celula-bg", celulaBg);
  document.documentElement.style.setProperty("--celula-text", celulaText);
  document.documentElement.style.setProperty("--tabela-bg", tabelaBg);

  document.querySelectorAll(".titulo-coluna").forEach((el) => {
    el.style.backgroundColor = tituloBg;
    el.style.color = tituloText;
  });
  document.querySelectorAll(".celula").forEach((el) => {
    el.style.backgroundColor = celulaBg;
    el.style.color = celulaText;
  });
  document.querySelectorAll(".tabela-resultados").forEach((el) => {
    el.style.backgroundColor = tabelaBg;
  });

  document.documentElement.style.setProperty(
    "--table-inceridos-color",
    tableInceridosColor
  );
  document.documentElement.style.setProperty("--bg-color", bg);
  document.documentElement.style.setProperty("--btn-color", btn);
  document.documentElement.style.setProperty("--campo-color", campo);
  document.documentElement.style.setProperty("--text-color", text);
  document.documentElement.style.setProperty("--aside-color", aside);
  document.documentElement.style.setProperty(
    "--table-header-color",
    tableHeader
  );
  document.documentElement.style.setProperty(
    "--result-table-bg",
    resultTableBg
  );
  document.documentElement.style.setProperty(
    "--campo-text-color",
    campoTextColor
  );

  const tableHeaderCells = document.querySelectorAll(
    "table#resultTable thead th"
  );
  tableHeaderCells.forEach((cell) => {
    cell.style.backgroundColor = tableHeader;
    cell.style.color = tableHeaderTextColor;
  });
  document
    .querySelectorAll("button")
    .forEach((button) => (button.style.color = btnTextColor));
  salvarConfiguracoes();
});

// Aplica as alterações de textos
document.getElementById("applyTextos").addEventListener("click", () => {
  const inputTitulo = document.getElementById("inputTitulo");
  const novoTitulo = inputTitulo.value.trim();
  document.querySelector(".container-principal h1").textContent =
    novoTitulo || inputTitulo.placeholder;
  document.querySelectorAll(".campo-container span").forEach((label, idx) => {
    const input = document.getElementById(`inputCampo${idx + 1}`);
    label.textContent = input.value.trim() || input.placeholder;
  });
  showError("Texto atualizado");
  salvarConfiguracoes(); // ← adiciona aqui!
});

// Evento para sortear os números e adicioná-los na tabela (coluna S usa rowIdS)
document.getElementById("sortBtn").addEventListener("click", () => {
  const resultados = [];
  for (let i = 1; i <= 5; i++) {
    const key = `campo${i}`;
    const { min, max } = config[key];
    const valor = gerarNumeroAleatorio(min, max);
    const container = document.getElementById(key).closest(".campo-container");
    if (container.style.display !== "none") {
      document.getElementById(key).textContent = valor;
      resultados.push(valor);
    } else {
      resultados.push("");
    }
  }

  const resultadoFinal = resultados.join("");
  const linha = document.createElement("tr");
  const data = new Date().toLocaleString("pt-BR");
  linha.innerHTML = `
    <td>${rowId}| ${resultadoFinal}</td>
    <td>${data}</td>
    <td>S</td>
  `;
  document.querySelector("#resultTable tbody").prepend(linha);

  // Armazena permanentemente no arquivo
  fs.appendFileSync(
    resultadosFile,
    `${rowId}| ${resultadoFinal} - ${data} - S\n`
  );

  rowId++;
});
// Lógica para adicionar o resultado inserido pelo usuário na tabela (coluna I usa rowIdI)
document.getElementById("addUserResult").addEventListener("click", () => {
  const input = document.getElementById("userNumber");
  const value = input.value.trim();

  if (!value) return showError("Por favor, insira um número!");
  const number = parseInt(value, 10);
  if (isNaN(number) || number < 0) return showError("Entrada inválida.");

  const linha = document.createElement("tr");
  const data = new Date().toLocaleString("pt-BR");
  linha.innerHTML = `
    <td>${rowId}| ${number}</td>
    <td>${data}</td>
    <td>I</td>
  `;
  document.querySelector("#resultTable tbody").prepend(linha);

  // Armazena permanentemente no arquivo
  fs.appendFileSync(resultadosFile, `${rowId}| ${number} - ${data} - I\n`);

  rowId++;
  input.value = "";
});
function showError(message) {
  const modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.top = "20px";
  modal.style.left = "50%";
  modal.style.transform = "translateX(-50%)";
  modal.style.background = "#ffdddd";
  modal.style.border = "1px solid #cc0000";
  modal.style.padding = "10px 20px";
  modal.style.zIndex = 1000;
  modal.style.borderRadius = "8px";
  modal.innerText = message;

  document.body.appendChild(modal);

  setTimeout(() => {
    modal.remove();
  }, 3000);
}
/*
// Verifica se atingiu o limite de divs e cria uma nova se necessário
let currentDiv = document.querySelector(".result-container:last-child");
if (!currentDiv || currentDiv.querySelectorAll("tr").length >= maxDivs) {
  currentDiv = createNewDiv(); // Cria uma nova div se necessário
}*/

// Toggle de exibição do formulário manual
document.getElementById("toggleUserInput").addEventListener("click", () => {
  const div = document.getElementById("userInputDiv");
  div.style.display = div.style.display === "none" ? "block" : "none";
});

function atualizarGradeModal() {
  // pega todas as linhas do tbody (já em ordem: newest first)
  const linhas = Array.from(document.querySelectorAll("#resultTable tbody tr"));

  // extrai o número completo, incluindo o identificador (antes e depois do " | ")
  const sVals = linhas
    .map((tr) => {
      const txt = tr.cells[0].textContent.trim();
      return txt.includes("|")
        ? txt.split("|")[0].trim() + "| " + txt.split("|")[1].trim()
        : "";
    })
    .reverse(); // Inverte a ordem

  const celulasContainer = document.querySelector("#orgaoprincipal .celulas");
  celulasContainer.innerHTML = "";

  // determina quantas células a grade deve ter
  const totalCells = celulasContainer.children.length || sVals.length;

  // preenche com os valores (ou vazio) na ordem antiga→nova
  for (let i = 0; i < totalCells; i++) {
    const novaCelula = document.createElement("div");
    novaCelula.classList.add("celula");
    novaCelula.textContent = sVals[i] || ""; // Exibe o número completo (exemplo: 1| 15135452)
    celulasContainer.appendChild(novaCelula);
  }
}

// Substituição do listener de mostrar resultados para usar atualizarGradeModal e evitar toggles conflitantes
const btnShow = document.getElementById("btnShowResults");
const btnBack = document.getElementById("btnBack");
const modal = document.getElementById("orgaoprincipal");
const main = document.getElementById("container-principal");
const leftA = document.getElementById("asideesquerdo");
const rightA = document.getElementById("direitoaside");

btnShow.addEventListener("click", () => {
  // Atualiza a grade ANTES de mostrar
  atualizarGradeModal();

  // Esconde os três painéis principais
  main.style.display = "none";
  leftA.style.display = "none";
  rightA.style.display = "none";

  // Exibe o modal e o botão voltar
  modal.style.display = "flex";
  btnBack.style.display = "inline-block";
});
// Botão para limpar os resultados de ambas as tabelas e iniciar novo sorteio
document.getElementById("clearResults").addEventListener("click", () => {
  // Limpa a tabela na interface
  document.querySelector("#resultTable tbody").innerHTML = "";
  const celulasContainer = document.querySelector("#orgaoprincipal .celulas");
  celulasContainer.innerHTML = "";
  document.querySelectorAll(".campo").forEach((campo) => {
    campo.textContent = "-";
  });
  document.getElementById("userNumber").value = "";

  rowId = 1;

  criarBackup();
  // Incrementa sessão e adiciona novo cabeçalho no arquivo
  //sessionCount++;
  //const header = `\n${ordinais[sessionCount] || sessionCount + 1} Sorteio\n`;
  //fs.appendFileSync(resultadosFile, header);
});

function criarBackup() {
  const dir = __dirname;
  const arquivos = fs.readdirSync(dir);

  const backupsExistentes = arquivos
    .filter((nome) => /^backup_\d+\.txt$/.test(nome))
    .map((nome) => parseInt(nome.match(/^backup_(\d+)\.txt$/)[1]))
    .sort((a, b) => a - b);

  const proximoNumero =
    backupsExistentes.length > 0
      ? backupsExistentes[backupsExistentes.length - 1] + 1
      : 1;

  const nomeBackup = `backup_${proximoNumero}.txt`;
  const caminhoBackup = path.join(dir, nomeBackup);

  // Copia o conteúdo de resultadosFile
  if (fs.existsSync(resultadosFile)) {
    const conteudo = fs.readFileSync(resultadosFile, "utf-8");
    fs.writeFileSync(caminhoBackup, conteudo, "utf-8");
    console.log(`Backup criado: ${nomeBackup}`);
  } else {
    console.log("Arquivo de resultados não encontrado. Nenhum backup criado.");
  }
  //limpar arquivo
  fs.writeFileSync(resultadosFile, "", "utf-8");
}

// Listener de voltar (restaura visão principal)
btnBack.addEventListener("click", () => {
  modal.style.display = "none";
  main.style.display = "flex";
  leftA.style.display = "block";
  rightA.style.display = "block";
  btnBack.style.display = "none";
});
function carregarConfiguracoes() {
  if (fs.existsSync(configPath)) {
    const configSalvo = JSON.parse(fs.readFileSync(configPath, "utf-8"));

    // Restaurar campos ocultos
    for (let i = 1; i <= 5; i++) {
      const campoContainer = document
        .getElementById("campo" + i)
        .closest(".campo-container");
      const checkbox = document.getElementById("hide" + i);
      const esconder = configSalvo.ocultar?.[`campo${i}`] ?? false;
      campoContainer.style.display = esconder ? "none" : "block";
      checkbox.checked = esconder;
    }

    // Restaurar valores min/max
    for (let i = 1; i <= 5; i++) {
      const minInput = document.getElementById("min" + i);
      const maxInput = document.getElementById("max" + i);
      const cfg = configSalvo.minmax?.[`campo${i}`];
      if (cfg) {
        minInput.value = cfg.min;
        maxInput.value = cfg.max;
        config[`campo${i}`] = { min: cfg.min, max: cfg.max };
      }
    }
    // Textos
    if (configSalvo.textos) {
      const titulo = configSalvo.textos.titulo;
      if (titulo) {
        document.getElementById("inputTitulo").value = titulo;
        document.querySelector(".container-principal h1").textContent = titulo;
      }
      for (let i = 1; i <= 5; i++) {
        const campoLabel = configSalvo.textos[`campo${i}`];
        if (campoLabel) {
          document.getElementById(`inputCampo${i}`).value = campoLabel;
          document
            .querySelector(`#campo${i}`)
            .closest(".campo-container")
            .querySelector("span").textContent = campoLabel;
        }
      }
    }

    // Cores
    if (configSalvo.cores) {
      Object.entries(configSalvo.cores).forEach(([id, val]) => {
        const input = document.getElementById(id);
        if (input) input.value = val;
      });
      // Dispara o listener de aplicar cores, para atualizar o CSS na página:
      document.getElementById("applyColors").click();
    }
  }
}
carregarConfiguracoes();
function salvarConfiguracoes() {
  const dados = {
    ocultar: {},
    minmax: {},
    textos: {},
    cores: {},
  };

  // Ocultação
  for (let i = 1; i <= 5; i++) {
    dados.ocultar[`campo${i}`] = document.getElementById("hide" + i).checked;
  }

  // Min/Max
  for (let i = 1; i <= 5; i++) {
    const min = parseInt(document.getElementById("min" + i).value) || 0;
    const max =
      parseInt(document.getElementById("max" + i).value) ||
      defaultMax["campo" + i];
    dados.minmax[`campo${i}`] = { min, max };
  }

  // Textos
  dados.textos.titulo = document.getElementById("inputTitulo").value.trim();
  for (let i = 1; i <= 5; i++) {
    dados.textos[`campo${i}`] = document
      .getElementById("inputCampo" + i)
      .value.trim();
  }

  // Cores
  const idsCores = [
    "colorBg",
    "colorBtn",
    "colorCampo",
    "colorText",
    "colorAside",
    "colorTableHeader",
    "colorBtnText",
    "colorTableHeaderText",
    "campoTextColor",
    "resultTableBg",
    "tableInceridosColor",
    "colorTituloBg",
    "colorTituloText",
    "colorCelulaBg",
    "colorCelulaText",
    "colorTabelaBg",
  ];
  idsCores.forEach((id) => {
    dados.cores[id] = document.getElementById(id).value;
  });

  fs.writeFileSync(configPath, JSON.stringify(dados, null, 2), "utf-8");
}
// Botão para resetar TODAS as configurações ao estado inicial
document.getElementById("defaultconfig").addEventListener("click", () => {
  // 1) Apaga o arquivo de config salvo
  if (fs.existsSync(configPath)) {
    fs.unlinkSync(configPath);
  }

  // 2) Reset em memória: ocultação de campos
  for (let i = 1; i <= 5; i++) {
    const cb = document.getElementById("hide" + i);
    cb.checked = false;
    document
      .getElementById("campo" + i)
      .closest(".campo-container").style.display = "block";
  }

  // 3) Reset min/max para valores padrão
  for (let i = 1; i <= 5; i++) {
    document.getElementById("min" + i).value = 0;
    document.getElementById("max" + i).value = defaultMax["campo" + i];
    config["campo" + i] = { min: 0, max: defaultMax["campo" + i] };
  }

  // 4) Reset dos textos (título e labels)
  const tituloInput = document.getElementById("inputTitulo");
  tituloInput.value = "";
  document.querySelector(".container-principal h1").textContent =
    tituloInput.placeholder;
  for (let i = 1; i <= 5; i++) {
    const inp = document.getElementById("inputCampo" + i);
    inp.value = "";
    const span = document
      .getElementById("campo" + i)
      .closest(".campo-container")
      .querySelector("span");
    span.textContent = inp.placeholder;
  }

  // 5) Reset das cores aos valores iniciais definidos no HTML
  const idsCores = [
    "colorBg",
    "colorBtn",
    "colorCampo",
    "colorText",
    "colorAside",
    "colorTableHeader",
    "colorBtnText",
    "colorTableHeaderText",
    "campoTextColor",
    "resultTableBg",
    "tableInceridosColor",
    "colorTituloBg",
    "colorTituloText",
    "colorCelulaBg",
    "colorCelulaText",
    "colorTabelaBg",
  ];
  idsCores.forEach((id) => {
    const input = document.getElementById(id);
    // defaultValue contém o atributo value inicial do HTML
    input.value = input.defaultValue;
  });

  // 6) Reaplica imediatamente textos e cores via seus listeners
  document.getElementById("applyColors").click();
  document.getElementById("applyTextos").click();
  document.getElementById("applyHide").click();
  document.getElementById("updateConfig").click();

  // 7) (Opcional) Gratificação visual
  showError("Configurações restauradas ao padrão!");
});
