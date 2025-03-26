console.log("Скрипт загружен и выполняется!");

// Блоки контента
class Block {
    constructor(data) {
        this.data = data;
    }

    toHTML() {
        return `<div class="block">${this.data}</div>`;
    }
}

class TextBlock extends Block {
    toHTML() {
        return `<div class="block"><p>${this.data}</p></div>`;
    }
}

class ImageBlock extends Block {
    toHTML() {
        return `<div class="block"><img src="${this.data}" alt="Image"></div>`;
    }
}

class LinkBlock extends Block {
    toHTML() {
        return `<div class="block"><a href="${this.data.url}" class="link-block">${this.data.text}</a></div>`;
    }
}

class AbilityBlock extends Block {
    toHTML() {
        return `
            <div class="ability">
                <img src="${this.data.image}" alt="Ability Image">
                <p><strong>${this.data.name}:</strong> ${this.data.description}</p>
            </div>
        `;
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

let blocks = [];
let currentUsers = [];

function initApp() {
    // Загрузка данных
    blocks = loadFromLocalStorage();
    if (blocks.length === 0) {
        blocks = createDefaultBlocks();
    }

    // Рендеринг
    renderPage(blocks);
    renderShortInfo();
    renderHistory();
    setupNavigation();
    setupEventListeners();
}

function createDefaultBlocks() {
    const abilities = [
        {
            name: "Sticky Bomb",
            description: "Бомба-липучка. Замедляет и дамажит (главное попади).",
            image: "img/techies_sticky_bomb.png"
        },
        {
            name: "Reactive Tazer",
            description: "Твои обидчики получат сдачу в виде бессилия, а после и их подрыва.",
            image: "img/techies_reactive_tazer.png"
        },
        {
            name: "Blast Off!",
            description: "Techies подрывает себя, нанося урон врагам.",
            image: "img/techies_suicide.png"
        },
        {
            name: "Minefield Sign",
            description: "Предупреждающая табличка о минном поле. Не поверил? Ты попал!",
            image: "img/techies_minefield_sign.png"
        },
        {
            name: "Proximity Mines",
            description: "Мины, которые взрываются при приближении врагов.",
            image: "img/techies_land_mines.png"
        }
    ];

    const tips = `
        <div class="tips">
            <h2>Советы по игре</h2>
            <ul>
                <li>ИГРАЙ КАК ЗНАЕШЬ</li>
                <li>МИНИРУЙ ВСЕ! НЕ ДАЙ ВРАГУ ТАК ПРОСТО ПРОЙТИ, ПУСТЬ ОН ПОДОРВЕТСЯ НА ВСЕМ И ПОКИНЕТ ИГРУ ДОСРОЧНО</li>
                <li>НЕ БОЙСЯ ВЫХОДИТЬ ОДИН НА ОДИН, ВАС ЖЕ ТРОЕ.</li>
                <li>Используйте Minefield Sign для психологического давления на врагов. ПОДАВИ ИХ МОРАЛЬ</li>
                <li>ПРЫГАЙ КАК ЗАЯЦ. ВЗРЫВАЙ КАК ЯДЕРКА!</li>
            </ul>
        </div>
    `;

    return [
        new ImageBlock("img/techies_village.jpg"),
        new TextBlock(`
            <h2>Способности Techies</h2>
            <div class="abilities-container">${abilities.map(ability => new AbilityBlock(ability).toHTML()).join('')}</div>
        `),
        new TextBlock(tips),
    ];
}

function loadFromLocalStorage() {
    const blocksData = JSON.parse(localStorage.getItem('blocks')) || [];
    return blocksData.map(data => {
        switch (data.type) {
            case 'textblock': return new TextBlock(data.content);
            case 'imageblock': return new ImageBlock(data.content);
            case 'linkblock': return new LinkBlock(data.content);
            case 'abilityblock': return new AbilityBlock(data.content);
            default: return new Block(data.content);
        }
    });
}

function renderPage(blocks) {
    const content = document.getElementById('content');
    const isEditMode = content.classList.contains('edit-mode');

    content.innerHTML = blocks.map((block, index) => `
        <div class="block">
            ${block.toHTML()}
            ${isEditMode ? `
                <div class="edit-buttons">
                    <button onclick="removeBlock(${index})">Удалить</button>
                    <button onclick="editBlock(${index})">Редактировать</button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

function renderShortInfo() {
    const shortInfo = document.getElementById('short-info');
    const isEditMode = document.getElementById('content').classList.contains('edit-mode');
    const savedShortInfo = JSON.parse(localStorage.getItem('shortInfo')) || {
        name: "Techies",
        role: "Поддержка / Сапёр",
        difficulty: "Высокая",
        description: "Techies — это команда из трёх гоблинов, специализирующихся на установке мин и ловушек.",
        link: "https://www.dota2.com/hero/techies"
    };

    shortInfo.innerHTML = `
        <p><strong>Имя:</strong> ${savedShortInfo.name}</p>
        <p><strong>Роль:</strong> ${savedShortInfo.role}</p>
        <p><strong>Сложность:</strong> ${savedShortInfo.difficulty}</p>
        <p><strong>Описание:</strong> ${savedShortInfo.description}</p>
        <p><a href="${savedShortInfo.link}" class="link-block">Официальная страница Techies по клику</a></p>
        ${isEditMode ? `
            <div class="edit-buttons">
                <button onclick="editShortInfo()">Редактировать краткую информацию</button>
            </div>
        ` : ''}
    `;
}

function renderHistory() {
    const historyBlock = document.getElementById('history-block');
    const isEditMode = document.getElementById('content').classList.contains('edit-mode');
    const savedHistory = JSON.parse(localStorage.getItem('history')) || {
        text: "За всю историю Устричной бухты никого не ненавидели так, как подрывников Techies. Но — вот незадача — Устричной бухты больше нет. Как и города Тотерина. И даже Охотограда. Вообще, если бы кто-нибудь следил за похождениями подрывников, он бы заметил, что там, где появляются Techies, исчезают города. Как и все остальные неизбежные бедствия, происходившие вокруг них, отправной точкой для уничтожения Устричной бухты стало изобретение. Гении пиротехники — Скви, Сплин и Спун — искали безопасный метод пробить шахты под городом взрывчаткой и создали самое диковинное своё устройство — кнопку, позволяющую зажечь фитиль издалека. Троица, решившая во что бы то ни стало испытать своё изобретение, заставила всю свою крохотную мастерскую радиоуправляемыми бочками с огненной солью. Набив тележку этими бомбами, они закопали их в пустынном поле. Спрятавшись в траншее, Сплин вдавил кнопку детонатора. Но ничего не произошло. Смутившись, он поднялся на ноги и нажимал кнопку ещё и ещё, пока наконец не прогремел взрыв, оставивший на поле воронку. Радостные Скви и Сплин уж было направились в сторону дома, но тут их накрыла мощная ударная волна. Сбитые с толку неожиданным взрывом, они пробрались через едкий дым и увидели, что от их мастерской остались одни руины. С неба падали куски дерева и камня, а воронка под мастерской начала углубляться. Вся Устричная бухта содрогнулась и начала оседать в шахты, а паникующие жители спасались бегством. Присев на краю своего тонущего дома, подрывники ухмылялись и хихикали, уже представляя себе, на что они способны, и совсем не думали о гневе их бывших соседей. Им было интересно только одно: а как можно сделать взрыв ещё сильнее?"
    };

    historyBlock.innerHTML = `
        <h2>ИСТОРИЯ ТЕЧИСА</h2>
        <p>${savedHistory.text}</p>
        ${savedHistory.image ? `<img src="${savedHistory.image}" alt="История">` : ''}
        ${isEditMode ? `
            <div class="edit-buttons">
                <button onclick="editHistory()">Редактировать историю</button>
            </div>
        ` : ''}
    `;
}

// Навигация
function setupNavigation() {
    const sections = {
        main: document.getElementById('main-section'),
        population: document.getElementById('api-results'),
        jokes: document.getElementById('api-results'),
        bitcoin: document.getElementById('api-results'),
        users: document.getElementById('api-results')
    };

    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            document.querySelectorAll('nav a').forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');

            const section = this.dataset.section;

            Object.values(sections).forEach(sec => {
                sec.classList.remove('active');
            });

            sections[section].classList.add('active');

            if (section === 'population') fetchPopulationData();
            else if (section === 'jokes') fetchRandomJoke();
            else if (section === 'bitcoin') fetchBitcoinPrice();
            else if (section === 'users') fetchUsers();
        });
    });

