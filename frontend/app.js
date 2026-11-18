"use strict";

const portraitPaths = {
  lyra: "assets/lyra.svg",
  thorin: "assets/thorin.svg",
  seraphine: "assets/seraphine.svg",
  "Artífice": "assets/images/characters_figs/artifice.jpg",
  "Bárbaro": "assets/images/characters_figs/barbaro.jpg",
  "Bardo": "assets/images/characters_figs/bardo.jpg",
  "Clérigo": "assets/images/characters_figs/Anduin_HoW.jpg",
  "Druida": "assets/images/characters_figs/Malfurion_WotE_Cropped.webp",
  "Guerreiro": "assets/images/characters_figs/Varian_Wei.webp",
  "Monge": "assets/images/characters_figs/monge.jpg",
  "Paladino": "assets/images/characters_figs/uther.jpg",
  "Patrulheiro": "assets/images/characters_figs/ranger.jpg",
  "Ladino": "assets/images/characters_figs/Valeera_HoW.webp",
  "Feiticeiro": "assets/images/characters_figs/sorcerer.jpg",
  "Bruxo": "assets/images/characters_figs/guldan.jpg",
  "Mago": "assets/images/characters_figs/medivh.jpg",
};
const defaultPortraitPath = "assets/images/Retrato de Aventureiro com Rosa dos Ventos.png";

const classLore = {
  "Artífice": "Um artífice combina invenção, ferramentas e magia para criar soluções extraordinárias.",
  "Bárbaro": "Um bárbaro transforma instinto, vigor e fúria em força para proteger sua companhia.",
  "Bardo": "Um bardo inspira aliados e altera o curso da jornada com arte e presença.",
  "Clérigo": "Um clérigo une convicção e poder sagrado para amparar e defender seus companheiros.",
  "Druida": "Um druida encontra poder na natureza e no equilíbrio entre suas muitas formas.",
  "Guerreiro": "Um guerreiro encontra propósito na disciplina e na coragem diante do perigo.",
  "Monge": "Um monge aperfeiçoa corpo e mente com disciplina, movimento e foco.",
  "Paladino": "Um paladino segue um juramento e o transforma em proteção e determinação.",
  "Patrulheiro": "Um patrulheiro lê os caminhos selvagens e mantém a companhia fora de perigo.",
  "Ladino": "Um ladino confia na observação, na agilidade e em escolhas precisas.",
  "Feiticeiro": "Um feiticeiro conduz uma magia inata, moldada pela própria essência.",
  "Bruxo": "Um bruxo explora dons arcanos recebidos por meio de um pacto misterioso.",
  "Mago": "Um mago transforma estudo e curiosidade em possibilidades arcanas.",
};

const ancestryLore = {
  Humana: "Humanos são conhecidos por sua versatilidade e capacidade de adaptação.",
  Elfa: "Elfos carregam a memória de antigas florestas e uma longa perspectiva do mundo.",
  "Anã": "Anões valorizam o ofício, a tradição e a firmeza das comunidades montanhosas.",
};

let characters = [
  {
    id: "lyra", name: "Lyra Ventobravo", ancestry: "Elfo da floresta", className: "Patrulheira", level: 5,
    origin: "Guardiã das fronteiras", personality: "Observadora, leal à sua companhia.",
    story: "Uma névoa antiga mudou os caminhos da floresta que Lyra jurou proteger.",
    portrait: "lyra", attributes: { FOR: 11, DES: 16, CON: 12, INT: 10, SAB: 15, CAR: 12 },
  },
  {
    id: "thorin", name: "Thorin Brasaferro", ancestry: "Anão da montanha", className: "Guerreiro", level: 4,
    origin: "Aprendiz de guilda", personality: "Paciente até a primeira provocação.",
    story: "Thorin procura o martelo que desapareceu da forja de sua família.",
    portrait: "thorin", attributes: { FOR: 16, DES: 10, CON: 15, INT: 11, SAB: 12, CAR: 10 },
  },
  {
    id: "seraphine", name: "Seraphine Dusk", ancestry: "Humana", className: "Bruxa", level: 3,
    origin: "Exilada da corte", personality: "Elegante, desconfiada de promessas fáceis.",
    story: "As marés trouxeram até Seraphine uma carta escrita com a própria caligrafia dela.",
    portrait: "seraphine", attributes: { FOR: 9, DES: 13, CON: 12, INT: 15, SAB: 11, CAR: 14 },
  },
];
let apiIsAvailable = false;
let editingCharacterId = null;

