// Variables globales
let currentModule = "home"
let currentView = "home"
let currentModuleData = null
let currentTopicData = null
let sidebarVisible = true
let notificationsContainer = null
let actualCurrentModule = "home" // Nueva variable para rastrear el módulo actual real

// Variables para Speech Synthesis
let utterance = null
let isSpeaking = false
let listenBtn = null


const topicsWithoutAudio = [
    "1-3-conversion", // Lista de subtemas sin audio
    "2-2-que-es",
    "2-3-que-es",
    "2-4-que-es",
    "2-5-que-es",
    "2-6-que-es",
    "2-7-que-es",
    "2-7-evaluacion"
];

// Función mejorada para controlar la visibilidad del botón de audio
function toggleAudioButton(moduleId, topicId, subtopicId) {
    const contentKey = `${moduleId}-${topicId}-${subtopicId}`;
    const listenBtn = document.getElementById("listenBtn");
    
    if (!listenBtn) return;
    
    // Detener cualquier audio que esté reproduciéndose al cambiar de tema
    if (topicsWithoutAudio.includes(contentKey)) {
        stopSpeech();
        listenBtn.style.display = "none";
    } else {
        listenBtn.style.display = "inline-block"; 
    }
}

// Banco de preguntas personalizado para cada tema
const customTestQuestions = {
  // Módulo 1
  "1-1": [
    // // Módulo 1, Tema 1
    // {
    //   question: "¿Qué es una variable de proceso?",
    //   options: [
    //     "Un factor que se mantiene constante",
    //     "Un parámetro que se controla durante un proceso",
    //     "Una medida de tiempo",
    //     "Un tipo de instrumento",
    //   ],
    //   correct: 1,
    // },
  ],
    "1-2": [
  ],

  "1-3": [
    // Módulo 1, Tema 3
    {
      question: "Responde las preguntas sobre conversión de unidades de temperatura. Se trata de ejercicios de conversión entre °C, °F y K, preguntas de verdadero o falso y selección múltiple.<br><br>1- Convierte 100°C a Fahrenheit usando la fórmula: <br><br>°F = (°C × 9⁄5) + 32",
      options: ["87,5 °F", "212 °F ", "148 °F", "210 °C"],
      correct: 1,
      explanation: "Aplicando la formula:<br> (100 × 9/5) + 32 = 180 + 32 = 212 °F",
    },
    {
      question: "La temperatura de congelación del agua en Kelvin es 0 K.",
      options: ["Verdadero", "Falso"],
      correct: 1,
      explanation: "El cero Kelvin (0 K) representa el cero absoluto, que es la temperatura más baja posible, donde las partículas tienen mínima energía térmica. La temperatura de congelación del agua es de 273,5 K, equivalente a 0 °C, no 0 K.",
    },
    {
      question: "100°F es mayor que 40°C",
      options: ["Verdadero", "Falso"],
      correct: 1,
      explanation: "Para comparar, convertimos 100 °F a °C con la fórmula:<br> °C = ((°F − 32) × 5) / 9 = ((100 − 32) × 5) / 9 = (68 × 5) / 9 ≈ 37,8 °C <br> Por lo tanto, 100 °F < 40 °C, lo que hace falsa la afirmación.",
    },
    {
      question: "¿Qué afirmación es correcta sobre la relación entre °C y K?",
      options: [
        "El valor en °C siempre es mayor que en K",
        "Ambas escalas tienen la misma magnitud numérica",
        "El valor en K siempre es mayor que en °C por 273,15 unidades",
        "Para convertir de °C a K se debe restar 273,15",
      ],
      correct: 2,
      explanation: "La relación entre grados Celsius y Kelvin es:<br> K = °C + 273,15 <br> Esto significa que cada valor en °C es siempre 273,15 unidades menor que su equivalente en K, ya que el cero de la escala Kelvin comienza donde la energía térmica es mínima, mientras que en °C se basa en el punto de congelación del agua.",
    },
    {
      question:
        "¿Cuál de las siguientes afirmaciones sobre la conversión de diferencias de temperatura (∆T) entre °C y K es correcta?",
      options: [
        "Un cambio de 1 °C es igual a un cambio de 1 K",
        "Un cambio de 1 °C equivale a un cambio de 273,15 K",
        "Un cambio de 1 K equivale a un cambio de 0 °C",
        "Para convertir ∆°C a ∆K se debe sumar 273,15",
      ],
      correct: 0,
      explanation:
        "Aunque los puntos de inicio de las escalas Celsius y Kelvin son distintos, la magnitud de cambio entre ambas es la misma. Es decir: <br> ΔT = 1 °C = 1 K <br> Esto solo aplica a diferencias de temperatura, no a valores absolutos. Por ejemplo, un aumento de 10 °C implica un aumento de 10 K.",
    },
  ],
  "1-4": [
    // Módulo 1, Tema 4
    {
      question:
        "Seleccione las respuestas correctas:<br><br>Una corriente de oxígeno (O₂) entra a un reactor con flujo molar de 10 mol/min. ¿Cuál es su flujo másico en g/min?",
      options: ["320 g/min", "0,32 g/min", "3,2 g/min", "160 g/min"],
      correct: 0,
      explanation: "Datos:<br>- ṅ = 10 mol/min <br> - Mₒ₂ = 32 g/mol<br>Cálculo:<br>ṁ = ṅ × M = 10 × 32 = 320 g/min",
    },
    {
      question: "Se suministra un flujo de nitrógeno (N₂) a razón de 22,4 L/min en condiciones estándar (0 °C y 1 atm). <br><br>¿Cuál es el flujo molar? <br><br>DATO: 1 mol de gas ocupa 22,4 L en condiciones estándar.",
      options: ["0,5 mol/min", "2 mol/min", "1 mol/min", "10 mol/min"],
      correct: 2,
      explanation: "En condiciones estándar (0 °C, 1 atm) 1 mol de gas ocupa 22,4 L.<br><br>ṅ = Volumen / Volumen por mol = (22,4 L/min) / (22,4 L/mol) = 1,0 mol/min",
    },
    {
      question: `Ordena de mayor a menor los siguientes flujos másicos:<br><br>
        A: 5 mol/min de CH₄ (PM = 16,0 g/mol)<br>
        B: 2 mol/min de CO₂ (PM = 44,0 g/mol)<br>
        C: 3 mol/min de O₂ (PM = 32,0 g/mol)`,
      options: ["B > C > A", "C > B > A", "B > A > C", "A > B > C"],
      correct: 1,
      explanation:
        "Calculamos flujo másico para cada caso:<br>A: 5 mol/min × 16 g/mol = 80 g/min<br>B: 2 mol/min × 44 g/mol = 88 g/min<br>C: 3 mol/min × 32 g/mol = 96 g/min<br><br>Orden de mayor a menor:<br>C (96) > B (88) > A (80)",
    },
    {
      question: "Dióxido de carbono (CO₂) entra a una columna de absorción a un flujo másico de 88 g/min. <br><br>¿Cuál es el flujo molar? <br><br> Dato: Masa molar del CO₂ = 44,0 g/mol .",
      options: ["4 mol/min", "2 mol/min", "1 mol/min", "0,5 mol/min"],
      correct: 1,
      explanation:
        "Datos:<br>- ṁ = 88 g/min<br>- M_CO₂ = 44 g/mol<br><br>ṅ = ṁ / M = (88 g/min) / (44,0 g/mol) = 2,0 mol/min",
    },
  ],
  // Módulo 2
  "2-1": [
    // Módulo 2, Tema 1
    {
      question: "¿Qué caracteriza a las tormentas en el mar?",
      options: ["Vientos suaves", "Condiciones climáticas extremas", "Aguas tranquilas", "Cielos despejados"],
      correct: 1,
    },
    {
      question: "¿Cuál es la primera señal de una tormenta?",
      options: [
        "Cambios en la presión atmosférica",
        "Aumento de la temperatura",
        "Disminución del viento",
        "Cielo completamente azul",
      ],
      correct: 0,
    },
    {
      question: "¿Qué equipo es esencial durante una tormenta?",
      options: ["Sombrillas", "Equipos de seguridad y navegación", "Ropa ligera", "Instrumentos musicales"],
      correct: 1,
    },
    {
      question: "¿Cómo se debe navegar en baja visibilidad?",
      options: ["A máxima velocidad", "Con instrumentos de navegación y precaución", "Sin instrumentos", "Solo de día"],
      correct: 1,
    },
    {
      question: "¿Qué protocolo seguir en tormentas severas?",
      options: [
        "Ignorar la tormenta",
        "Buscar refugio y seguir protocolos de seguridad",
        "Acelerar el viaje",
        "Apagar todos los equipos",
      ],
      correct: 1,
    },
  ],
  // AGREGADO: Preguntas para el tema de navegación nocturna
  "2-4": [
    {
      question: "¿Cuál es la principal ventaja de la navegación nocturna?",
      options: [
        "Mayor velocidad",
        "Movimientos sigilosos y no detectados",
        "Mejor visibilidad",
        "Menos peligros marinos",
      ],
      correct: 1,
    },
    {
      question: "¿Qué constelación es más importante para la navegación nocturna?",
      options: ["Orión", "La Osa Mayor y la Estrella Polar", "Casiopea", "La Cruz del Sur"],
      correct: 1,
    },
    {
      question: "¿Cuál es un peligro específico de la navegación nocturna?",
      options: [
        "Exceso de luz solar",
        "Colisiones con obstáculos no visibles",
        "Demasiado viento",
        "Aguas muy tranquilas",
      ],
      correct: 1,
    },
    {
      question: "¿Qué técnica se usa para navegación silenciosa?",
      options: [
        "Motores a máxima potencia",
        "Velas silenciosas y remos amortiguados",
        "Música alta para distraer",
        "Luces brillantes",
      ],
      correct: 1,
    },
    {
      question: "¿Cómo se aprovechan las corrientes nocturnas?",
      options: [
        "Se ignoran completamente",
        "Se usan para movimiento eficiente y silencioso",
        "Solo se usan de día",
        "Se evitan siempre",
      ],
      correct: 1,
    },
  ],
}

