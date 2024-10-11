let nextDom = document.getElementById('next');
let prevDom = document.getElementById('prev');
let carouselDom = document.querySelector('.carousel');
let listItemDom = document.querySelector('.carousel .list');
let thumbnailDom = document.querySelector('.carousel .thumbnail');

const hamburger = document.getElementById('hamburger');
const navitems = document.getElementById('navitems');

hamburger.addEventListener('click', () => {
    navitems.querySelector('ul').classList.toggle('show');
});

nextDom.onclick = function(){
    console.log("Next button clicked");
    showSlider('next');
}
prevDom.onclick = function(){
    console.log("prev button clicked");
    showSlider('prev');
}
let timeRunning = 3000;
let runTimeOut;
function showSlider(type){
    let itemSlider = document.querySelectorAll('.carousel .list .item')
    let itemThumbnail = document.querySelectorAll('.carousel .thumbnail .item')

    if (type == 'next'){
        listItemDom.appendChild(itemSlider[0]);
        thumbnailDom.appendChild(itemThumbnail[0]);
        carouselDom.classList.add('next');
    } else{
        let positionLastItem = itemSlider.length - 1;
        listItemDom.prepend(itemSlider[positionLastItem]);
        thumbnailDom.prepend(itemThumbnail[positionLastItem]);
        carouselDom.classList.add('prev');
    }

    clearTimeout(runTimeOut);
    runTimeOut = setTimeout(()=>{
        carouselDom.classList.remove('next');
        carouselDom.classList.remove('prev');
    },timeRunning)
}

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/user-details', {
            method: 'GET',
            credentials: 'include' 
        });
        const data = await response.json();

        if (data.isLoggedIn) {
            document.getElementById('user-details').textContent = `Welcome, ${data.username}!`;
        } else {
            window.location.href = '/login.html'; 
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
        window.location.href = '/login.html';
    }
});
document.getElementById("logout-link").addEventListener("click", async () => {
    try {
        await fetch("/logout", { method: "POST" });
        window.location.href = "/login.html";
    } catch (error) {
        console.error("Error logging out:", error);
    }
});