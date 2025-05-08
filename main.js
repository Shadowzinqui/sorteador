// main.js (Electron entry point)
// Este arquivo inicializa a janela do Electron e carrega seu front-end

const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

function createWindow() {
  // Cria a janela do browser
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      // Permite uso de require() no renderer (script.js)
      nodeIntegration: true,
      contextIsolation: false,
      // Se usar preload para maior segurança, aponte aqui:
      // preload: path.join(__dirname, 'preload.js')
    },
  });
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  // Carrega o HTML principal
  win.loadFile("index.html");

  // (Opcional) abre DevTools automaticamente em desenvolvimento
  // win.webContents.openDevTools();
}

// Quando o Electron estiver pronto, cria a janela
app.whenReady().then(createWindow);

// No macOS, recria janela se o ícone for clicado e não houver janelas abertas
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Fecha o app quando todas as janelas forem fechadas (exceto no macOS)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

const template = [
  {
    label: "Arquivo",
    submenu: [
      {
        label: "Sair",
        click: () => app.quit(),
        accelerator: "alt+F4",
      },
    ],
  },
  {
    label: "Exibir",
    submenu: [
      {
        label: "Recarregar",
        role: "reload",
      },
      {
        label: "Ferramentas do desenvolvedor",
        role: "toggleDevTools",
      },

      {
        label: "Aplicar zoom",
        role: "zoomIn",
      },
      {
        label: "Reduzir ",
        role: "zoomOut",
      },
      {
        label: "Restaurar zoom padrão",
        role: "resetZoom",
      },
    ],
  },
  {
    label: "Ajuda",
    submenu: [
      {
        label: "site Electron",
        click: () =>
          shell.openExternal(
            "https://www.electronjs.org/pt/docs/latest/tutorial/tutorial-first-app"
          ),
      },
      {
        label: "Sobre",
        click: () => aboutWindow(),
      },
    ],
  },
];
