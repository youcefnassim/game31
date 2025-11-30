// Configuration du jeu
const gameConfig = {
    score: 0,
    level: 1,
    maxLevel: 3,
    timeLimit: 60, // secondes
    timeLeft: 60,
    isPlaying: false,
    timer: null,
    items: [],
    bins: [
        { id: 'white', name: 'Verre blanc', emoji: '🥛', color: '#e0e0e0', items: [] },
        { id: 'green', name: 'Verre vert', emoji: '🍾', color: '#4caf50', items: [] },
        { id: 'brown', name: 'Verre marron', emoji: '🍺', color: '#795548', items: [] },
        { id: 'blue', name: 'Verre bleu', emoji: '🧪', color: '#2196f3', items: [] },
        { id: 'trash', name: 'Non recyclable', emoji: '🚫', color: '#f44336', items: [] }
    ],
    glassItems: [
        // Niveau 1 - Facile
        [
            { id: 1, name: 'Bouteille d\'eau', type: 'white', emoji: '💧', points: 10 },
            { id: 2, name: 'Bouteille de vin blanc', type: 'white', emoji: '🥂', points: 10 },
            { id: 3, name: 'Bouteille de bière', type: 'brown', emoji: '🍺', points: 10 },
            { id: 4, name: 'Bouteille de vin rouge', type: 'green', emoji: '🍷', points: 10 },
            { id: 5, name: 'Flacon de parfum', type: 'trash', emoji: '💄', points: 5 }
        ],
        // Niveau 2 - Moyen
        [
            { id: 6, name: 'Pot de confiture', type: 'white', emoji: '🍯', points: 10 },
            { id: 7, name: 'Bouteille d\'huile', type: 'trash', emoji: '🫒', points: 5 },
            { id: 8, name: 'Bouteille de jus de fruit', type: 'green', emoji: '🧃', points: 10 },
            { id: 9, name: 'Bouteille de cidre', type: 'brown', emoji: '🍏', points: 10 },
            { id: 10, name: 'Flacon de médicament', type: 'trash', emoji: '💊', points: 5 },
            { id: 11, name: 'Bouteille de bière blanche', type: 'white', emoji: '🍺', points: 10 },
            { id: 12, name: 'Bouteille de champagne', type: 'white', emoji: '🍾', points: 15 }
        ],
        // Niveau 3 - Difficile
        [
            { id: 13, name: 'Bocal de conserve', type: 'white', emoji: '🥫', points: 10 },
            { id: 14, name: 'Bouteille de bière brune', type: 'brown', emoji: '🍺', points: 10 },
            { id: 15, name: 'Flacon d\'essence', type: 'trash', emoji: '⛽', points: 5 },
            { id: 16, name: 'Bouteille de limonade', type: 'green', emoji: '🥤', points: 10 },
            { id: 17, name: 'Bouteille de bière verte', type: 'green', emoji: '🍺', points: 10 },
            { id: 18, name: 'Bouteille d\'eau minérale bleue', type: 'blue', emoji: '💧', points: 15 },
            { id: 19, name: 'Bouteille de vin rosé', type: 'white', emoji: '🍷', points: 10 },
            { id: 20, name: 'Bouteille de whisky', type: 'brown', emoji: '🥃', points: 15 }
        ]
    ]
};

// Initialisation du jeu
function initGame() {
    loadLevel(1);
    setupDragAndDrop();
    updateScore();
    updateTimer();
    showMessage(`Niveau ${gameConfig.level} - Trie les verres par couleur !`, 'info');
    
    // Démarrer le tutoriel
    showTutorial();
}

// Afficher le tutoriel
function showTutorial() {
    const tutorial = document.getElementById('tutorial');
    tutorial.style.display = 'block';
    
    // Fermer le tutoriel quand on clique sur le bouton
    document.getElementById('close-tutorial').addEventListener('click', function() {
        tutorial.style.display = 'none';
        startGame();
    });
}

// Démarrer le jeu
function startGame() {
    if (gameConfig.isPlaying) return;
    
    gameConfig.isPlaying = true;
    gameConfig.timeLeft = gameConfig.timeLimit;
    updateTimer();
    
    // Démarrer le minuteur
    gameConfig.timer = setInterval(function() {
        gameConfig.timeLeft--;
        updateTimer();
        
        // Vérifier si le temps est écoulé
        if (gameConfig.timeLeft <= 0) {
            clearInterval(gameConfig.timer);
            endGame();
        }
    }, 1000);
    
    // Activer les éléments
    document.querySelectorAll('.glass-item').forEach(item => {
        item.draggable = true;
    });
}

// Fin du jeu
function endGame() {
    gameConfig.isPlaying = false;
    clearInterval(gameConfig.timer);
    
    // Désactiver le glisser-déposer
    document.querySelectorAll('.glass-item').forEach(item => {
        item.draggable = false;
    });
    
    // Afficher le score final
    const score = Math.max(0, gameConfig.score);
    const message = `Temps écoulé ! Score final : ${score} points`;
    showMessage(message, 'info');
    
    // Afficher le bouton de redémarrage
    document.getElementById('restart-btn').style.display = 'inline-block';
}

