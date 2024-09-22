document.addEventListener('DOMContentLoaded', function(){
    const fontsHolder = document.getElementById('fontsHolder');
    const arrowDown = document.getElementById('arrowDown');
    const popUp = document.getElementById('popUp');

    // Add event listeners
    document.getElementById('fontsDropdown').addEventListener('click', toggleDropdown);
    document.querySelectorAll('.fontButton').forEach(function(el) {
        el.addEventListener('click', toggleDropdown);
    })

    document.querySelectorAll('.fontButton').forEach(function (button) {
        button.addEventListener('click', function(evt) {
            document.querySelectorAll('.fontButton').forEach(function(btn) {
                btn.classList.remove('selected');
            });
            
            evt.currentTarget.classList.add('selected');
        });
    });

    // Toggle dropdown menu
    function toggleDropdown() {
        fontsHolder.classList.toggle('hidden');
        arrowDown.classList.toggle('arrow-rotate');
        popUp.classList.toggle('hidden');
    }

    // Remove dropdown menu, when you click outside of it
    popUp.addEventListener('click', popupHandler);
    function popupHandler() {
        fontsHolder.classList.add('hidden');
        arrowDown.classList.remove('arrow-rotate');
        popUp.classList.add('hidden');
    }
})
