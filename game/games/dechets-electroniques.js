// Données des objets électroniques
const electronicItems = [
    { id: 1, name: 'Téléphone', type: 'recyclable', icon: '📱' },
    { id: 2, name: 'Ordinateur', type: 'recyclable', icon: '💻' },
    { id: 3, name: 'Pile', type: 'dangerous', icon: '🔋' },
    { id: 4, name: 'Ampoule', type: 'dangerous', icon: '💡' },
    { id: 5, name: 'Câble', type: 'recyclable', icon: '🔌' },
    { id: 6, name: 'Batterie', type: 'dangerous', icon: '🔋' },
    { id: 7, name: 'Clé USB', type: 'recyclable', icon: '💾' },
    { id: 8, name: 'Imprimante', type: 'recyclable', icon: '🖨️' },
    { id: 9, name: 'Télécommande', type: 'recyclable', icon: '🎮' },
    { id: 10, name: 'Souris', type: 'recyclable', icon: '🖱️' }
];

let score = 0;
let currentItems = [];
let draggedItem = null;

// Initialisation du jeu
function initGame() {
    score = 0;
    document.getElementById('score').textContent = score;
    currentItems = [...electronicItems].sort(() => 0.5 - Math.random()).slice(0, 6);
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
            setTimeout(() => this.style.opacity = '0.4', 0);
        });
        
        item.addEventListener('dragend', function() {
            this.style.opacity = '1';
        });
    });
    
    bins.forEach(bin => {
        bin.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.opacity = '0.7';
        });
        
        bin.addEventListener('dragleave', function() {
            this.style.opacity = '1';
        });
        
        bin.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.opacity = '1';
            
            if (draggedItem) {
                const itemId = parseInt(draggedItem.dataset.id);
                const item = electronicItems.find(i => i.id === itemId);
                const binType = this.dataset.type;
                
                if (item.type === binType) {
                    score += 10;
                    document.getElementById('score').textContent = score;
                    draggedItem.style.display = 'none';
                    showMessage('Bonne réponse !', 'success');
                    
                    // Retirer l'élément des items courants
                    currentItems = currentItems.filter(i => i.id !== itemId);
                    
                    if (currentItems.length === 0) {
                        showMessage('Félicitations ! Vous avez trié tous les objets !', 'success');
                    }
                } else {
                    score = Math.max(0, score - 5);
                    document.getElementById('score').textContent = score;
                    showMessage('Ce n\'est pas la bonne poubelle !', 'error');
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
    messageArea.className = type === 'error' ? 'error' : 'success';
    
    setTimeout(() => {
        messageArea.className = '';
    }, 2000);
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    
    // Bouton de vérification
    document.getElementById('check-btn').addEventListener('click', () => {
        if (currentItems.length > 0) {
            showMessage(`Il reste ${currentItems.length} objet(s) à trier !`, 'info');
        } else {
            showMessage('Bravo ! Vous avez tout trié correctement !', 'success');
        }
    });
    
    // Bouton nouvelle partie
    document.getElementById('new-game').addEventListener('click', initGame);
});
