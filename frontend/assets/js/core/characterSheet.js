const characterData = {
    info: {
        name: '',
        player: '',
        chronicle: '',
        nature: '',
        demeanor: '',
        concept: '',
        affiliation: '',
        faction: '',
        essence: ''
    },
    points: {
        attributes: {
            total: [7, 5, 3], // The player can assign these values to Physical, Social, Mental
            spent: { physical: 0, social: 0, mental: 0 }
        },
        abilities: {
            total: [13, 9, 5], // The player can assign these values to Talents, Skills, Knowledges
            spent: { talents: 0, skills: 0, knowledges: 0 }
        },
        backgrounds: {
            total: 7,
            spent: 0
        },
        freebies: 15,
        experience: 0
    },
    attributes: {
        physical: {
            'Força': 1,
            'Destreza': 1,
            'Vigor': 1
        },
        social: {
            'Carisma': 1,
            'Manipulação': 1,
            'Aparência': 1
        },
        mental: {
            'Percepção': 1,
            'Inteligência': 1,
            'Raciocínio': 1
        }
    },
    abilities: {
        talents: {
            'Prontidão': 1, 'Esportes': 1, 'Briga': 1, 'Lábia': 1, 'Empatia': 1,
            'Expressão': 1, 'Intimidação': 1, 'Liderança': 1, 'Manha': 1, 'Consciência': 1
        },
        skills: {
            'Ofícios': 1, 'Condução': 1, 'Etiqueta': 1, 'Armas de Fogo': 1, 'Armas Brancas': 1,
            'Meditação': 1, 'Furtividade': 1, 'Sobrevivência': 1, 'Tecnologia': 1, 'Artes Marciais': 1
        },
        knowledges: {
            'Acadêmicos': 1, 'Computador': 1, 'Finanças': 1, 'Investigação': 1, 'Direito': 1,
            'Linguística': 1, 'Medicina': 1, 'Ocultismo': 1, 'Política': 1, 'Ciência': 1
        }
    },
    advantages: {
        backgrounds: {
            // Backgrounds are typically added by the player.
            // We can have a list of potential backgrounds or let them be custom.
            // For now, let's represent them as an object.
        },
        spheres: {
            'Correspondência': 0, 'Entropia': 0, 'Forças': 0, 'Vida': 0, 'Mente': 0,
            'Matéria': 0, 'Primórdio': 0, 'Espírito': 0, 'Tempo': 0
        },
        arete: 1,
        willpower: 1,
        quintessence: Array(20).fill('empty'),
    },
    health: [
        { label: 'Escoriado', penalty: 0, state: 'ok' },
        { label: 'Machucado', penalty: -1, state: 'ok' },
        { label: 'Ferido', penalty: -1, state: 'ok' },
        { label: 'Ferido Gravemente', penalty: -2, state: 'ok' },
        { label: 'Espancado', penalty: -2, state: 'ok' },
        { label: 'Aleijado', penalty: -5, state: 'ok' },
        { label: 'Incapacitado', penalty: null, state: 'ok' }
    ]
};

// This file defines the data model.
// Functions to modify this data will be added later,
// likely in this file or in a dedicated state management file.
