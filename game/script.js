const draggables = document.querySelectorAll('.trash-item');
const bins = document.querySelectorAll('.bin');
const messageArea = document.getElementById('message-area');
const scoreSpan = document.getElementById('score');
let score = 0;

// 1. Gérer le début du glisser (Drag Start)
draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', () => {
        draggable.classList.add('dragging');
    });

    draggable.addEventListener('dragend', () => {
        draggable.classList.remove('dragging');
    });
});

// 2. Gérer la zone de dépôt (Drop Zone)
bins.forEach(bin => {
    // Autoriser le drop
    bin.addEventListener('dragover', (e) => {
        e.preventDefault(); // Nécessaire pour autoriser le drop
        bin.classList.add('drag-over'); // Feedback visuel
    });

    bin.addEventListener('dragleave', () => {
        bin.classList.remove('drag-over');
    });

    bin.addEventListener('drop', (e) => {
        e.preventDefault();
        bin.classList.remove('drag-over');
        
        const draggable = document.querySelector('.dragging');
        const trashType = draggable.classList[1]; // ex: 'plastic', 'glass'
        const acceptedTypes = bin.getAttribute('data-type').split(',');

        // 3. Vérification de la logique de tri
        if (acceptedTypes.includes(trashType)) {
            // BRAVO !
            score += 10;
            scoreSpan.innerText = score;
            messageArea.innerText = "Bravo ! Le monstre est content ! 😋";
            messageArea.style.color = "green";
            draggable.remove(); // On enlève le déchet
            
            // Animation simple du monstre
            bin.querySelector('.monster-face').innerText = "😋";
            setTimeout(() => bin.querySelector('.monster-face').innerText = "🤤", 1000);
            
        } else {
            // ERREUR !
            messageArea.innerText = "Beurk ! Ce n'est pas la bonne poubelle ! 🤢";
            messageArea.style.color = "red";
            
            // Animation erreur
            bin.querySelector('.monster-face').innerText = "🤢";
            setTimeout(() => bin.querySelector('.monster-face').innerText = "🤤", 1000);
        }
    });
});