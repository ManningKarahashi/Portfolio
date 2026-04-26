function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ? "/"
    : "/Portfolio/";

let pages = [
    { url: "", title: "Home" },
    { url: "projects/", title: "Projects" },
    { url: "contact/", title: "Contact" },
    { url: "profile/", title: "Profile" },
];

let nav = document.createElement("nav");
document.body.prepend(nav);

for (let p of pages) {
    let url = p.url;
    let title = p.title;

    url = !url.startsWith("http") ? BASE_PATH + url : url;

    let a = document.createElement("a");
    a.href = url;
    a.textContent = title;

    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add("current");
    }

    nav.append(a);
}

document.body.insertAdjacentHTML(
    "afterbegin",
    `<label class="color-scheme">
    Theme:
    <select>
        <option value="light dark">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
    </select>
    </label>`
);

let select = document.querySelector(".color-scheme select");

function setColorScheme(colorScheme) {
    document.documentElement.style.setProperty("color-scheme", colorScheme);
    select.value = colorScheme;
}

if ("colorScheme" in localStorage) {
    setColorScheme(localStorage.colorScheme);
}

select.addEventListener("input", function (event) {
    localStorage.colorScheme = event.target.value;
    setColorScheme(event.target.value);
});

let form = document.querySelector("form");

form?.addEventListener("submit", function (event) {
    event.preventDefault();

    let data = new FormData(form);
    let url = form.getAttribute("action") + "?";
  
    for (let [name, value] of data) {
        url += `${name}=${encodeURIComponent(value)}&`;
    }

    url = url.slice(0, -1);
    location.href = url;
});

export async function fetchJSON(url) {
    try {
        const response = await fetch(url);
 
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }
 
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
    }
}
 
export async function fetchGithubData(username) {
    return fetchJSON(`https://api.github.com/users/${username}`);
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
    if (!containerElement) {
        console.error('renderProjects: containerElement is null or undefined');
        return;
    }
 
    containerElement.innerHTML = '';
 
    if (!projects || projects.length === 0) {
        containerElement.innerHTML = '<p>No projects to display.</p>';
        return;
    }
 
    for (const project of projects) {
        const article = document.createElement('article');
 
        article.innerHTML = `
            <${headingLevel}>${project.title ?? 'Untitled'}</${headingLevel}>
            <img src="${project.image ?? ''}" alt="${project.title ?? ''}">
            <p>${project.description ?? ''}</p>
        `;
 
        containerElement.appendChild(article);
    }
}