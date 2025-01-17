log(terminal, "jkdjhfs")

window.addEventListener('keydown', function(event) {
    if (event.keyCode === 27 || event.key === 'Escape') { 
        process.exit(1);
    }
});


