document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const filterButtons = document.querySelectorAll('.filter-button');
    const blogPosts = document.querySelectorAll('.blog-post');

    // Helper function to show/hide posts with animation
    function togglePostVisibility(post, show) {
        if (show) {
            post.style.transition = 'none';
            post.style.opacity = '0';
            post.style.transform = 'translateY(20px)';
            post.style.display = post.classList.contains('featured') ? 'grid' : 'block';
            post.offsetHeight;
            post.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            post.style.opacity = '1';
            post.style.transform = 'translateY(0)';
        } else {
            post.style.opacity = '0';
            post.style.transform = 'translateY(20px)';
            setTimeout(() => {
                post.style.display = 'none';
            }, 300);
        }
    }

    // Combined search and filter state
    let currentFilter = 'all';
    let currentSearch = '';

    // Function to check if a post matches both search and filter criteria
    function shouldShowPost(post) {
        const postCategory = post.querySelector('.post-category').textContent.toLowerCase();
        const title = post.querySelector('.blog-content h3').textContent.toLowerCase();
        const content = post.querySelector('.blog-content p').textContent.toLowerCase();
        
        const matchesFilter = currentFilter === 'all' || postCategory === currentFilter;
        const matchesSearch = currentSearch === '' || 
            title.includes(currentSearch) || 
            content.includes(currentSearch) || 
            postCategory.includes(currentSearch);
        
        return matchesFilter && matchesSearch;
    }

    // Function to update visible posts
    function updateVisiblePosts() {
        blogPosts.forEach(post => {
            togglePostVisibility(post, shouldShowPost(post));
        });
    }

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase().trim();
            updateVisiblePosts();
        });
    }

    // Filter functionality
    if (filterButtons) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                currentFilter = button.getAttribute('data-filter').toLowerCase();
                updateVisiblePosts();
            });
        });
    }

    // Initialize visibility
    updateVisiblePosts();
});
