const API_URL = 'http://192.168.1.6:8080/api/tasks';
const token = localStorage.getItem('jwtToken');

// Redirect to login if no token is found
if (!token) {
    window.location.href = 'index.html';
}

// Base configuration for authenticated requests
const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
};

// Bootstrap Modal instances for programmatic control
const createModal = new bootstrap.Modal(document.getElementById('createModal'));
const editModal = new bootstrap.Modal(document.getElementById('editModal'));

// 1. FETCH AND DISPLAY TASKS (GET)
async function loadTasks() {
    try {
        const response = await fetch(API_URL, { headers: authHeaders });
        const tasks = await response.json();
        const container = document.getElementById('tasks-container');
        container.innerHTML = ''; // Clear container before rendering

        tasks.forEach(task => {
            // Task card styling based on completion status
            const isCompleted = task.completed ? 'completed-task bg-light' : 'bg-white';
            const statusBadge = task.completed 
                ? '<span class="badge bg-success mb-2">Completada</span>' 
                : '<span class="badge bg-warning text-dark mb-2">Pendiente</span>';

            const card = document.createElement('div');
            card.className = 'col-md-6 col-lg-4';
            card.innerHTML = `
                <div class="card shadow-sm p-3 task-card ${isCompleted}" onclick='openEditModal(${JSON.stringify(task)})'>
                    ${statusBadge}
                    <h5 class="card-title">${task.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">📅 ${task.creationDate ? task.creationDate : 'Sin fecha'}</h6>
                    <p class="card-text text-truncate">${task.description}</p>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error("Error loading tasks:", error);
    }
}

// 2. CREATE TASK (POST)
async function createTask() {
    const title = document.getElementById('new-title').value;
    const description = document.getElementById('new-desc').value;
    const creationDate = document.getElementById('new-date').value; // Capture date input

    await fetch(API_URL, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ 
            title: title, 
            description: description, 
            completed: false,
            creationDate: creationDate // Send to Spring Boot backend
        })
    });

    // Reset input fields
    document.getElementById('new-title').value = '';
    document.getElementById('new-desc').value = '';
    document.getElementById('new-date').value = '';

    createModal.hide();
    loadTasks();
}

// 3. OPEN EDIT MODAL AND POPULATE DATA
function openEditModal(task) {
    document.getElementById('edit-id').value = task.id;
    document.getElementById('edit-title').value = task.title;
    document.getElementById('edit-desc').value = task.description;
    document.getElementById('edit-completed').checked = task.completed;
    editModal.show();
}

// 4. UPDATE TASK (PUT)
async function updateTask() {
    const id = document.getElementById('edit-id').value;
    const title = document.getElementById('edit-title').value;
    const description = document.getElementById('edit-desc').value;
    const completed = document.getElementById('edit-completed').checked;

    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ title, description, completed })
    });

    editModal.hide();
    loadTasks();
}

// 5. DELETE TASK (DELETE)
async function deleteTaskFromModal() {
    const id = document.getElementById('edit-id').value;
    if (confirm('¿Estás seguro de que querés borrar esta tarea?')) {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: authHeaders
        });
        editModal.hide();
        loadTasks();
    }
}

// --- Confirmed Logout function ---
function confirmLogout() {
    localStorage.removeItem('jwtToken');
    // Use replace to prevent navigation back to the dashboard via the back button
    window.location.replace('index.html');
}

// Initial data load on page startup
loadTasks();