// Datos de los módulos con soporte para imágenes (solo 2 módulos)
const modulesData = {
  1: {
    title: "PARTE 1: VARIABLES DE PROCESO",
    subtitle: "Fundamentos del Control de Procesos",
    topics: [
      {
        id: 1,
        title: "Tu misión",
        icon: "fas fa-anchor",
        image: "images/15.jpg", // Imagen para el punto del mapa
        content: {
          title: '',
          text: '',
          steps: [],
        },
        sidebarButtons: [
          { id: "que-es", label: "Introducción", icon: "fas fa-question-circle", type: "content" },
          { id: "variablesP", label: "Las variables de proceso", icon: "fas fa-bullseye", type: "content" },
          
        ],
      },
      {
        id: 2,
        title: "Isla de la presión",
        icon: "fas fa-anchor",
        image: "images/10.jpg", // Imagen para el punto del mapa
        content: {
          title: '',
          text: '',
          steps: [],
        },
        sidebarButtons: [
          { id: "que-es", label: "Isla de la presión", icon: "fas fa-stopwatch", type: "content" },
          { id: "Cpresion", label: "¿Qué es la presión?", icon: "fas fa-stopwatch", type: "content" },
          { id: "Tpresion", label: "Tipos de presión", icon: "fas fa-stopwatch", type: "content" },
          { id: "medicion", label: "Instrumentos de medición", icon: "fas fa-stopwatch", type: "content" },
          { id: "desafio", label: "Desafío", icon: "fas fa-lightbulb", type: "content" },
          // { id: "test", label: "Realizar Test", icon: "fas fa-clipboard-check", type: "test" },
        ],
      },
      {
        id: 3,
        title: "Isla del fuego eterno",
        icon: "fas fa-book-open",
        image: "images/2.jpg",
        formUrl: "https://forms.gle/AsYBiHssKN7RQxXN9",
        content: {
          title: "",
          text: "",
          steps: [],
        },
        sidebarButtons: [
          { id: "que-es", label: "El Desafío de Calor'Bel", icon: "fas fa-question-circle", type: "content" },
          { id: "islaC", label: "Isla del fuego eterno", icon: "fas fa-fire", type: "content" },
          { id: "conversion", label: "Conversión de temperaturas", icon: "fas fa-fire", type: "content" },
          { id: "Vtemperatura", label: "Temperatura", icon: "fas fa-fire", type: "content" },
          { id: "test", label: "Desafío", icon: "fas fa-lightbulb", type: "test" },
        ],
      },
      {
        id: 4,
        title: "Isla del gran flujo",
        icon: "fas fa-tools",
        image: "images/3.jpg",
        formUrl: "https://forms.gle/w8AGxxd2VTMCaedr8",
        content: {
          title: "",
          text: "",
          steps: [],
        },
        sidebarButtons: [
          { id: "que-es", label: "Prueba del capitán Venturi", icon: "fas fa-question-circle", type: "content" },
          { id: "Iflujo", label: "Isla del gran flujo", icon: "fas fa-tint", type: "content" },
          { id: "Vflujo", label: "Flujo", icon: "fas fa-tint", type: "content" },
          { id: "Tflujo", label: "Tipos de flujo", icon: "fas fa-tint", type: "content" },
          { id: "test", label: "Desafío", icon: "fas fa-lightbulb", type: "test" },
        ],
      },
      {
        id: 5,
        title: "Isla de la concentración",
        icon: "fas fa-ship",
        image: "images/5.jpg",
        content: {
          title: "",
          text: "",
          steps: [],
        },
        sidebarButtons: [
          { id: "que-es", label: "El Reto de Alquimix", icon: "fas fa-question-circle", type: "content" },
          { id: "concentracion", label: "Isla de la concentración", icon: "fas fa-flask	", type: "content" },
          { id: "expresar", label: "Formas de expresar la concentración", icon: "fas fa-flask	", type: "content" },
          { id: "VideoC", label: "Concentración", icon: "fas fa-flask", type: "content" },
          { id: "desafioA", label: "Desafío", icon: "fas fa-lightbulb", type: "content" },
        ],
      },
      {
        id: 6,
        title: "Isla del Gran Saber",
        icon: "fas fa-compass",
        image: "images/8.jpg",
        content: {
          title: "",
          text: "",
          steps: [],
        },
        sidebarButtons: [
          { id: "que-es", label: "La prueba del One Process", icon: "fas fa-question-circle", type: "content" },
          { id: "proceso", label: "Proceso real", icon: "fas fa-book-open", type: "content" },
          { id: "desafioG", label: "Desafío", icon: "fas fa-lightbulb", type: "content" },
        ],
      },
    ],
  },
  2: {
    title: "PARTE 2: BALANCES CON REACCIÓN QUÍMICA",
    subtitle: "Pruebas y Aventuras Peligrosas",
    topics: [
      {
        id: 1,
        title: "Tu misión  ",
        icon: "fas fa-bolt",
        image: "images2/10.jpeg",
        content: {
          title: "",
          text: "",
          steps: [
          ],
        },
        sidebarButtons: [
          { id: "que-es", label: 'Leyenda "Monarca de los procesos"', icon: "fas fa-question-circle", type: "content" },
          { id: "video-brc", label: 'Balances con Reacción química', icon: "fas fa-bullseye", type: "content" },
        ],
      },
      {
        id: 2,
        title: "Isla grados de libertad",
        icon: "fas fa-sword",
        image: "images2/12.jpeg",
        content: {
          title: "",
          text: "",
          steps: [
          ],
        },
        sidebarButtons: [
          { id: "que-es", label: "Grados de libertad", icon: "fas fa-question-circle", type: "content" },
        ],
      },
      {
        id: 3,
        title: "Isla velocidad <br>de reacción",
        icon: "fas fa-dragon",
        image: "images2/13.jpeg",
        content: {
          title: "",
          text: "",
          steps: [
          ],
        },
        sidebarButtons: [
          { id: "que-es", label: "Velocidad de reacción", icon: "fas fa-question-circle", type: "content" },
        ],
      },
      {
        id: 4,
        title: "Isla conversión",
        icon: "fas fa-moon",
        image: "images2/14.jpeg",
        content: {
          title: "",
          text: "",
          steps: [
          ],
        },
        sidebarButtons: [
          { id: "que-es", label: "Conversión", icon: "fas fa-question-circle", type: "content" },
        ],
      },
      {
        id: 5,
        title: "Isla reactivo límite <br>y en exceso",
        icon: "fas fa-life-ring",
        image: "images2/15.jpg",
        content: {
          title: "",
          text: "",
          steps: [
          ],
        },
        sidebarButtons: [
          { id: "que-es", label: "Reactivo límite y en exceso", icon: "fas fa-question-circle", type: "content" },
        ],
      },
      {
        id: 6,
        title: "Isla Selectividad y Rendimiento Fraccional",
        icon: "fas fa-life-ring",
        image: "images2/16.jpeg",
        content: {
          title: "",
          text: "",
          steps: [
          ],
        },
        sidebarButtons: [
          { id: "que-es", label: "Selectividad y Rendimiento Fraccional", icon: "fas fa-question-circle", type: "content" },
        ],
      },
      {
        id: 7,
        title: "Isla del gran saber",
        icon: "fas fa-life-ring",
        image: "images2/17.jpg",
        content: {
          title: "",
          text: "",
          steps: [
          ],
        },
        sidebarButtons: [
          { id: "que-es", label: "Desafío final", icon: "fas fa-question-circle", type: "content" },
        ],
      },
    ],
  },
}

// Inicialización cuando se carga la página
document.addEventListener("DOMContentLoaded", () => {
  console.log("🏴‍☠️ Iniciando La Aventura del Tesoro Pirata...")
  initializeApp()
})

// Modificar la función initializeApp para inicializar correctamente en móviles
function initializeApp() {
  setupEventListeners()

  // Inicializar el sidebar correctamente en móviles
  if (window.innerWidth <= 768) {
    const sidebar = document.querySelector(".sidebar")
    const mainContainer = document.querySelector(".main-container")
    const toggleBtn = document.getElementById("sidebarToggle")

    // Asegurar que el sidebar esté oculto inicialmente en móviles
    sidebar.classList.add("collapsed")
    mainContainer.classList.add("sidebar-collapsed")
    toggleBtn.innerHTML = '<i class="fas fa-bars"></i>'
    toggleBtn.style.display = "flex"
    sidebarVisible = false
  }

  showNotification("¡Bienvenido a la Aventura del Tesoro Pirata!", "success")
  setupAmbientMusicButton()
}

function setupEventListeners() {
  console.log("Configurando event listeners...")

  // Navegación del sidebar
  const menuBtn = document.getElementById("menuBtn")
  const homeButton = document.getElementById("homeBtn")
  const compassBtn = document.getElementById("compassBtn")
  const helpBtn = document.getElementById("helpBtn")

  // Botón Menú - Mostrar módulos
  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      console.log("Menu button clicked")
      showMenuContent()
      setActiveNavItem(this)
    })
  }

  // Botón Inicio - Mostrar página principal
  if (homeButton) {
    homeButton.addEventListener("click", function () {
      console.log("Home button clicked")
      navigateToModule("home")
      showHomeContent()
      setActiveNavItem(this)
    })
  }

  // Botón créditos
  if (compassBtn) {
    compassBtn.addEventListener("click", function () {
      console.log("Compass button clicked")
      setActiveNavItem(this)
      showCreditsSection()
    })
  }

  // Botón Ayuda
  if (helpBtn) {
    helpBtn.addEventListener("click", function () {
      console.log("Help button clicked")
      setActiveNavItem(this)
      showHelpSection()
    })
  }

  // Tarjetas de módulos
  const moduleCards = document.querySelectorAll(".module-card")
  moduleCards.forEach((card) => {
    card.addEventListener("click", function () {
      const moduleNumber = this.getAttribute("data-module")
      console.log("Module clicked:", moduleNumber)
      showModuleDetails(moduleNumber)
    })
  })

  // Paginación
  const pageButtons = document.querySelectorAll(".page-btn")
  pageButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const moduleId = this.getAttribute("data-module")
      console.log("Module button clicked:", moduleId)
      navigateToModule(moduleId)
    })
  })

  const nextButton = document.getElementById("pageNext")
  if (nextButton) {
    nextButton.addEventListener("click", () => {
      console.log("Next button clicked, current module:", actualCurrentModule)
      const modules = ["home", "1", "2"] // Solo 2 módulos
      const currentIndex = modules.indexOf(actualCurrentModule)
      if (currentIndex < modules.length - 1) {
        const nextModule = modules[currentIndex + 1]
        navigateToModule(nextModule)
      } else {
        showNotification("¡Has completado toda la aventura!", "success")
      }
    })
  }

  // Botón volver a módulos
  const backToModules = document.getElementById("backToModules")
  if (backToModules) {
    backToModules.addEventListener("click", () => {
      document.getElementById("moduleRouteContent").classList.remove("active")
      showMenuContent()
      setActiveNavItem(document.getElementById("menuBtn"))
    })
  }

  // Botón volver a ruta
  const backToRoute = document.getElementById("backToRoute")
  if (backToRoute) {
    backToRoute.addEventListener("click", () => {
      document.getElementById("topicContent").classList.remove("active")
      if (currentModuleData) {
        showModuleRoute(currentModuleData)
      }
    })
  }

  // Botón toggle del sidebar
  const sidebarToggle = document.getElementById("sidebarToggle")
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", toggleSidebar)
  }

  // Botón de escuchar tema (Speech-to-Text)
  listenBtn = document.getElementById("listenBtn")
  if (listenBtn) {
    listenBtn.addEventListener("click", toggleSpeech)
  }
}

