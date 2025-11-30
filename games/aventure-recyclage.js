// Données des niveaux du jeu
const levels = [
    {
        name: "Parc municipal",
        background: "🌳",
        items: [
            { id: 1, name: 'Bouteille en plastique', type: 'recyclable', icon: '🥤' },
            { id: 2, name: 'Journal', type: 'recyclable', icon: '📰' },
            { id: 3, name: 'Mégot', type: 'dangereux', icon: '🚬' },
            { id: 4, name: 'Mouchoir', type: 'ordures', icon: '🧻' },
            { id: 5, name: 'Pomme', type: 'compost', icon: '🍎' }
        ]
    },
    {
        name: "Plage",
        background: "🏖️",
        items: [
            { id: 6, name: 'Bouteille en verre', type: 'verre', icon: '🍾' },
            { id: 7, name: 'Sac plastique', type: 'recyclable', icon: '🛍️' },
            { id: 8, name: 'Coquillage', type: 'naturel', icon: '🐚' },
            { id: 9, name: 'Mégot', type: 'dangereux', icon: '🚬' },
            { id: 10, name: 'Canette', type: 'recyclable', icon: '🥫' }
        ]
    },
    {
        name: "Centre-ville",
        background: "🏙️",
        items: [
            { id: 11, name: 'Ticket de métro', type: 'ordures', icon: '🎫' },
            { id: 12, name: 'Bouteille en verre', type: 'verre', icon: '🍾' },
            { id: 13, name: 'Mouchoir', type: 'ordures', icon: '🧻' },
            { id: 14, name: 'Boîte à pizza', type: 'compost', icon: '🍕' },
            { id: 15, name: 'Bouchon en liège', type: 'recyclable', icon: '🍾' }
        ]
    }
];

// État du jeu
let currentLevel = 0;
let score = 0;
let lives = 3;

// Éléments du DOM
const levelTitle = document.getElementById('level-title');
const levelBackground = document.getElementById('level-background');
const itemsContainer = document.getElementById('items-container');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const messageArea = document.getElementById('message-area');
const nextLevelBtn = document.getElementById('next-level');

// Types de poubelles et leurs propriétés
const binTypes = {
    'recyclable': { emoji: '♻️', color: '#4caf50' },
    'verre': { emoji: '🥛', color: '#2196f3' },
    'compost': { emoji: '🌱', color: '#8d6e63' },
    'ordures': { emoji: '🗑️', color: '#9e9e9e' },
    'dangereux': { emoji: '⚠️', color: '#f44336' },
    'naturel': { emoji: '🌿', color: '#4caf50' }
};

// Initialisation du jeu
function initGame() {
    currentLevel = 0;
    score = 0;
    lives = 3;
    updateScore();
    updateLives();
    loadLevel(currentLevel);
}

// Charge un niveau
function loadLevel(levelIndex) {
    if (levelIndex >= levels.length) {
        showMessage('Félicitations ! Vous avez terminé toutes les missions de recyclage !', 'success');
        nextLevelBtn.style.display = 'none';
        return;
    }

    const level = levels[levelIndex];
    levelTitle.textContent = `Mission : ${level.name} ${level.background}`;
    levelBackground.textContent = level.background;
    
    // Afficher les items
    renderItems(level.items);
    
    // Créer les poubelles
    renderBins(level.items);
    
    // Cacher le bouton niveau suivant
    nextLevelBtn.style.display = 'none';
    
    // Message d'introduction
    showMessage(`Triez les déchets dans le parc ${level.background}`, 'info');
}

// Affiche les objets à trier
function renderItems(items) {
    itemsContainer.innerHTML = '';
    
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        itemElement.draggable = true;
        itemElement.dataset.id = item.id;
        itemElement.dataset.type = item.type;
        itemElement.innerHTML = `
            <div class="item-icon">${item.icon}</div>
            <div>${item.name}</div>
        `;
        
        // Ajouter l'événement de glisser
        itemElement.addEventListener('dragstart', handleDragStart);
        
        itemsContainer.appendChild(itemElement);
    });
}

// Crée les poubelles en fonction des types d'objets du niveau
function renderBins(items) {
    const binsContainer = document.getElementById('bins-container');
    binsContainer.innerHTML = '';
    
    // Trouver tous les types uniques d'objets pour ce niveau
    const uniqueTypes = [...new Set(items.map(item => item.type))];
    
    uniqueTypes.forEach(type => {
        if (binTypes[type]) {
            const bin = document.createElement('div');
            bin.className = 'bin';
            bin.dataset.type = type;
            bin.style.backgroundColor = binTypes[type].color;
            
            bin.innerHTML = `
                <div class="bin-icon">${binTypes[type].emoji}</div>
                <div class="bin-label">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
            `;
            
            // Ajouter les événements de glisser-déposer
            bin.addEventListener('dragover', handleDragOver);
            bin.addEventListener('dragleave', handleDragLeave);
            bin.addEventListener('drop', handleDrop);
            
            binsContainer.appendChild(bin);
        }
    });
}

// Gestion du glisser-déposer
function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.id);
    e.target.classList.add('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    this.classList.add('drag-over');
}

function handleDragLeave() {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    
    const itemId = e.dataTransfer.getData('text/plain');
    const itemElement = document.querySelector(`.item[data-id="${itemId}"]`);
    const itemType = itemElement.dataset.type;
    const binType = this.dataset.type;
    
    if (itemType === binType) {
        // Bonne réponse
        score += 10;
        updateScore();
        itemElement.style.display = 'none';
        showMessage('Bien joué !', 'success');
        
        // Vérifier si tous les objets sont triés
        const remainingItems = document.querySelectorAll('.item:not([style*="display: none"])');
        if (remainingItems.length === 0) {
            showMessage('Niveau réussi !', 'success');
            nextLevelBtn.style.display = 'inline-block';
        }
    } else {
        // Mauvaise réponse
        lives--;
        updateLives();
        showMessage(`Oups ! Ce n'est pas la bonne poubelle pour ce déchet.`, 'error');
        
        if (lives <= 0) {
            showMessage('Partie terminée ! Essayez à nouveau.', 'error');
            setTimeout(initGame, 2000);
        }
    }
}

// Passe au niveau suivant
function nextLevel() {
    currentLevel++;
    loadLevel(currentLevel);
}

// Met à jour l'affichage du score
function updateScore() {
    scoreElement.textContent = score;
}

// Met à jour l'affichage des vies
function updateLives() {
    livesElement.textContent = '❤️'.repeat(lives);
}

// Affiche un message
function showMessage(message, type) {
    messageArea.textContent = message;
    messageArea.className = type;
    
    if (type === 'error') {
        messageArea.style.animation = 'shake 0.5s';
        setTimeout(() => {
            messageArea.style.animation = '';
        }, 500);
    }
    
    setTimeout(() => {
        if (messageArea.className === type) {
            messageArea.className = '';
        }
    }, 2000);
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    
    // Bouton niveau suivant
    nextLevelBtn.addEventListener('click', nextLevel);
    
    // Bouton d'aide
    document.getElementById('help-btn').addEventListener('click', () => {
        showMessage('Glisse chaque déchet vers la bonne poubelle en fonction de son type !', 'info');
    });
    
    // Bouton nouvelle partie
    document.getElementById('new-game').addEventListener('click', initGame);
});
