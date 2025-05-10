document.addEventListener("DOMContentLoaded", () => {
    console.log("Сайт загружен!");
  
    const projects = document.querySelectorAll(".project");
    projects.forEach(p => {
      p.addEventListener("click", () => {
        alert("Подробнее о проекте (пока заглушка)");
      });
    });
  });

  
  // Анимация хедера при скролле
let lastScroll = 0;

function updateHeader() {
    const header = document.querySelector('.main-header');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
        
        // Скрытие хедера при скролле вниз
        if (currentScroll > lastScroll && !header.classList.contains('hide')) {
            header.classList.add('hide');
        } 
        // Показ при скролле вверх
        else if (currentScroll < lastScroll && header.classList.contains('hide')) {
            header.classList.remove('hide');
        }
    } else {
        header.classList.remove('scrolled', 'hide');
    }
    
    lastScroll = currentScroll;
}

// Оптимизация обработки скролла
let isTicking = false;
window.addEventListener('scroll', () => {
    if (!isTicking) {
        window.requestAnimationFrame(() => {
            updateHeader();
            isTicking = false;
        });
        isTicking = true;
    }
});

// Инициализация при загрузке
updateHeader();


// Общая функция загрузки проектов
async function loadProjects(containerId, category = 'all') {
    try {
        const response = await fetch(`/api/projects.php?category=${category}`);
        const projects = await response.json();
        
        const container = document.getElementById(containerId);
        container.innerHTML = projects.map(project => `
            <div class="project-card" data-aos="fade-up" data-category="${project.category}">
                <div class="project-image" 
                     style="background-image: url('uploads/${project.image_url}')">
                </div>
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-links">
                        ${project.demo_url ? `<a href="${project.demo_url}" class="btn-primary">Демо</a>` : ''}
                        ${project.code_url ? `<a href="${project.code_url}" class="btn-outline">Код</a>` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Ошибка загрузки:', error);
    }
}

// Для главной страницы
if (document.getElementById('featured-projects')) {
    loadProjects('featured-projects', 'featured');
}

// Для страницы проектов
if (document.getElementById('all-projects')) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.filter;
            loadProjects('all-projects', category);
        });
    });
    loadProjects('all-projects');
}