function navigateToModule(moduleId) {
  console.log("Navigating to module:", moduleId)

  // ocultar créditos si estaban abiertos
  document.getElementById("creditsSection").classList.add("hidden")
  document.getElementById("helpSection").classList.add("hidden")
  document.getElementById("helpSection").classList.remove("active")

  // Mostrar/ocultar botón de ambientación
  const ambientBtn = document.getElementById("ambientBtn")
  if (ambientBtn) {
    ambientBtn.style.display = moduleId === "home" ? "inline-block" : "none"
  }

  // Actualizar botones de paginación
  const pageButtons = document.querySelectorAll(".page-btn")
  pageButtons.forEach((btn) => {
    btn.classList.remove("active")
    if (btn.getAttribute("data-module") === moduleId) {
      btn.classList.add("active")
    }
  })

  currentModule = moduleId
  actualCurrentModule = moduleId // Actualizar el módulo actual real

  // Navegar según el módulo
  if (moduleId === "home") {
    showNotification(`Navegando a ${getModuleName(moduleId)}`, "success")
    showHomeContent()
    setActiveNavItem(document.getElementById("homeBtn"))
  } else {
    showModuleDetails(moduleId)
  }
}

function getModuleName(moduleId) {
  const moduleNames = {
    home: "Inicio",
    1: "Módulo 1",
    2: "Módulo 2",
  }
  return moduleNames[moduleId] || "Módulo Desconocido"
}

function showModuleDetails(moduleNumber) {
  const moduleData = modulesData[moduleNumber]
  if (!moduleData) return

  currentModuleData = moduleData
  actualCurrentModule = moduleNumber.toString() // Asegurar que sea string

  // Actualizar botones de paginación para mostrar concordancia
  const pageButtons = document.querySelectorAll(".page-btn")
  pageButtons.forEach((btn) => {
    btn.classList.remove("active")
    if (btn.getAttribute("data-module") === moduleNumber) {
      btn.classList.add("active")
    }
  })

  showModuleRoute(moduleData)
  showNotification(`Explorando ${moduleData.title}...`, "success")
}

// Modificar la función showModuleRoute para manejar mejor el sidebar
function showModuleRoute(moduleData) {
  // Ocultar otras secciones
  document.getElementById("homeContent").classList.add("hidden")
  document.getElementById("menuContent").classList.remove("active")
  document.getElementById("topicContent").classList.remove("active")

  // Detener cualquier reproducción de voz al cambiar de vista
  stopSpeech()

  // Mostrar la sección de ruta del módulo
  const moduleRouteContent = document.getElementById("moduleRouteContent")
  moduleRouteContent.classList.add("active")

  // Actualizar el título
  document.getElementById("routeTitle").textContent = moduleData.title

  // Generar los puntos de la ruta
  generateRoutePoints(moduleData.topics)

  // Manejar sidebar según el dispositivo
  if (window.innerWidth <= 768) {
    closeSidebarOnMobile()
  } else {
    showSidebarInNormalView()
  }
}

function generateRoutePoints(topics) {
  const container = document.querySelector(".route-points-container")
  container.innerHTML = ""
  // const isModule2 = currentModule === "2"
  const isModule2 = topics.length === 7

  // Posiciones alternadas para crear efecto de mapa
  const positions = [
    { x: 15, y: 25 },
    { x: 30, y: 75 },
    { x: 45, y: 25 },
    { x: 60, y: 75 },
    { x: 75, y: 25 },
    { x: 87, y: 75 }, // Tema 6 - abajo
    { x: 97, y: 25 },
  ]

  topics.forEach((topic, index) => {
    const pointElement = document.createElement("div")
    pointElement.className = "route-point"
    // 👇 Ajustar posición si es el módulo 2
    let leftPercent = positions[index].x
    if (isModule2) {
      leftPercent -= 6
    }

    pointElement.style.left = leftPercent + "%"
    pointElement.style.top = positions[index].y + "%"
    pointElement.setAttribute("data-topic-id", topic.id)
    

    // 👉 Si es el primer tema, no muestres el círculo
  const pointContent = index === 0
    ? `
      <div class="point-info">
        <span class="point-title">${topic.title}</span>
      </div>
    `
    : `
      <div class="point-circle" data-number="${topic.id}">
        ${
          topic.image
            ? `<img src="${topic.image}" alt="${topic.title}" class="point-image" />`
            : `<i class="${topic.icon}"></i>`
        }
      </div>
      <div class="point-info">
        <span class="point-title">${topic.title}</span>
      </div>
    `

    pointElement.innerHTML = pointContent

    pointElement.addEventListener("click", () => {
      showTopicContent(topic)
    })

    container.appendChild(pointElement)
  })
}

// Modificar la función showTopicContent para manejar mejor el sidebar
function showTopicContent(topicData) {
  currentTopicData = topicData

  // Ocultar la vista de ruta del módulo
  document.getElementById("moduleRouteContent").classList.remove("active")

  // Mostrar la vista de contenido del tema
  const topicContent = document.getElementById("topicContent")
  topicContent.classList.add("active")

  // Actualizar el título del tema
  document.getElementById("topicTitle").textContent = `${currentModuleData.title} - ${topicData.title}`

  // Generar la lista de puntos en el sidebar
  generateTopicPointsList()

  // Cargar el contenido del tema
  loadTopicContent(topicData)

  
  // Centrar el tema seleccionado en móvil
  if (window.innerWidth <= 480) {
    setTimeout(() => {
      const topicsList = document.querySelector('.topic-points-list');
      const activeItem = topicsList?.querySelector('.topic-point-item.active');
      
      if (topicsList && activeItem) {
        // Calcula posición para centrar
        const listRect = topicsList.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();
        const scrollPos = itemRect.left - listRect.left - (listRect.width / 2) + (itemRect.width / 2);
        
        topicsList.scrollTo({
          left: scrollPos,
          behavior: 'smooth'
        });
      }
    }, 300); // Aumenté el timeout para asegurar el renderizado
  }
  hideSidebarInTopicView();
}

function generateTopicPointsList() {
  const container = document.getElementById("topicPointsList")
  container.innerHTML = ""

  currentModuleData.topics.forEach((topic) => {
    const pointItem = document.createElement("div")
    pointItem.className = `topic-point-item ${topic.id === currentTopicData.id ? "active" : ""}`
    pointItem.setAttribute("data-topic-id", topic.id)

    pointItem.innerHTML = `
      <div class="topic-point-icon">
        ${
          topic.image
            ? `<img src="${topic.image}" class="topic-icon-image" alt="${topic.title}">`
            : `<i class="${topic.icon}"></i>`
        }
      </div>
      <div class="topic-point-text">
        <span class="number">${topic.id}</span>
        <span class="title">${topic.title}</span>
      </div>
    `
    pointItem.addEventListener("click", () => {
      const newTopicData = currentModuleData.topics.find((t) => t.id === topic.id)
      if (newTopicData) {
        currentTopicData = newTopicData
        loadTopicContent(newTopicData)

        container.querySelectorAll(".topic-point-item").forEach((item) => {
          item.classList.remove("active")
        })
        pointItem.classList.add("active")

        document.getElementById("topicTitle").textContent = `${currentModuleData.title} - ${newTopicData.title}`
      }
    })

    container.appendChild(pointItem)
  })
}

function loadTopicContent(topicData) {
  generateTopicInfoSidebar()
  updateTopicMainContent("que-es")
  updateInfoButtonsState("que-es")
  // Reiniciar el botón de voz al cargar un nuevo tema
  resetSpeechButton()

  // Resetear scroll de ambos sidebars en móvil
  if (window.innerWidth <= 480) {
    // Timeout para esperar el renderizado
    setTimeout(() => {
      const resetScroll = (selector) => {
        const element = document.querySelector(selector);
        if (element) {
          element.scrollTo({
            left: 0,
            behavior: 'auto'
          });
        }
      };
      
      resetScroll('.info-buttons');      // Scroll subtemas
    }, 50);
  }
}

function generateTopicInfoSidebar() {
  const container = document.querySelector(".topic-info-sidebar .info-buttons")
  if (!container || !currentTopicData) return

  container.innerHTML = ""

  currentTopicData.sidebarButtons.forEach((button) => {
    const btnElement = document.createElement("button")
    btnElement.className = `info-btn ${button.id === "que-es" ? "active" : ""}`
    btnElement.setAttribute("data-info", button.id)
    btnElement.setAttribute("data-type", button.type)

    btnElement.innerHTML = `
      <i class="${button.icon}"></i>
      <span>${button.label}</span>
    `

    if (button.type === "test") {
      btnElement.addEventListener("click", (e) => {
        e.preventDefault()
        stopSpeech() // Detener la voz al abrir el test
        showTestModal(currentTopicData)
      })
    } else {
      btnElement.addEventListener("click", (e) => {
        e.preventDefault()
        updateTopicMainContent(button.id)
        updateInfoButtonsState(button.id)
        resetSpeechButton() // Reiniciar el botón de voz al cambiar de subtema
      })
    }

    container.appendChild(btnElement)
  })
}

function showTestModal(topicData) {
  // Obtener preguntas personalizadas para este tema específico
  const testQuestions = getCustomTestQuestions(topicData)

  const modal = document.createElement("div")
  modal.className = "modal-overlay test-modal"
  modal.innerHTML = `
    <div class="modal-content test-content">
      <div class="modal-header">
        <h3><i class="fas fa-clipboard-check"></i> Test: ${topicData.title}</h3>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body test-body">
        <div class="test-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: 0%"></div>
          </div>
          <span class="progress-text">Pregunta 1 de ${testQuestions.length}</span>
        </div>
        <div class="test-questions-container">
          ${generateTestHTML(testQuestions)}
        </div>
      </div>
      <div class="modal-footer test-footer">
        <button class="modal-btn test-prev" disabled>Anterior</button>
        <button class="modal-btn test-next">Siguiente</button>
        <button class="modal-btn test-submit" style="display: none;">Finalizar Test</button>
      </div>
    </div>
  `

  document.body.appendChild(modal)
  setupTestLogic(modal, testQuestions)

  const closeBtn = modal.querySelector(".modal-close")
  closeBtn.addEventListener("click", () => {
    document.body.removeChild(modal)
  })

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal)
    }
  })
}

// Nueva función para obtener preguntas personalizadas
function getCustomTestQuestions(topicData) {
  const moduleId = Object.keys(modulesData).find((key) =>
    modulesData[key].topics.some((topic) => topic.id === topicData.id && topic.title === topicData.title),
  )

  const questionKey = `${moduleId}-${topicData.id}`

  // Retornar preguntas personalizadas si existen, sino usar preguntas genéricas
  return customTestQuestions[questionKey] || generateGenericTestQuestions(topicData)
}

