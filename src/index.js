document.addEventListener('DOMContentLoaded', () => {
    const quoteForm = document.getElementById('new-quote-form');
    const quoteList = document.getElementById('quote-list');
  
    // Function to fetch and display quotes
    function fetchAndDisplayQuotes() {
      fetch('http://localhost:3000/quotes?_embed=likes')
        .then((response) => response.json())
        .then((quotes) => {
          quoteList.innerHTML = ''; // Clear the quote list
  
          quotes.forEach((quote) => {
            const quoteCard = document.createElement('li');
            quoteCard.className = 'quote-card';
            quoteCard.innerHTML = `
              <blockquote class="blockquote">
                <p class="mb-0">${quote.quote}</p>
                <footer class="blockquote-footer">${quote.author}</footer>
                <br>
                <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
                <button class='btn-danger'>Delete</button>
              </blockquote>
            `;
            const likeButton = quoteCard.querySelector('.btn-success');
            const deleteButton = quoteCard.querySelector('.btn-danger');
            likeButton.addEventListener('click', () => likeQuote(quote));
            deleteButton.addEventListener('click', () => deleteQuote(quote));
            quoteList.appendChild(quoteCard);
          });
        });
    }
  
    // Event listener for the quote form submission
    quoteForm.addEventListener('submit', (event) => {
      event.preventDefault();
  
      const quote = document.getElementById('quote').value;
      const author = document.getElementById('author').value;
  
      if (quote && author) {
        createQuote(quote, author);
      } else {
        alert('Both quote and author fields are required.');
      }
    });
  
    // Function to create a new quote
    function createQuote(quote, author) {
      fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quote, author, likes: [] }),
      })
        .then(() => {
          // Clear form fields
          document.getElementById('quote').value = '';
          document.getElementById('author').value = '';
  
          // Fetch and refresh the quote list
          fetchAndDisplayQuotes();
        });
    }
  
    // Function to like a quote
    function likeQuote(quote) {
      const like = { quoteId: quote.id };
  
      fetch('http://localhost:3000/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(like),
      })
        .then(() => fetchAndDisplayQuotes()); // Refresh the quote list to reflect the like
    }
  
    // Function to delete a quote
    function deleteQuote(quote) {
      fetch(`http://localhost:3000/quotes/${quote.id}`, {
        method: 'DELETE',
      })
        .then(() => fetchAndDisplayQuotes()); // Refresh the quote list after deletion
    }
  
    // Initial fetch when the page loads
    fetchAndDisplayQuotes();
  });
  