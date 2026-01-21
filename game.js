const GAME_DATA = {
    fr: [
        { id: 'fruit', name: 'Fruits', color: '#ff7675', icon: '🍎', words: ['Pomme', 'Banane', 'Fraise', 'Kiwi', 'Orange', 'Citron', 'Raisin', 'Poire', 'Mangue', 'Melon'] },
        { id: 'animal', name: 'Animaux', color: '#55efc4', icon: '🐾', words: ['Chien', 'Chat', 'Lion', 'Tigre', 'Ours', 'Loup', 'Renard', 'Aigle', 'Panda', 'Koala'] },
        { id: 'metier', name: 'Métiers', color: '#74b9ff', icon: '👮', words: ['Juge', 'Prof', 'Chef', 'Pilote', 'Maire', 'Clerc', 'Maçon', 'Coach', 'Médecin', 'Avocat'] },
        { id: 'pays', name: 'Pays', color: '#a29bfe', icon: '🌍', words: ['France', 'Chine', 'Japon', 'Italie', 'Brésil', 'Canada', 'Inde', 'Maroc', 'Espagne', 'USA'] },
        { id: 'meuble', name: 'Maison', color: '#fdcb6e', icon: '🪑', words: ['Table', 'Chaise', 'Lit', 'Lampe', 'Canapé', 'Bureau', 'Tapis', 'Miroir', 'Four', 'Frigo'] },
        { id: 'sport', name: 'Sports', color: '#e17055', icon: '⚽', words: ['Foot', 'Tennis', 'Rugby', 'Judo', 'Boxe', 'Golf', 'Ski', 'Surf', 'Basket', 'Vélo'] },
        { id: 'couleur', name: 'Couleurs', color: '#fab1a0', icon: '🎨', words: ['Rouge', 'Bleu', 'Vert', 'Jaune', 'Noir', 'Blanc', 'Rose', 'Gris', 'Violet', 'Cyan'] },
        { id: 'musique', name: 'Musique', color: '#00cec9', icon: '🎵', words: ['Piano', 'Guitare', 'Violon', 'Flûte', 'Basse', 'Harpe', 'Tambour', 'Sax', 'Oboe', 'Tuba'] }
    ],
    en: [
        { id: 'fruit', name: 'Fruits', color: '#ff7675', icon: '🍎', words: ['Apple', 'Banana', 'Berry', 'Kiwi', 'Orange', 'Lemon', 'Grape', 'Pear', 'Mango', 'Melon'] },
        { id: 'animal', name: 'Animals', color: '#55efc4', icon: '🐾', words: ['Dog', 'Cat', 'Lion', 'Tiger', 'Bear', 'Wolf', 'Fox', 'Eagle', 'Panda', 'Koala'] },
        { id: 'metier', name: 'Jobs', color: '#74b9ff', icon: '👮', words: ['Judge', 'Teach', 'Chef', 'Pilot', 'Mayor', 'Clerk', 'Mason', 'Coach', 'Doctor', 'Lawyer'] },
        { id: 'pays', name: 'Countries', color: '#a29bfe', icon: '🌍', words: ['France', 'China', 'Japan', 'Italy', 'Brazil', 'Canada', 'India', 'Spain', 'USA', 'Egypt'] },
        { id: 'meuble', name: 'Home', color: '#fdcb6e', icon: '🪑', words: ['Table', 'Chair', 'Bed', 'Lamp', 'Sofa', 'Desk', 'Rug', 'Mirror', 'Oven', 'Fridge'] },
        { id: 'sport', name: 'Sports', color: '#e17055', icon: '⚽', words: ['Soccer', 'Tennis', 'Rugby', 'Judo', 'Box', 'Golf', 'Ski', 'Surf', 'Basket', 'Bike'] },
        { id: 'couleur', name: 'Colors', color: '#fab1a0', icon: '🎨', words: ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Pink', 'Gray', 'Purple', 'Cyan'] },
        { id: 'musique', name: 'Music', color: '#00cec9', icon: '🎵', words: ['Piano', 'Guitar', 'Violin', 'Flute', 'Bass', 'Harp', 'Drum', 'Sax', 'Oboe', 'Tuba'] }
    ]
};

// --- 2. VARIABLES GLOBALES ---
let activeCards = [];   // Cartes sur la pyramide
let drawPile = [];      // Cartes dans la pioche (face cachée)
let discardPile = [];   // Cartes retournées (face visible)
let selectedCards = []; // Cartes sélectionnées par le joueur
let score = 0;
let currentLang = localStorage.getItem('gameLang') || 'fr';
let currentTheme = localStorage.getItem('gameTheme') || 'pop';

// --- 3. INITIALISATION ---
window.onload = function() {
    applyTheme(currentTheme);
    document.getElementById('select-theme').value = currentTheme;
    document.getElementById('select-lang').value = currentLang;
    
    // Attacher l'événement clic sur la pioche
    document.getElementById('deck-pile').onclick = drawCard;
    
    initGame();
};

function initGame() {
    score = 0;
    updateScoreUI();
    selectedCards = [];
    discardPile = [];
    drawPile = [];
    activeCards = [];
    
    // Nettoyer l'interface
    document.getElementById('game-board').innerHTML = '<div class="pyramid-container" id="pyramid"></div>';
    document.getElementById('active-card').innerHTML = '';
    updateDeckUI();

    // 1. Générer toutes les cartes
    const fullDeck = generateDeck();
    
    // 2. Séparer : 21 cartes pour la Pyramide, le reste pour la Pioche
    // (Une pyramide de 6 étages fait 21 cartes : 1+2+3+4+5+6)
    const pyramidCards = fullDeck.slice(0, 21);
    drawPile = fullDeck.slice(21);
    
    // 3. Construire la Pyramide
    buildPyramid(pyramidCards);
    
    // 4. Initialiser la pioche visuelle
    updateDeckUI();
    updateLocks();
}

// --- 4. GÉNÉRATION DES DONNÉES ---
function generateDeck() {
    const categories = GAME_DATA[currentLang];
    let deck = [];
    
    // On prend tous les mots disponibles pour s'assurer d'avoir des paires
    categories.forEach(cat => {
        cat.words.forEach(word => {
            deck.push({
                word: word,
                catId: cat.id,
                catColor: cat.color,
                catIcon: cat.icon,
                id: Math.random().toString(36).substr(2, 9),
                source: 'deck' // Pour savoir d'où vient la carte
            });
        });
    });

    // Mélange
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

// --- 5. GESTION DE LA PIOCHE (NOUVEAU) ---
function drawCard() {
    // Si la pioche est vide, on recycle la défausse
    if (drawPile.length === 0) {
        if (discardPile.length > 0) {
            // Recyclage : La défausse redevient la pioche
            drawPile = discardPile.reverse();
            discardPile = [];
            document.getElementById('active-card').innerHTML = ''; // Vide la zone active
            updateDeckUI();
        }
        return;
    }

    // Prendre la première carte de la pioche
    const cardData = drawPile.shift(); // Enlève le premier élément
    
    // L'ajouter à la défausse
    discardPile.push(cardData);
    
    // Afficher la carte dans la zone "Active"
    renderActiveDrawCard(cardData);
    updateDeckUI();
    
    // Si une carte était sélectionnée ailleurs, on annule pour éviter les bugs
    clearSelection(); 
}

function renderActiveDrawCard(data) {
    const container = document.getElementById('active-card');
    container.innerHTML = ''; // Effacer l'ancienne
    
    // On réutilise la même structure HTML que les cartes du plateau
    // Mais on ajoute un onclick spécifique
    const div = document.createElement('div');
    div.className = 'card';
    div.style.position = 'relative'; // Important pour qu'elle reste dans le cadre
    
    div.innerHTML = `
        <div class="cat-indicator" style="background-color: ${data.catColor}"></div>
        <div class="card-icon">${data.catIcon}</div>
        <div class="card-word">${data.word}</div>
    `;
    
    div.onclick = () => handleDrawCardClick(div, data);
    container.appendChild(div);
}

function updateDeckUI() {
    const deckEl = document.getElementById('deck-pile');
    if (drawPile.length === 0) {
        if (discardPile.length > 0) {
            deckEl.innerText = "↺"; // Symbole de recyclage
            deckEl.style.opacity = "1";
        } else {
            deckEl.innerText = "";
            deckEl.style.opacity = "0.2"; // Complètement vide
        }
    } else {
        deckEl.innerText = drawPile.length; // Affiche le nombre restant
        deckEl.style.opacity = "1";
    }
}

// --- 6. INTERACTION JOUEUR (Modifié pour la pioche) ---

// Clic sur une carte de la PYRAMIDE
function handleCardClick(el) {
    if (el.classList.contains('locked')) return;
    
    toggleSelection(el);
}

// Clic sur la carte de la PIOCHE
function handleDrawCardClick(el, data) {
    toggleSelection(el);
}

function toggleSelection(el) {
    // Gestion Select / Deselect
    if (el.classList.contains('selected')) {
        el.classList.remove('selected');
        selectedCards = selectedCards.filter(item => item.el !== el);
        return;
    }

    el.classList.add('selected');
    
    // On stocke l'élément DOM et ses données associées
    // Astuce : pour retrouver les data d'une carte Pyramide, on cherche dans activeCards
    // Pour la carte Pioche, on sait que c'est la dernière de discardPile
    let cardData = null;
    
    // Est-ce une carte de la pyramide ?
    const pyramidObj = activeCards.find(c => c.el === el);
    if (pyramidObj) {
        cardData = pyramidObj.data;
    } else {
        // C'est forcément la carte active de la pioche
        cardData = discardPile[discardPile.length - 1];
    }

    selectedCards.push({ el: el, data: cardData });

    if (selectedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    const c1 = selectedCards[0];
    const c2 = selectedCards[1];

    if (c1.data.catId === c2.data.catId) {
        // MATCH !
        score += 100;
        updateScoreUI();

        // Animation
        c1.el.classList.add('matched');
        c2.el.classList.add('matched');

        // Nettoyage LOGIQUE
        
        // 1. Si c'est une carte pyramide, on la désactive
        const p1 = activeCards.find(k => k.el === c1.el);
        if (p1) p1.active = false;
        
        const p2 = activeCards.find(k => k.el === c2.el);
        if (p2) p2.active = false;

        // 2. Si c'est la carte de pioche, on l'enlève de la défausse
        if (!p1) removeTopDiscard();
        if (!p2) removeTopDiscard();

        clearSelection();
        setTimeout(() => updateLocks(), 300);

    } else {
        // ERREUR
        setTimeout(() => {
            selectedCards.forEach(item => item.el.classList.remove('selected'));
            clearSelection();
        }, 500);
    }
}

function removeTopDiscard() {
    discardPile.pop(); // Enlève la carte du tableau
    // Visuellement, on vide la case active (l'animation CSS matched s'en charge, on nettoie après)
    setTimeout(() => {
        const container = document.getElementById('active-card');
        // Si la carte qui vient d'être matchée est celle affichée, on la retire
        // Mais attention, si on a matché 2 cartes pioche (rare), il faut gérer.
        // Pour simplifier : On réaffiche la nouvelle carte du haut de la pile défausse (s'il en reste)
        if (discardPile.length > 0) {
            renderActiveDrawCard(discardPile[discardPile.length - 1]);
        } else {
            container.innerHTML = '';
        }
        updateDeckUI();
    }, 300);
}

function clearSelection() {
    selectedCards = [];
    // On retire visuellement la classe selected de tout le monde pour être sûr
    document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
}


// --- 7. CONSTRUCTION PYRAMIDE (Reste quasi identique) ---
function buildPyramid(deck) {
    const container = document.getElementById('pyramid');
    let cardIndex = 0;
    const rows = 6; 
    const xOffset = 90;
    const yOffset = 50;
    const centerX = container.clientWidth / 2 || window.innerWidth / 2;

    for (let r = 0; r < rows; r++) {
        let cardsInRow = r + 1;
        let startX = centerX - (cardsInRow * xOffset) / 2;

        for (let c = 0; c < cardsInRow; c++) {
            if (cardIndex >= deck.length) break;
            const cardData = deck[cardIndex];
            const el = createCardElement(cardData, r, c, startX + (c * xOffset), r * yOffset);
            container.appendChild(el);
            activeCards.push({ el: el, data: cardData, row: r, col: c, active: true });
            cardIndex++;
        }
    }
}

function createCardElement(data, row, col, x, y) {
    const div = document.createElement('div');
    div.className = 'card';
    div.style.left = x + 'px';
    div.style.top = y + 'px';
    div.innerHTML = `
        <div class="cat-indicator" style="background-color: ${data.catColor}"></div>
        <div class="card-icon">${data.catIcon}</div>
        <div class="card-word">${data.word}</div>
    `;
    div.onclick = () => handleCardClick(div);
    return div;
}

function updateLocks() {
    activeCards.forEach(cardObj => {
        if (!cardObj.active) return;
        const r = cardObj.row;
        const c = cardObj.col;
        const child1 = activeCards.find(k => k.row === r + 1 && k.col === c && k.active);
        const child2 = activeCards.find(k => k.row === r + 1 && k.col === c + 1 && k.active);
        
        if (child1 || child2) cardObj.el.classList.add('locked');
        else cardObj.el.classList.remove('locked');
    });
    checkVictory();
}

function checkVictory() {
    const remaining = activeCards.filter(c => c.active).length;
    if (remaining === 0) {
        setTimeout(() => {
            document.getElementById('final-score').innerText = score;
            document.getElementById('modal-victory').classList.remove('hidden');
        }, 500);
    }
}

// UI Helpers (Identiques)
function updateScoreUI() { document.getElementById('txt-score').innerText = 'Score: ' + score; }
function restartGame() { document.getElementById('modal-victory').classList.add('hidden'); initGame(); }
function openSettings() { document.getElementById('modal-settings').classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
function applyTheme(t) { document.body.setAttribute('data-theme', t); }
function changeTheme(t) { localStorage.setItem('gameTheme', t); applyTheme(t); }
function changeLanguage(l) { localStorage.setItem('gameLang', l); location.reload(); }