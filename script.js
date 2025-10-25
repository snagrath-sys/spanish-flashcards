class FlashcardApp {
    constructor() {
        this.flashcards = this.loadFromStorage();
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
        this.updateStats();
    }

    bindEvents() {
        // Add card button
        document.getElementById('addCardBtn').addEventListener('click', () => {
            this.showAddModal();
        });

        // Add card form
        document.getElementById('addCardForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addCard();
        });

        // Modal close events
        document.querySelector('.close').addEventListener('click', () => {
            this.hideAddModal();
        });

        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.hideAddModal();
        });

        // Close modal when clicking outside
        document.getElementById('addCardModal').addEventListener('click', (e) => {
            if (e.target.id === 'addCardModal') {
                this.hideAddModal();
            }
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideAddModal();
            }
        });

        // Event delegation for delete buttons and card flipping
        document.getElementById('flashcardsGrid').addEventListener('click', (e) => {
            // Handle delete button clicks
            if (e.target.classList.contains('delete-btn')) {
                e.stopPropagation();
                const cardId = e.target.getAttribute('data-card-id');
                this.deleteCard(cardId);
                return;
            }

            // Handle card flipping
            const flashcard = e.target.closest('.flashcard');
            if (flashcard && !e.target.classList.contains('delete-btn')) {
                this.flipCard(flashcard);
            }
        });

        // Export button
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportData();
        });

        // Import button
        document.getElementById('importBtn').addEventListener('click', () => {
            this.showImportModal();
        });

        // Import modal events
        document.querySelector('.close-import').addEventListener('click', () => {
            this.hideImportModal();
        });

        document.getElementById('cancelImport').addEventListener('click', () => {
            this.hideImportModal();
        });

        document.getElementById('fileInput').addEventListener('change', (e) => {
            if (e.target.files[0]) {
                this.importData(e.target.files[0]);
            }
        });

        document.getElementById('importFromText').addEventListener('click', () => {
            this.importFromText();
        });

        // Close import modal when clicking outside
        document.getElementById('importModal').addEventListener('click', (e) => {
            if (e.target.id === 'importModal') {
                this.hideImportModal();
            }
        });
    }

    showAddModal() {
        document.getElementById('addCardModal').style.display = 'block';
        document.getElementById('spanishWord').focus();
    }

    hideAddModal() {
        document.getElementById('addCardModal').style.display = 'none';
        document.getElementById('addCardForm').reset();
    }

    showImportModal() {
        document.getElementById('importModal').style.display = 'block';
    }

    hideImportModal() {
        document.getElementById('importModal').style.display = 'none';
        document.getElementById('fileInput').value = '';
        document.getElementById('jsonTextarea').value = '';
    }

    addCard() {
        const spanishWord = document.getElementById('spanishWord').value.trim();
        const englishWord = document.getElementById('englishWord').value.trim();

        if (!spanishWord || !englishWord) {
            alert('Please fill in both fields');
            return;
        }

        // Check for duplicates
        const exists = this.flashcards.some(card => 
            card.spanish.toLowerCase() === spanishWord.toLowerCase()
        );

        if (exists) {
            alert('This Spanish word already exists!');
            return;
        }

        const newCard = {
            id: Date.now().toString(),
            spanish: spanishWord,
            english: englishWord,
            createdAt: new Date().toISOString()
        };

        this.flashcards.push(newCard);
        this.saveToStorage();
        this.render();
        this.updateStats();
        this.hideAddModal();

        // Show success feedback
        this.showNotification('Card added successfully!');
    }

    deleteCard(id) {
        if (confirm('Are you sure you want to delete this card?')) {
            this.flashcards = this.flashcards.filter(card => card.id !== id);
            this.saveToStorage();
            this.render();
            this.updateStats();
            this.showNotification('Card deleted successfully!');
        }
    }

    flipCard(cardElement) {
        cardElement.classList.toggle('flipped');
    }

    render() {
        const grid = document.getElementById('flashcardsGrid');
        const emptyState = document.getElementById('emptyState');

        if (this.flashcards.length === 0) {
            grid.innerHTML = '';
            emptyState.classList.add('show');
            return;
        }

        emptyState.classList.remove('show');
        
        grid.innerHTML = this.flashcards.map(card => `
            <div class="flashcard">
                <div class="flashcard-inner">
                    <div class="flashcard-front">
                        <div class="flashcard-word">${this.escapeHtml(card.spanish)}</div>
                        <div class="flashcard-label">Spanish</div>
                    </div>
                    <div class="flashcard-back">
                        <div class="flashcard-word">${this.escapeHtml(card.english)}</div>
                        <div class="flashcard-label">English</div>
                    </div>
                </div>
                <button class="btn btn-danger delete-btn" data-card-id="${card.id}" title="Delete card">
                    ×
                </button>
            </div>
        `).join('');
    }

    updateStats() {
        const count = this.flashcards.length;
        document.getElementById('cardCount').textContent = 
            `${count} card${count !== 1 ? 's' : ''}`;
    }

    saveToStorage() {
        try {
            localStorage.setItem('spanishFlashcards', JSON.stringify(this.flashcards));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            this.showNotification('Error saving cards. Storage might be full.', 'error');
        }
    }

    loadFromStorage() {
        try {
            const stored = localStorage.getItem('spanishFlashcards');
            return stored ? JSON.parse(stored) : this.getDefaultCards();
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return this.getDefaultCards();
        }
    }

    getDefaultCards() {
        // Return some sample cards to get started
        return [
            {
                id: '1',
                spanish: 'hola',
                english: 'hello',
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                spanish: 'gracias',
                english: 'thank you',
                createdAt: new Date().toISOString()
            },
            {
                id: '3',
                spanish: 'adiós',
                english: 'goodbye',
                createdAt: new Date().toISOString()
            },
            {
                id: '4',
                spanish: 'agua',
                english: 'water',
                createdAt: new Date().toISOString()
            },
            {
                id: '5',
                spanish: 'casa',
                english: 'house',
                createdAt: new Date().toISOString()
            },
            {
                id: '6',
                spanish: 'comida',
                english: 'food',
                createdAt: new Date().toISOString()
            }
        ];
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            backgroundColor: type === 'success' ? '#28a745' : '#dc3545',
            color: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            zIndex: '1001',
            opacity: '0',
            transform: 'translateY(-20px)',
            transition: 'all 0.3s ease'
        });

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Export data for backup
    exportData() {
        const dataStr = JSON.stringify(this.flashcards, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'spanish-flashcards.json';
        link.click();
    }

    // Import data from backup
    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedCards = JSON.parse(e.target.result);
                if (Array.isArray(importedCards)) {
                    this.flashcards = importedCards;
                    this.saveToStorage();
                    this.render();
                    this.updateStats();
                    this.hideImportModal();
                    this.showNotification('Cards imported successfully!');
                } else {
                    throw new Error('Invalid file format');
                }
            } catch (error) {
                this.showNotification('Error importing cards. Please check the file format.', 'error');
            }
        };
        reader.readAsText(file);
    }

    // Import from text area
    importFromText() {
        const jsonText = document.getElementById('jsonTextarea').value.trim();
        if (!jsonText) {
            this.showNotification('Please paste JSON data first.', 'error');
            return;
        }

        try {
            const importedCards = JSON.parse(jsonText);
            if (Array.isArray(importedCards)) {
                this.flashcards = importedCards;
                this.saveToStorage();
                this.render();
                this.updateStats();
                this.hideImportModal();
                this.showNotification('Cards imported successfully!');
            } else {
                throw new Error('Invalid JSON format');
            }
        } catch (error) {
            this.showNotification('Error importing cards. Please check the JSON format.', 'error');
        }
    }

    // Clear all data
    clearAllData() {
        if (confirm('Are you sure you want to delete ALL flashcards? This cannot be undone.')) {
            this.flashcards = [];
            this.saveToStorage();
            this.render();
            this.updateStats();
            this.showNotification('All cards deleted successfully!');
        }
    }
}

// Initialize the app when the page loads
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new FlashcardApp();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + N to add new card
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        document.getElementById('addCardBtn').click();
    }
    
    // Space to flip cards when hovering
    if (e.key === ' ' && e.target.closest('.flashcard')) {
        e.preventDefault();
        if (app) {
            app.flipCard(e.target.closest('.flashcard'));
        }
    }
});

// Service Worker for offline support (basic implementation)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
