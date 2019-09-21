window.addEventListener('load', () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('sw.js')
            .then(registration => console.log('Service Worker registered'))
            .catch(err => 'SW registration failed');
    }
    const el = document.querySelector('main');
    el.classList.remove('mounted');
    el.classList.add('mounted');
    const toggle = document.getElementById('switch');
    toggle.addEventListener('click', event => {
        if (event.currentTarget.checked) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    });
});

(() => {})();