// Chargement d'un niveau
function loadLevel(level) {
    gameConfig.level = level;
    gameConfig.items = [...gameConfig.glassItems[level - 1]];
    gameConfig.bins.forEach(bin => bin.items = []);
    
    // Mélanger les items
    gameConfig.items = shuffleArray(gameConfig.items);
    
    // Mise à jour de l'interface
    document.getElementById('level-display').textContent = `Niveau ${level}`;
    document.getElementById('level-indicator').style.width = `${(level / gameConfig.maxLevel) * 100}%`;
    renderItems();
    renderBins();
    
    // Réinitialiser le score pour le niveau
    gameConfig.score = 0;
    updateScore();
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

// Afficher les verres
function renderItems() {
    const itemsContainer = document.getElementById('items-container');
    itemsContainer.innerHTML = '';
    
    gameConfig.items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'glass-item';
        itemElement.draggable = gameConfig.isPlaying;
        itemElement.dataset.id = item.id;
        
        // Créer un élément de verre avec un effet de reflet
        itemElement.innerHTML = `
            <div class="glass-shape" style="background: ${getGlassColor(item.type)}">
                <div class="glass-reflection"></div>
                <div class="glass-content">
                    <div class="item-emoji">${item.emoji}</div>
                    <div class="item-name">${item.name}</div>
                </div>
            </div>
        `;
        
        // Style spécial pour l'élément en cours de déplacement
        itemElement.addEventListener('dragstart', function(e) {
            this.classList.add('dragging');
            e.dataTransfer.setData('text/plain', item.id);
        });
        
        itemElement.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });
        
        itemsContainer.appendChild(itemElement);
    });
}

// Obtenir la couleur du verre
function getGlassColor(type) {
    const colors = {
        'white': 'rgba(255, 255, 255, 0.7)',
        'green': 'rgba(76, 175, 80, 0.7)',
        'brown': 'rgba(121, 85, 72, 0.7)',
        'blue': 'rgba(33, 150, 243, 0.7)',
        'trash': 'rgba(244, 67, 54, 0.7)'
    };
    return colors[type] || '#ffffff';
}

// Afficher les bacs
function renderBins() {
    const binsContainer = document.getElementById('bins-container');
    binsContainer.innerHTML = '';
    
    gameConfig.bins.forEach(bin => {
        const binElement = document.createElement('div');
        binElement.className = 'bin';
        binElement.dataset.type = bin.id;
        
        // Créer un bac avec un style de conteneur de verre
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
            if (!gameConfig.isPlaying) return;
            this.classList.add('bin-hover');
        });
        
        binElement.addEventListener('dragleave', function() {
            this.classList.remove('bin-hover');
        });
        
        binElement.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('bin-hover');
            
            if (!gameConfig.isPlaying) return;
            
            const itemId = parseInt(e.dataTransfer.getData('text/plain'));
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
    const itemElement = document.querySelector(`.glass-item[data-id="${item.id}"]`);
    
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
                clearInterval(gameConfig.timer);
                setTimeout(() => {
                    loadLevel(gameConfig.level + 1);
                    showMessage(`Niveau ${gameConfig.level} - Excellent !`, 'success');
                    startGame();
                }, 1500);
            } else {
                endGame();
                showMessage('Félicitations ! Tu as trié tous les verres !', 'success');
            }
        }
    } else {
        // Mauvais tri
        gameConfig.score = Math.max(0, gameConfig.score - 5);
        gameConfig.timeLeft = Math.max(5, gameConfig.timeLeft - 3); // Pénalité de temps
        itemElement.classList.add('incorrect');
        showMessage('Oups ! Mauvais bac ! -5 points et -3 secondes', 'error');
        
        // Réinitialiser le style après l'animation
        setTimeout(() => {
            itemElement.classList.remove('incorrect');
        }, 500);
    }
    
    updateScore();
    updateTimer();
}

// Configuration du glisser-déposer
function setupDragAndDrop() {
    const items = document.querySelectorAll('.glass-item');
    
    // Activer le glisser-déposer pour les éléments
    items.forEach(item => {
        item.addEventListener('dragstart', function(e) {
            if (!gameConfig.isPlaying) {
                e.preventDefault();
                return false;
            }
            e.dataTransfer.setData('text/plain', this.dataset.id);
            this.classList.add('dragging');
        });
        
        item.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });
    });
}

// Mettre à jour le minuteur
function updateTimer() {
    const minutes = Math.floor(gameConfig.timeLeft / 60);
    const seconds = gameConfig.timeLeft % 60;
    document.getElementById('timer').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    
    // Changer la couleur du minuteur en fonction du temps restant
    const timerElement = document.getElementById('timer-container');
    if (gameConfig.timeLeft <= 10) {
        timerElement.classList.add('warning');
    } else {
        timerElement.classList.remove('warning');
    }
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
        clearInterval(gameConfig.timer);
        loadLevel(gameConfig.level + 1);
        showMessage(`Niveau ${gameConfig.level} - C'est parti !`, 'info');
        startGame();
    } else {
        showMessage('Tu as terminé tous les niveaux !', 'success');
    }
}

// Réinitialiser le jeu
function resetGame() {
    clearInterval(gameConfig.timer);
    gameConfig.score = 0;
    gameConfig.isPlaying = false;
    updateScore();
    loadLevel(1);
    showMessage('Nouvelle partie commencée !', 'info');
    document.getElementById('restart-btn').style.display = 'none';
    
    // Afficher le tutoriel
    showTutorial();
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', initGame);
