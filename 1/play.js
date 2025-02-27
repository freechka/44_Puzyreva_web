let hasKey = false;
let hasSword = false;
let isAlive = true;

while (isAlive) {
    const choice = prompt(`
        Куда ты пойдешь?
        1. Идти вперед по тропинке.
        2. Осмотреть кусты.
        3. Попытаться открыть старую дверь в дереве.
        4. Сдаться и закончить игру.
    `);

    switch (choice) {
        case "1":
            const encounter = Math.random();
            if (encounter < 0.5) {
                alert("Ты встретил дружелюбного оленя. Он показал тебе безопасный путь.");
            } else {
                const fight = confirm("Ты встретил дикого волка! Хочешь сразиться с ним?");
                if (fight) {
                    if (hasSword) {
                        alert("Ты использовал меч и победил волка! Ты можешь идти дальше.");
                    } else {
                        alert("У тебя нет оружия, и волк напал на тебя. Игра окончена.");
                        isAlive = false;
                    }
                } else {
                    alert("Ты убежал от волка, но заблудился в лесу.");
                }
            }
            break;

        case "2":
            if (!hasKey) {
                const takeKey = confirm("Ты нашел ключ в кустах. Взять его?");
                if (takeKey) {
                    hasKey = true;
                    alert("Ты взял ключ. Может быть, он пригодится.");
                } else {
                    alert("Ты оставил ключ в кустах.");
                }
            } else {
                alert("Ты уже осмотрел кусты. Здесь больше ничего нет.");
            }
            break;

        case "3":
            if (hasKey) {
                alert("Ты использовал ключ, чтобы открыть дверь. За ней ты нашел выход из леса! Поздравляю, ты победил!");
                isAlive = false;
            } else {
                alert("Дверь заперта. Тебе нужен ключ, чтобы открыть ее.");
            }
            break;

        case "4":
            alert("Ты сдался. Игра окончена.");
            isAlive = false;
            break;

        default:
            alert("Пожалуйста, выбери вариант от 1 до 4.");
            break;
    }

    if (isAlive && !hasSword) {
        const findSword = confirm("По пути ты нашел старый меч. Взять его?");
        if (findSword) {
            hasSword = true;
            alert("Теперь у тебя есть меч. Он может пригодиться в бою.");
        }
    }
}

alert("Спасибо за игру! Попробуй еще раз, чтобы увидеть другие концовки.");