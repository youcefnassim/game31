// Configuration du jeu
const gameConfig = {
    score: 0,
    level: 1,
    maxLevel: 3,
    items: [],
    correctBin: 'yellow',
    bins: [
        { id: 'yellow', name: 'Bac Jaune', emoji: '🟡', color: '#ffeb3b', items: [] },
        { id: 'blue', name: 'Bac Bleu', emoji: '🔵', color: '#2196f3', items: [] },
        { id: 'green', name: 'Bac Vert', emoji: '🟢', color: '#4caf50', items: [] },
        { id: 'black', name: 'Poubelle', emoji: '⚫', color: '#212121', items: [] }
    ],
    gameItems: [
        // Niveau 1 - Facile
        [
            { id: 1, name: 'Bouteille en plastique', type: 'yellow', emoji: '🧴', points: 10 },
            { id: 2, name: 'Brique de lait', type: 'yellow', emoji: '🥛', points: 10 },
            { id: 3, name: 'Journal', type: 'blue', emoji: '📰', points: 15 },
            { id: 4, name: 'Verre à boire', type: 'green', emoji: '🥃', points: 20 },
            { id: 5, name: 'Mouchoir en papier', type: 'black', emoji: '🧻', points: 5 }
        ],
        // Niveau 2 - Moyen
        [
            { id: 6, name: 'Pot de yaourt', type: 'yellow', emoji: '🥛', points: 10 },
            { id: 7, name: 'Boîte de conserve', type: 'yellow', emoji: '🥫', points: 10 },
            { id: 8, name: 'Magazine', type: 'blue', emoji: '📚', points: 15 },
            { id: 9, name: 'Bocal en verre', type: 'green', emoji: '🍶', points: 20 },
            { id: 10, name: 'Barquette en polystyrène', type: 'black', emoji: '🍱', points: 5 }
        ],
        // Niveau 3 - Difficile
        [
            { id: 11, name: 'Sachet de céréales', type: 'yellow', emoji: '🌾', points: 15 },
            { id: 12, name: 'Bouchon en liège', type: 'yellow', emoji: '🍾', points: 10 },
            { id: 13, name: 'Cahier', type: 'blue', emoji: '📓', points: 15 },
            { id: 14, name: 'Ampoule', type: 'green', emoji: '💡', points: 20 },
            { id: 15, name: 'Couche jetable', type: 'black', emoji: '👶', points: 5 }
        ]
    ]
};

// Initialisation du jeu
function initGame() {
    loadLevel(1);
    setupDragAndDrop();
    updateScore();
    showMessage(`Niveau ${gameConfig.level} - Trie les déchets dans le bon bac !`, 'info');
}

// Chargement d'un niveau
function loadLevel(level) {
    gameConfig.level = level;
    gameConfig.items = [...gameConfig.gameItems[level - 1]];
    gameConfig.bins.forEach(bin => bin.items = []);
    
    // Mélanger les items
    gameConfig.items = shuffleArray(gameConfig.items);
    
    // Mise à jour de l'interface
    document.getElementById('level-display').textContent = `Niveau ${level}`;
    renderItems();
    renderBins();
}

// Mélanger un tableau
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Afficher les déchets
function renderItems() {
    const itemsContainer = document.getElementById('items-container');
    itemsContainer.innerHTML = '';
    
    gameConfig.items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'game-item';
        itemElement.draggable = true;
        itemElement.dataset.id = item.id;
        itemElement.innerHTML = `
            <div class="item-emoji">${item.emoji}</div>
            <div class="item-name">${item.name}</div>
        `;
        
        // Style spécial pour l'élément en cours de déplacement
        itemElement.addEventListener('dragstart', function() {
            this.classList.add('dragging');
        });
        
        itemElement.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });
        
        itemsContainer.appendChild(itemElement);
    });
}