    document.querySelector('nav a[data-section="main"]').click();
}

// API Functions
async function fetchPopulationData() {
    const apiContent = document.getElementById('api-content');
    apiContent.innerHTML = '<div class="loading">⏳ Загрузка данных о странах...</div>';

    try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,population,flags,cca3');

        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);

        const countries = await response.json();
        const randomCountries = countries.sort(() => 0.5 - Math.random()).slice(0, 10);

        let html = `
            <div class="api-card">
                <h3>🌍 Данные о странах</h3>
                <table>
                    <tr>
                        <th>Флаг</th>
                        <th>Страна</th>
                        <th>Столица</th>
                        <th>Население</th>
                        <th>Код</th>
                    </tr>
        `;

        randomCountries.forEach(country => {
            html += `
                <tr>
                    <td><img src="${country.flags?.png || ''}" alt="Флаг" width="30"></td>
                    <td>${country.name?.common || '—'}</td>
                    <td>${country.capital?.[0] || '—'}</td>
                    <td class="population">${formatNumber(country.population)}</td>
                    <td>${country.cca3 || '—'}</td>
                </tr>
            `;
        });

        apiContent.innerHTML = html + `</table></div>`;
    } catch (error) {
        apiContent.innerHTML = `
            <div class="error">
                ❌ Ошибка при загрузке данных: ${error.message}
            </div>
        `;
    }
}

