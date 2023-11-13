export function animationInfoBlock(div, setInfoBlock) {
    setInfoBlock(false);

    let top = (window.innerHeight / 2 - document.getElementById(div).getBoundingClientRect().top
        - 200
    ) + 'px';

    let elementChild = document.getElementById(div).firstElementChild;
    const time_title = elementChild.lastElementChild.innerHTML;
    elementChild = elementChild.nextElementSibling;
    const new_title = elementChild.textContent;
    elementChild = elementChild.nextElementSibling;
    const prepod = elementChild.innerHTML;

    document.getElementById('room-info-block-time-container').innerHTML = time_title;
    document.getElementById('room-info-block-prepod').innerHTML = prepod;

    document.getElementById('Info-Block').style.pointerEvents = 'auto';
    document.documentElement.style.setProperty('--old_position_y_center', document.getElementById(div).getBoundingClientRect().top + 'px');
    document.documentElement.style.setProperty('--position_y_center', top);
    document.documentElement.style.setProperty('--pos_y', (window.innerHeight / 2 - 200) + 'px');
    document.documentElement.style.setProperty('--width_block', (document.getElementById(div).getBoundingClientRect().width) + 'px');
    document.documentElement.style.setProperty('--height_block', (document.getElementById(div).getBoundingClientRect().height) + 'px');

    document.documentElement.style.setProperty('--new_title', new_title);

    document.getElementById(div).style.opacity = 0;

    document.getElementById('room-info-block').classList.remove('state2');
    document.getElementById('Info-Block').classList.remove('state2');

    document.getElementById('room-info-block').classList.add('state1');
    document.getElementById('Info-Block').classList.add('state1');
}


function eventFunc() {
    document.getElementById(_idInfoBlockData).style.opacity = 1;
    document.getElementById('Info-Block').style.pointerEvents = 'none';
    _setInfoBlock(true);
    document.getElementById('room-info-block').removeEventListener('animationend', eventFunc);
}

let _setInfoBlock;
let _idInfoBlockData;

export function reverseAnimationInfoBlock(setInfoBlock, idInfoBlockData) {
    _idInfoBlockData = idInfoBlockData;
    _setInfoBlock = setInfoBlock;

    document.getElementById('room-info-block').addEventListener('animationend',  eventFunc);
    document.getElementById('room-info-block').classList.remove('state1');
    document.getElementById('Info-Block').classList.remove('state1');
    document.getElementById('Info-Block').classList.add('state2');
    document.getElementById('room-info-block').classList.add('state2');

}