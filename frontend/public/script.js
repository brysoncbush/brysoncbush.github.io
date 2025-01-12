function optionsDisplay() {
    // Check if the tab already exists (to avoid creating it again)
    let optionsTab = document.getElementById("optionsTab");

    if (!optionsTab) {
        // If not, create the tab dynamically
        optionsTab = document.createElement("div");
        optionsTab.id = "optionsTab";
        optionsTab.classList.add("optionsTab");

        // Add content to the tab
        optionsTab.innerHTML = `
            <ul>
                <li><a href="../sign-in/sign-in.html">Sign In</a></li>
                <li><a href="../create-account/create-account.html">Create Account</a></li>
                <li><a href="../settings/settings.html">Settings</a></li>
            </ul>
        `;
        document.body.appendChild(optionsTab);

        // Use setTimeout to ensure the tab is appended before starting the animation
        setTimeout(() => {
            optionsTab.style.right = "0"; // Slide in the tab
        }, 10);
    } else {
        // If the tab already exists, toggle its visibility
        if (optionsTab.style.right === "0px") {
            optionsTab.style.right = "-300px"; // Slide it back off-screen
        } else {
            optionsTab.style.right = "0"; // Slide it in
        }
    }
}