async function fetchRandomJoke() {
    const apiContent = document.getElementById('api-content');
    apiContent.innerHTML = '<div class="loading">⏳ Загрузка случайной шутки...</div>';

    try {
        const response = await fetch('https://official-joke-api.appspot.com/random_joke');
        const joke = await response.json();

        const html = `
            <div class="api-card">
                <h3>😂 Случайная шутка</h3>
                <p><strong>${joke.setup}</strong></p>
                <p>${joke.punchline}</p>
                <p><em>Тип: ${joke.type}</em></p>
            </div>
        `;

        apiContent.innerHTML = html;
    } catch (error) {
        apiContent.innerHTML = `
            <div class="error">
                ❌ Ошибка при загрузке шутки: ${error.message}
            </div>
        `;
    }
}

async function fetchBitcoinPrice() {
    const apiContent = document.getElementById('api-content');
    apiContent.innerHTML = '<div class="loading">⏳ Загрузка курса биткоина...</div>';

    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,eur,gbp,rub&include_last_updated_at=true');

        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);

        const data = await response.json();
        const lastUpdated = new Date(data.bitcoin.last_updated_at * 1000).toLocaleString('ru-RU');

        const html = `
            <div class="api-card">
                <h3>💰 Курс биткоина</h3>
                <p><small>Обновлено: ${lastUpdated}</small></p>
                <div class="stats-container">
                    <div class="stat-row">
                        <span class="stat-name">USD:</span>
                        <span class="stat-value">$${data.bitcoin.usd.toLocaleString('ru-RU')}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-name">EUR:</span>
                        <span class="stat-value">€${data.bitcoin.eur.toLocaleString('ru-RU')}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-name">GBP:</span>
                        <span class="stat-value">£${data.bitcoin.gbp.toLocaleString('ru-RU')}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-name">RUB:</span>
                        <span class="stat-value">${data.bitcoin.rub.toLocaleString('ru-RU')} ₽</span>
                    </div>
                </div>
                <p><em>Данные предоставлены CoinGecko API</em></p>
            </div>
        `;

        apiContent.innerHTML = html;
    } catch (error) {
        apiContent.innerHTML = `
            <div class="error">
                ❌ Ошибка при загрузке курса биткоина: ${error.message}
            </div>
        `;
    }
}

