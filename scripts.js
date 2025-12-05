document.addEventListener('DOMContentLoaded', () => {
    // Elementos principais do app
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const emptyImage = document.querySelector('.empty-image');
    const todosContainer = document.querySelector('.todos-container');
    const progressBar = document.getElementById('progress');
    const progressNumbers = document.getElementById('numbers');
    const form = document.querySelector('.input-area');


    // Mostra ou esconde imagem de vazio conforme tarefas
    const toggleEmptyState = () => {
        emptyImage.style.display = taskList.children.length === 0 ? 'block' : 'none';
        todosContainer.style.width = taskList.children.length > 0 ? '100%' : '50%';
    };


    // Atualiza barra e números de progresso
    const updateProgress = (checkCompletion = true) => {
        const totalTasks = taskList.children.length;
        const completedTasks = taskList.querySelectorAll('.checkbox:checked').length;

        progressBar.style.width = totalTasks ? `${(completedTasks / totalTasks) * 100}%` : '0%';
        progressNumbers.textContent = `${completedTasks} / ${totalTasks}`;
        if(checkCompletion && totalTasks > 0 && completedTasks === totalTasks) {
            Confetti();
        }
    };

    // Salva tarefas no localStorage
    const saveTasksLocalStorage = () => {
        const tasks = Array.from(taskList.querySelectorAll('li')).map(li => ({
            text: li.querySelector('span').textContent,
            completed: li.querySelector('.checkbox').checked
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Carrega tarefas do localStorage ao iniciar
    const loadTasksFromLocalStorage = () => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        if (Array.isArray(savedTasks)) {
            savedTasks.forEach(({text, completed}) => addTask(text, completed, false));
        }
        toggleEmptyState();
        updateProgress();
    };

    // Adiciona nova tarefa à lista
    const addTask = (text, completed = false, checkCompletion = true) => {
        const taskText = (typeof text === 'string' && text.trim()) ? text.trim() : taskInput.value.trim();
        if(!taskText) {
            return;
        }

        const li = document.createElement('li');
        li.innerHTML = `
        <input type="checkbox" class="checkbox" ${completed ? 'checked' : ''} />
        <span>${taskText}</span>
        <div class="task-buttons">
            <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
            <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
        </div>
        `;

        const checkbox = li.querySelector('.checkbox');
        const editBtn = li.querySelector('.edit-btn');

        if (completed) {
            li.classList.add('completed');
            editBtn.disabled = true;
            editBtn.style.opacity = '0.5';
            editBtn.style.pointerEvents = 'none';
        }

        // Marca/desmarca tarefa como concluída
        checkbox.addEventListener('change', () => {
            const isChecked = checkbox.checked;
            li.classList.toggle('completed', isChecked);
            editBtn.disabled = isChecked;
            editBtn.style.opacity = isChecked ? '0.5' : '1';
            editBtn.style.pointerEvents = isChecked ? 'none' : 'auto';
            updateProgress();
            saveTasksLocalStorage();
        });

        // Edita tarefa
        editBtn.addEventListener('click', () => {
            if(!checkbox.checked) {
                taskInput.value = li.querySelector('span').textContent;
                li.remove();
                toggleEmptyState();
                updateProgress(false);
                saveTasksLocalStorage();
            };
        });

        // Remove tarefa da lista
        li.querySelector('.delete-btn').addEventListener('click', () => {
            li.remove();
            toggleEmptyState();
            updateProgress();
            saveTasksLocalStorage();
        });

        taskList.appendChild(li);
        taskInput.value = '';
        toggleEmptyState();
        updateProgress(checkCompletion);
        saveTasksLocalStorage();
    };

    // Adiciona tarefa ao enviar o formulário
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        addTask();
    });

    //Rotação de Slogans
    const slogans = [
        "Sua lista. O pesadelo da preguiça",
        "Devagar, mas sempre!",
        "Onde a procrastinação não tem vez!",
        "A lista de tarefas que a preguiça teme",
        "Tarefa feita é tarefa riscada"
    ];
    let sloganIndex = 0;

    const sloganElement = document.getElementById('slogan-text');

    const rotateSlogans = () => {
        sloganIndex = (sloganIndex + 1) % slogans.length;
        sloganElement.textContent = slogans[sloganIndex];
    };
    
    // Intervalo para função rotateSlogans
    setInterval(rotateSlogans, 10000); 
    
    loadTasksFromLocalStorage(); // Inicializa lista de tarefas
    
});

// Função para efeito de confete ao completar todas as tarefas
const Confetti = () => {
    if (typeof confetti !== 'function') {
        console.warn('Confetti library not available');
        return;
    }

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
        confetti({
            ...defaults,
            particleCount: 40,
            scalar: 1.2,
            shapes: ['star'],
        });

        confetti({
            ...defaults,
            particleCount: 10,
            scalar: 0.75,
            shapes: ['circle'],
        });
    }

    shoot();
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
};