document.addEventListener('DOMContentLoaded', function () {
  fetch('profiles.json')
    .then(response => response.json())
    .then(data => {
      const profilesList = document.getElementById('profiles-list');
      profilesList.innerHTML = '';

      if (data.profiles && data.profiles.length > 0) {
        // Sort profiles: London first
        const sortedProfiles = data.profiles.sort((a, b) => {
          if (a.region === 'London' && b.region !== 'London') {
            return -1; // "London" profiles come first
          } else if (a.region !== 'London' && b.region === 'London') {
            return 1; // Other profiles come later
          } else {
            return 0; // Preserve order for other profiles
          }
        });

        // Render sorted profiles
        sortedProfiles.forEach(profile => {
          const profileCard = document.createElement('div');
          profileCard.classList.add('profile-card');
          
          // Make the profile card clickable
          profileCard.onclick = () => window.location.href = `profile.html?user=${encodeURIComponent(profile.URL)}`;
          
          const profileImage = profile.images[0] || 'https://via.placeholder.com/150';
          profileCard.innerHTML = `
            <img src="${profileImage}" alt="${profile.name}">
            <div class="profile-info">
              <div class="profile-name">${profile.name}</div>
              <div class="profile-details">${profile.age} y/o - ${profile.gender} - ${profile.town} - ${profile.region}</div>
            </div>
            <div class="profile-badge">ID Verified</div>
          `;
          profilesList.appendChild(profileCard);
        });
      } else {
        profilesList.innerHTML = '<p>No profiles found.</p>';
      }
    })
    .catch(error => console.error("Error loading profiles:", error));
});

// Modal for verified profiles
function showVerifiedModal(name) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <p><strong>${name}</strong> has provided photo ID to prove their identity.</p>
      <button onclick="closeModal()">Close</button>
    </div>
  `;
  document.body.appendChild(modal);
}

// Close modal function
function closeModal() {
  const modal = document.querySelector('.modal');
  if (modal) {
    modal.remove();
  }
}