// Работа с пользователями (JSONPlaceholder API)
async function fetchUsers() {
    const apiContent = document.getElementById('api-content');
    apiContent.innerHTML = '<div class="loading">⏳ Загрузка пользователей...</div>';

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);

        currentUsers = await response.json();
        renderUsers(currentUsers);
    } catch (error) {
        apiContent.innerHTML = `<div class="error">❌ Ошибка: ${error.message}</div>`;
    }
}

function renderUsers(users) {
    const apiContent = document.getElementById('api-content');

    let html = `
        <div class="api-card">
            <h3>👥 Управление пользователями</h3>
            <button onclick="showAddUserForm()">Добавить пользователя</button>
            <table class="users-table">
                <tr>
                    <th>ID</th>
                    <th>Имя</th>
                    <th>Email</th>
                    <th>Действия</th>
                </tr>
    `;

    users.forEach(user => {
        html += `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                    <button onclick="editUser(${user.id})">✏️</button>
                    <button onclick="deleteUser(${user.id})">🗑️</button>
                </td>
            </tr>
        `;
    });

    apiContent.innerHTML = html + `</table></div>`;
}

// POST - Добавление пользователя
async function addUser(userData) {
    const apiContent = document.getElementById('api-content');
    apiContent.innerHTML = '<div class="loading">⏳ Добавление пользователя...</div>';

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users', {
            method: 'POST',
            body: JSON.stringify({
                ...userData,
                id: Math.max(...currentUsers.map(u => u.id)) + 1 // Генерируем новый ID
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);

        const newUser = await response.json();
        currentUsers.unshift(newUser);
        renderUsers(currentUsers);
        alert('Пользователь успешно добавлен!');
    } catch (error) {
        apiContent.innerHTML = `<div class="error">❌ Ошибка: ${error.message}</div>`;
    }
}

// PUT - Полное обновление пользователя
async function updateUser(id, userData) {
    const apiContent = document.getElementById('api-content');
    apiContent.innerHTML = '<div class="loading">⏳ Обновление пользователя...</div>';

    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                ...userData,
                id: id // Сохраняем оригинальный ID
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);

        const updatedUser = await response.json();
        const index = currentUsers.findIndex(u => u.id === id);
        if (index !== -1) currentUsers[index] = updatedUser;
        renderUsers(currentUsers);
        alert('Пользователь успешно обновлен!');
    } catch (error) {
        apiContent.innerHTML = `<div class="error">❌ Ошибка: ${error.message}</div>`;
    }
}

// PATCH - Частичное обновление
async function patchUser(id, updates) {
    const apiContent = document.getElementById('api-content');
    apiContent.innerHTML = '<div class="loading">⏳ Частичное обновление...</div>';

    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(updates),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);

        const patchedUser = await response.json();
        const index = currentUsers.findIndex(u => u.id === id);
        if (index !== -1) currentUsers[index] = {...currentUsers[index], ...patchedUser};
        renderUsers(currentUsers);
        alert('Данные пользователя обновлены!');
    } catch (error) {
        apiContent.innerHTML = `<div class="error">❌ Ошибка: ${error.message}</div>`;
    }
}

// DELETE - Удаление пользователя
async function deleteUser(id) {
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) return;

    const apiContent = document.getElementById('api-content');
    apiContent.innerHTML = '<div class="loading">⏳ Удаление пользователя...</div>';

    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);

        currentUsers = currentUsers.filter(user => user.id !== id);
        renderUsers(currentUsers);
        alert('Пользователь удален!');
    } catch (error) {
        apiContent.innerHTML = `<div class="error">❌ Ошибка: ${error.message}</div>`;
    }
}

// Формы для работы с пользователями
function showAddUserForm() {
    const apiContent = document.getElementById('api-content');
    apiContent.innerHTML = `
        <div class="api-card">
            <h3>➕ Добавить пользователя</h3>
            <form onsubmit="handleAddUser(event)">
                <input type="text" name="name" placeholder="Имя" required>
                <input type="email" name="email" placeholder="Email" required>
                <div class="form-buttons">
                    <button type="submit">Сохранить</button>
                    <button type="button" onclick="fetchUsers()">Отмена</button>
                </div>
            </form>
        </div>
    `;
}

