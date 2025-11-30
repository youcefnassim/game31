// Données des déchets compostables et non compostables
const wasteItems = [
    { id: 1, name: 'Épluchures', type: 'compostable', icon: '🥕' },
    { id: 2, name: 'Marc de café', type: 'compostable', icon: '☕' },
    { id: 3, name: 'Coquilles d\'œufs', type: 'compostable', icon: '🥚' },
    { id: 4, name: 'Feuilles mortes', type: 'compostable', icon: '🍂' },
    { id: 5, name: 'Restes de fruits', type: 'compostable', icon: '🍎' },
    { id: 6, name: 'Sachet de thé', type: 'non-compostable', icon: '🍵' },
    { id: 7, name: 'Os de viande', type: 'non-compostable', icon: '🍖' },
    { id: 8, name: 'Plastique', type: 'non-compostable', icon: '🥤' },
    { id: 9, name: 'Métal', type: 'non-compostable', icon: '🥫' },
    { id: 10, name: 'Verre', type: 'non-compostable', icon: '🥛' }
];

let score = 0;
let currentItems = [];
let draggedItem = null;

// Initialisation du jeu
function initGame() {
    score = 0;
    document.getElementById('score').textContent = score;
    currentItems = [...wasteItems].sort(() => 0.5 - Math.random()).slice(0, 6);
    renderItems();
    setupDragAndDrop();
}

// Affiche les objets à trier
function renderItems() {
    const container = document.getElementById('items-container');
    container.innerHTML = '';
    
    currentItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        itemElement.draggable = true;
        itemElement.dataset.id = item.id;
        itemElement.innerHTML = `
            <div class="item-icon">${item.icon}</div>
            <div>${item.name}</div>
        `;
        container.appendChild(itemElement);
    });
}

// Configure le glisser-déposer
function setupDragAndDrop() {
    const items = document.querySelectorAll('.item');
    const bins = document.querySelectorAll('.bin');
    
    items.forEach(item => {
        item.addEventListener('dragstart', function(e) {
            draggedItem = this;
            this.classList.add('dragging');
        });
        
        item.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });
    });
    
    bins.forEach(bin => {
        bin.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.transform = 'scale(1.05)';
        });
        
        bin.addEventListener('dragleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        bin.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.transform = 'scale(1)';
            
            if (draggedItem) {
                const itemId = parseInt(draggedItem.dataset.id);
                const item = wasteItems.find(i => i.id === itemId);
                const binType = this.dataset.type;
                
                if (item.type === binType) {
                    score += 10;
                    document.getElementById('score').textContent = score;
                    draggedItem.style.display = 'none';
                    showMessage('Bien joué ! C\'est compostable !', 'success');
                    
                    // Retirer l'élément des items courants
                    currentItems = currentItems.filter(i => i.id !== itemId);
                    
                    if (currentItems.length === 0) {
                        showMessage('Félicitations ! Vous avez tout trié correctement !', 'success');
                    }
                } else {
                    score = Math.max(0, score - 5);
                    document.getElementById('score').textContent = score;
                    showMessage('Oups ! Ce n\'est pas compostable !', 'error');
                }
                
                draggedItem = null;
            }
        });
    });
}

// Affiche un message
function showMessage(message, type) {
    const messageArea = document.getElementById('message-area');
    messageArea.textContent = message;
    messageArea.className = type;
    
    setTimeout(() => {
        messageArea.className = '';
    }, 2000);
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    
    // Bouton d'aide
    document.getElementById('help-btn').addEventListener('click', () => {
        showMessage('Glisse les déchets vers le bac à compost s\'ils sont compostables, sinon vers la poubelle !', 'info');
    });
    
    // Bouton nouvelle partie
    document.getElementById('new-game').addEventListener('click', initGame);
});
