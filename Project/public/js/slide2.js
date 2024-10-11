document.addEventListener("DOMContentLoaded", function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            } else {
                entry.target.classList.remove('show');
            }
        });
    }, {
        root: null,
    threshold: 0.1,
    rootMargin: "0px"
    });

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));
});

document.addEventListener("DOMContentLoaded", function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('active-zoom')) {
                entry.target.classList.add('active-zoom');
                entry.target.classList.remove('reverse-zoom');
            } else if (!entry.isIntersecting && entry.target.classList.contains('active-zoom')) {
                entry.target.classList.remove('active-zoom');
                entry.target.classList.add('reverse-zoom');
            }
        });
    }, {
        root: null,
        threshold: 0.1,
    rootMargin: "0px"
    });

    const zoomElements = document.querySelectorAll('.zoom-out');
    zoomElements.forEach((el) => observer.observe(el));
});

document.addEventListener("DOMContentLoaded", function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('translated');
             } // else {
            //     entry.target.classList.remove('translated');
            // }
        });
    }, {
        root: null, 
    threshold: 0.01,
    rootMargin: "0px"
    });

    const translateElements = document.querySelectorAll('.translate');
    translateElements.forEach((el) => observer.observe(el));
});
document.addEventListener("DOMContentLoaded", function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('lefttranslated');
             }
        });
    }, {
        root: null, 
    threshold: 0.01,
    rootMargin: "0px"
    });

    const ltranslateElements = document.querySelectorAll('.ltranslate');
    ltranslateElements.forEach((el) => observer.observe(el));
});
document.addEventListener("DOMContentLoaded", function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__heartBeat');
             } 
        });
    }, {
        root: null, 
    threshold: 0.01,
    rootMargin: "0px"
    });

    const explorebtn = document.querySelectorAll('.explorebtn');
    explorebtn.forEach((el) => observer.observe(el));
});

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

const hamburger = document.getElementById('hamburger');
const navitems = document.getElementById('navitems');

hamburger.addEventListener('click', () => {
    navitems.querySelector('ul').classList.toggle('show');
});

let left = document.querySelector('#left2');
let right = document.querySelector('#right2');
let btn1 = document.querySelector('#c2btn1');
let btn2 = document.querySelector('#c2btn2');
let btn3 = document.querySelector('#c2btn3');
let btn4 = document.querySelector('#c2btn4');
let btn5 = document.querySelector('#c2btn5');
let btn6 = document.querySelector('#c2btn6');

let leftimages = ['img/left3.jpg', 'img/left1.jpg', 'img/left4.webp'];
let rightimages = ['img/right3.avif', 'img/right1.jpeg', 'img/necklace.jpg'];

let index = 0;

let changebackgrounds = () => {
    if (index < 3) {
        left.style.backgroundImage = `url(${leftimages[index]})`;
        right.style.backgroundImage = `url(${rightimages[index]})`;
        index += 1;
    } else {
        index = 1;
        left.style.backgroundImage = `url(${leftimages[0]})`;
        right.style.backgroundImage = `url(${rightimages[0]})`;
    }
}
setInterval(changebackgrounds, 3000);
btn1.addEventListener('click', () => {
    left.style.backgroundImage = `url(${leftimages[0]})`;
})
btn2.addEventListener('click', () => {
    left.style.backgroundImage = `url(${leftimages[1]})`;
})
btn3.addEventListener('click', () => {
    left.style.backgroundImage = `url(${leftimages[2]})`;
})
btn4.addEventListener('click', () => {
    right.style.backgroundImage = `url(${rightimages[0]})`;
})
btn5.addEventListener('click', () => {
    right.style.backgroundImage = `url(${rightimages[1]})`;
})
btn6.addEventListener('click', () => {
    right.style.backgroundImage = `url(${rightimages[2]})`;
})
document.getElementById("logout-link").addEventListener("click", async () => {
    try {
        await fetch("/logout", { method: "POST" });
        window.location.href = "/login.html";
    } catch (error) {
        console.error("Error logging out:", error);
    }
});