// Función de respaldo para generar preguntas genéricas
function generateGenericTestQuestions(topicData) {
  return [
    {
      question: `¿Cuál es el concepto principal de ${topicData.title}?`,
      options: [
        "Una técnica básica de navegación",
        topicData.content.title,
        "Un tipo de embarcación pirata",
        "Una herramienta de medición",
      ],
      correct: 1,
    },
    {
      question: `¿Cuál de los siguientes es un paso importante en ${topicData.title}?`,
      options: [
        topicData.content.steps[0],
        "Contar monedas de oro",
        "Limpiar la cubierta del barco",
        "Cantar canciones piratas",
      ],
      correct: 0,
    },
    {
      question: `¿Por qué es importante dominar ${topicData.title}?`,
      options: [
        "Para impresionar a otros piratas",
        "Para encontrar más tesoros",
        "Para desarrollar habilidades esenciales de navegación pirata",
        "Para decorar el barco",
      ],
      correct: 2,
    },
    {
      question: `¿Cuál es una aplicación práctica de ${topicData.title}?`,
      options: [
        "Decorar el barco con banderas",
        "Aplicación en navegación diaria y expediciones",
        "Contar historias a la tripulación",
        "Limpiar las velas del barco",
      ],
      correct: 1,
    },
    {
      question: `¿Qué recursos son necesarios para ${topicData.title}?`,
      options: [
        "Solo buena suerte",
        "Herramientas básicas, materiales de apoyo y conocimiento específico",
        "Un loro parlante",
        "Muchas monedas de oro",
      ],
      correct: 1,
    },
  ]
}

function generateTestHTML(questions) {
  return questions
    .map(
      (q, index) => `
    <div class="test-question ${index === 0 ? "active" : ""}" data-question="${index}">
      <h4 class="question-title">${q.question}</h4>
      <div class="question-options">
        ${q.options
          .map(
            (option, optIndex) => `
          <label class="option-label">
            <input type="radio" name="question_${index}" value="${optIndex}">
            <span class="option-text">${option}</span>
          </label>
        `,
          )
          .join("")}
      </div>
    </div>
  `,
    )
    .join("")
}

function setupTestLogic(modal, questions) {
  let currentQuestion = 0;
  const answers = {};

  const prevBtn = modal.querySelector(".test-prev");
  const nextBtn = modal.querySelector(".test-next");
  const submitBtn = modal.querySelector(".test-submit");
  const progressFill = modal.querySelector(".progress-fill");
  const progressText = modal.querySelector(".progress-text");

  function updateProgress() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    progressFill.style.width = progress + "%";
    progressText.textContent = `Pregunta ${currentQuestion + 1} de ${questions.length}`;
  }

  function showQuestion(index) {
    const questionElements = modal.querySelectorAll(".test-question");
    questionElements.forEach((el, i) => {
      el.classList.toggle("active", i === index);
    });

    // Controlar visibilidad de botones
    prevBtn.disabled = index === 0;
    prevBtn.style.opacity = index === 0 ? "0.5" : "1";

    if (index === questions.length - 1) {
      nextBtn.style.display = "none";
      submitBtn.style.display = "flex";
      // Deshabilitar submit si no hay respuesta
      const selectedOption = modal.querySelector(`input[name="question_${currentQuestion}"]:checked`);
      submitBtn.disabled = !selectedOption;
      submitBtn.style.opacity = !selectedOption ? "0.5" : "1";
    } else {
      nextBtn.style.display = "flex";
      submitBtn.style.display = "none";
      // Deshabilitar next si no hay respuesta
      const selectedOption = modal.querySelector(`input[name="question_${currentQuestion}"]:checked`);
      nextBtn.disabled = !selectedOption;
      nextBtn.style.opacity = !selectedOption ? "0.5" : "1";
    }

    updateProgress();
  }

  // Event listener para cambios en las opciones de respuesta
  const optionInputs = modal.querySelectorAll('input[type="radio"]');
  optionInputs.forEach(input => {
    input.addEventListener("change", () => {
      // Habilitar el botón correspondiente cuando se selecciona una respuesta
      if (currentQuestion === questions.length - 1) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
      } else {
        nextBtn.disabled = false;
        nextBtn.style.opacity = "1";
      }
    });
  });

  nextBtn.addEventListener("click", () => {
    const selectedOption = modal.querySelector(`input[name="question_${currentQuestion}"]:checked`);
    if (!selectedOption) {
      showNotification("Por favor selecciona una respuesta antes de continuar", "error");
      return;
    }

    answers[currentQuestion] = Number.parseInt(selectedOption.value);
    
    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      showQuestion(currentQuestion);
    }
  });

  prevBtn.addEventListener("click", () => {
    if (currentQuestion > 0) {
      currentQuestion--;
      showQuestion(currentQuestion);
    }
  });

  submitBtn.addEventListener("click", () => {
    const selectedOption = modal.querySelector(`input[name="question_${currentQuestion}"]:checked`);
    if (!selectedOption) {
      showNotification("Por favor responde esta pregunta antes de finalizar el test", "error");
      return;
    }

    // Guardar la última respuesta
    answers[currentQuestion] = Number.parseInt(selectedOption.value);

    // Verificar si todas las preguntas fueron respondidas
    const unansweredQuestions = questions.map((_, index) => index)
      .filter(index => answers[index] === undefined);

    if (unansweredQuestions.length > 0) {
      showNotification(`Tienes ${unansweredQuestions.length} pregunta(s) sin responder. Por favor respóndelas antes de finalizar.`, "error");
      // Ir a la primera pregunta sin responder
      currentQuestion = unansweredQuestions[0];
      showQuestion(currentQuestion);
      return;
    }

    // Todas respondidas - mostrar resultados
    const results = calculateTestResults(questions, answers);
    showTestResults(modal, results);
  });

  // Mostrar la primera pregunta
  showQuestion(0);
}

function calculateTestResults(questions, answers) {
  let correct = 0
  const total = questions.length

  questions.forEach((question, index) => {
    if (answers[index] === question.correct) {
      correct++
    }
  })

  const percentage = Math.round((correct / total) * 100)

  let grade, message, icon

  if (percentage >= 90) {
    grade = "Capitán Pirata"
    message = "¡Excelente! Dominas completamente este tema."
    icon = "fas fa-crown"
  } else if (percentage >= 70) {
    grade = "Pirata Experimentado"
    message = "¡Muy bien! Tienes un buen conocimiento del tema."
    icon = "fas fa-star"
  } else if (percentage >= 50) {
    grade = "Pirata Aprendiz"
    message = "Bien, pero necesitas repasar algunos conceptos."
    icon = "fas fa-anchor"
  } else {
    grade = "Grumete"
    message = "Necesitas estudiar más este tema antes de continuar."
    icon = "fas fa-ship"
  }

  return { correct, total, percentage, grade, message, icon }
}

// funcion con formularios, respuestas correctas, si el porcentjae es mayor a 75 se habilitan los botones de siguiente y registrar asistencia

function showTestResults(modal, results) {
  const modalBody = modal.querySelector(".modal-body")
  const modalFooter = modal.querySelector(".modal-footer")

  // Obtener las preguntas del test actual
  const testQuestions = getCustomTestQuestions(currentTopicData)

  modalBody.innerHTML = `
    <div class="test-results">
      <div class="result-icon">
        <i class="${results.icon}"></i>
      </div>
      <h3 class="result-grade">${results.grade}</h3>
      <div class="result-score">
        <span class="score-number">${results.percentage}%</span>
        <span class="score-detail">${results.correct} de ${results.total} correctas</span>
      </div>
      <p class="result-message">${results.message}</p>
      <div class="result-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${results.percentage}%"></div>
        </div>
      </div>
      <div class="answers-explanation" style="display: none; margin-top: 20px;">
        <h4>Respuestas Correctas:</h4>
        ${generateAnswersExplanation(testQuestions)}
      </div>
    </div>
  `

  // Obtener el URL del formulario para este tema (si existe)
  const formUrl = currentTopicData.formUrl || "https://forms.gle/dqMbnZui6SNpceRMA?embedded=true"

  // Crear botones según el resultado
  const buttonsHTML = `
    <button class="modal-btn test-answers">Ver Respuestas</button>
    <button class="modal-btn test-retry">Repetir Test</button>
    <button class="modal-btn test-continue" ${results.percentage < 75 ? "disabled" : ""}>
      Continuar Aventura
    </button>
    ${
      results.percentage >= 75
        ? `
      <button class="modal-btn test-register" style="background-color: #dd7310ff; color: white;">
        <i class="fas fa-clipboard-check"></i> Registrar Asistencia
      </button>
    `
        : ""
    }
  `

  modalFooter.innerHTML = buttonsHTML

  // Estilo para botón deshabilitado
  if (results.percentage < 75) {
    const continueBtn = modalFooter.querySelector(".test-continue")
    continueBtn.style.opacity = "0.6"
    continueBtn.style.cursor = "not-allowed"
  }

  // Event listener para el botón de ver respuestas
  const answersBtn = modal.querySelector(".test-answers")
  if (answersBtn) {
    answersBtn.addEventListener("click", () => {
      const explanationDiv = modal.querySelector(".answers-explanation")
      if (explanationDiv.style.display === "none") {
        explanationDiv.style.display = "block"
        answersBtn.textContent = "Ocultar Respuestas"
      } else {
        explanationDiv.style.display = "none"
        answersBtn.textContent = "Ver Respuestas"
      }
    })
  }

  // Event listener para repetir test
  modal.querySelector(".test-retry").addEventListener("click", () => {
    document.body.removeChild(modal)
    showTestModal(currentTopicData)
  })

  // Event listener para continuar aventura
  const continueBtn = modal.querySelector(".test-continue")
  if (continueBtn) {
    continueBtn.addEventListener("click", () => {
      if (results.percentage >= 75) {
        document.body.removeChild(modal)
        showNotification(`¡Test completado! Puntuación: ${results.percentage}%`, "success")

        // Pasar al siguiente tema del módulo
        const currentTopicIndex = currentModuleData.topics.findIndex((topic) => topic.id === currentTopicData.id)
        if (currentTopicIndex < currentModuleData.topics.length - 1) {
          const nextTopic = currentModuleData.topics[currentTopicIndex + 1]
          showTopicContent(nextTopic)
        } else {
          // Si es el último tema, volver a la vista de ruta del módulo
          document.getElementById("topicContent").classList.remove("active")
          showModuleRoute(currentModuleData)
          showNotification("¡Has completado todos los temas de este módulo!", "success")
        }
      }
    })
  }

  // Event listener para registrar asistencia
  const registerBtn = modal.querySelector(".test-register")
  if (registerBtn) {
    registerBtn.addEventListener("click", () => {
      openFormModalWithUrl(formUrl) // Abre el formulario sin cerrar el test
    })
  }
}

// Función auxiliar para generar las explicaciones de respuestas
function generateAnswersExplanation(questions) {
  if (!questions || questions.length === 0) {
    return "<div class='no-answers'>No hay información disponible sobre las respuestas.</div>"
  }

  return questions
    .map(
      (question, index) => `
    <div class="question-answer">
      <div class="question-header">
        <span class="question-number">Pregunta ${index + 1}</span>
        <h4 class="question-text">${question.question}</h4>
      </div>
      <div class="correct-answer">
        <span class="correct-label">Respuesta correcta:</span>
        <span class="answer-value">${question.options[question.correct]}</span>
      </div>
      ${
        question.explanation
          ? `
        <div class="explanation-box">
          <div class="explanation-header">Explicación:</div>
          <div class="explanation-text">${question.explanation}</div>
        </div>
      `
          : ""
      }
    </div>
  `,
    )
    .join("")
}

