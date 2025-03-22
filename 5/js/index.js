console.log("Скрипт загружен и выполняется!");

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

function resetToDefault() {
    localStorage.removeItem('blocks');
    localStorage.removeItem('history');
    localStorage.removeItem('shortInfo');
    location.reload();
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

function toggleEditMode() {
    const content = document.getElementById('content');
    const editControls = document.getElementById('edit-controls');
    content.classList.toggle('edit-mode');
    editControls.style.display = content.classList.contains('edit-mode') ? 'block' : 'none';
    renderPage(blocks);
    renderShortInfo();
    renderHistory();
}

function saveToLocalStorage(blocks) {
    const blocksData = blocks.map(block => ({
        type: block.constructor.name.toLowerCase(),
        content: block.data
    }));
    localStorage.setItem('blocks', JSON.stringify(blocksData));
}

function loadFromLocalStorage() {
    const blocksData = JSON.parse(localStorage.getItem('blocks')) || [];
    return blocksData.map(data => {
        switch (data.type) {
            case 'textblock':
                return new TextBlock(data.content);
            case 'imageblock':
                return new ImageBlock(data.content);
            case 'linkblock':
                return new LinkBlock(data.content);
            case 'abilityblock':
                return new AbilityBlock(data.content);
            default:
                return new Block(data.content);
        }
    });
}

document.getElementById('edit-mode-toggle').addEventListener('click', toggleEditMode);

let blocks = loadFromLocalStorage();
if (blocks.length === 0) {
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

    blocks = [
        new ImageBlock("img/techies_village.jpg"),
        new TextBlock(`
            <h2>Способности Techies</h2>
            <div class="abilities-container">${abilities.map(ability => new AbilityBlock(ability).toHTML()).join('')}</div>
        `),
        new TextBlock(tips),
    ];
}

renderPage(blocks);
renderShortInfo();
renderHistory();

function addBlock(type, content) {
    let newBlock;
    switch (type) {
        case 'text':
            newBlock = new TextBlock(content);
            break;
        case 'image':
            newBlock = new ImageBlock(content);
            break;
        case 'link':
            newBlock = new LinkBlock(content);
            break;
        case 'ability':
            newBlock = new AbilityBlock(content);
            break;
        default:
            newBlock = new Block(content);
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