document.addEventListener("DOMContentLoaded", async function () {
    const userTableBody = document.getElementById("user-list");

    try {
        // Fetch user list from API
        const response = await fetch("http://localhost:3001/user-list");
        const data = await response.json();

        if (response.ok && data.values) {
            userTableBody.innerHTML = ""; // Clear existing content

            data.values.forEach((user, index) => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.full_name}</td>
                    <td>${user.email}</td>
                    <td>
                        <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
                    </td>
                `;

                userTableBody.appendChild(row);
            });
        } else {
            userTableBody.innerHTML = `<tr><td colspan="4">No users found</td></tr>`;
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        userTableBody.innerHTML = `<tr><td colspan="4">Error loading users</td></tr>`;
    }
});

// Function to handle user deletion
async function deleteUser(userId) {
    if (confirm("Are you sure you want to delete this user?")) {
        try {
            const response = await fetch(`http://localhost:3001/user-delete/${userId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("User deleted successfully!");
                location.reload(); // Refresh the page to update the list
            } else {
                alert("Failed to delete user");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    }
}

// Placeholder for Edit Function (You can implement this later)
function editUser(userId) {
    alert(`Edit functionality for user ID ${userId} is coming soon!`);
}
