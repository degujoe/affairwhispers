document.addEventListener('DOMContentLoaded', function () {
  let profilesData = []; // Store all profiles data
  let profilesToShow = 10; // Number of profiles to show per page
  let currentPage = 1; // Current page number

  // Fetch and store profiles data
  function fetchProfiles() {
    fetch('profiles.json')
      .then(response => response.json())
      .then(data => {
        if (data.profiles && data.profiles.length > 0) {
          // Sort profiles: London first
          profilesData = data.profiles.sort((a, b) => {
            if (a.region === 'London' && b.region !== 'London') {
              return -1;
            } else if (a.region !== 'London' && b.region === 'London') {
              return 1;
            } else {
              return 0;
            }
          });

          renderProfiles(); // Render the initial set of profiles
        } else {
          document.getElementById('profiles-list').innerHTML = '<p>No profiles found.</p>';
        }
      })
      .catch(error => console.error("Error loading profiles:", error));
  }

  // Render profiles for the current page
  function renderProfiles() {
    const profilesList = document.getElementById('profiles-list');
    const startIndex = (currentPage - 1) * profilesToShow;
    const endIndex = startIndex + profilesToShow;
    const profilesToRender = profilesData.slice(startIndex, endIndex);

    profilesToRender.forEach(profile => {
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

    // Hide the "Load More" button if all profiles are displayed
    if (endIndex >= profilesData.length) {
      document.getElementById('load-more').style.display = 'none';
    }
  }

  // Handle "Load More" button click
  function handleLoadMore() {
    currentPage++;
    renderProfiles();
  }

  // Fetch profiles data on page load
  fetchProfiles();

  // Add event listener to "Load More" button
  const loadMoreButton = document.getElementById('load-more');
  loadMoreButton.addEventListener('click', handleLoadMore);

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
});
