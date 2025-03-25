document.addEventListener("DOMContentLoaded", () => {
  const queueList = document.getElementById("queueList");
  const addButton = document.getElementById("addButton");
  const nameInput = document.getElementById("nameInput");

  // Загрузка данных из localStorage при загрузке страницы
  let queue = JSON.parse(localStorage.getItem("queue")) || [];

  // Сохранение данных в localStorage
  function saveQueueToLocalStorage() {
    localStorage.setItem("queue", JSON.stringify(queue));
  }

  // Обновление списка на странице
  function updateQueue() {
    queueList.innerHTML = "";
    queue.sort((a, b) => a.score - b.score); // Сортировка по баллам

    queue.forEach((person, index) => {
      const listItem = document.createElement("li");
      listItem.className = "queue-item";

      const infoDiv = document.createElement("div");
      infoDiv.textContent = `${index + 1}. ${person.name} (${person.score} баллов)`;

      const historyDiv = document.createElement("div");
      historyDiv.className = "history";
      historyDiv.textContent = `История: ${person.history.join(", ") || "пусто"}`;

      const actionsDiv = document.createElement("div");
      actionsDiv.className = "actions";

      const addActionButtons = ["+Д", "+П", "+Р", "+З"];
      const removeActionButtons = ["-Д", "-П", "-Р", "-З"];

      // Добавление кнопок действий
      addActionButtons.forEach(action => {
        const button = document.createElement("button");
        button.className = "action-button add";
        button.textContent = action;
        button.addEventListener("click", () => applyAction(person, action));
        actionsDiv.appendChild(button);
      });

      removeActionButtons.forEach(action => {
        const button = document.createElement("button");
        button.className = "action-button remove";
        button.textContent = action;
        button.addEventListener("click", () => applyAction(person, action));
        actionsDiv.appendChild(button);
      });

      // Кнопка "Удалить"
      const deleteButton = document.createElement("button");
      deleteButton.className = "action-button delete";
      deleteButton.textContent = "Удалить";
      deleteButton.addEventListener("click", () => deletePerson(index));
      actionsDiv.appendChild(deleteButton);

      listItem.appendChild(infoDiv);
      listItem.appendChild(historyDiv);
      listItem.appendChild(actionsDiv);
      queueList.appendChild(listItem);
    });

    // Сохраняем данные в localStorage после обновления
    saveQueueToLocalStorage();
  }

  // Применение действия с учетом новых правил
  function applyAction(person, action) {
    const scoreMap = {
      "+Д": 1,
      "+П": 2,
      "+Р": 3,
      "+З": 4,
      "-Д": -1,
      "-П": -2,
      "-Р": -3,
      "-З": -4,
    };

    const oppositeAction = {
      "+Д": "-Д",
      "+П": "-П",
      "+Р": "-Р",
      "+З": "-З",
      "-Д": "+Д",
      "-П": "+П",
      "-Р": "+Р",
      "-З": "+З",
    };

    // Если это действие "-", проверяем наличие соответствующего "+" в истории
    if (action.startsWith("-")) {
      const requiredAction = oppositeAction[action];
      const index = person.history.indexOf(requiredAction);

      if (index === -1) {
        alert(`Нельзя применить "${action}", так как нет соответствующего "+"`);
        return;
      }

      // Удаляем первое вхождение соответствующего "+"
      person.history.splice(index, 1);
    } else {
      // Если это действие "+", добавляем его в историю
      person.history.push(action);
    }

    // Пересчитываем баллы на основе текущей истории
    person.score = person.history.reduce((total, act) => total + scoreMap[act], 0);

    updateQueue();
  }

  // Удаление участника из очереди
  function deletePerson(index) {
    if (confirm("Вы уверены, что хотите удалить этого участника?")) {
      queue.splice(index, 1); // Удаляем участника из массива
      updateQueue(); // Обновляем интерфейс
    }
  }

  // Добавление нового участника
  addButton.addEventListener("click", () => {
    const name = nameInput.value.trim();
    if (name) {
      queue.push({ name, score: 0, history: [] }); // Инициализация истории
      nameInput.value = "";
      updateQueue();
    } else {
      alert("Введите ФИО!");
    }
  });

  // Загружаем данные из localStorage при запуске
  updateQueue();
});