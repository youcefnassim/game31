// Configuration du jeu
const gameConfig = {
    score: 0,
    level: 1,
    maxLevel: 3,
    items: [],
    bins: [
        { id: 'plastic', name: 'Plastique', emoji: '🧴', color: '#2196f3', items: [] },
        { id: 'paper', name: 'Papier/Carton', emoji: '📦', color: '#ffc107', items: [] },
        { id: 'metal', name: 'Métal', emoji: '🥫', color: '#9e9e9e', items: [] },
        { id: 'glass', name: 'Verre', emoji: '🥃', color: '#4caf50', items: [] },
        { id: 'trash', name: 'Poubelle', emoji: '🗑️', color: '#212121', items: [] }
    ],
    gameItems: [
        // Niveau 1 - Facile
        [
            { id: 1, name: 'Bouteille en plastique', type: 'plastic', emoji: '🧴', points: 10 },
            { id: 2, name: 'Brique de lait', type: 'paper', emoji: '🥛', points: 10 },
            { id: 3, name: 'Boîte de conserve', type: 'metal', emoji: '🥫', points: 15 },
            { id: 4, name: 'Bocal en verre', type: 'glass', emoji: '🥃', points: 15 },
            { id: 5, name: 'Barquette en polystyrène', type: 'trash', emoji: '🍱', points: 5 }
        ],
        // Niveau 2 - Moyen
        [
            { id: 6, name: 'Film plastique', type: 'trash', emoji: '📦', points: 5 },
            { id: 7, name: 'Bouteille en verre coloré', type: 'glass', emoji: '🍷', points: 15 },
            { id: 8, name: 'Canette en aluminium', type: 'metal', emoji: '🥤', points: 15 },
            { id: 9, name: 'Carton à pizza sale', type: 'trash', emoji: '🍕', points: 5 },
            { id: 10, name: 'Bidon de lessive', type: 'plastic', emoji: '🧴', points: 10 },
            { id: 11, name: 'Magazine', type: 'paper', emoji: '📚', points: 10 }
        ],
        // Niveau 3 - Difficile
        [
            { id: 12, name: 'Barquette en aluminium', type: 'metal', emoji: '🥡', points: 15 },
            { id: 13, name: 'Pot de yaourt en plastique', type: 'plastic', emoji: '🥛', points: 10 },
            { id: 14, name: 'Bouteille d\'huile en verre', type: 'trash', emoji: '🫒', points: 5 },
            { id: 15, name: 'Brique de jus', type: 'paper', emoji: '🧃', points: 10 },
            { id: 16, name: 'Couvercle en métal', type: 'metal', emoji: '🥫', points: 15 },
            { id: 17, name: 'Sachet de thé', type: 'trash', emoji: '🍵', points: 5 },
            { id: 18, name: 'Bouteille de parfum', type: 'glass', emoji: '💄', points: 15 }
        ]
    ]
};

// Initialisation du jeu
function initGame() {
    loadLevel(1);
    setupDragAndDrop();
    updateScore();
    showMessage(`Niveau ${gameConfig.level} - Trie les emballages dans le bon bac !`, 'info');
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
    document.getElementById('level-indicator').style.width = `${(level / gameConfig.maxLevel) * 100}%`;
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

// Afficher les emballages
function renderItems() {
    const itemsContainer = document.getElementById('items-container');
    itemsContainer.innerHTML = '';
    
    gameConfig.items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'packaging-item';
        itemElement.draggable = true;
        itemElement.dataset.id = item.id;
        itemElement.innerHTML = `
            <div class="item-emoji">${item.emoji}</div>
            <div class="item-name">${item.name}</div>
        `;
        
        // Style spécial pour l'élément en cours de déplacement
        itemElement.addEventListener('dragstart', function() {
            this.classList.add('dragging');
            // Stocker l'ID de l'élément en cours de déplacement
            this.setAttribute('data-dragging', 'true');
        });
        
        itemElement.addEventListener('dragend', function() {
            this.classList.remove('dragging');
            this.removeAttribute('data-dragging');
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
        
        // Ajouter un effet de survol pour indiquer où déposer
        binElement.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('bin-hover');
        });
        
        binElement.addEventListener('dragleave', function() {
            this.classList.remove('bin-hover');
        });
        
        binElement.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('bin-hover');
            
            const itemId = parseInt(document.querySelector('.packaging-item[data-dragging="true"]')?.dataset.id);
            const item = gameConfig.items.find(i => i.id === itemId);
            const binType = this.dataset.type;
            
            if (item) {
                handleItemDrop(item, binType);
            }
        });
        
        binsContainer.appendChild(binElement);
    });
}

// Gérer le dépôt d'un élément
function handleItemDrop(item, binType) {
    const itemElement = document.querySelector(`.packaging-item[data-id="${item.id}"]`);
    
    if (!itemElement) return;
    
    // Vérifier si le tri est correct
    if (item.type === binType) {
        // Bon tri
        gameConfig.score += item.points;
        
        // Mettre à jour l'interface
        itemElement.classList.add('correct');
        showMessage(`Bien joué ! +${item.points} points`, 'success');
        
        // Retirer l'élément de la liste des items
        gameConfig.items = gameConfig.items.filter(i => i.id !== item.id);
        
        // Ajouter l'élément au bon bac
        const bin = gameConfig.bins.find(b => b.id === binType);
        if (bin) {
            bin.items.push(item);
            const binElement = document.querySelector(`.bin[data-type="${binType}"] .bin-items`);
            if (binElement) {
                const itemInBin = document.createElement('div');
                itemInBin.className = 'item-in-bin';
                itemInBin.innerHTML = item.emoji;
                binElement.appendChild(itemInBin);
            }
        }
        
        // Vérifier si tous les éléments sont triés
        if (gameConfig.items.length === 0) {
            if (gameConfig.level < gameConfig.maxLevel) {
                setTimeout(() => {
                    loadLevel(gameConfig.level + 1);
                    showMessage(`Niveau ${gameConfig.level + 1} - Excellent !`, 'success');
                }, 1000);
            } else {
                showMessage('Félicitations ! Tu as trié tous les emballages !', 'success');
                document.getElementById('next-level-btn').style.display = 'none';
            }
        }
    } else {
        // Mauvais tri
        gameConfig.score = Math.max(0, gameConfig.score - 5);
        itemElement.classList.add('incorrect');
        showMessage('Oups ! Mauvais bac ! -5 points', 'error');
        
        // Réinitialiser le style après l'animation
        setTimeout(() => {
            itemElement.classList.remove('incorrect');
        }, 500);
    }
    
    updateScore();
}

// Configuration du glisser-déposer
function setupDragAndDrop() {
    const items = document.querySelectorAll('.packaging-item');
    
    // Activer le glisser-déposer pour les éléments
    items.forEach(item => {
        item.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.dataset.id);
            this.classList.add('dragging');
        });
        
        item.addEventListener('dragend', function() {
            this.classList.remove('dragging');
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
