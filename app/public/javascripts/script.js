
let searchForm = document.querySelector('.search-form')

document.querySelector('#search-btn').onclick = () => {
    searchForm.classList.toggle('active');
    loginForm.classList.remove('active');
    navbar.classList.remove('active');
}

let loginForm = document.querySelector('.login-form')

document.querySelector('#login-btn').onclick = () => {
    loginForm.classList.toggle('active');
    searchForm.classList.remove('active');
    navbar.classList.remove('active');
}

let navbar = document.querySelector('.navbar')

document.querySelector('#menu-btn').onclick = () => {
    navbar.classList.toggle('active');
    searchForm.classList.remove('active');
    loginForm.classList.remove('active');
}

window.onscroll = () =>{
    searchForm.classList.remove('active');
    loginForm.classList.remove('active');
    navbar.classList.remove('active');
}

var swiper = new Swiper(".product-slider", {
    loop:true,
    spaceBetween: 20,
    autoplay: {
        delay: 2000,
        disableOnInteraction: false,
    },
    centeredSlides: true,
    breakpoints: {
        0: {
            slidesPerview: 1,
        },
        768: {
            slidesPerview: 2,
        },     
        1020: {
            slidesPerview: 3,
        },
    },
});


let popup = document.getElementById("popup");
let popup2 = document.getElementById("popup2");
let popup3 = document.getElementById("popup3");

function openPopup(){
    popup.classList.add("open-popup")
    popup2.classList.remove("open-popup")
    popup3.classList.remove("open-popup")
}

function closePopup(){
    popup.classList.remove("open-popup")
}


function openPopup2(){
    popup2.classList.add("open-popup")
    popup.classList.remove("open-popup")
    popup3.classList.remove("open-popup")
}

function closePopup2(){
    popup2.classList.remove("open-popup")
}

function closePopup3(){
    popup3.classList.remove("open-popup")
}

function openPopup3(){
    popup3.classList.add("open-popup")
    popup.classList.remove("open-popup")
    popup2.classList.remove("open-popup")
}



const stars = document.querySelectorAll(".stars span");

stars.forEach((star, index1) => {
    star.addEventListener("click", ()=> {

        stars.forEach((star, index2) => {
            index1 >= index2 ? star.classList.add("active") : star.classList.remove("active")
        })
    })
})