const toast = document.querySelector(".toast");
let toastTimer;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
}

async function apiRequest(path, options = {}) {
  const response = await fetch(path, options);
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = payload?.detail;
    const message = Array.isArray(detail)
      ? detail.map((issue) => issue.msg).join("; ")
      : detail || `A API respondeu com HTTP ${response.status}.`;
    throw new Error(message);
  }
  return payload;
}

function fromApiCharacter(record) {
  return {
    id: String(record.id),
    name: record.name,
    ancestry: record.race,
    className: record.class_name,
    level: record.level,
    origin: "Não informada",
    personality: "",
    story: "",
    look: "",
    portrait: portraitPaths[record.class_name] ? record.class_name : "Guerreiro",
    attributes: {},
    source: "api",
  };
}

// O login é uma passagem demonstrativa. Ele não envia nem guarda credenciais.
const loginForm = document.querySelector("#demo-login");

if (loginForm) {
  const identifier = loginForm.querySelector("#identifier");
  const password = loginForm.querySelector("#password");
  const message = loginForm.querySelector("#login-message");

  function validateField(input, errorText) {
    const valid = Boolean(input.value.trim());
    const field = input.closest(".field");
    field.classList.toggle("has-error", !valid);
    input.setAttribute("aria-invalid", String(!valid));
    field.querySelector(".field-error").textContent = valid ? "" : errorText;
    return valid;
  }

  [identifier, password].forEach((input) => {
    input.addEventListener("input", () => {
      if (input.value.trim()) validateField(input, "");
      message.className = "login-message";
      message.textContent = "";
    });
  });

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const nameIsValid = validateField(identifier, "Inscreva seu nome para continuar.");
    const passwordIsValid = validateField(password, "Escreva qualquer palavra para continuar.");

    if (!nameIsValid || !passwordIsValid) {
      message.className = "login-message is-visible";
      message.textContent = "Preencha os dois campos para abrir a prévia.";
      (nameIsValid ? password : identifier).focus();
      return;
    }

    // Não preservamos o valor: só damos tempo para a animação curta de saída.
    password.value = "";
    document.body.classList.add("is-departing");
    window.setTimeout(() => { window.location.href = "index.html"; }, 540);
  });

  const passwordToggle = loginForm.querySelector(".password-toggle");
  passwordToggle.addEventListener("click", () => {
    const showPassword = password.type === "password";
    password.type = showPassword ? "text" : "password";
    passwordToggle.setAttribute("aria-label", showPassword ? "Ocultar senha" : "Mostrar senha");
    passwordToggle.setAttribute("aria-pressed", String(showPassword));
  });
}

document.querySelectorAll("[data-demo-action]").forEach((button) => {
  button.addEventListener("click", () => {
    showToast(`${button.dataset.demoAction}: esta opção ainda não está disponível nesta prévia.`);
    closeMobileMenu();
  });
});

const sidebar = document.querySelector("#sidebar");
const menuButton = document.querySelector(".mobile-menu");
const sidebarScrim = document.querySelector(".sidebar-scrim");
const mobileNavigation = window.matchMedia("(max-width: 760px)");

const hallView = document.querySelector("#hall-view");
const creatorView = document.querySelector("#creator-view");
let requestCreatorExit = null;

function closeMobileMenu({ restoreFocus = false } = {}) {
  if (!sidebar || !menuButton) return;
  sidebar.classList.remove("is-open");
  sidebar.inert = mobileNavigation.matches;
  sidebarScrim?.classList.remove("is-visible");
  sidebarScrim?.setAttribute("aria-hidden", "true");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menu");
  if (restoreFocus) menuButton.focus();
}

