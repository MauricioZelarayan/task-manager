// --- Active session protection ---
if (localStorage.getItem('jwtToken')) {
    // Use 'replace' instead of 'href' to avoid leaving a trace in the browser history
    window.location.replace('dashboard.html');
}

// Backend URL
const API_URL = 'http://localhost:8080/auth';

// UI Elements
const authForm = document.getElementById('auth-form');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const toggleFormBtn = document.getElementById('toggle-form');
const errorMessage = document.getElementById('error-message');

// Flag to track Login vs Register mode
let isLoginMode = true;

// Switch between Login and Register modes
toggleFormBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    
    if (isLoginMode) {
        formTitle.innerText = 'Iniciar Sesión';
        submitBtn.innerText = 'Ingresar';
        toggleFormBtn.innerText = '¿No tienes cuenta? Regístrate aquí';
    } else {
        formTitle.innerText = 'Crear Cuenta';
        submitBtn.innerText = 'Registrarse';
        toggleFormBtn.innerText = '¿Ya tienes cuenta? Inicia sesión';
    }
    errorMessage.classList.add('d-none'); // Hide error messages when toggling
});

// Handle form submission
authForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent page refresh

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Define endpoint based on current mode
    const endpoint = isLoginMode ? '/login' : '/register';
    
    try {
        const response = await fetch(API_URL + endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            throw new Error(isLoginMode ? 'Credenciales incorrectas' : 'El usuario ya existe o hay un error');
        }

        const data = await response.json();

        if (isLoginMode) {
            // Store the JWT Token in the browser's localStorage
            // Ensure the backend returns the token in a field named "token"
            localStorage.setItem('jwtToken', data.token); 
            
            // Redirect to Dashboard and clear history stack
            window.location.replace('dashboard.html'); 

        } else {

            authForm.reset();

            // Success feedback for registration and switch to login mode
            Swal.fire({
                icon: 'success',
                title: '¡Registro exitoso!',
                text: 'Ahora puedes iniciar sesión con tu nueva cuenta.',
                confirmButtonColor: '#0d6efd',
                timer: 3000
            });
            toggleFormBtn.click(); // Trigger toggle back to login
        }

    } catch (error) {
        errorMessage.innerText = error.message;
        errorMessage.classList.remove('d-none');
    }
});