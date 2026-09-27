function goToLogin() {
    window.location.href = '/api/calendar/login';
}

function goToLogout() {
    window.location.href = '/api/calendar/logout';
}

export { goToLogin, goToLogout };