if (menuButton && sidebar) {
  sidebar.inert = mobileNavigation.matches;
  mobileNavigation.addEventListener("change", (event) => {
    sidebar.inert = event.matches && !sidebar.classList.contains("is-open");
    if (!event.matches) closeMobileMenu();
  });

  menuButton.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("is-open");
    sidebar.inert = !isOpen && mobileNavigation.matches;
    sidebarScrim?.classList.toggle("is-visible", isOpen);
    sidebarScrim?.setAttribute("aria-hidden", String(!isOpen));
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    if (isOpen) sidebar.querySelector(".side-link")?.focus();
  });

  sidebarScrim?.addEventListener("click", () => closeMobileMenu({ restoreFocus: true }));

  const navTitles = {
    "#hall": "SALÃO PRINCIPAL",
    "#adventurers": "MEUS HERÓIS",
    "#campaigns": "CAMPANHAS",
    "#profile": "PERFIL DO AVENTUREIRO",
  };

  sidebar.querySelectorAll(".side-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (link.dataset.demoAction || link.hasAttribute("data-open-creator")) return;
      closeMobileMenu();
      const activateLink = () => {
        sidebar.querySelectorAll(".side-link").forEach((item) => item.classList.toggle("is-active", item === link));
        const title = navTitles[link.getAttribute("href")];
        if (title) document.querySelector("#breadcrumb-title").textContent = title;
      };
      if (creatorView && !creatorView.hidden) {
        event.preventDefault();
        requestCreatorExit?.(() => {
          activateLink();
          window.location.hash = link.getAttribute("href");
        });
        return;
      }
      activateLink();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && sidebar.classList.contains("is-open")) closeMobileMenu({ restoreFocus: true });
  });
}

