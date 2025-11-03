// This function runs all our code after the HTML page is fully loaded
document.addEventListener("DOMContentLoaded", function() {

    // --- 1. HTML "INCLUDE" FUNCTION ---
    // This function fetches HTML content from a file and injects it into an element
    const loadHTML = async (elementId, filePath) => {
        try {
            const response = await fetch(filePath); // Get the file
            if (!response.ok) {
                throw new Error(`Could not fetch ${filePath}: ${response.statusText}`);
            }
            const text = await response.text(); // Get the HTML text
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = text; // Put the HTML into our placeholder
            } else {
                console.warn(`Element with ID '${elementId}' not found.`);
            }
        } catch (error) {
            console.error('Error loading HTML:', error);
        }
    };

    // --- 2. MAIN APP LOGIC FUNCTION ---
    // We run this function *after* loading the header and footer
    const initializeApp = () => {
        
        // Find elements on the page
        const loginForm = document.getElementById("login-form");
        const welcomeMessage = document.getElementById("welcome-message");
        const authButtonPlaceholder = document.getElementById("auth-button-placeholder");

        // Check if user is logged in
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        const username = localStorage.getItem("username");

        // --- A) LOGIC FOR DASHBOARD PAGE (index.html) ---
        if (welcomeMessage) {
            if (!isLoggedIn) {
                // If not logged in, kick them back to login.html
                alert("You must be logged in to view this page.");
                window.location.href = "login.html";
                return; // Stop running the script
            }

            // If they are logged in:
            // 1. Show welcome message
            welcomeMessage.textContent = `Welcome, ${username}! Select an option from the sidebar.`;
            
            // 2. Add the "Logout" button to the header
            if (authButtonPlaceholder) {
                authButtonPlaceholder.innerHTML = `<a href="login.html" class="btn logout-btn" id="logout-btn">Logout</a>`;
            }

            // 3. Add event listener to the *new* logout button
            const logoutButton = document.getElementById("logout-btn");
            if (logoutButton) {
                logoutButton.addEventListener("click", (event) => {
                    event.preventDefault();
                    localStorage.removeItem("isLoggedIn");
                    localStorage.removeItem("username");
                    window.location.href = "login.html";
                });
            }
        }

        // --- B) LOGIC FOR LOGIN PAGE (login.html) ---
        if (loginForm) {
            // 1. Add the "Login" button to the header
            if (authButtonPlaceholder) {
                authButtonPlaceholder.innerHTML = `<a href="login.html" class="btn login-btn">Login</a>`;
            }
            
            // 2. Add event listener to the form
            loginForm.addEventListener("submit", (event) => {
                event.preventDefault();
                const usernameInput = document.getElementById("username").value;
                const errorMsg = document.getElementById("error-message");

                if (usernameInput.trim() === "") {
                    errorMsg.textContent = "Please enter a username.";
                } else {
                    // Success!
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("username", usernameInput);
                    window.location.href = "index.html"; // Go to dashboard
                }
            });
        }
    };

    // --- 3. EXECUTION ---
    // We use Promise.all to load header and footer *at the same time*.
    // *After* they are both finished, .then() runs the initializeApp function.
    Promise.all([
        loadHTML("header-placeholder", "_header.html"),
        loadHTML("footer-placeholder", "_footer.html")
    ]).then(() => {
        // Now that the header and footer are loaded, run the main app logic
        initializeApp();
    });

});
