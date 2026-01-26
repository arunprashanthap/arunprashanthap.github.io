document.addEventListener('DOMContentLoaded', () => {
    
    // Select all filter buttons and filter items
    const filterBtns = document.querySelectorAll('.filter-btn');
    const filterItems = document.querySelectorAll('.filter-item');

    // Add click event to each button
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 1. Remove 'active' class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // 2. Add 'active' class to clicked button
            btn.classList.add('active');

            // 3. Get the category to filter
            const category = btn.getAttribute('data-filter');

            // 4. Loop through items and show/hide
            filterItems.forEach(item => {
                if (category === 'all' || item.id === category) {
                    item.style.display = 'block';
                    // Optional: Add fade-in animation reset
                    item.style.animation = 'none';
                    item.offsetHeight; /* trigger reflow */
                    item.style.animation = 'fadeIn 0.5s ease-in-out';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
});