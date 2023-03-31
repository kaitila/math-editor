function openNav() {
    document.querySelector(".sidebar").style.width = "20rem";
    document.querySelector(".shader").style.display = "block";
}

function closeNav() {
    document.querySelector(".sidebar").style.width = "0";
    document.querySelector(".shader").style.display = "none";
}

document.getElementById('open').addEventListener('click', () => openNav());
document.getElementById('close').addEventListener('click', () => closeNav());
document.querySelector(".shader").addEventListener('click', () => closeNav());

document.getElementById('dark').addEventListener('click', () => document.body.classList.add('darkmode'));
document.getElementById('light').addEventListener('click', () => document.body.classList.remove('darkmode'));