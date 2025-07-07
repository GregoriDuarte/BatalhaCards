document.addEventListener('DOMContentLoaded', () => {

const warriorsData = [
  { id: 'guardiao',  name: 'Guardião Real',   icon: '🛡️',
    attack: 85,  defense: 120, image: 'IMG/guardiao.png' },

  { id: 'colosso',   name: 'Colosso do Norte', icon: '🪓',
    attack: 110, defense: 80,  image: 'IMG/colosso.png' },

  { id: 'vigia',     name: 'Vigia Sombrio',   icon: '🏹',
    attack: 95,  defense: 70,  image: 'IMG/vigia.png' },

  { id: 'arcano',    name: 'Arcano Supremo',  icon: '✴️',
    attack: 130, defense: 50,  image: 'IMG/arcano.png' },

  { id: 'luz',       name: 'Luz Celestial',   icon: '⚡',
    attack: 90,  defense: 110, image: 'IMG/luz.png' },

  { id: 'lamina',    name: 'Lâmina Oculta',   icon: '🔪',
    attack: 120, defense: 60,  image: 'IMG/lamina.png' },

  { id: 'gladiador', name: 'Gladiador de Ferro', icon: '⚔️',
    attack: 100, defense: 90,  image: 'IMG/gladiador.png' },

  { id: 'furia',     name: 'Fúria Rubra', icon: '🔥',
    attack: 140, defense: 40,  image: 'IMG/furia.png' },

  { id: 'cruzado',   name: 'Cruzado Azul', icon: '🛡️',
    attack: 80,  defense: 130, image: 'IMG/cruzado.png' },

  { id: 'sentinela', name: 'Sentinela Dourado', icon: '🔱',
    attack: 105, defense: 75,  image: 'IMG/sentinela.png' }
];


    const warriorGrid = document.getElementById('warrior-grid');
    const arenas = document.querySelectorAll('.arena');
    const statusText = document.getElementById('status-text');
    const battleLog = document.getElementById('battle-log');
    const resetButton = document.getElementById('reset-button');
    
    let draggedCard = null;
    let arenaState = { 'arena-1': null, 'arena-2': null };

    // 1. Cria os cards dos guerreiros
    function createWarriorCards() {
        warriorsData.forEach(data => {
            const card = document.createElement('div');
            card.className = 'warrior-card';
            card.id = data.id;
            card.draggable = true;
            
            card.innerHTML = `
             <img src="${data.image}" alt="${data.name}" class="warrior-image">

                <div class="warrior-header">
                    <strong>${data.name}</strong>
                    <span class="icon">${data.icon}</span>
                </div>
                <div class="warrior-stats">
                    <div><span>Ataque:</span> <span>${data.attack}</span></div>
                    <div><span>Defesa:</span> <span>${data.defense}</span></div>
                </div>
            `;
            warriorGrid.appendChild(card);
        });
    }

    // 2. Drag and Drop
    function addDragDropListeners() {
        const cards = document.querySelectorAll('.warrior-card');
        cards.forEach(card => {
            card.addEventListener('dragstart', (e) => {
                draggedCard = e.target;
                e.target.classList.add('dragging');
            });

            card.addEventListener('dragend', (e) => {
                e.target.classList.remove('dragging');
                draggedCard = null;
            });
        });

        arenas.forEach(arena => {
            arena.addEventListener('dragover', (e) => {
                e.preventDefault(); // Permite o drop
                if (!arena.hasChildNodes() || arena.querySelector('.placeholder')) {
                    arena.classList.add('drag-over');
                }
            });

            arena.addEventListener('dragleave', () => {
                arena.classList.remove('drag-over');
            });

            arena.addEventListener('drop', (e) => {
                e.preventDefault();
                arena.classList.remove('drag-over');

                // Permissao para soltar com a arena vazia 
                if ((!arena.hasChildNodes() || arena.querySelector('.placeholder')) && draggedCard) {
                    const placeholder = arena.querySelector('.placeholder');
                    if(placeholder) placeholder.remove();
                    
                    arena.appendChild(draggedCard);
                    arenaState[arena.id] = draggedCard.id;
                    checkCombatReady();
                }
            });
        });
    }
    
    // 3. Verifica se as arenas estão com os guerreiros
    function checkCombatReady() {
        if (arenaState['arena-1'] && arenaState['arena-2']) {
            statusText.textContent = "BATALHA IMINENTE!";
            setTimeout(startCombat, 1000); // Delay
        }
    }

    // 4. Lógica de Combate
    function startCombat() {
        const warrior1Data = warriorsData.find(w => w.id === arenaState['arena-1']);
        const warrior2Data = warriorsData.find(w => w.id === arenaState['arena-2']);

        // Lógica de dano
        const score1 = warrior1Data.attack - warrior2Data.defense;
        const score2 = warrior2Data.attack - warrior1Data.defense;
        
        let winnerMessage;

        if (score1 > score2) {
            winnerMessage = `🏆 ${warrior1Data.name} VENCEU! Seu poder de ataque (${score1}) superou o do oponente (${score2}).`;
        } else if (score2 > score1) {
            winnerMessage = `🏆 ${warrior2Data.name} VENCEU! Seu poder de ataque (${score2}) superou o do oponente (${score1}).`;
        } else {
            winnerMessage = `EMPATE! Os guerreiros mostraram forças iguais!`;
        }
        
        statusText.textContent = "RESULTADO DA BATALHA";
        battleLog.textContent = winnerMessage;
    }

    // 5. Resetar
    function resetGame() {
    // Limpa o estado das arenas
    arenaState = { 'arena-1': null, 'arena-2': null };
    
    // Limpa o conteúdo das arenas e devolve os cards
    arenas.forEach(arena => {
        const child = arena.querySelector('.warrior-card');
        if (child) {
            warriorGrid.appendChild(child);
        }

        // Só limpa a arena, sem afetar a div de controles ou botões
        if (!arena.querySelector('.placeholder')) {
            arena.innerHTML = `<span class="placeholder">Guerreiro ${arena.id.split('-')[1]}</span>`;
        }
    });

    // Reseta os textos
    statusText.textContent = "AGUARDANDO GUERREIROS";
    battleLog.textContent = "Arena Medieval! Arraste dois guerreiros para as arenas!";
}


    // Inicia o jogo
    createWarriorCards();
    addDragDropListeners();
    resetButton.addEventListener('click', resetGame);
});
