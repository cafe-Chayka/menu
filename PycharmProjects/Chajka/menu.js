function showTab(tabName, btn) {
    // Сховуємо всі вкладки
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    document.getElementById(tabName).style.display = 'block';

    // Видаляємо активні класи для вкладок
    document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
    btn.classList.add('active');

    // Завжди закриваємо випадаючий список перед завантаженням нових даних
    const dropdownMenu = document.getElementById('categoryList');
    dropdownMenu.style.display = 'none';

    // Завантажуємо дані з меню
    fetch('menu.json')
        .then(response => response.json())
        .then(menuData => {
            if (tabName === 'kitchen') {
                loadMenu('kitchen-categories', menuData.kitchen.categories, 'kitchen');
                updateDropdown(menuData.kitchen.categories, 'kitchen');
            } else if (tabName === 'bar') {
                loadMenu('bar-categories', menuData.bar.categories, 'bar');
                updateDropdown(menuData.bar.categories, 'bar');
            }
        })
        .catch(error => {
            console.error('Error loading menu data:', error);
        });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function loadMenu(containerId, categories, tabName) { // Додаємо tabName
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    const sortedCategories = categories.sort((a, b) => a.sort - b.sort);
    sortedCategories.forEach(category => {
        const categoryId = `${tabName}-${category.name.replace(/\s+/g, '-').toLowerCase()}`; // Робимо ID унікальним
        const categoryDiv = document.createElement('div');
        categoryDiv.id = categoryId;
        categoryDiv.innerHTML = `<h3>${category.name}</h3>`;

        category.dishes.forEach(dish => {
            categoryDiv.innerHTML += `
                <div class="dish">
                    <h4 style="color: #FFD700; font-weight: bold;">${dish.name}</h4>
                    ${dish.description ? `<p>${dish.description}</p>` : ''}   
                    ${dish.nameoutput && dish.output ? `<p><strong>${dish.nameoutput}:</strong> ${dish.output}</p>` : ''}
                    ${!dish.nameoutput && dish.output ? `<p>${dish.output}</p>` : ''}
                    <p style="color: #FFD700;"><strong>Ціна:</strong> <span>${dish.price}</span></p>
                </div>
            `;
        });
        container.appendChild(categoryDiv);
    });
}

function updateDropdown(categories, tabName) {
    const dropdownMenu = document.getElementById('categoryList');
    dropdownMenu.innerHTML = '';

    categories.forEach(category => {
        const listItem = document.createElement('li');
        listItem.innerText = category.name;
        listItem.onclick = () => {
            const categoryId = `${tabName}-${category.name.replace(/\s+/g, '-').toLowerCase()}`; // Оновили ID
            const categoryTitle = document.querySelector(`#${categoryId} h3`);

            if (categoryTitle) {
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 0;
                const categoryOffset = categoryTitle.getBoundingClientRect().top + window.scrollY;

                window.scrollTo({
                    top: categoryOffset - headerHeight - 65,
                    behavior: 'smooth'
                });
            }

            dropdownMenu.style.display = 'none';
        };
        dropdownMenu.appendChild(listItem);
    });

    document.querySelector('.dropdown-btn').addEventListener('click', toggleDropdown);
}

function toggleDropdown() {
    const dropdownMenu = document.getElementById('categoryList');
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
}

// Завантажуємо вкладку "kitchen" за замовчуванням
document.addEventListener('DOMContentLoaded', () => showTab('kitchen', document.querySelector('.tab-button')));