// O criador fica na mesma página para funcionar também por abertura local do HTML.
if (hallView && creatorView) {
const stepPanels = [...document.querySelectorAll("[data-step-panel]")];
const progressItems = [...document.querySelectorAll("[data-progress]")];
const previousButton = document.querySelector("[data-previous]");
const nextButton = document.querySelector("[data-next]");
const finishButton = document.querySelector("[data-finish]");
const heroName = document.querySelector("#hero-name");
const heroLevel = document.querySelector("#hero-level");
const heroOrigin = document.querySelector("#hero-origin");
const heroLook = document.querySelector("#hero-look");
const heroPersonality = document.querySelector("#hero-personality");
const heroHistory = document.querySelector("#hero-history");
const creatorState = {
  step: 0,
  name: "",
  level: 1,
  ancestry: "Humana",
  className: "Guerreiro",
  origin: "Viajante errante",
  portrait: "Guerreiro",
  look: "",
  personality: "",
  story: "",
};

function setCreatorStep(step, direction = "next") {
  creatorState.step = Math.max(0, Math.min(3, step));
  stepPanels.forEach((panel, index) => {
    panel.hidden = index !== creatorState.step;
    panel.classList.remove("is-entering-from-next", "is-entering-from-previous");
    if (index === creatorState.step) {
      panel.classList.add(direction === "next" ? "is-entering-from-next" : "is-entering-from-previous");
    }
  });
  progressItems.forEach((item, index) => {
    item.classList.toggle("is-current", index === creatorState.step);
    item.classList.toggle("is-complete", index < creatorState.step);
    if (index === creatorState.step) item.setAttribute("aria-current", "step");
    else item.removeAttribute("aria-current");
  });
  previousButton.hidden = creatorState.step === 0;
  nextButton.hidden = creatorState.step === 3;
  finishButton.hidden = creatorState.step !== 3;
  document.querySelector("#step-count").textContent = `${creatorState.step + 1} / 4`;
  stepPanels[creatorState.step].querySelector("h2").focus({ preventScroll: true });
}

function openCreator() {
  if (!hallView || !creatorView) return;
  editingCharacterId = null;
  finishButton.firstChild.textContent = "Inscrever no grimório ";
  hallView.hidden = true;
  creatorView.hidden = false;
  document.querySelector("#breadcrumb-title").textContent = "FORJAR PERSONAGEM";
  closeMobileMenu();
  setCreatorStep(0);
  window.scrollTo({ top: 0, behavior: "smooth" });
  heroName.focus({ preventScroll: true });
}

function closeCreator() {
  creatorView.hidden = true;
  hallView.hidden = false;
  document.querySelector("#breadcrumb-title").textContent = "SALÃO PRINCIPAL";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

let onCreatorExitConfirmed = () => {};

function requestCloseCreator(onConfirmed = () => {}) {
  if (!exitDialog || exitDialog.open) return;
  onCreatorExitConfirmed = onConfirmed;
  exitDialog.showModal();
}
requestCreatorExit = requestCloseCreator;

const exitDialog = document.querySelector("#creator-exit-dialog");
document.querySelectorAll("[data-close-creator]").forEach((button) => button.addEventListener("click", () => requestCloseCreator()));
document.querySelector("[data-confirm-exit]").addEventListener("click", () => {
  exitDialog.close();
  resetCreator();
  closeCreator();
  onCreatorExitConfirmed();
  onCreatorExitConfirmed = () => {};
});
document.querySelector("[data-cancel-exit]").addEventListener("click", () => {
  exitDialog.close();
  onCreatorExitConfirmed = () => {};
});
exitDialog.addEventListener("cancel", () => { onCreatorExitConfirmed = () => {}; });

document.querySelectorAll("[data-open-creator]").forEach((button) => button.addEventListener("click", openCreator));

function currentAttributeValues() {
  const abbreviations = { strength: "FOR", dexterity: "DES", constitution: "CON", intelligence: "INT", wisdom: "SAB", charisma: "CAR" };
  return Object.fromEntries([...document.querySelectorAll("[data-attribute]")].map((input) => [abbreviations[input.dataset.attribute], Number(input.value)]));
}

function updateReview() {
  document.querySelector("#review-name").textContent = creatorState.name || "Aguardando nome";
  document.querySelector("#review-kind").textContent = `${creatorState.ancestry} · ${creatorState.className}`;
  document.querySelector("#review-origin").textContent = creatorState.origin;
  document.querySelector("#review-look").textContent = creatorState.look || "Não informada";
  document.querySelector("#review-personality").textContent = creatorState.personality || "Não informada";
  document.querySelector("#review-history").textContent = creatorState.story || "Ainda não inscrita";
  const attributes = currentAttributeValues();
  document.querySelector("#review-attributes").textContent = `FOR ${attributes.FOR} · DES ${attributes.DES} · CON ${attributes.CON} · INT ${attributes.INT} · SAB ${attributes.SAB} · CAR ${attributes.CAR}`;
}

function updateCreatorPreview() {
  const safePortrait = portraitPaths[creatorState.portrait] || defaultPortraitPath;
  document.querySelector("#preview-portrait").src = safePortrait;
  document.querySelector("#preview-name").textContent = creatorState.name.trim() || "Sua próxima lenda";
  const kind = document.querySelector("#preview-kind");
  kind.replaceChildren();
  kind.append(document.createTextNode(creatorState.ancestry));
  const separator = document.createElement("i");
  separator.textContent = "·";
  kind.append(separator, document.createTextNode(creatorState.className));
  document.querySelector("#preview-origin").textContent = creatorState.origin;
  document.querySelector("#choice-insight").textContent = `${ancestryLore[creatorState.ancestry]} ${classLore[creatorState.className]}`;
  updateReview();
}

const classGallery = document.querySelector(".class-gallery");
Object.keys(classLore).forEach((className) => {
  const option = document.createElement("button");
  option.type = "button";
  option.className = "class-option";
  option.dataset.value = className;
  option.setAttribute("aria-pressed", String(className === creatorState.className));
  if (className === creatorState.className) option.classList.add("is-selected");

  const portrait = document.createElement("img");
  portrait.src = portraitPaths[className] || defaultPortraitPath;
  portrait.alt = "";
  portrait.loading = "lazy";
  portrait.decoding = "async";
  const label = document.createElement("span");
  label.textContent = className;
  option.append(portrait, label);
  classGallery.append(option);
});

document.querySelectorAll("[data-choice-group]").forEach((group) => {
  group.addEventListener("click", (event) => {
    const option = event.target.closest("[data-value]");
    if (!option) return;
    group.querySelectorAll("[data-value]").forEach((button) => {
      const isSelected = button === option;
      button.classList.toggle("is-selected", isSelected);
      button.setAttribute("aria-pressed", String(isSelected));
    });

    const property = group.dataset.choiceGroup;
    creatorState[property] = option.dataset.value;
    if (property === "className") {
      creatorState.portrait = option.dataset.value;
      const previewFrame = document.querySelector(".preview-frame");
      previewFrame.classList.remove("is-changing");
      void previewFrame.offsetWidth;
      previewFrame.classList.add("is-changing");
    }
    const hint = document.querySelector(`#${property === "className" ? "class" : property}-hint`);
    if (hint) hint.textContent = `Selecionada: ${option.dataset.value}`;
    updateCreatorPreview();
  });
});

heroName.addEventListener("input", () => {
  creatorState.name = heroName.value;
  heroName.setAttribute("aria-invalid", "false");
  document.querySelector("#name-error").textContent = "";
  updateCreatorPreview();
});
heroLevel.addEventListener("input", () => {
  heroLevel.setAttribute("aria-invalid", "false");
  document.querySelector("#level-error").textContent = "";
});
heroOrigin.addEventListener("change", () => { creatorState.origin = heroOrigin.value; updateCreatorPreview(); });
heroLook.addEventListener("input", () => { creatorState.look = heroLook.value.trim(); updateReview(); });
heroPersonality.addEventListener("input", () => { creatorState.personality = heroPersonality.value.trim(); updateReview(); });
heroHistory.addEventListener("input", () => { creatorState.story = heroHistory.value.trim(); updateReview(); });
document.querySelectorAll("[data-attribute]").forEach((input) => input.addEventListener("input", () => {
  document.querySelector("#attributes-error").textContent = "";
  updateReview();
}));

function validateCurrentStep() {
  if (creatorState.step === 0) {
    creatorState.name = heroName.value.trim();
    const nameError = document.querySelector("#name-error");
    const levelError = document.querySelector("#level-error");
    const validName = creatorState.name.length > 0;
    const level = Number(heroLevel.value);
    const validLevel = Number.isInteger(level) && level >= 1 && level <= 20;
    heroName.setAttribute("aria-invalid", String(!validName));
    heroLevel.setAttribute("aria-invalid", String(!validLevel));
    nameError.textContent = validName ? "" : "Escreva um nome antes de virar a página.";
    levelError.textContent = validLevel ? "" : "Use um nível inteiro entre 1 e 20.";
    if (!validName) heroName.focus();
    else if (!validLevel) heroLevel.focus();
    creatorState.level = level;
    return validName && validLevel;
  }

  if (creatorState.step === 2) {
    const invalid = [...document.querySelectorAll("[data-attribute]")].some((input) => {
      const value = Number(input.value);
      return !Number.isInteger(value) || value < 3 || value > 20;
    });
    const error = document.querySelector("#attributes-error");
    error.textContent = invalid ? "Use números inteiros entre 3 e 20 em todos os atributos." : "";
    if (invalid) document.querySelector("[data-attribute]:invalid")?.focus();
    return !invalid;
  }

  return true;
}

nextButton.addEventListener("click", () => {
  if (validateCurrentStep()) {
    setCreatorStep(creatorState.step + 1, "next");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});
previousButton.addEventListener("click", () => {
  setCreatorStep(creatorState.step - 1, "previous");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const characterList = document.querySelector("#character-list");
const emptyGrimoire = document.querySelector("#empty-grimoire");

function createCharacterRow(character, index) {
  const article = document.createElement("article");
  article.className = "character-row is-arriving";
  article.dataset.character = character.id;

  const portrait = document.createElement("div");
  portrait.className = "portrait-frame";
  const image = document.createElement("img");
  image.src = portraitPaths[character.portrait] || defaultPortraitPath;
  image.alt = `Retrato demonstrativo de ${character.name}`;
  portrait.append(image);

  const number = document.createElement("div");
  number.className = "character-number";
  number.textContent = String(index + 1).padStart(2, "0");

  const bio = document.createElement("div");
  bio.className = "character-bio";
  const classification = document.createElement("span");
  classification.textContent = `${character.ancestry.toLocaleUpperCase("pt-BR")} · NÍVEL ${character.level}`;
  const name = document.createElement("h3");
  name.textContent = character.name;
  const detail = document.createElement("p");
  detail.textContent = `${character.className} · ${character.source === "api" ? "API local" : "demonstração"}`;
  bio.append(classification, name, detail);

  const ability = document.createElement("div");
  ability.className = "character-ability";
  const abilityLabel = document.createElement("small");
  abilityLabel.textContent = "ATRIBUTOS ILUSTRATIVOS";
  const abilityValue = document.createElement("b");
  abilityValue.textContent = "FICHA";
  ability.append(abilityLabel, abilityValue);

  const openButton = document.createElement("button");
  openButton.className = "sheet-link";
  openButton.type = "button";
  openButton.dataset.openSheet = character.id;
  openButton.append(document.createTextNode("Abrir ficha "));
  const arrow = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  arrow.setAttribute("aria-hidden", "true");
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", "#icon-arrow");
  arrow.append(use);
  openButton.append(arrow);
  article.append(portrait, number, bio, ability, openButton);
  return article;
}

function updateCharacterCount() {
  const count = characterList.querySelectorAll(".character-row").length;
  document.querySelector("#character-count").textContent = String(count).padStart(2, "0");
  characterList.hidden = count === 0;
  emptyGrimoire.hidden = count !== 0;
}

async function loadCharactersFromApi() {
  const note = document.querySelector("#local-note");
  try {
    const records = await apiRequest("/characters");
    characters = records.map(fromApiCharacter);
    apiIsAvailable = true;
    characterList.replaceChildren(...characters.map(createCharacterRow));
    note.textContent = "Personagens carregados da API local. Eles ficam na memória do servidor e somem quando ele reinicia.";
  } catch (error) {
    apiIsAvailable = false;
    note.textContent = "A API não respondeu. Estes exemplos são locais; inicie backend/start-dev.bat para carregar e salvar personagens pela API.";
    showToast("Não foi possível carregar personagens. Confira se o backend está iniciado.");
  }
  updateCharacterCount();
}

function renderAttributeGrid(attributes = {}) {
  const labels = { FOR: "Força", DES: "Destreza", CON: "Constituição", INT: "Inteligência", SAB: "Sabedoria", CAR: "Carisma" };
  const target = document.querySelector("#sheet-attributes");
  target.replaceChildren();
  Object.entries(labels).forEach(([abbreviation, label]) => {
    const stat = document.createElement("div");
    stat.className = "sheet-stat";
    const name = document.createElement("b");
    name.textContent = abbreviation;
    const value = document.createElement("span");
    value.textContent = attributes[abbreviation] ?? "—";
    stat.setAttribute("aria-label", `${label}: ${value.textContent}`);
    stat.append(name, value);
    target.append(stat);
  });
}

const sheetDialog = document.querySelector("#sheet-dialog");

function renderSheet(character) {
  document.querySelector("#sheet-portrait").src = portraitPaths[character.portrait] || defaultPortraitPath;
  document.querySelector("#sheet-name").textContent = character.name;
  document.querySelector("#sheet-kind").textContent = `${character.ancestry} · ${character.className} · Nível ${character.level}`;
  document.querySelector("#sheet-origin").textContent = character.origin || "Não informada";
  document.querySelector("#sheet-personality").textContent = character.personality || character.look || "Não informada";
  document.querySelector("#sheet-story").textContent = character.story || character.look || "Uma nova história ainda está sendo escrita.";
  renderAttributeGrid(character.attributes);
  sheetDialog.dataset.characterId = character.id;
  document.querySelector("[data-edit-character]").hidden = !apiIsAvailable;
  sheetDialog.showModal();
}

async function openSheet(characterId) {
  try {
    const character = apiIsAvailable
      ? fromApiCharacter(await apiRequest(`/characters/${encodeURIComponent(characterId)}`))
      : characters.find((entry) => entry.id === characterId);
    if (character) renderSheet(character);
  } catch (error) {
    showToast(`Não foi possível carregar a ficha: ${error.message}`);
  }
}

characterList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-open-sheet]");
  if (!button) return;
  openSheet(button.dataset.openSheet);
});
document.querySelector("[data-close-sheet]").addEventListener("click", () => sheetDialog.close());
sheetDialog.addEventListener("click", (event) => {
  if (event.target === sheetDialog) sheetDialog.close();
});

document.querySelector("[data-edit-character]").addEventListener("click", () => {
  const character = characters.find((entry) => entry.id === sheetDialog.dataset.characterId);
  if (!character || !apiIsAvailable) return;

  sheetDialog.close();
  resetCreator();
  openCreator();
  editingCharacterId = character.id;
  heroName.value = character.name;
  heroLevel.value = String(character.level);
  creatorState.name = character.name;
  creatorState.level = character.level;
  creatorState.origin = character.origin;

  const ancestryAliases = { Elfo: "Elfa", "Anão": "Anã", Humano: "Humana" };
  const ancestryValue = ancestryAliases[character.ancestry] || character.ancestry;
  const ancestryOption = document.querySelector(`[data-choice-group="ancestry"] [data-value="${CSS.escape(ancestryValue)}"]`);
  const classOption = [...document.querySelectorAll('[data-choice-group="className"] [data-value]')]
    .find((option) => option.dataset.value === character.className);
  ancestryOption?.click();
  classOption?.click();
  finishButton.firstChild.textContent = "Salvar alterações ";
  document.querySelector("#creator-title").innerHTML = "Edite a ficha <em>do aventureiro.</em>";
  updateCreatorPreview();
});

finishButton.addEventListener("click", async () => {
  if (!validateCurrentStep()) return;
  creatorState.name = heroName.value.trim();
  creatorState.level = Number(heroLevel.value);
  creatorState.origin = heroOrigin.value;
  creatorState.look = heroLook.value.trim();
  creatorState.personality = heroPersonality.value.trim();
  creatorState.story = heroHistory.value.trim();
  const payload = {
    name: creatorState.name,
    race: creatorState.ancestry,
    class_name: creatorState.className,
    level: creatorState.level,
  };

  const characterBeingEdited = editingCharacterId;
  const path = characterBeingEdited
    ? `/characters/${encodeURIComponent(characterBeingEdited)}`
    : "/characters";
  try {
    const savedRecord = await apiRequest(path, {
      method: characterBeingEdited ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const character = fromApiCharacter(savedRecord);
    if (characterBeingEdited) {
      const index = characters.findIndex((entry) => entry.id === character.id);
      if (index === -1) throw new Error("O personagem atualizado não apareceu na lista carregada.");
      characters[index] = character;
      characterList.querySelector(`[data-character="${character.id}"]`)
        ?.replaceWith(createCharacterRow(character, index));
    } else {
      characters.push(character);
      characterList.append(createCharacterRow(character, characters.length - 1));
    }
    updateCharacterCount();
    resetCreator();
    closeCreator();
    const newCharacterRow = document.querySelector(`[data-character="${character.id}"]`);
    newCharacterRow?.scrollIntoView({ behavior: "smooth", block: "center" });
    newCharacterRow?.querySelector("[data-open-sheet]")?.focus({ preventScroll: true });
    showToast(`${character.name} foi ${characterBeingEdited ? "atualizado" : "criado"} na API local. Os dados ainda somem quando o servidor reinicia.`);
  } catch (error) {
    showToast(`Não foi possível salvar pela API: ${error.message}`);
    return;
  }
});

function resetCreator() {
  heroName.value = "";
  heroLevel.value = "1";
  heroOrigin.selectedIndex = 0;
  heroLook.value = "";
  heroPersonality.value = "";
  heroHistory.value = "";
  creatorState.name = "";
  creatorState.level = 1;
  creatorState.ancestry = "Humana";
  creatorState.className = "Guerreiro";
  creatorState.origin = heroOrigin.value;
  creatorState.portrait = "Guerreiro";
  creatorState.look = "";
  creatorState.personality = "";
  creatorState.story = "";
  editingCharacterId = null;
  document.querySelector("#creator-title").innerHTML = "Forje uma nova <em>lenda.</em>";
  finishButton.firstChild.textContent = "Inscrever no grimório ";
  document.querySelector("#class-hint").textContent = "Guerreiro";
  document.querySelector("#ancestry-hint").textContent = "Escolha uma";
  const defaultChoices = { ancestry: "Humana", className: "Guerreiro" };
  document.querySelectorAll("[data-choice-group]").forEach((group) => {
    group.querySelectorAll("[data-value]").forEach((button, index) => {
      const selected = button.dataset.value === (defaultChoices[group.dataset.choiceGroup] || group.querySelector("[data-value]")?.dataset.value);
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  });
  document.querySelectorAll("[data-attribute]").forEach((input) => { input.value = input.defaultValue; });
  updateCreatorPreview();
}

updateCreatorPreview();
updateCharacterCount();
loadCharactersFromApi();
}
