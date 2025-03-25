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

function loadMenu(containerId, categories, tabName) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    categories.forEach((category, index) => {
        const categoryId = `${tabName}-category-${index}`; // Формуємо унікальний id на основі індексу

        const categoryDiv = document.createElement('div');
        categoryDiv.id = categoryId; // Присвоюємо унікальний id
        categoryDiv.innerHTML = `<h3>${category.name}</h3>`;

        category.dishes.forEach(dish => {
            categoryDiv.innerHTML += `
                <div class="dish">
                    <h4 style="color: #FFD700; font-weight: bold;">${dish.name}</h4>
                    ${dish.description ? `<p>${dish.description}</p>` : ''}   
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

    categories.forEach((category, index) => {
        const categoryId = `${tabName}-category-${index}`; // Формуємо id на основі індексу

        const listItem = document.createElement('li');
        listItem.innerText = category.name;
        listItem.onclick = () => {
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
