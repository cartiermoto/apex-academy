import type { L, Lang } from "./types";

/** Resolve a bilingual string. */
export function t(value: L | undefined, lang: Lang): string {
  if (!value) return "";
  return value[lang] ?? value.es ?? "";
}

/** UI chrome strings (navigation, buttons, states). Course text lives in /content. */
export const ui = {
  appName: { es: "Apex Academy", en: "Apex Academy" },
  tagline: {
    es: "Apex, explicado desde lo que ya sabes como Admin.",
    en: "Apex, explained from what you already know as an Admin.",
  },

  // auth
  signInTitle: { es: "Acceso", en: "Sign in" },
  signInHint: {
    es: "Entra para guardar tu progreso en la nube y seguirlo en cualquier dispositivo.",
    en: "Sign in to save your progress to the cloud and pick it up on any device.",
  },
  signIn: { es: "Iniciar sesión", en: "Sign in" },
  /** the same button on a phone, where the full label leaves no room */
  signInShort: { es: "Entrar", en: "Sign in" },
  backToCourse: { es: "Volver al curso", en: "Back to the course" },
  syncOn: { es: "Progreso sincronizado", en: "Progress synced" },
  syncOff: {
    es: "Progreso solo en este dispositivo",
    en: "Progress on this device only",
  },
  password: { es: "Contraseña", en: "Password" },
  enter: { es: "Entrar", en: "Enter" },
  checking: { es: "Comprobando…", en: "Checking…" },
  email: { es: "Correo", en: "Email" },
  createAccount: { es: "Crear cuenta", en: "Create account" },
  noAccount: { es: "Crear cuenta gratis", en: "Create a free account" },
  haveAccount: { es: "Ya tengo cuenta", en: "I already have an account" },
  forgotPassword: { es: "Olvidé mi contraseña", en: "I forgot my password" },
  sendLink: { es: "Enviar enlace", en: "Send link" },
  passwordRule: { es: "Mínimo 8 caracteres", en: "At least 8 characters" },
  passwordTooShort: { es: "La contraseña debe tener al menos 8 caracteres.", en: "The password must have at least 8 characters." },
  samePassword: { es: "Esa ya es tu contraseña: elige otra.", en: "That is already your password: choose another." },
  wrongCredentials: { es: "Correo o contraseña incorrectos.", en: "Wrong email or password." },
  emailNotConfirmed: { es: "Falta confirmar tu correo: abre el enlace que te enviamos.", en: "Your email is not confirmed yet: open the link we sent you." },
  confirmSent: { es: "Revisa tu correo y abre el enlace para activar la cuenta. Mira también en spam.", en: "Check your email and open the link to activate the account. Look in spam too." },
  resetSent: { es: "Si ese correo tiene cuenta, te llegará un enlace para cambiar la contraseña.", en: "If that email has an account, a link to change the password is on its way." },
  tooManyEmails: { es: "Se han enviado demasiados correos. Inténtalo de nuevo más tarde.", en: "Too many emails were sent. Try again later." },
  authUnavailable: { es: "No se pudo completar. Inténtalo de nuevo.", en: "That could not be completed. Try again." },
  linkProblem: { es: "Ese enlace no se pudo usar aquí. Si era para confirmar tu cuenta, ya está confirmada: entra con tu contraseña.", en: "That link could not be used here. If it was to confirm your account, it is confirmed: sign in with your password." },
  newPassword: { es: "Clave nueva", en: "New password" },
  authTitleSignin: { es: "¿Seguimos?", en: "Shall we?" },
  authTitleSignup: { es: "¿Empezamos?", en: "Ready?" },
  authTitleForgot: { es: "¿Tu clave?", en: "Forgot it?" },
  authSaySignin: { es: "¡Qué bien verte! Entra y seguimos donde lo dejaste.", en: "Good to see you! Sign in and we pick up where you left off." },
  authSaySignup: { es: "¡Hola! Crea tu cuenta y voy módulo a módulo contigo.", en: "Hi! Create your account and I go module by module with you." },
  authSayForgot: { es: "Tranquilidad: dime tu correo y te envío un enlace para cambiarla.", en: "No worries: tell me your email and I will send a link to change it." },
  authSayNewPassword: { es: "Elige una clave nueva y seguimos.", en: "Choose a new password and we carry on." },
  continueWithoutAccount: { es: "Seguir sin cuenta", en: "Continue without an account" },
  savePassword: { es: "Guardar contraseña", en: "Save password" },
  signOut: { es: "Salir", en: "Sign out" },

  // nav / home
  home: { es: "Inicio", en: "Home" },
  modules: { es: "Módulos", en: "Modules" },
  challenges: { es: "Desafíos", en: "Challenges" },
  menu: { es: "Menú", en: "Menu" },
  close: { es: "Cerrar", en: "Close" },
  overallProgress: { es: "Progreso general", en: "Overall progress" },
  continueLearning: { es: "Continuar", en: "Continue" },
  startCourse: { es: "Empezar el curso", en: "Start the course" },
  lessons: { es: "sub-lecciones", en: "sub-lessons" },
  lessonsDone: { es: "completadas", en: "done" },
  minutes: { es: "min", en: "min" },
  comingSoon: { es: "En preparación", en: "In preparation" },
  planned: { es: "Planificado", en: "Planned" },
  locked: { es: "Bloqueado", en: "Locked" },
  unlockedBy: { es: "Se desbloquea al completar", en: "Unlocks on completing" },
  ready: { es: "Disponible", en: "Available" },
  checkpoint: { es: "Checkpoint", en: "Checkpoint" },
  module: { es: "Módulo", en: "Module" },
  challenge: { es: "Desafío", en: "Challenge" },
  whatYouWillBuild: { es: "Lo que vas a construir", en: "What you will build" },

  // lesson chrome
  theory: { es: "Teoría", en: "Theory" },
  quiz: { es: "Quiz", en: "Quiz" },
  exercise: { es: "Ejercicio", en: "Exercise" },
  objectives: { es: "En esta sub-lección", en: "In this sub-lesson" },
  markTheoryRead: { es: "Teoría leída · ir al quiz", en: "Theory read · go to quiz" },
  theoryRead: { es: "Teoría leída", en: "Theory read" },
  next: { es: "Siguiente", en: "Next" },
  previous: { es: "Anterior", en: "Previous" },
  backToHome: { es: "Volver al inicio", en: "Back to home" },
  nextLesson: { es: "Siguiente sub-lección", en: "Next sub-lesson" },
  lessonComplete: { es: "Sub-lección completada", en: "Sub-lesson complete" },
  completedBanner: {
    es: "Teoría, quiz y ejercicio superados. Buen trabajo.",
    en: "Theory, quiz and exercise passed. Nice work.",
  },

  // quiz
  question: { es: "Pregunta", en: "Question" },
  of: { es: "de", en: "of" },
  check: { es: "Comprobar", en: "Check" },
  correct: { es: "Correcto", en: "Correct" },
  incorrect: { es: "Incorrecto", en: "Not quite" },
  selectAllThatApply: {
    es: "Selecciona todas las que apliquen",
    en: "Select all that apply",
  },
  typeYourAnswer: { es: "Escribe tu respuesta", en: "Type your answer" },
  quizResult: { es: "Resultado del quiz", en: "Quiz result" },
  retakeQuiz: { es: "Repetir quiz", en: "Retake quiz" },
  goToExercise: { es: "Ir al ejercicio", en: "Go to exercise" },
  spacedChip: { es: "Repaso espaciado", en: "Spaced review" },
  interleavedChip: { es: "Mixta", en: "Interleaved" },
  predictChip: { es: "Predice el output", en: "Predict the output" },
  errorChip: { es: "Encuentra el error", en: "Find the error" },
  recallChip: { es: "Recuerda sin opciones", en: "Free recall" },

  // exercise
  yourCode: { es: "Tu código", en: "Your code" },
  requirements: { es: "Requisitos", en: "Requirements" },
  validate: { es: "Validar", en: "Validate" },
  validating: { es: "Validando…", en: "Validating…" },
  reset: { es: "Reiniciar", en: "Reset" },
  hint: { es: "Pista", en: "Hint" },
  showHint: { es: "Ver pista", en: "Show hint" },
  nextHintLocked: {
    es: "La siguiente pista se abre tras otro intento fallido.",
    en: "The next hint opens after another failed attempt.",
  },
  allHintsUsed: { es: "No quedan más pistas.", en: "No hints left." },
  saved: { es: "Guardado", en: "Saved" },
  saving: { es: "Guardando…", en: "Saving…" },
  feedback: { es: "Retroalimentación", en: "Feedback" },
  checksPassed: { es: "comprobaciones superadas", en: "checks passed" },
  exercisePassed: { es: "Ejercicio superado", en: "Exercise passed" },
  exerciseFailed: { es: "Todavía no", en: "Not yet" },
  showSolution: { es: "Ver solución", en: "Show solution" },
  hideSolution: { es: "Ocultar solución", en: "Hide solution" },
  solution: { es: "Solución", en: "Solution" },
  solutionLocked: {
    es: "La solución se abre tras usar las 3 pistas.",
    en: "The solution opens after using all 3 hints.",
  },
  optionalCheck: { es: "opcional", en: "optional" },
  attempts: { es: "intentos", en: "attempts" },
  copy: { es: "Copiar", en: "Copy" },
  copied: { es: "Copiado", en: "Copied" },

  // challenge
  components: { es: "Componentes", en: "Components" },
  rubric: { es: "Criterios de evaluación", en: "Evaluation criteria" },
  aiFeedback: { es: "Retroalimentación cualitativa", en: "Qualitative feedback" },
  challengeLockedMsg: {
    es: "Completa el módulo requisito para desbloquear este desafío.",
    en: "Complete the required module to unlock this challenge.",
  },

  // misc
  language: { es: "Idioma", en: "Language" },
  theme: { es: "Tema", en: "Theme" },
  palette: { es: "Paleta de colores", en: "Colour palette" },
  light: { es: "Claro", en: "Light" },
  dark: { es: "Oscuro", en: "Dark" },
  notStarted: { es: "No iniciado", en: "Not started" },
  inProgress: { es: "En progreso", en: "In progress" },
  completed: { es: "Completado", en: "Completed" },
  resetProgress: { es: "Reiniciar progreso", en: "Reset progress" },
  resetProgressConfirm: {
    es: "¿Borrar todo tu progreso y código guardado?",
    en: "Delete all your progress and saved code?",
  },
  storageLocal: { es: "Local", en: "Local" },
  storageNeon: { es: "Neon", en: "Neon" },
} satisfies Record<string, L>;

export type UiKey = keyof typeof ui;
