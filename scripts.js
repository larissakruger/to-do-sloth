document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const emptyImage = document.querySelector('.empty-image');
    const todosContainer = document.querySelector('.todos-container');
    const progressBar = document.getElementById('progress');
    const progressNumbers = document.getElementById('numbers');
    const form = document.querySelector('.input-area');
    const filters = document.querySelectorAll('.filters button');

    let tasks = [];
    let currentFilter = 'all';

    // Mostra ou esconde imagem de vazio
    const toggleEmptyState = () => {
        const isEmpty = taskList.children.length === 0;

        taskList.style.display = isEmpty ? 'none' : 'block';
        emptyImage.style.display = isEmpty ? 'block' : 'none';
        todosContainer.style.overflowY = isEmpty ? 'hidden' : 'auto';

        if (isEmpty) {
            todosContainer.classList.add('empty-state-active');
        } else {
            todosContainer.classList.remove('empty-state-active');
        }
    };
    
    // Atualiza barra e números de progresso
    const updateProgress = () => {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.completed).length;

        progressBar.style.width = totalTasks ? `${(completedTasks / totalTasks) * 100}%` : '0%';
        progressNumbers.textContent = `${completedTasks} / ${totalTasks}`;

        if(totalTasks > 0 && completedTasks === totalTasks) {
            Confetti();
        }
    };

    // Salva tarefas no localStorage
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Carrega tarefas do localStorage
    const loadTasks = () => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = savedTasks;
        renderTasks();
    };

    // Selecionar os botões de filtro
    const filterButtons = document.querySelectorAll('.filters button'); 

    filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');

    });
});

document.querySelector('.filters button:first-child').classList.add('selected');

    // Aplicando filtro e ordenação
    const renderTasks = () => {
        taskList.innerHTML = '';

        let filteredTasks = tasks;
        if(currentFilter === 'pending') filteredTasks = tasks.filter(t => !t.completed);
        if(currentFilter === 'completed') filteredTasks = tasks.filter(t => t.completed);

        filteredTasks.sort((a, b) => a.completed - b.completed);

        // Cria elementos <li>
        filteredTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''}/>
                <span>${task.text}</span>
                <div class="task-buttons">
                    <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
                    <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;

            const checkbox = li.querySelector('.checkbox');
            const editBtn = li.querySelector('.edit-btn');

            if(task.completed) {
                li.classList.add('completed');
                editBtn.disabled = true;
                editBtn.style.opacity = '0.5';
                editBtn.style.pointerEvents = 'none';
            }

            // Checkbox evento
            checkbox.addEventListener('change', () => {
                task.completed = checkbox.checked;
                renderTasks();
                saveTasks();
            });

            // Editar tarefa
            editBtn.addEventListener('click', () => {
                if(!task.completed) {
                    taskInput.value = task.text;
                    tasks.splice(tasks.indexOf(task), 1);
                    renderTasks();
                    saveTasks();
                }
            });

            // Deletar tarefa
            li.querySelector('.delete-btn').addEventListener('click', () => {
                tasks.splice(tasks.indexOf(task), 1);
                renderTasks();
                saveTasks();
            });

            taskList.appendChild(li);
        });

        toggleEmptyState();
        updateProgress();
    };

    // Adiciona nova tarefa
    const addTask = (text) => {
        const taskText = text?.trim() || taskInput.value.trim();
        if(!taskText) return;

        tasks.push({ text: taskText, completed: false });
        taskInput.value = '';
        renderTasks();
        saveTasks();
    };

    // Eventos
    form.addEventListener('submit', e => {
        e.preventDefault();
        addTask();
    });

    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    // Rotação de slogans
    const slogans = [
        "Sua lista. O pesadelo da preguiça",
        "Devagar, mas sempre!",
        "Onde a procrastinação não tem vez!",
        "A lista de tarefas que a preguiça teme",
        "Tarefa feita é tarefa riscada"
    ];
    let sloganIndex = 0;
    const sloganElement = document.getElementById('slogan-text');
    setInterval(() => {
        sloganIndex = (sloganIndex + 1) % slogans.length;
        sloganElement.textContent = slogans[sloganIndex];
    }, 10000);

    // Inicializa
    loadTasks();
});

// Confete
const Confetti = () => {
    if (typeof confetti !== 'function') return;

    const defaults = {
        spread: 360,
        ticks: 50,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
        shapes: ['star'],
        colors: ['#FFE400', '#FFBD00', '#E89400', '#FFCA6C', '#FDFFB8'],
    };

    function shoot() {
        confetti({ ...defaults, particleCount: 40, scalar: 1.2, shapes: ['star'] });
        confetti({ ...defaults, particleCount: 10, scalar: 0.75, shapes: ['circle'] });
    }

    shoot();
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
};