function showEditUserForm(id) {
    const user = currentUsers.find(u => u.id === id);
    if (!user) return;

    const apiContent = document.getElementById('api-content');
    apiContent.innerHTML = `
        <div class="api-card">
            <h3>✏️ Редактировать пользователя</h3>
            <form onsubmit="handleUpdateUser(event, ${user.id})">
                <input type="text" name="name" value="${user.name}" required>
                <input type="email" name="email" value="${user.email}" required>
                <div class="form-buttons">
                    <button type="submit">Сохранить</button>
                    <button type="button" onclick="fetchUsers()">Отмена</button>
                    <button type="button" onclick="showPatchForm(${user.id})">Частичное обновление</button>
                </div>
            </form>
        </div>
    `;
}

function showPatchForm(id) {
    const user = currentUsers.find(u => u.id === id);
    if (!user) return;

    const apiContent = document.getElementById('api-content');
    apiContent.innerHTML = `
        <div class="api-card">
            <h3>🔄 Частичное обновление</h3>
            <form onsubmit="handlePatchUser(event, ${user.id})">
                <input type="text" name="name" placeholder="Новое имя" value="${user.name}">
                <input type="email" name="email" placeholder="Новый email" value="${user.email}">
                <div class="form-buttons">
                    <button type="submit">Обновить</button>
                    <button type="button" onclick="showEditUserForm(${user.id})">Назад</button>
                </div>
            </form>
        </div>
    `;
}

// Обработчики форм
function handleAddUser(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
    };
    addUser(userData);
}

function handleUpdateUser(e, id) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
    };
    updateUser(id, userData);
}

function handlePatchUser(e, id) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updates = {};

    if (formData.get('name')) updates.name = formData.get('name');
    if (formData.get('email')) updates.email = formData.get('email');

    if (Object.keys(updates).length > 0) {
        patchUser(id, updates);
    } else {
        alert('Нет данных для обновления');
    }
}

// Редактирование контента
function toggleEditMode() {
    const content = document.getElementById('content');
    const editControls = document.getElementById('edit-controls');
    content.classList.toggle('edit-mode');
    editControls.style.display = content.classList.contains('edit-mode') ? 'block' : 'none';
    renderPage(blocks);
    renderShortInfo();
    renderHistory();
}

function addBlock(type, content) {
    if (!content) return;

    let newBlock;
    switch (type) {
        case 'text': newBlock = new TextBlock(content); break;
        case 'image': newBlock = new ImageBlock(content); break;
        case 'link': newBlock = new LinkBlock(content); break;
        case 'ability': newBlock = new AbilityBlock(content); break;
        case 'history':
            const newHistory = { text: content.text, image: content.image };
            localStorage.setItem('history', JSON.stringify(newHistory));
            renderHistory();
            return;
        default: newBlock = new Block(content);
    }

    blocks.push(newBlock);
    renderPage(blocks);
    saveToLocalStorage(blocks);
}

function removeBlock(index) {
    blocks.splice(index, 1);
    renderPage(blocks);
    saveToLocalStorage(blocks);
}

function editBlock(index) {
    const block = blocks[index];
    let newContent;

    if (block instanceof TextBlock) {
        newContent = prompt("Введите новый текст:", block.data);
        if (newContent) block.data = newContent;
    } else if (block instanceof ImageBlock) {
        newContent = prompt("Введите новый URL изображения:", block.data);
        if (newContent) block.data = newContent;
    } else if (block instanceof LinkBlock) {
        const url = prompt("Введите новый URL:", block.data.url);
        const text = prompt("Введите новый текст ссылки:", block.data.text);
        if (url && text) block.data = { url, text };
    } else if (block instanceof AbilityBlock) {
        const name = prompt("Введите название способности:", block.data.name);
        const description = prompt("Введите описание:", block.data.description);
        const image = prompt("Введите URL изображения:", block.data.image);
        if (name && description && image) block.data = { name, description, image };
    }

    if (newContent) {
        renderPage(blocks);
        saveToLocalStorage(blocks);
    }
}

