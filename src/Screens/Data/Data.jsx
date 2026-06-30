export const listaChats = [
    {
        id: 1,
        nombre: "Julián Alarcón",
        hora: "08:12",
        mensaje: "Che, ¿al final pudiste descargar el programa ese?",
        noLeidos: 1,
        mensajes: [
            { id: 1, texto: "Che, ¿al final pudiste descargar el programa ese?", hora: "08:10", tipo: "received" },
            { id: 2, texto: "Sí! Me costó pero lo bajé", hora: "08:12", tipo: "sent" },
        ]
    },
    {
        id: 2,
        nombre: "Paula Benítez",
        hora: "10:45",
        mensaje: "Avisame cuando estés por salir así te espero abajo.",
        noLeidos: 5,
        mensajes: [
            { id: 1, texto: "Hola! ¿a qué hora salís?", hora: "10:30", tipo: "received" },
            { id: 2, texto: "En unos 20 minutos", hora: "10:35", tipo: "sent" },
            { id: 3, texto: "Avisame cuando estés por salir así te espero abajo.", hora: "10:45", tipo: "received" },
        ]
    },
    {
        id: 3,
        nombre: "Gonzalo Martínez",
        hora: "13:20",
        mensaje: "No sabés el frío que hace acá, traete una campera.",
        noLeidos: 2,
        mensajes: [
            { id: 1, texto: "¿Venís para acá?", hora: "13:10", tipo: "received" },
            { id: 2, texto: "Sí, en un rato salgo", hora: "13:15", tipo: "sent" },
            { id: 3, texto: "No sabés el frío que hace acá, traete una campera.", hora: "13:20", tipo: "received" },
        ]
    },
    {
        id: 4,
        nombre: "Victoria Rossi",
        hora: "16:10",
        mensaje: "Te mandé una foto de lo que compramos, ¿te gusta?",
        noLeidos: 0,
        mensajes: [
            { id: 1, texto: "Fuimos de compras hoy!", hora: "15:50", tipo: "received" },
            { id: 2, texto: "Qué compraron?", hora: "16:00", tipo: "sent" },
            { id: 3, texto: "Te mandé una foto de lo que compramos, ¿te gusta?", hora: "16:10", tipo: "received" },
        ]
    },
    {
        id: 5,
        nombre: "Matías Fernández",
        hora: "19:55",
        mensaje: "¡Feliz cumple loco! Espero que la pases de diez.",
        noLeidos: 0,
        mensajes: [
            { id: 1, texto: "¡Feliz cumple loco! Espero que la pases de diez.", hora: "19:55", tipo: "received" },
            { id: 2, texto: "Gracias mati!! 🎉", hora: "20:01", tipo: "sent" },
        ]
    }
];