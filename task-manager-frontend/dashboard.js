const API_URL = 'http://localhost:8080/api/tasks';
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

/**
 * FETCH AND DISPLAY TASKS (GET)
 */
async function loadTasks() {
    const container = document.getElementById('tasks-container');

    // Display Skeletons (loading state) while waiting for the server response
    container.innerHTML = `
        <div class="col-md-6 col-lg-4"><div class="card skeleton-card shadow-sm"></div></div>
        <div class="col-md-6 col-lg-4"><div class="card skeleton-card shadow-sm"></div></div>
        <div class="col-md-6 col-lg-4"><div class="card skeleton-card shadow-sm"></div></div>
    `;

    try {
        const response = await fetch(API_URL, { headers: authHeaders });
        const tasks = await response.json();
        container.innerHTML = ''; // Clear container before rendering

        // Check if the task list is empty after receiving data
        if (tasks.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="empty-state p-5 bg-white rounded-4 shadow-sm border border-dashed" style="border: 2px dashed #dee2e6;">
                        <i class="bi bi-journal-check display-1 text-muted opacity-25"></i>
                        <h3 class="mt-3 text-secondary">Todo al día!</h3>
                        <p class="text-muted">No hay tareas existentes. <br> 
                            Probá tocando el botón <strong>"+ Nueva tarea"</strong> para empezar.</p>
                    </div>
                </div>
            `;
            return;
        }

        tasks.forEach(task => {
            let cardClass = '';
            let statusBadge = '';
            let dateTextClass = 'text-muted'; 

            // Visual logic based on task status
            if (task.status === 'COMPLETED') {
                cardClass = 'completed-task bg-light';
                statusBadge = '<span class="badge bg-success mb-2">Completeda</span>';
            } else if (task.status === 'FINISHED') {
                cardClass = 'finished-task'; // Fixed variable name
                statusBadge = '<span class="badge bg-danger mb-2">Finalizada</span>';
            } else {
                // Default status is PENDING
                cardClass = 'bg-white';
                statusBadge = '<span class="badge bg-warning text-dark mb-2">Pendiente</span>';
            }

            const card = document.createElement('div');
            card.className = 'col-md-6 col-lg-4';
            card.innerHTML = `
                <div class="card shadow-sm p-3 task-card ${cardClass}" onclick='openEditModal(${JSON.stringify(task)})'>
                    ${statusBadge}
                    <h5 class="card-title">${task.title}</h5>
                    <h6 class="card-subtitle mb-2 ${dateTextClass}">📅 ${task.creationDate ? task.creationDate : 'Sin fecha seleccionada'}</h6>
                    <p class="card-text text-truncate">${task.description}</p>
                </div>
            `;
            container.appendChild(card);
        });


    } catch (error) {
        console.error("Error al cargar tareas:", error);
    }
}

/**
 * CREATE TASK (POST)
 */
async function createTask() {
    const title = document.getElementById('new-title').value;
    const description = document.getElementById('new-desc').value;
    const rawCreationDate = document.getElementById('new-date').value;
    const rawExpirationDate = document.getElementById('new-expiry').value;

    // Validation: stop execution if title is missing
    if (!title) {
        Swal.fire('Atención', 'Ingresá un nombre para la tarea.', 'warning');
        return;
    }

    // ANTI-400 WORKAROUND: Convert empty date strings ("") to null for backend compatibility
    const creationDate = rawCreationDate === "" ? null : rawCreationDate;
    const expirationDate = rawExpirationDate === "" ? null : rawExpirationDate;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({ 
                title, 
                description, 
                status: 'PENDING',
                creationDate,
                expirationDate 
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Backend Error:", errorText);
            throw new Error('Server error while saving (400)');
        }

        // Reset input fields
        document.getElementById('new-title').value = '';
        document.getElementById('new-desc').value = '';
        document.getElementById('new-date').value = '';
        document.getElementById('new-expiry').value = '';

        createModal.hide();
        loadTasks();
        
        Swal.fire({
            toast: true, position: 'top-end', icon: 'success', 
            title: 'Tarea creada', showConfirmButton: false, timer: 2000
        });

    } catch (error) {
        console.error("Fetch failed:", error);
    }
}

/**
 * OPEN EDIT MODAL AND POPULATE DATA
 */
function openEditModal(task) {
    document.getElementById('edit-id').value = task.id;
    document.getElementById('edit-title').value = task.title;
    document.getElementById('edit-desc').value = task.description;
    
    // Assign dates. If null, inputs will display as empty (dd/mm/yyyy)
    document.getElementById('edit-date').value = task.creationDate || ''; 
    document.getElementById('edit-expiry').value = task.expirationDate || ''; 
    
    document.getElementById('edit-status').value = task.status || 'PENDING'; 
    
    editModal.show();
}

/**
 * UPDATE TASK (PUT)
 */
async function updateTask() {
    const id = document.getElementById('edit-id').value;
    const title = document.getElementById('edit-title').value;
    const description = document.getElementById('edit-desc').value;
    const status = document.getElementById('edit-status').value;
    const creationDate = document.getElementById('edit-date').value;
    const expirationDate = document.getElementById('edit-expiry').value;

    const finalCreationDate = creationDate === "" ? null : creationDate;
    const finalExpirationDate = expirationDate === "" ? null : expirationDate;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: authHeaders,
            body: JSON.stringify({ 
                title, 
                description, 
                status, 
                creationDate: finalCreationDate,
                expirationDate: finalExpirationDate 
            }) 
        });

        if (!response.ok) {
            throw new Error('Could not update task on the server');
        }

        editModal.hide();
        loadTasks();
        
        Swal.fire({
            toast: true, position: 'top-end', icon: 'success', 
            title: 'Tarea actualizada', showConfirmButton: false, timer: 2000
        });

    } catch (error) {
        console.error("PUT request failed:", error);
    }
}

/**
 * DELETE TASK (DELETE)
 */
async function deleteTaskFromModal() {
    const id = document.getElementById('edit-id').value;

    // We use SweetAlert2 for a consistent and professional UI
    const result = await Swal.fire({
        title: 'Estás seguro?',
        text: "Esta acción no se puede deshacer!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545', // Danger Red
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, eliminar!',
        cancelButtonText: 'Cancelar',
        reverseButtons: true // Places "Cancel" on the left for better UX
    });

    if (result.isConfirmed) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: authHeaders
            });

            if (!response.ok) throw new Error('Failed to delete task');

            editModal.hide();
            loadTasks();

            // Success feedback
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Tarea elminada!',
                showConfirmButton: false,
                timer: 2000
            });

        } catch (error) {
            console.error("Delete request failed:", error);
            Swal.fire('Error', 'No se pudo eliminar la tarea. Por favor, intenta de nuevo.', 'error');
        }
    }
}

/**
 * FILTERING LOGIC
 */
function filterTasks() {
    const searchText = document.getElementById('search-input').value.toLowerCase();
    const searchDate = document.getElementById('search-date').value;
    const taskCards = document.querySelectorAll('.task-card');
    let count = 0;

    taskCards.forEach(card => {
        const cardColumn = card.parentElement;
        const title = card.querySelector('.card-title').innerText.toLowerCase();
        const description = card.querySelector('.card-text').innerText.toLowerCase();
        const cardDateText = card.querySelector('.card-subtitle').innerText.replace('📅', '').trim();

        const matchesText = title.includes(searchText) || description.includes(searchText);
        const matchesDate = searchDate === "" || cardDateText === searchDate;

        if (matchesText && matchesDate) {
            cardColumn.style.display = "block";
            count++;
        } else {
            cardColumn.style.display = "none";
        }
    });

    checkEmptyFilterResults(count);
}


function resetFilters() {
    document.getElementById('search-input').value = "";
    document.getElementById('search-date').value = "";
    filterTasks();
}

function checkEmptyFilterResults(count) {
    const container = document.getElementById('tasks-container');
    let noResultsMsg = document.getElementById('no-results-msg');

    if (count === 0) {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.id = 'no-results-msg';
            noResultsMsg.className = 'col-12 text-center py-5';
            noResultsMsg.innerHTML = `
                <i class="bi bi-search display-4 text-muted opacity-25"></i>
                <p class="text-muted mt-2">No tasks match your search criteria.</p>
            `;
            container.appendChild(noResultsMsg);
        }
    } else if (noResultsMsg) {
        noResultsMsg.remove();
    }
}

function confirmLogout() {
    localStorage.removeItem('jwtToken');
    window.location.replace('index.html');
}

// Initial data load
loadTasks();

// Set today's date as default in the creation date input
document.getElementById('new-date').value = new Date().toISOString().split('T')[0];