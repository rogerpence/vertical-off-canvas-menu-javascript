let c1 = Array.from(document.querySelectorAll('.clicker'));

c1.forEach(function(element){
    element.addEventListener('click', (e) => {
        let mover = document.querySelector('.tester');    
    
        if (mover.classList.length == 1 ||
            mover.classList.contains('move-left')) {
    
            mover.classList.add('move-right');
            mover.classList.remove('move-left');
        }
        else {                    
            mover.classList.add('move-left');
            mover.classList.remove('move-right');
        }
    
        let x = 0;
    })
}) 

