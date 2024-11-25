// Toggle theme

const theme = window.localStorage && window.localStorage.getItem("theme");
const themeToggle = document.querySelector(".theme-toggle");
const isDark = theme === "dark";
var metaThemeColor = document.querySelector("meta[name=theme-color]");

if (theme !== null) {
    document.body.classList.toggle("dark-theme", isDark);
    isDark
        ? metaThemeColor.setAttribute("content", "#1b1c1c")
        : metaThemeColor.setAttribute("content", "#f9f9f9");
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    window.localStorage &&
        window.localStorage.setItem(
            "theme",
            document.body.classList.contains("dark-theme") ? "dark" : "light"
        );
    document.body.classList.contains("dark-theme")
        ? metaThemeColor.setAttribute("content", "#1b1c1c")
        : metaThemeColor.setAttribute("content", "#f9f9f9");
});
