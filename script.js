const addCardBtn = document.getElementById('addCard');
const flashcardsContainer = document.getElementById('flashcardsContainer');
const shuffleBtn = document.getElementById('shuffleCards');

const confirmModal = document.getElementById('confirmModal');
const cancelDelete = document.getElementById('cancelDelete');
const confirmDelete = document.getElementById('confirmDelete');

let savedCards = JSON.parse(localStorage.getItem('flashcards')) || [];
let cardToDelete = null; // store card user wants to delete

function displayCard(cardData) {
  const card = document.createElement('div');
  card.className = 'flashcard';

  // Card content
  const content = document.createElement('span');
  content.innerText = cardData.showQuestion ? cardData.question : cardData.answer;
  card.appendChild(content);

  // Delete ❌ using HTML code
  const deleteBtn = document.createElement('span');
  deleteBtn.innerHTML = '&#10060;'; // guaranteed to show ❌
  deleteBtn.style.cursor = 'pointer';
  deleteBtn.style.fontWeight = 'bold';
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    cardToDelete = { card, cardData };
    confirmModal.style.display = 'flex';
  });
  card.appendChild(deleteBtn);

  // Track if learned
  let isLearned = cardData.learned;
  card.style.background = isLearned ? 'linear-gradient(145deg, #28a745, #55c76d)' 
                                    : 'linear-gradient(145deg, #3e3e5e, #5b5b8f)';

  // Flip on click
  card.addEventListener('click', () => {
    cardData.showQuestion = !cardData.showQuestion;
    content.innerText = cardData.showQuestion ? cardData.question : cardData.answer;
    saveCards();
  });

  // Mark learned on double-click
  card.addEventListener('dblclick', () => {
    isLearned = !isLearned;
    cardData.learned = isLearned;
    card.style.background = isLearned ? 'linear-gradient(145deg, #28a745, #55c76d)' 
                                      : 'linear-gradient(145deg, #3e3e5e, #5b5b8f)';
    saveCards();
  });

  flashcardsContainer.appendChild(card);
}

// Save cards
function saveCards() {
  localStorage.setItem('flashcards', JSON.stringify(savedCards));
}

// Display existing
savedCards.forEach(displayCard);

// Add new card
addCardBtn.addEventListener('click', () => {
  const question = document.getElementById('question').value;
  const answer = document.getElementById('answer').value;

  if (question && answer) {
    const cardData = { question, answer, learned: false, showQuestion: true };
    savedCards.push(cardData);
    displayCard(cardData);
    saveCards();
    document.getElementById('question').value = '';
    document.getElementById('answer').value = '';
  }
});

// Shuffle cards
shuffleBtn.addEventListener('click', () => {
  flashcardsContainer.innerHTML = '';
  savedCards.sort(() => Math.random() - 0.5);
  savedCards.forEach(displayCard);
});

// Modal buttons
cancelDelete.onclick = () => {
  cardToDelete = null;
  confirmModal.style.display = 'none';
};

confirmDelete.onclick = () => {
  if (cardToDelete) {
    flashcardsContainer.removeChild(cardToDelete.card);
    savedCards = savedCards.filter(c => c !== cardToDelete.cardData);
    saveCards();
    cardToDelete = null;
  }
  confirmModal.style.display = 'none';
};