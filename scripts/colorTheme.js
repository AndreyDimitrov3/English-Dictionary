const themeSwitcher = document.querySelector("[data-theme-picker]");
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

// Automatically set the theme based on user settings
document.documentElement.setAttribute("data-theme", prefersDarkScheme.matches ? "dark" : "light");
themeSwitcher.checked = prefersDarkScheme.matches;

// Add event listener for manual theme switching
themeSwitcher.addEventListener("change", () => {
    if (themeSwitcher.checked) {
        document.documentElement.setAttribute("data-theme", "dark");
    } else {
        document.documentElement.setAttribute("data-theme", "light");
    }
});
