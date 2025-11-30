// Configuration du jeu
const gameConfig = {
    score: 0,
    level: 1,
    maxLevel: 3,
    items: [],
    bins: [
        { id: 'recyclable', name: 'Recyclables', emoji: '♻️', items: [] },
        { id: 'glass', name: 'Verre', emoji: '🥛', items: [] },
        { id: 'trash', name: 'Déchets', emoji: '🗑️', items: [] },
        { id: 'hazardous', name: 'Dangereux', emoji: '⚠️', items: [] }
    ],
    beachItems: [
        // Niveau 1 - Facile
        [
            { id: 1, name: 'Bouteille en plastique', type: 'recyclable', emoji: '🧴', points: 10 },
            { id: 2, name: 'Canette', type: 'recyclable', emoji: '🥫', points: 10 },
            { id: 3, name: 'Bouteille en verre', type: 'glass', emoji: '🍾', points: 15 },
            { id: 4, name: 'Mégot', type: 'hazardous', emoji: '🚬', points: 20 },
            { id: 5, name: 'Sac plastique', type: 'trash', emoji: '🛍️', points: 5 }
        ],
        // Niveau 2 - Moyen
        [
            { id: 6, name: 'Filet de pêche', type: 'hazardous', emoji: '🎣', points: 20 },
            { id: 7, name: 'Boîte de conserve', type: 'recyclable', emoji: '🥫', points: 10 },
            { id: 8, name: 'Bouchon en liège', type: 'recyclable', emoji: '🍾', points: 5 },
            { id: 9, name: 'Briquet', type: 'hazardous', emoji: '🔥', points: 20 },
            { id: 10, name: 'Mouchoir en papier', type: 'trash', emoji: '🧻', points: 5 }
        ],
        // Niveau 3 - Difficile
        [
            { id: 11, name: 'Batterie', type: 'hazardous', emoji: '🔋', points: 25 },
            { id: 12, name: 'Verre brisé', type: 'glass', emoji: '🥃', points: 15 },
            { id: 13, name: 'Papier d\'emballage', type: 'recyclable', emoji: '📦', points: 10 },
            { id: 14, name: 'Mégot mouillé', type: 'hazardous', emoji: '🚬', points: 20 },
            { id: 15, name: 'Couvercle en métal', type: 'recyclable', emoji: '🥫', points: 10 }
        ]
    ]
};

// Initialisation du jeu
function initGame() {
    loadLevel(1);
    setupDragAndDrop();
    updateScore();
    showMessage(`Niveau ${gameConfig.level} - Nettoie la plage en triant les déchets !`, 'info');
}

// Chargement d'un niveau
function loadLevel(level) {
    gameConfig.level = level;
    gameConfig.items = [...gameConfig.beachItems[level - 1]];
    gameConfig.bins.forEach(bin => bin.items = []);
    
    // Mise à jour de l'interface
    document.getElementById('level-display').textContent = `Niveau ${level}`;
    renderItems();
    renderBeach();
}

// Affichage des déchets sur la plage
function renderBeach() {
    const beach = document.getElementById('beach-area');
    beach.innerHTML = '';
    
    gameConfig.items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'beach-item';
        itemElement.draggable = true;
        itemElement.dataset.id = item.id;
        itemElement.innerHTML = `
            <div class="item-emoji">${item.emoji}</div>
            <div class="item-name">${item.name}</div>
        `;
        
        // Ajout d'un effet de vague aléatoire
        const randomX = Math.random() * 80;
        const randomY = Math.random() * 30;
        itemElement.style.left = `${randomX}%`;
        itemElement.style.top = `${randomY}%`;
        
        beach.appendChild(itemElement);
    });
}

// Configuration du glisser-déposer
function setupDragAndDrop() {
    const beach = document.getElementById('beach-area');
    const bins = document.querySelectorAll('.bin');
    
    // Événements pour les éléments de la plage
    document.addEventListener('dragstart', function(e) {
        if (e.target.classList.contains('beach-item')) {
            e.dataTransfer.setData('text/plain', e.target.dataset.id);
            e.target.classList.add('dragging');
        }
    });
    
    document.addEventListener('dragend', function(e) {
        if (e.target.classList.contains('beach-item')) {
            e.target.classList.remove('dragging');
        }
    });
    
    // Événements pour les poubelles
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
            
            if (item && item.type === binType) {
                // Bon tri
                gameConfig.score += item.points;
                gameConfig.items = gameConfig.items.filter(i => i.id !== itemId);
                showMessage(`Bien joué ! +${item.points} points`, 'success');
                
                // Animation de succès
                this.classList.add('success');
                setTimeout(() => this.classList.remove('success'), 1000);
                
                // Vérifier si tous les déchets sont triés
                if (gameConfig.items.length === 0) {
                    if (gameConfig.level < gameConfig.maxLevel) {
                        setTimeout(() => {
                            loadLevel(gameConfig.level + 1);
                            showMessage(`Niveau ${gameConfig.level + 1} - La plage est plus propre !`, 'info');
                        }, 1000);
                    } else {
                        setTimeout(() => {
                            showMessage('Félicitations ! Tu as nettoyé toute la plage !', 'success');
                            document.getElementById('next-level-btn').style.display = 'none';
                        }, 1000);
                    }
                }
            } else {
                // Mauvais tri
                gameConfig.score = Math.max(0, gameConfig.score - 5);
                showMessage('Oups ! Mauvais bac ! -5 points', 'error');
                
                // Animation d'erreur
                this.classList.add('error');
                setTimeout(() => this.classList.remove('error'), 1000);
            }
            
            updateScore();
            renderBeach();
        });
    });
}

// Affichage d'un message
function showMessage(message, type = 'info') {
    const messageArea = document.getElementById('message-area');
    messageArea.textContent = message;
    messageArea.className = `message-${type}`;
    
    if (type === 'error') {
        // Animation de secousse pour les erreurs
        messageArea.classList.add('shake');
        setTimeout(() => messageArea.classList.remove('shake'), 500);
    }
}

// Mise à jour du score
function updateScore() {
    document.getElementById('score-value').textContent = gameConfig.score;
}

// Fonction pour passer au niveau suivant
function nextLevel() {
    if (gameConfig.level < gameConfig.maxLevel) {
        loadLevel(gameConfig.level + 1);
        showMessage(`Niveau ${gameConfig.level} - La plage est plus propre !`, 'info');
    } else {
        showMessage('Tu as terminé tous les niveaux !', 'success');
        document.getElementById('next-level-btn').style.display = 'none';
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', initGame);