// Modificar las funciones de navegación para cerrar automáticamente el sidebar en móviles
function showHomeContent() {
  const homeContent = document.getElementById("homeContent")
  const menuContent = document.getElementById("menuContent")
  const moduleRouteContent = document.getElementById("moduleRouteContent")
  const topicContent = document.getElementById("topicContent")

  // Ocultar créditos si están activos
  document.getElementById("creditsSection").classList.add("hidden")
  document.getElementById("helpSection").classList.add("hidden")
  document.getElementById("helpSection").classList.remove("active")

  homeContent.classList.remove("hidden")
  menuContent.classList.remove("active")
  moduleRouteContent.classList.remove("active")
  topicContent.classList.remove("active")

  stopSpeech()

  // Cerrar sidebar automáticamente en móviles
  if (window.innerWidth <= 768) {
    closeSidebarOnMobile()
  } else {
    showSidebarInNormalView()
  }

  currentView = "home"
  actualCurrentModule = "home"

  const pageButtons = document.querySelectorAll(".page-btn")
  pageButtons.forEach((btn) => {
    btn.classList.remove("active")
    if (btn.getAttribute("data-module") === "home") {
      btn.classList.add("active")
    }
  })
}

function showMenuContent() {
  const homeContent = document.getElementById("homeContent")
  const menuContent = document.getElementById("menuContent")
  const moduleRouteContent = document.getElementById("moduleRouteContent")
  const topicContent = document.getElementById("topicContent")

  // Ocultar créditos si están activos
  document.getElementById("creditsSection").classList.add("hidden")
  document.getElementById("helpSection").classList.add("hidden")
  document.getElementById("helpSection").classList.remove("active")

  homeContent.classList.add("hidden")
  moduleRouteContent.classList.remove("active")
  topicContent.classList.remove("active")

  stopSpeech()

  setTimeout(() => {
    menuContent.classList.add("active")
  }, 250)

  // Cerrar sidebar automáticamente en móviles
  if (window.innerWidth <= 768) {
    closeSidebarOnMobile()
  } else {
    showSidebarInNormalView()
  }

  currentView = "menu"
  actualCurrentModule = "home"
  activateHomeButtonInBottomBar()
}

// Modificar la función showCreditsSection para cerrar automáticamente el sidebar en móviles
function showCreditsSection() {
  stopSpeech()

  // Ocultar otras vistas
  document.getElementById("homeContent").classList.add("hidden")
  document.getElementById("menuContent").classList.remove("active")
  document.getElementById("moduleRouteContent").classList.remove("active")
  document.getElementById("topicContent").classList.remove("active")
  document.getElementById("helpSection").classList.add("hidden")
  document.getElementById("helpSection").classList.remove("active")

  // Mostrar créditos
  document.getElementById("creditsSection").classList.remove("hidden")
  actualCurrentModule = "home"
  activateHomeButtonInBottomBar()

  // Cerrar sidebar automáticamente en móviles
  if (window.innerWidth <= 768) {
    closeSidebarOnMobile()
  }
}

// Modificar la función showHelpSection para cerrar automáticamente el sidebar en móviles
function showHelpSection() {
  stopSpeech()
  document.getElementById("homeContent").classList.add("hidden")
  document.getElementById("menuContent").classList.remove("active")
  document.getElementById("moduleRouteContent").classList.remove("active")
  document.getElementById("topicContent").classList.remove("active")
  document.getElementById("creditsSection").classList.remove("active")
  document.getElementById("creditsSection").classList.add("hidden")

  const help = document.getElementById("helpSection")
  help.classList.remove("hidden")
  help.classList.add("active")

  activateHomeButtonInBottomBar()
  actualCurrentModule = "home"

  // Cerrar sidebar automáticamente en móviles
  if (window.innerWidth <= 768) {
    closeSidebarOnMobile()
  }
}

function setActiveNavItem(activeItem) {
  const navItems = document.querySelectorAll(".nav-item")
  navItems.forEach((item) => item.classList.remove("active"))
  activeItem.classList.add("active")
}

// Funciones para manejar el sidebar
function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar")
  const mainContainer = document.querySelector(".main-container")
  const toggleBtn = document.getElementById("sidebarToggle")

  sidebarVisible = !sidebarVisible

  if (sidebarVisible) {
    sidebar.classList.remove("collapsed")
    mainContainer.classList.remove("sidebar-collapsed")
    toggleBtn.innerHTML = '<i class="fas fa-times"></i>'
  } else {
    sidebar.classList.add("collapsed")
    mainContainer.classList.add("sidebar-collapsed")
    toggleBtn.innerHTML = '<i class="fas fa-bars"></i>'
  }
}

function hideSidebarInTopicView() {
  const sidebar = document.querySelector(".sidebar")
  const mainContainer = document.querySelector(".main-container")
  const toggleBtn = document.getElementById("sidebarToggle")

  sidebar.classList.add("collapsed")
  mainContainer.classList.add("sidebar-collapsed")
  toggleBtn.innerHTML = '<i class="fas fa-bars"></i>'
  toggleBtn.style.display = "flex" // Mostrar el botón solo cuando estamos en vista de tema
  sidebarVisible = false
}

function showSidebarInNormalView() {
  const sidebar = document.querySelector(".sidebar")
  const mainContainer = document.querySelector(".main-container")
  const toggleBtn = document.getElementById("sidebarToggle")

  sidebar.classList.remove("collapsed")
  mainContainer.classList.remove("sidebar-collapsed")
  toggleBtn.innerHTML = '<i class="fas fa-times"></i>'
  toggleBtn.style.display = "none" // Ocultar el botón en vistas normales
  sidebarVisible = true
}

// Nueva función para cerrar el sidebar en móviles
function closeSidebarOnMobile() {
  if (window.innerWidth <= 768) {
    const sidebar = document.querySelector(".sidebar")
    const mainContainer = document.querySelector(".main-container")
    const toggleBtn = document.getElementById("sidebarToggle")

    sidebar.classList.add("collapsed")
    mainContainer.classList.add("sidebar-collapsed")
    toggleBtn.innerHTML = '<i class="fas fa-bars"></i>'
    sidebarVisible = false
  }
}

// nueva funcion con texto e imagen y video
function updateTopicMainContent(buttonId) {
  const topicMainContent = document.getElementById("topicContentText")
  topicMainContent.innerHTML = ""

  const content = getContentForButton(buttonId)

  // Obtener el ID del módulo y tema actual para el data-topic
  const moduleId = Object.keys(modulesData).find((key) =>
    modulesData[key].topics.some((topic) => topic.id === currentTopicData.id && topic.title === currentTopicData.title),
  )
  const topicKey = `${moduleId}-${currentTopicData.id}`

  // Agregar data-topic al content-box
  const contentBox = document.querySelector(".content-box")
  if (contentBox) {
    contentBox.setAttribute("data-topic", topicKey)
  }

  // Título
  const titleElement = document.createElement("h3")
  titleElement.textContent = content.title
  titleElement.className = "topic-content-title"
  topicMainContent.appendChild(titleElement)

  // Texto + Imagen en un contenedor
  const textImageContainer = document.createElement("div")
  textImageContainer.className = "topic-content-text-image"

  if (content.image) {
    const imgElement = document.createElement("img")
    imgElement.src = content.image
    imgElement.alt = content.title || "Imagen del subtema"
    imgElement.className = "topic-side-image"
    textImageContainer.appendChild(imgElement)
  }

  const textElement = document.createElement("p")
  textElement.innerHTML = content.text
  textElement.className = "topic-content-text"
  textImageContainer.appendChild(textElement)

  topicMainContent.appendChild(textImageContainer)

  // Lista de pasos
  const stepsList = document.createElement("ol")
  stepsList.className = "topic-content-steps"

  content.steps.forEach((step) => {
    const stepItem = document.createElement("li")
    stepItem.textContent = step
    stepsList.appendChild(stepItem)
  })

  topicMainContent.appendChild(stepsList)

  // Video (debajo de todo)
  if (content.video) {
    const videoContainer = document.createElement("div")
    videoContainer.className = "topic-content-video"
    videoContainer.innerHTML = `
      <iframe width="100%" height="315"
        src="${content.video}"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>
    `
    topicMainContent.appendChild(videoContainer)
  }
  //Esto fuerza que el scroll vaya al inicio del contenedor correcto
  document.querySelector(".topic-main-content")?.scrollTo({ top: 0, behavior: "smooth" })

  addTopicContentStyles()
  resetSpeechButton() // Reiniciar el botón de voz al cambiar de subtema
  toggleAudioButton(currentModule, currentTopicData.id, buttonId);
}

