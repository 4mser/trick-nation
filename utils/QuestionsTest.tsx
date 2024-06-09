// types/questions.ts
export type Question = {
    questionText: string;
    options: Array<{
        text: string;
        points: Record<string, number>;
    }>;
};

export const questions: Question[] = [
    {
        questionText: "Elige un superpoder",
        options: [
            { text: "Viajar en el tiempo", points: { "Sabio": 2, "Aventurero": 1 } },
            { text: "Telepatía", points: { "Conector": 3 } },
            { text: "Super Inteligencia", points: { "Sabio": 3 } },
            { text: "Invisibilidad", points: { "Creador": 2, "Aventurero": 1 } },
            { text: "Teletransportación", points: { "Aventurero": 3 } },
            { text: "Manipulación de la materia", points: { "Creador": 3, "Visionario": 1 } },
            { text: "Curación instantánea", points: { "Guardian": 3 } },
            { text: "Control del clima", points: { "Visionario": 2, "Guardian": 1 } },
        ],
    },
    {
        questionText: "Cuando te encuentras en una situación difícil, ¿cuál es tu primer instinto?",
        options: [
            { text: "Buscar consejo o apoyo en tus amigos o familiares", points: { "Conector": 3 } },
            { text: "Enfrentarlo de inmediato, confiando en tu capacidad para superarlo", points: { "Aventurero": 3 } },
            { text: "Analizar la situación detenidamente antes de actuar", points: { "Sabio": 3 } },
            { text: "Imaginar una solución creativa que nadie más haya considerado", points: { "Creador": 3 } },
            { text: "Pensar en cómo esta situación puede ser una oportunidad de aprendizaje o mejora", points: { "Visionario": 2, "Sabio": 1 } },
            { text: "Considerar el impacto de tus acciones en los demás y en el entorno", points: { "Guardian": 3 } },
        ],
    },
    {
        questionText: "¿Cuál de estas opciones describe mejor tu enfoque hacia los nuevos proyectos o desafíos?",
        options: [
            { text: "Un rompecabezas que necesita ser resuelto", points: { "Sabio": 3 } },
            { text: "Una oportunidad para conectar con otros y colaborar", points: { "Conector": 3 } },
            { text: "Un lienzo en blanco listo para ser transformado en arte", points: { "Creador": 3 } },
            { text: "Una aventura emocionante llena de posibilidades inexploradas", points: { "Aventurero": 3 } },
            { text: "Un problema que necesita una solución sostenible y consciente", points: { "Guardian": 3 } },
            { text: "Una chance para innovar y aplicar tecnologías emergentes", points: { "Visionario": 3 } },
        ],
    },
    {
        questionText: "Si tuvieras que enseñar algo, ¿qué te gustaría enseñar?",
        options: [
            { text: "Técnicas de supervivencia y exploración al aire libre", points: { "Aventurero": 3 } },
            { text: "Cómo cultivar tu propio jardín o producir tu comida de manera sostenible", points: { "Guardian": 3 } },
            { text: "Una materia académica, como matemáticas, historia o ciencias", points: { "Sabio": 3 } },
            { text: "Un taller creativo, como pintura, escritura o música", points: { "Creador": 3 } },
            { text: "Habilidades sociales y de comunicación para mejorar las relaciones", points: { "Conector": 3 } },
            { text: "Curso sobre tecnología futura y su impacto en la sociedad", points: { "Visionario": 3 } },
        ],
    },
    {
        questionText: "Si pudieras vivir en cualquier época histórica, ¿cuál elegirías?",
        options: [
            { text: "La época de los grandes exploradores y descubrimientos geográficos", points: { "Aventurero": 3 } },
            { text: "El renacimiento, donde el arte y la creatividad florecieron", points: { "Creador": 3 } },
            { text: "La revolución industrial, un periodo de innovación y cambio tecnológico", points: { "Visionario": 3 } },
            { text: "Una sociedad utópica futura donde la tecnología ha resuelto los principales problemas de la humanidad", points: { "Visionario": 2, "Guardian": 1 } },
            { text: "Una era de comunidades fuertes y cohesionadas, con un enfoque en la sostenibilidad", points: { "Guardian": 3 } },
            { text: "La antigüedad, donde nacieron las bases del conocimiento y la filosofía", points: { "Sabio": 3 } },
        ],
    },
    {
        questionText: "¿Qué tipo de libro preferirías leer en un día tranquilo?",
        options: [
            { text: "Una novela de aventuras que te transporte a lugares exóticos y situaciones emocionantes", points: { "Aventurero": 3 } },
            { text: "Un libro sobre filosofía o psicología que desafíe tu forma de pensar", points: { "Sabio": 3 } },
            { text: "Una autobiografía de una persona influyente que haya cambiado el mundo", points: { "Visionario": 2, "Conector": 1 } },
            { text: "Una guía sobre cómo vivir de manera más sostenible y consciente del medio ambiente", points: { "Guardian": 3 } },
            { text: "Un libro de poesía o una novela gráfica visualmente estimulante", points: { "Creador": 3 } },
            { text: "Un manual sobre cómo mejorar tus habilidades sociales y de comunicación", points: { "Conector": 3 } },
        ],
    },
    {
        questionText: "Imagina que puedes dedicar un año entero a trabajar en cualquier proyecto que desees, sin restricciones económicas. ¿En qué te enfocarías?",
        options: [
            { text: "Desarrollar una nueva tecnología o invento que pueda cambiar la forma en que vivimos", points: { "Visionario": 3 } },
            { text: "Viajar por el mundo documentando diferentes culturas y modos de vida", points: { "Aventurero": 3 } },
            { text: "Crear una obra de arte o un álbum musical que exprese tu visión única del mundo", points: { "Creador": 3 } },
            { text: "Iniciar una organización sin fines de lucro dedicada a una causa en la que crees profundamente", points: { "Guardian": 3 } },
            { text: "Investigar y escribir un libro que aporte una nueva perspectiva sobre un tema que te apasiona", points: { "Sabio": 3 } },
            { text: "Organizar una serie de eventos comunitarios que fomenten la conexión y el apoyo mutuo", points: { "Conector": 3 } },
        ],
    },
    {
        questionText: "¿Cuál de estas frases resuena más contigo?",
        options: [
            { text: "No todos los que deambulan están perdidos", points: { "Aventurero": 3 } },
            { text: "Sé el cambio que quieres ver en el mundo", points: { "Guardian": 3 } },
            { text: "La verdadera sabiduría está en saber que no sabes", points: { "Sabio": 3 } },
            { text: "La creatividad es la inteligencia divirtiéndose", points: { "Creador": 3 } },
            { text: "Solo juntos podemos hacer que el mañana sea mejor", points: { "Conector": 3 } },
            { text: "El futuro pertenece a quienes creen en la belleza de sus sueños", points: { "Visionario": 3 } },
        ],
    }
];
