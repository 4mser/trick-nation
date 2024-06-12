export type Question = {
    questionText: string;
    options: Array<{
        text: string;
        points: Record<string, number>;
    }>;
};

export const questions: Question[] = [
    {
        questionText: "Escoge una habilidad",
        options: [
            { text: "Viajar en el tiempo", points: { "Sabio": 3, "Aventurero": 1 } },
            { text: "Leer mentes", points: { "Conector": 3, "Sabio": 1 } },
            { text: "Super inteligencia", points: { "Sabio": 4 } },
            { text: "Ser invisible", points: { "Creador": 2, "Aventurero": 2 } },
            { text: "Teletransportación", points: { "Aventurero": 4 } },
            { text: "Manipular la materia", points: { "Creador": 4, "Visionario": 2 } },
            { text: "Curación instantánea", points: { "Guardián": 4 } },
            { text: "Controlar el clima", points: { "Visionario": 3, "Guardián": 1 } },
            { text: "Fuerza sobrehumana", points: { "Guerrero": 4 } },
        ],
    },
    {
        questionText: "Cuando te encuentras en una situación difícil, ¿cuál es tu primer instinto?",
        options: [
            { text: "Buscar consejo de amigos o familiares", points: { "Conector": 4 } },
            { text: "Emprender la aventura que te hará solucionarlo", points: { "Aventurero": 4, "Guerrero": 2 } },
            { text: "Analizar antes de actuar", points: { "Sabio": 4 } },
            { text: "Imaginar soluciones creativas", points: { "Creador": 4 } },
            { text: "Verlo como una oportunidad de aprendizaje", points: { "Visionario": 3, "Sabio": 1 } },
            { text: "Considerar el impacto en los demás", points: { "Guardián": 4 } },
            { text: "Enfrentar el desafío con determinación", points: { "Guerrero": 4 } },
        ],
    },
    {
        questionText: "¿Cuál de estas opciones describe mejor tu enfoque hacia los nuevos proyectos o desafíos?",
        options: [
            { text: "Un rompecabezas para resolver", points: { "Sabio": 4 } },
            { text: "Una oportunidad para colaborar", points: { "Conector": 4 } },
            { text: "Un lienzo en blanco para crear", points: { "Creador": 4 } },
            { text: "Una aventura llena de posibilidades", points: { "Aventurero": 4 } },
            { text: "Un problema para solucionar y ayudar al resto", points: { "Guardián": 4 } },
            { text: "Una chance para innovar", points: { "Visionario": 4 } },
            { text: "Una batalla que ganar", points: { "Guerrero": 4 } },
        ],
    },
    {
        questionText: "¿Qué te gustaría aprender?",
        options: [
            { text: "Supervivencia al aire libre", points: { "Aventurero": 4 } },
            { text: "Ser Autosustentable", points: { "Guardián": 4 } },
            { text: "Conocimientos Ancestrales", points: { "Sabio": 4 } },
            { text: "Artes Plásticas", points: { "Creador": 4 } },
            { text: "Habilidades sociales", points: { "Conector": 4 } },
            { text: "Tecnología futura", points: { "Visionario": 4 } },
            { text: "Artes marciales o defensa personal", points: { "Guerrero": 4 } },
        ],
    },
    {
        questionText: "¿En qué época histórica preferirías vivir?",
        options: [
            { text: "Época de exploradores", points: { "Aventurero": 4 } },
            { text: "Renacimiento", points: { "Creador": 4 } },
            { text: "Revolución industrial", points: { "Visionario": 4 } },
            { text: "Futuro utópico", points: { "Visionario": 3, "Guardián": 1 } },
            { text: "Época de comunidades sostenibles", points: { "Guardián": 4 } },
            { text: "Antigüedad", points: { "Sabio": 4 } },
            { text: "Edad de los guerreros", points: { "Guerrero": 4 } },
        ],
    },
    {
        questionText: "¿Qué tipo de libro prefieres leer?",
        options: [
            { text: "Novela de aventuras", points: { "Aventurero": 4 } },
            { text: "Libro de filosofía", points: { "Sabio": 4 } },
            { text: "Autobiografía de un influyente", points: { "Visionario": 3, "Conector": 1 } },
            { text: "Guía sobre sostenibilidad", points: { "Guardián": 4 } },
            { text: "Poesía o novela gráfica", points: { "Creador": 4 } },
            { text: "Manual de habilidades sociales", points: { "Conector": 4 } },
            { text: "Relato de una batalla épica", points: { "Guerrero": 4 } },
        ],
    },
    {
        questionText: "Tienes un año libre, ¿en qué te enfocarías?",
        options: [
            { text: "Desarrollar una nueva tecnología", points: { "Visionario": 4 } },
            { text: "Viajar y documentar culturas", points: { "Aventurero": 4 } },
            { text: "Crear una obra de arte", points: { "Creador": 4 } },
            { text: "Iniciar una ONG", points: { "Guardián": 4 } },
            { text: "Investigar y escribir un libro", points: { "Sabio": 4 } },
            { text: "Organizar eventos comunitarios", points: { "Conector": 4 } },
            { text: "Entrenar y ponerte muy fuerte", points: { "Guerrero": 4 } },
        ],
    },
    {
        questionText: "¿Qué frase resuena más contigo?",
        options: [
            { text: "No todos los que deambulan están perdidos", points: { "Aventurero": 4 } },
            { text: "Sé el cambio que quieres ver en el mundo", points: { "Guardián": 4 } },
            { text: "La verdadera sabiduría está en saber que no sabes nada", points: { "Sabio": 4 } },
            { text: "La creatividad es inteligencia divirtiéndose", points: { "Creador": 4 } },
            { text: "Solo juntos podemos hacer el mañana mejor", points: { "Conector": 4 } },
            { text: "El futuro pertenece a quienes creen en la belleza de sus sueños", points: { "Visionario": 4 } },
            { text: "Donde hay voluntad, hay un camino", points: { "Guerrero": 4 } },
        ],
    },
    {
        questionText: "¿Qué actividad te resulta más gratificante?",
        options: [
            { text: "Explorar nuevos lugares", points: { "Aventurero": 4 } },
            { text: "Ayudar a los demás", points: { "Guardián": 4 } },
            { text: "Aprender cosas nuevas", points: { "Sabio": 4 } },
            { text: "Crear algo único", points: { "Creador": 4 } },
            { text: "Conectar con personas", points: { "Conector": 4 } },
            { text: "Innovar y pensar en el futuro", points: { "Visionario": 4 } },
            { text: "Participar en deportes extremos", points: { "Guerrero": 4 } },
        ],
    },
    {
        questionText: "¿Qué te motiva más en la vida?",
        options: [
            { text: "Descubrir y experimentar", points: { "Aventurero": 4 } },
            { text: "Proteger y conservar", points: { "Guardián": 4 } },
            { text: "Aprender y comprender", points: { "Sabio": 4 } },
            { text: "Crear e innovar", points: { "Creador": 4 } },
            { text: "Conectar y colaborar", points: { "Conector": 4 } },
            { text: "Soñar y planificar", points: { "Visionario": 4 } },
            { text: "Superar y conquistar", points: { "Guerrero": 4 } },
        ],
    },
];