// Afficher les bacs
function renderBins() {
    const binsContainer = document.getElementById('bins-container');
    binsContainer.innerHTML = '';
    
    gameConfig.bins.forEach(bin => {
        const binElement = document.createElement('div');
        binElement.className = 'bin';
        binElement.dataset.type = bin.id;
        binElement.innerHTML = `
            <div class="bin-header" style="background-color: ${bin.color}20; border: 2px solid ${bin.color}">
                <div class="bin-emoji">${bin.emoji}</div>
                <div class="bin-name">${bin.name}</div>
            </div>
            <div class="bin-items" data-type="${bin.id}">
                <!-- Les éléments seront ajoutés ici par glisser-déposer -->
            </div>
        `;
        
        binsContainer.appendChild(binElement);
    });
}

// Configuration du glisser-déposer
function setupDragAndDrop() {
    const items = document.querySelectorAll('.game-item');
    const bins = document.querySelectorAll('.bin');
    
    // Événements pour les éléments à trier
    items.forEach(item => {
        item.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.dataset.id);
        });
    });
    
    // Événements pour les bacs
    bins.forEach(bin => {
        bin.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('bin-hover');
        });
        
        bin.addEventListener('dragleave', function() {
            this.classList.remove('bin-hover');
        });
        
        bin.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('bin-hover');
            
            const itemId = parseInt(e.dataTransfer.getData('text/plain'));
            const item = gameConfig.items.find(i => i.id === itemId);
            const binType = this.dataset.type;
            
            if (item) {
                // Vérifier si le tri est correct
                if (item.type === binType) {
                    // Bon tri
                    gameConfig.score += item.points;
                    
                    // Déplacer l'élément vers le bac
                    const itemElement = document.querySelector(`.game-item[data-id="${item.id}"]`);
                    if (itemElement) {
                        const binItems = this.querySelector('.bin-items');
                        itemElement.style.transform = 'scale(0.8)';
                        itemElement.style.opacity = '0.8';
                        binItems.appendChild(itemElement);
                        
                        // Vérifier si tous les éléments sont triés
                        const remainingItems = document.querySelectorAll('.game-item:not(.in-bin)');
                        if (remainingItems.length === 0) {
                            if (gameConfig.level < gameConfig.maxLevel) {
                                setTimeout(() => {
                                    loadLevel(gameConfig.level + 1);
                                    showMessage(`Niveau ${gameConfig.level + 1} - Excellent !`, 'success');
                                }, 1000);
                            } else {
                                showMessage('Félicitations ! Tu as terminé tous les niveaux !', 'success');
                                document.getElementById('next-level-btn').style.display = 'none';
                            }
                        }
                    }
                    
                    showMessage(`Bien joué ! +${item.points} points`, 'success');
                    updateScore();
                } else {
                    // Mauvais tri
                    gameConfig.score = Math.max(0, gameConfig.score - 5);
                    showMessage('Oups ! Ce ne va pas dans ce bac ! -5 points', 'error');
                    updateScore();
                }
            }
        });
    });
}

// Afficher un message
function showMessage(message, type = 'info') {
    const messageArea = document.getElementById('message-area');
    messageArea.textContent = message;
    messageArea.className = `message-${type}`;
    
    if (type === 'error') {
        messageArea.classList.add('shake');
        setTimeout(() => messageArea.classList.remove('shake'), 500);
    }
}

// Mise à jour du score
function updateScore() {
    document.getElementById('score-value').textContent = gameConfig.score;
}

// Passer au niveau suivant
function nextLevel() {
    if (gameConfig.level < gameConfig.maxLevel) {
        loadLevel(gameConfig.level + 1);
        showMessage(`Niveau ${gameConfig.level} - C'est parti !`, 'info');
    } else {
        showMessage('Tu as terminé tous les niveaux !', 'success');
        document.getElementById('next-level-btn').style.display = 'none';
    }
}

// Réinitialiser le jeu
function resetGame() {
    gameConfig.score = 0;
    updateScore();
    loadLevel(1);
    showMessage('Nouvelle partie commencée !', 'info');
    document.getElementById('next-level-btn').style.display = 'inline-block';
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', initGame);