// Función mejorada para contenido específico por tema y subtema
function getContentForButton(buttonId) {
  const defaultContent = {
    title: currentTopicData.content.title,
    text: currentTopicData.content.text,
    steps: currentTopicData.content.steps,
  }

  // Contenido específico por tema y subtema
  const moduleId = Object.keys(modulesData).find((key) =>
    modulesData[key].topics.some((topic) => topic.id === currentTopicData.id && topic.title === currentTopicData.title),
  )

  const topicKey = `${moduleId}-${currentTopicData.id}`
  const contentKey = `${topicKey}-${buttonId}`

  // Contenido específico para cada combinación de tema y subtema
  const specificContent = {
    // ========== MÓDULO 1 - TEMA 1 (tu mision) ==========
    "1-1-que-es": {
      title: 'Leyenda del "One Process"',
      text: 'En un vasto océano de conocimiento, existe una leyenda sobre un tesoro llamado "One Process ", un poder que otorga a su poseedor el control absoluto sobre los procesos químicos e industriales. Se dice que aquel que logre dominar las variables de proceso podrá navegar por los mares de la ingeniería sin miedo a naufragar.\nTú, joven aprendiz, eres navegante en esta travesía. Para encontrar el One Process, deberás viajar a través de cinco islas legendarias, cada una custodiada por un guardián que pondrá a prueba tu ingenio y habilidades. ¿Serás capaz de superar los desafíos y convertirte en el Gran Monarca de los Procesos?',
      steps: [],
      image: "images/40.jpeg",
    },
    "1-1-variablesP": {
      title: "Las variables de proceso",
      text: "Las variables de proceso son esenciales en la ingeniería, ya que permiten describir y controlar el comportamiento de las sustancias dentro de un sistema. Un proceso implica la transformación de materias primas a través de diversas unidades operativas. Las variables de proceso juegan un papel clave para garantizar la eficacia, seguridad y eficiencia del proceso, y la calidad de los productos y servicios ofrecidos. Su correcta medición y control son fundamentales para mantener la estabilidad y mejorar el desempeño de los procesos.",
      steps: [],
      video: "https://www.youtube.com/embed/BwYsm7RFeXg",
    },

    // ========== MÓDULO 1 - TEMA 2 (CONCEPTOS BÁSICOS)
    "1-2-que-es": {
      title: "El Reino de Baro'Que",
      text: 'Aquí, el pirata Baro\'Que, conocido como "El Señor de la Presión", controla los mares con su habilidad de manipular la presión del aire y el agua. Para pasar su prueba, debes comprender la diferencia entre presión absoluta y manométrica, así como dominar las herramientas de medición de presión.',
      steps: [],
      image: "images/41.jpeg",
    },
    "1-2-Cpresion": {
      title: "¿Cómo se define la presión?",
      text: "La presión se define como la fuerza ejercida por unidad de área (F/A). En el contexto de los fluidos, se utiliza el término presión cuando esta fuerza es ejercida por un gas o un líquido sobre una superficie. Por lo tanto, se expresa en unidades de newtons por metro cuadrado (N/m²), la cual se llama pascal (Pa).",
      steps: [],
      video: "https://www.youtube.com/embed/tqnd4avxIyc",
    },
    "1-2-Tpresion": {
      title: "Tipos de presión",
      text: `<b>Presión absoluta:</b> es la presión medida en relación con el vacío absoluto, el cual representa la ausencia total de presión (cero presión).
      <br><b>Presión atmosférica:</b> es la presión que ejerce el aire de la atmósfera sobre la superficie terrestre y sobre todos los objetos situados en ella. Su valor varía con la altitud y las condiciones climáticas.
      <br><b>Presión manométrica:</b> es la diferencia entre la presión absoluta y la presión atmosférica. Corresponde a la presión que mide un manómetro, por lo general sin tener en cuenta la presión atmosférica. Se utiliza comúnmente en sistemas cerrados como tanques, tuberías o equipos presurizados, y no está limitada únicamente a sistemas de aire comprimido.
      <br><br><b>P absoluta = P manométrica + P atmosférica</b>`,
      steps: [],
      image: "images/42.jpeg",
    },
    "1-2-medicion": {
      title: "Instrumentos de medición",
      text: `<b style="padding-left: 20px; display: inline-block;">Métodos de elemento elástico</b>
      <ul style="list-style: disc; padding-left: 20px;">
      <ul>
        <li>Tubo Bourdon: mide presión por la deformación de un tubo curvado.</li>
        <li>Fuelles y diafragmas: se deforman con la presión; usados en presiones bajas o con fluidos especiales.</li>
      </ul><br>

      <b>Métodos de columna de líquido</b>
      <ul>
        <li>Manómetros de líquido: miden presión mediante la altura de una columna de fluido (agua, mercurio, etc.).</li>
      </ul><br>

      <b>Métodos eléctricos y electrónicos</b>
      <ul>
        <li>Manómetros electrónicos: combinan elementos mecánicos con sensores.</li>
        <li>Transductores piezorresistivos y piezoeléctricos: convierten la presión en señales eléctricas; usados en sistemas automatizados.</li>
      </ul>`,
      steps: [],
      image: "images/44.jpeg",
    },
    "1-2-desafio": {
      title: "El Reino de Baro'Que",
      text: `<b>Desafío:</b> Utilizando el <b>simulador PhET</b>, selecciona dos líquidos con diferentes densidades 
      (por ejemplo, agua y miel). Usa la regla (haciendo clic en su ítem) para medir la altura del líquido en el recipiente 
      y el manómetro para medir la presión. Puedes controlar el nivel del líquido en el recipiente arrastrando la perilla de 
      control de flujo superior hacia la derecha para agregar más contenido, o utilizando la perilla inferior para retirar la cantidad necesaria.
      <br><br>1 - Llena el recipiente con cada líquido hasta la altura máxima y mide la presión a 1 m de profundidad. 
      <br>2 - Compara los resultados obtenidos con ambos líquidos.      
      <br><br><b>¿Cuál de los líquidos ejerce mayor presión según la altura asignada? Justifica tu respuesta.</b>
      <br><br><b>Enlace al simulador: </b> <a href="https://phet.colorado.edu/sims/html/under-pressure/latest/under-pressure_all.html?locale=es" target="_blank" style="color: #1222b6ff;">¡¡ Haz clic aquí !!</a>
      <br><br>
      <div class="encuesta-container">
      <button onclick="openFormModalWithUrl('https://forms.gle/pUYnCxYrGi2x5Etq6?embedded=true')" class="btn-encuesta">
        📝 Haz clic aquí para registrar tus respuestas y asistencia
      </button>
      </div>`,
      steps: [],
      image: "images/45.PNG",
    },

    // ========== MÓDULO 1 - TEMA 2 (CONCEPTOS BÁSICOS) ==========
    "1-3-que-es": {
      title: "El Desafío de Calor'Bel",
      text: "En esta isla volcánica, la pirata Calor'Bel puede cambiar la temperatura a su antojo. Solo aquellos que dominen las escalas de temperatura podrán cruzar sin ser consumidos por las llamas.",
      steps: [],
      image: "images/46.jpeg",
    },
    "1-3-islaC": {
      title: "Isla del fuego eterno",
      text: `La temperatura es una variable que afecta las propiedades físicas y químicas de las sustancias. 
      Su control es esencial, ya que influye en las propiedades fisicoquímicas, en el estado de agregación 
      (sólido, líquido o gas) y en la velocidad de las reacciones químicas. Es importante comprender que existen 
      diferentes escalas de temperatura (Kelvin, Celsius, Fahrenheit), por lo que se requieren ecuaciones de conversión entre ellas. 
      La medición de la temperatura se realiza mediante instrumentos como termómetros, termopares u otros sensores térmicos.`,
      steps: [],
      image: "images/47.jpeg",
    },
    "1-3-conversion": {
      title: "Tabla de conversión de temperaturas",
      text: `
      <table style="border-collapse: collapse; width: 100%; text-align: center; font-family: 'Comic Sans MS', cursive; border: 2px solid #a76de0;">
        <thead>
          <tr style="background-color: #ffc8c8;">
            <th style="border: 1px solid #a76de0; padding: 8px;">CONVERTIR</th>
            <th style="border: 1px solid #a76de0; padding: 8px;">ECUACIÓN</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #a76de0; padding: 8px;">°C → °F</td>
            <td style="border: 1px solid #a76de0; padding: 8px;">°F = (9/5 * °C) + 32</td>
          </tr>
          <tr>
            <td style="border: 1px solid #a76de0; padding: 8px;">°F → °C</td>
            <td style="border: 1px solid #a76de0; padding: 8px;">°C = 5/9 (°F - 32)</td>
          </tr>
          <tr>
            <td style="border: 1px solid #a76de0; padding: 8px;">°C → K</td>
            <td style="border: 1px solid #a76de0; padding: 8px;">K = °C + 273,15</td>
          </tr>
          <tr>
            <td style="border: 1px solid #a76de0; padding: 8px;">K → °C</td>
            <td style="border: 1px solid #a76de0; padding: 8px;">°C = K - 273,15</td>
          </tr>
          <tr>
            <td style="border: 1px solid #a76de0; padding: 8px;">°F → K</td>
            <td style="border: 1px solid #a76de0; padding: 8px;">K = 5/9 (°F - 32) + 273,15</td>
          </tr>
          <tr>
            <td style="border: 1px solid #a76de0; padding: 8px;">K → °F</td>
            <td style="border: 1px solid #a76de0; padding: 8px;">°F = 9/5 (K - 273,15) + 32</td>
          </tr>
        </tbody>
      </table>`,
      steps: [],
    },
    "1-3-Vtemperatura": {
      title: "Video explicativo de la temperatura",
      text: "",
      steps: [],
      video: "https://www.youtube.com/embed/U8go9nhP-3E",
    },

    // ========== MÓDULO 1 - TEMA 4 (HERRAMIENTAS) ==========
    "1-4-que-es": {
      title: "La prueba del capitán Venturi",
      text: "El Capitán Venturi, un legendario navegante, controla los ríos subterráneos de esta isla con su dominio del flujo volumétrico, másico y molar. Para seguir adelante, debes demostrar tu capacidad para calcular, diferenciar y relacionar estos tipos de flujo en un sistema de tuberías.",
      steps: [],
      image: "images/49.jpeg",
    },
    "1-4-Iflujo": {
      title: "Isla del gran flujo",
      text: "El flujo se refiere al movimiento de material (generalmente, un fluido) dentro de un proceso y puede ser másico, molar o volumétrico. Es esencial para calcular la cantidad de producción en un proceso. Las velocidades de flujo son variables críticas, e influyen en la caída de presión y determinan parámetros de diseño, en sistemas de transporte en tuberías y ductos.",
      steps: [],
      image: "images/50.jpeg",
    },
    "1-4-Vflujo": {
      title: "Video explicativo del flujo",
      text: "",
      steps: [],
      video: "https://www.youtube.com/embed/FCvJp3uxb6U",
    },
    "1-4-Tflujo": {
      title: "Tipos de flujo",
      text: `<b>Flujo volumétrico</b><br>
      El flujo volumétrico se describe como el volumen de fluido que atraviesa una sección específica de una tubería o canal en un intervalo determinado de tiempo. Este parámetro se puede medir en cualquier punto a lo largo de una tubería, y el valor puede cambiar a medida que el líquido se mueve a través del sistema. 
      <br>
      Las unidades de medida comunes para el flujo volumétrico incluyen metros cúbicos por segundo (m³/s), litros por minuto (LPM) y galones por minuto (GPM).
      <br>
      El flujo volumétrico es igual al flujo másico dividido entre la densidad:
      <br>
      <b>Q<sub>v</sub> = ṁ / ρ</b>
      <br>
      <b>Donde:</b>
      <br>• Q<sub>v</sub> = flujo volumétrico [m³/s]
      <br>• ṁ = flujo másico [kg/s]
      <br>• ρ = densidad [kg/m³]
      <br><br>
      <b>Flujo másico</b><br>
      Se refiere a la masa del fluido transportada por unidad de tiempo, en otras palabras, es la medida de cuánta masa pasa por un punto específico en un determinado periodo.
      <br>
      Las unidades de medida comunes para el flujo másico incluyen kilogramos por segundo (kg/s), gramos por minuto (g/min).
      <br>
      Para obtener el flujo másico, se multiplica el flujo volumétrico por la densidad:
      <br>
      <b>ṁ = ρ · Q<sub>v</sub></b>
      <br>
      <b>Donde:</b>
      <br>• ṁ = flujo másico [kg/s]
      <br>• Q<sub>v</sub> = flujo volumétrico [m³/s]
      <br>• ρ = densidad [kg/m³]
      <br><br>
      <b>Flujo molar</b><br>
      El flujo molar indica la cantidad de moles de una sustancia que fluyen en un tiempo dado; en otras palabras, 
      se refiere a la cantidad de sustancia, medida en moles, que pasa a través de una superficie específica por unidad de tiempo. 
      Este concepto es fundamental en diversas áreas de la ingeniería y la química, especialmente en procesos donde se manejan reacciones químicas 
      y transferencias de materia.<br>
      La unidad de medida más común para el flujo molar es el mol por segundo (mol/s).<br>
      La conversión entre flujo másico y flujo molar se realiza dividiendo el flujo másico por el peso molecular de la sustancia:<br>
      <b>ṅ = ṁ / M</b><br>
      <b>Donde:</b><br>
      • ṅ = flujo molar [mol/s]<br>
      • ṁ = flujo másico [kg/s]<br>
      • M = masa molar o peso molecular de la sustancia [kg/mol]<br><br>`,
      steps: [],
      image: "images/62.jpeg"
    },

    // ========== MÓDULO 1 - TEMA 5 (PREPARACIÓN) ==========
    "1-5-que-es": {
      title: "El Reto de Alquimix",
      text: `El alquimista Alquimix protege la receta del elixir más puro del mundo, 
      pero solo aquellos que dominen la concentración y la composición de las soluciones podrán obtenerla. 
      Aquí aprenderás sobre unidades como Normalidad (N), Molaridad (M), ppm, ppb, %p/p, %p/V, %mol/mol, equivalente - gramo.`,
      steps: [],
      image: "images/51.jpeg",
    },
    "1-5-concentracion": {
      title: "Isla de la concentración",
      text: `La concentración química se refiere a la medida de la cantidad de soluto presente en una solución, disolución o mezcla. La concentración cuantifica la proporción de soluto respecto a la solución total (soluto+disolvente). Algunas unidades específicas también expresan esta proporción en relación directa con la cantidad de disolvente. <br>
      <b>Soluto: </b> La sustancia que se disuelve en el disolvente.
      <br><b>Disolvente: </b> La sustancia que disuelve el soluto.
      <br><b>Solución: </b> La mezcla homogénea resultante de la combinación del soluto y el disolvente.`,
      steps: [],
      image: "images/52.jpeg",
    },
    "1-5-expresar": {
      title: "¿Cómo se expresa la concentración?",
      text: `La concentración se expresa de diferentes maneras, siendo las más comunes:
      <br><b> Normalidad (N): </b> Equivalentes-gramo de soluto por litro de solución.
      <br><b> Molaridad (M): </b> Moles de soluto por litro de solución.
      <br><b> Equivalente - gramo: </b> Masa molar entre su n-factor (mol de H⁺, OH⁻ o electrones) depende del tipo de la molécula.
      <br><b> Partes por millón (ppm): </b> Miligramos de soluto por litro de solución (mg/L) o por kilogramo, dependiendo del sistema.
      <br><b> Partes por billón (ppb): </b> Microgramos de soluto por litro (µg/L) o por kilogramo.
      <br><b> Porcentaje masa a masa (%p/p): </b> Gramos de soluto por 100 gramos de solución.
      <br><b> Porcentaje masa a volumen (%p/v): </b> Gramos de soluto por 100 mL de solución.
      <br><b> Porcentaje molar (%mol/mol): </b> Moles de soluto por 100 moles de solución
      <br><b> Fracción másica (w): </b> Relación entre la masa del soluto y la masa total de la solución (adimensional, puede expresarse en decimal o en porcentaje).`,
      steps: [],
      image: "images/53.jpeg",
    },
    "1-5-VideoC": {
      title: "Video explicativo de la concentración",
      text: "",
      steps: [],
      video: "https://www.youtube.com/embed/thWBtOutRgo",
    },
    "1-5-desafioA": {
      title: "El Reto de Alquimix",
      text: `<b>Desafío:</b> En el <b>simulador  de PhET</b>, prepara una solución con 1 L de agua y agrega alguno de los solutos que se despliegan de forma sólida, observa como 
      varía la concentración punzando sobre la manecilla de medición y arrastrándola a la parte líquida que se encuentra en el recipiente; agrega más soluto sin cambiar el volumen, 
      luego disminuye y aumenta el nivel del agua. Puedes controlar el nivel del agua en el recipiente arrastrando la perilla de control de flujo superior hacia la derecha para agregar 
      más contenido, o utilizando la perilla inferior para retirar la cantidad que desees. En el experimento con el simulador de PhET, realizaste diferentes operaciones sobre una solución: agregar más soluto, agregar más solvente y eliminar parte de la solución.
      <br><br><b>¿Cuáles de estas operaciones cambian la concentración de la solución y cuáles no? Explica por qué ocurre o no ocurre el cambio en cada caso.</b>
      <br><br><b>Enlace al simulador: </b> <a href="https://phet.colorado.edu/es/simulations/concentration" target="_blank" style="color: #1222b6ff;">¡¡ Haz clic aquí !!</a>
      <br><br>
      <div class="encuesta-container">
      <button onclick="openFormModalWithUrl('https://forms.gle/V29rUv3LeEf8HTje9?embedded=true')" class="btn-encuesta">
        📝 Haz clic aquí para registrar tus respuestas y asistencia
      </button>
      </div>`,
      steps: [],
      image: "images/54.PNG",
    },

    // ========== MÓDULO 1 - TEMA 6 (IMPLEMENTACIÓN) ==========
    "1-6-que-es": {
      title: "El último desafío",
      text: `Después de superar todas las islas, llegas a la Isla del Gran Saber, donde una antigua y gran maestra del conocimiento te hará una última prueba: integrar todas las variables de proceso en un gran caso de estudio. Solo entonces, recibirás el título de Gran Monarca de los Procesos y descubrirás el secreto del One Process.
      <br><br><b>Desafío final:</b> Analiza un proceso real donde debas aplicar todos los conocimientos adquiridos.`,
      steps: [],
      image: "images/55.jpeg",
    },
    "1-6-proceso": {
      title: "Aplicación en un caso real",
      text: `<p>Una planta química produce etanol (EtOH) a partir de una mezcla líquida de etanol y agua, proveniente de una unidad de fermentación. Esta mezcla alimenta una torre de destilación (rectificadora) para obtener etanol con alta pureza.</p>
      <ul>
        <li><strong>Temperatura de operación:</strong> 40 °C</li>
        <li><strong>Presión de operación:</strong> 1,5 atm</li>
        <li><strong>Flujo volumétrico de la solución en la alimentación:</strong> 500 L/h. Esta corriente está formada por una mezcla azeotrópica compuesta por 95 % de etanol y 5 % de agua (% en masa).</li>
      </ul><br>
      Nota: Una mezcla azeotrópica, o azeótropo, es una mezcla de dos o más líquidos que hierve a una temperatura constante y cuya composición de vapor es idéntica a la composición del líquido. Debido a esto, no se pueden separar por destilación simple.
      <p><br><strong>Datos físicos:</strong></p>
      <ul>
        <li><strong>Masa molar del etanol:</strong> 46 kg/kmol</li>
        <li><strong>Masa molar del agua:</strong> 18 kg/kmol</li>
        <li><strong>Constante de gas:</strong> R = 0,08205 L·atm/mol·K</li>
      </ul>
      <!-- Aquí va la imagen -->
      <figure style="text-align:center; margin-top:15px;">
        <img src="images/63.png" alt="Diagrama de proceso" style="max-width:400px; border-radius:8px;" />
        <figcaption style="font-size:14px; font-style:italic; margin-top:6px;">
          Tabla 1: Densidad de soluciones acuosas orgánicas.<br>
          Tomado de (Perry, R. H., Green, D. W., & Maloney, J. O. Manual del ingeniero químico, 6.ª ed., McGraw-Hill.)
        </figcaption>
      </figure>`,
      steps: [],
      image: "images/56.png",
    },
    "1-6-desafioG": {
      title: "Realiza estos enunciados",
      text: `
      1-	Convierta el flujo volumétrico de etanol en la corriente de alimentación a flujo másico (kg/h).<br><br>
      2-	A partir del flujo másico de etanol en la corriente de alimentación, determine el flujo molar (kmol/h). Usa la siguiente fórmula para calcular el peso molecular promedio de la mezcla el cual necesitarás usar para calcular los flujos molares de las sustancias involucradas (etanol-agua). <br><br>
      <p><strong>Fórmula:</strong></p>
      <p>
        PM<sub>mezcla</sub> = 
        x<sub>C<sub>2</sub>H<sub>6</sub>O</sub> · PM<sub>C<sub>2</sub>H<sub>6</sub>O</sub> + 
        x<sub>H<sub>2</sub>O</sub> · PM<sub>H<sub>2</sub>O</sub>
      </p>

      <p><strong>Donde:</strong></p>
      <ul>
        <li>x<sub>C<sub>2</sub>H<sub>6</sub>O</sub> = <em>composición molar del etanol</em></li>
        <li>PM<sub>C<sub>2</sub>H<sub>6</sub>O</sub> = <em>peso molecular del etanol</em></li>
        <li>x<sub>H<sub>2</sub>O</sub> = <em>composición molar del agua</em></li>
        <li>PM<sub>H<sub>2</sub>O</sub> = <em>peso molecular del agua</em></li>
      </ul><br><br>
      3-	¿Qué volumen ocupa el gas a la salida de la torre (corriente 2) si se asume que el etanol se separa 100% analíticamente puro en condiciones estándar? (25 °C y 1 atm).<br><br>
      4-	Si se aumenta la presión a 2,0 atm manteniendo la misma temperatura, ¿qué ocurre con el volumen del gas?<br>
      -	Aumenta<br>
      -	Disminuye<br>
      -	Permanece constante<br><br>
        Justifica tu respuesta brevemente con una fórmula o concepto.
      <br><br>
      <div class="encuesta-container">
      <button onclick="openFormModalWithUrl('https://docs.google.com/forms/d/e/1FAIpQLSf73hw8HGPKmc5MLcv6InE9GnlT2Ov3sW7PNIdnKs4ev86LDQ/viewform?embedded=true')" class="btn-encuesta">
          📝 Haz clic aquí para registrar tus respuestas y asistencia
        </button>
      </div>`,
      steps: [],
    },

    // ========== MÓDULO 2 - TEMA 1 (TORMENTAS) ==========
    "2-1-que-es": {
      title: 'Leyenda "Monarca de los procesos"',
      text: `En el vasto océano del Nuevo Mundo, la tripulación de los balanceadores descubre un misterioso laboratorio flotante perteneciente 
      a los guardianes del equilibrio químico. Se dice que estos científicos descubrieron la fórmula secreta para fabricar un combustible revolucionario 
      capaz de potenciar cualquier barco y hacerlo más veloz.<br><br>Sin embargo, el laboratorio está protegido por acertijos químicos que solo los más astutos pueden resolver. 
      Tú y tu tripulación necesitarán aplicar sus conocimientos sobre balance con reacción química para desbloquear los secretos de los guardianes y obtener la fórmula antes que la Marina o los Piratas de Barbanegra lo hagan.`,
      steps: [],
      image: "images2/11.jpeg",
    },
    "2-1-video-brc": {
      title: 'Balances con Reacción química',
      text: ``,
      steps: [],
      video: "https://www.youtube.com/embed/FbD8IJFdBXY",
    },

    // ========== MÓDULO 2 - TEMA 2 (BATALLAS NAVALES) ==========
    "2-2-que-es": {
      title: "",
      text: `<div style="text-align: center; max-width: 600px; margin: auto;">
      <img src="images2/4.png" alt="Grados de libertad" style="width: 100%; border: 2px solid #333; border-radius: 10px;">
      <p style="font-family: 'Comic Sans MS'; margin-top: 10px;">
        <i>Figura: Explicación de Grados de libertad.</i>
      </p>
      </div>`,
      steps: [
      ],
    },
    
    // ========== MÓDULO 2 - TEMA 3 (MONSTRUOS MARINOS) ==========
    "2-3-que-es": {
      title: "",
      text: `<div style="text-align: center; max-width: 600px; margin: auto;">
      <img src="images2/5.png" alt="Velocidad de reacción" style="width: 100%; border: 2px solid #333; border-radius: 10px;">
      <p style="font-family: 'Comic Sans MS'; margin-top: 10px;">
        <i>Figura: Explicación de Velocidad de reacción.</i>
      </p>
      </div>`,
      steps: [
      ],
    },
    
    // ========== MÓDULO 2 - TEMA 4 (NAVEGACIÓN NOCTURNA) ==========
    "2-4-que-es": {
      title: "",
      text: `<div style="text-align: center; max-width: 600px; margin: auto;">
      <img src="images2/6.png" alt="Conversión" style="width: 100%; border: 2px solid #333; border-radius: 10px;">
      <p style="font-family: 'Comic Sans MS'; margin-top: 10px;">
        <i>Figura: Explicación de Conversión.</i>
      </p>
      </div>`,
      steps: [
      ],
    },
    
    // ========== MÓDULO 2 - TEMA 5 ==========
    "2-5-que-es": {
      title: "",
      text: `<div style="text-align: center; max-width: 600px; margin: auto;">
      <img src="images2/7.png" alt="Reactivo límite y en exceso" style="width: 100%; border: 2px solid #333; border-radius: 10px;">
      <p style="font-family: 'Comic Sans MS'; margin-top: 10px;">
        <i>Figura: Explicación de reactivo límite y en exceso.</i>
      </p>
      </div>`,
      steps: [
      ],
    },
    // ========== MÓDULO 2 - TEMA 6 ==========
    "2-6-que-es": {
      title: "",
      text: `<div style="text-align: center; max-width: 600px; margin: auto;">
      <img src="images2/8.png" alt="Selectividad y Rendimiento Fraccional" style="width: 100%; border: 2px solid #333; border-radius: 10px;">
      <p style="font-family: 'Comic Sans MS'; margin-top: 10px;">
        <i>Figura: Explicación de Selectividad y Rendimiento Fraccional.</i>
      </p>
      </div>`,
      steps: [
      ],
    },
    // ========== MÓDULO 2 - TEMA 6 ==========
    
    "2-7-que-es": {
      title: "",
      text: `<div style="text-align: center; max-width: 600px; margin: auto;">
      <img src="images2/20.png" alt="Balance Elemental" style="width: 100%; border: 2px solid #333; border-radius: 10px;">
      </div>
      <div style="text-align: center; max-width: 600px; margin: auto; margin-top: 20px; border: 2px solid #333; border-radius: 10px; padding: 0px; background-color: #fff;">
        <img src="images2/21.png" alt="Grados de Libertad" style="width: 100%; border-radius: 10px; display: block; margin-bottom: 10px;">
        <img src="images2/22.png" alt="Grados de Libertad" style="width: 100%; border-radius: 10px; display: block;">
      </div>
      <div style="text-align: center; max-width: 600px; margin: auto; margin-top: 20px;">
        <img src="images2/23.png" alt="Grados de Libertad" style="width: 100%; border: 2px solid #333; border-radius: 10px;">
      </div>
      <br>
      <div class="encuesta-container">
      <button onclick="openFormModalWithUrl('https://forms.gle/amFUK74GvPvyyJcA8?embedded=true')" class="btn-encuesta">
        📝 Haz clic aquí para registrar tus respuestas y asistencia
      </button>
      </div>`,
      steps: [
      ],
    },
  }

  // Retornar contenido específico si existe, sino usar contenido por defecto del tema
  return specificContent[contentKey] || defaultContent
}

