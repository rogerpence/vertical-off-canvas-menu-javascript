const autoboundEventHandlers = {
    testImageClick: function(e) {
        //document.getElementById('up-down-icon').classList.toggle('rotate180')

        const child = e.currentTarget.firstElementChild;
        child.classList.toggle('rotate180');
        autoboundEventHandlers.toggleSlidingPanel(e);

        console.log(child);
    },

    toggleSlidingPanel: function (e) {

        let panel = document.querySelector('.sliding-panel');    

        const style = getComputedStyle(document.body)
        const width = parseInt(style.getPropertyValue('--off-canvas-menu-width'),10);
       
        console.log(width);

        panel.classList.toggle('show-panel');



        // if (panel.classList.length == 1 ||
        //     panel.classList.contains('move-left')) {

        //     panel.classList.add('move-right');
        //     panel.classList.remove('move-left');
        // }
        // else {                    
        //     panel.classList.add('move-left');
        //     panel.classList.remove('move-right');
        // }


    }
}

assignAutoboundEventHandlers(); 

document.addEventListener('click', (e) => {
    let panel = document.querySelector('.sliding-panel');    
    if (panel.classList.contains('show-panel')) {
        autoboundEventHandlers.toggleSlidingPanel(e);       
    }        
    else {
        e.preventDefault();
        e.stopPropagation();
    }

})