function editShortInfo() {
    const savedShortInfo = JSON.parse(localStorage.getItem('shortInfo')) || {
        name: "Techies",
        role: "Поддержка / Сапёр",
        difficulty: "Высокая",
        description: "Techies — это команда из трёх гоблинов, специализирующихся на установке мин и ловушек.",
        link: "https://www.dota2.com/hero/techies"
    };

    const name = prompt("Введите имя:", savedShortInfo.name);
    const role = prompt("Введите роль:", savedShortInfo.role);
    const difficulty = prompt("Введите сложность:", savedShortInfo.difficulty);
    const description = prompt("Введите описание:", savedShortInfo.description);
    const link = prompt("Введите ссылку:", savedShortInfo.link);

    if (name && role && difficulty && description && link) {
        const newShortInfo = { name, role, difficulty, description, link };
        localStorage.setItem('shortInfo', JSON.stringify(newShortInfo));
        renderShortInfo();
    }
}

function editHistory() {
    const savedHistory = JSON.parse(localStorage.getItem('history')) || {
        text: "За всю историю Устричной бухты никого не ненавидели так, как подрывников Techies. Но — вот незадача — Устричной бухты больше нет. Как и города Тотерина. И даже Охотограда. Вообще, если бы кто-нибудь следил за похождениями подрывников, он бы заметил, что там, где появляются Techies, исчезают города. Как и все остальные неизбежные бедствия, происходившие вокруг них, отправной точкой для уничтожения Устричной бухты стало изобретение. Гении пиротехники — Скви, Сплин и Спун — искали безопасный метод пробить шахты под городом взрывчаткой и создали самое диковинное своё устройство — кнопку, позволяющую зажечь фитиль издалека. Троица, решившая во что бы то ни стало испытать своё изобретение, заставила всю свою крохотную мастерскую радиоуправляемыми бочками с огненной солью. Набив тележку этими бомбами, они закопали их в пустынном поле. Спрятавшись в траншее, Сплин вдавил кнопку детонатора. Но ничего не произошло. Смутившись, он поднялся на ноги и нажимал кнопку ещё и ещё, пока наконец не прогремел взрыв, оставивший на поле воронку. Радостные Скви и Сплин уж было направились в сторону дома, но тут их накрыла мощная ударная волна. Сбитые с толку неожиданным взрывом, они пробрались через едкий дым и увидели, что от их мастерской остались одни руины. С неба падали куски дерева и камня, а воронка под мастерской начала углубляться. Вся Устричная бухта содрогнулась и начала оседать в шахты, а паникующие жители спасались бегством. Присев на краю своего тонущего дома, подрывники ухмылялись и хихикали, уже представляя себе, на что они способны, и совсем не думали о гневе их бывших соседей. Им было интересно только одно: а как можно сделать взрыв ещё сильнее?"
    };

    const text = prompt("Введите текст истории:", savedHistory.text);
    const image = prompt("Введите URL изображения:", savedHistory.image);

    if (text) {
        const newHistory = { text, image };
        localStorage.setItem('history', JSON.stringify(newHistory));
        renderHistory();
    }
}

function saveToLocalStorage(blocks) {
    const blocksData = blocks.map(block => ({
        type: block.constructor.name.toLowerCase(),
        content: block.data
    }));
    localStorage.setItem('blocks', JSON.stringify(blocksData));
}

function saveChanges() {
    saveToLocalStorage(blocks);
    alert('Изменения сохранены!');
}

function resetToDefault() {
    if (confirm('Вы уверены, что хотите сбросить все изменения?')) {
        localStorage.removeItem('blocks');
        localStorage.removeItem('history');
        localStorage.removeItem('shortInfo');
        location.reload();
    }
}

// Вспомогательные функции
function formatNumber(num) {
    return new Intl.NumberFormat('ru-RU').format(num);
}

// Инициализация событий
function setupEventListeners() {
    document.getElementById('edit-mode-toggle').addEventListener('click', toggleEditMode);
}