function updateInfoButtonsState(buttonId) {
  const infoButtons = document.querySelectorAll(".topic-info-sidebar .info-buttons .info-btn")
  infoButtons.forEach((btn) => {
    btn.classList.remove("active")
    if (btn.getAttribute("data-info") === buttonId) {
      btn.classList.add("active")
    }
  })
}

function addTopicContentStyles() {
  if (!document.getElementById("topic-content-styles")) {
    const topicStyles = `
      .topic-content-title {
        color: var(--ocean-blue);
        font-size: 1.5rem;
        margin-bottom: 1rem;
        font-weight: bold;
      }
      
      .topic-content-text {
        color: var(--driftwood);
        line-height: 1.6;
        margin-bottom: 1.5rem;
        text-align: justify;
      }
      
      .topic-content-steps {
        color: var(--driftwood);
        line-height: 1.5;
        padding-left: 1.5rem;
      }
      
      .topic-content-steps li {
        margin-bottom: 0.5rem;
      }
    `

    const styleSheet = document.createElement("style")
    styleSheet.id = "topic-content-styles"
    styleSheet.textContent = topicStyles
    document.head.appendChild(styleSheet)
  }
}

function showNotification(message, type = "success") {
  if (type === "info") return

  if (!notificationsContainer) {
    notificationsContainer = document.getElementById("notificationsContainer")
    if (!notificationsContainer) {
      notificationsContainer = document.createElement("div")
      notificationsContainer.id = "notificationsContainer"
      notificationsContainer.className = "notifications-container"
      document.body.appendChild(notificationsContainer)
    }
  }

  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-check-circle"></i>
      <span>${message}</span>
    </div>
  `

  notificationsContainer.appendChild(notification)

  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease"
    setTimeout(() => {
      if (notificationsContainer.contains(notification)) {
        notificationsContainer.removeChild(notification)
      }
    }, 300)
  }, 3000)
}

// Funciones de Speech-to-Text
function toggleSpeech() {
  if (isSpeaking) {
    pauseSpeech()
  } else {
    startSpeech()
  }
}

function startSpeech() {
  if (!window.speechSynthesis) {
    showNotification("Tu navegador no soporta la síntesis de voz.", "error")
    return
  }

  const topicContentTextElement = document.getElementById("topicContentText")
  if (!topicContentTextElement) return

  const textToSpeak = topicContentTextElement.innerText

  if (speechSynthesis.speaking && utterance) {
    speechSynthesis.resume()
    isSpeaking = true
    updateSpeechButton("Pausar Tema", "fas fa-pause")
  } else {
    utterance = new SpeechSynthesisUtterance(textToSpeak)
    utterance.lang = "es-ES" // Establecer el idioma a español
    utterance.rate = 1 // Velocidad de habla (1 es normal)
    utterance.pitch = 1 // Tono de voz (1 es normal)

    utterance.onend = () => {
      isSpeaking = false
      updateSpeechButton("Escuchar Tema", "fas fa-volume-up")
    }

    utterance.onerror = (event) => {
      console.error("SpeechSynthesisUtterance.onerror", event)
      isSpeaking = false
      // No mostrar "Error al Escuchar" permanentemente, solo resetear
      updateSpeechButton("Escuchar Tema", "fas fa-volume-up")
      // showNotification("Error al reproducir el audio.", "error")
    }

    speechSynthesis.speak(utterance)
    isSpeaking = true
    updateSpeechButton("Pausar Tema", "fas fa-pause")
  }
}

function pauseSpeech() {
  if (speechSynthesis.speaking) {
    speechSynthesis.pause()
    isSpeaking = false
    updateSpeechButton("Reanudar Tema", "fas fa-play")
  }
}

function stopSpeech() {
  if (speechSynthesis.speaking || speechSynthesis.paused) {
    speechSynthesis.cancel()
  }
  isSpeaking = false
  updateSpeechButton("Escuchar Tema", "fas fa-volume-up")
}

function updateSpeechButton(text, iconClass) {
  if (listenBtn) {
    listenBtn.innerHTML = `<i class="${iconClass}"></i> ${text}`
  }
}

function resetSpeechButton() {
  stopSpeech() // Asegura que cualquier reproducción anterior se detenga
  updateSpeechButton("Escuchar Tema", "fas fa-volume-up")
}

function setupAmbientMusicButton() {
  const music = document.getElementById("backgroundMusic")
  const ambientBtn = document.getElementById("ambientBtn")
  let isPlaying = false

  if (!ambientBtn || !music) return

  // Detectar si es un dispositivo móvil
  const isPhone = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  ambientBtn.addEventListener("click", () => {
    if (!isPlaying) {
      music.volume = isPhone ? 0.02 : 0.05; // Volumen más bajo en móviles
      music.play()
      ambientBtn.textContent = "🔇 Detener Ambiente"
      isPlaying = true
    } else {
      music.pause()
      ambientBtn.textContent = "🌊 Ambientar Aventura"
      isPlaying = false
    }
  })
}

function activateHomeButtonInBottomBar() {
  const pageButtons = document.querySelectorAll(".page-btn")
  pageButtons.forEach((btn) => {
    if (btn.getAttribute("data-module") === "home") {
      btn.classList.add("active")
    } else {
      btn.classList.remove("active")
    }
  })
}

function openFormModalWithUrl(formUrl) {
  const iframe = document.getElementById("formIframe")
  iframe.src = formUrl
  document.getElementById("formModal").classList.remove("hidden")
}

function closeFormModal() {
  document.getElementById("formModal").classList.add("hidden")
  document.getElementById("formIframe").src = "" // Limpia el contenido
}

window.addEventListener("click", (event) => {
  const modal = document.getElementById("formModal")
  if (event.target === modal) {
    closeFormModal()
  }
})

// Controlador de orientación
function checkOrientation() {
  const warning = document.getElementById('orientation-warning');
  const isMobile = window.innerWidth <= 768; // Incluye tablets
  
  if (isMobile) {
    // Detectar orientación (métodos cruz-navegador)
    const isLandscape = window.matchMedia("(orientation: landscape)").matches || Math.abs(window.orientation) === 90;
    
    if (isLandscape) {
      warning.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      warning.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
}

// Event listeners
window.addEventListener('DOMContentLoaded', checkOrientation);
window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', checkOrientation);

// Detener la síntesis de voz si el usuario recarga o cierra la página
window.addEventListener("beforeunload", () => {
  stopSpeech()
})

window.addEventListener("unload", () => {
  speechSynthesis.cancel()
})
