
document.addEventListener('DOMContentLoaded', function () {
  let profilesData = []; // Store all profiles data
  const profilesPerPage = 10; // Number of profiles to display per page
  let currentPage = 1; // Current page number

  // Fetch profiles data
  function fetchProfiles() {
    fetch('profiles.json')
      .then((response) => response.json())
      .then((data) => {
        if (data.profiles && data.profiles.length > 0) {
          // Sort profiles: London first
          profilesData = data.profiles.sort((a, b) => {
            if (a.region === 'London' && b.region !== 'London') return -1;
            if (a.region !== 'London' && b.region === 'London') return 1;
            return 0;
          });

          renderProfiles(); // Render the first page of profiles
          updatePaginationControls(); // Update pagination controls
        } else {
          document.getElementById('profiles-list').innerHTML = '<p>No profiles found.</p>';
        }
      })
      .catch((error) => console.error('Error loading profiles:', error));
  }

  // Render profiles for the current page
  function renderProfiles() {
    const profilesList = document.getElementById('profiles-list');
    profilesList.innerHTML = ''; // Clear the existing profiles

    const startIndex = (currentPage - 1) * profilesPerPage;
    const endIndex = startIndex + profilesPerPage;
    const profilesToRender = profilesData.slice(startIndex, endIndex); // Slice profiles for the current page

    profilesToRender.forEach((profile) => {
      const profileCard = document.createElement('div');
      profileCard.classList.add('profile-card');

      // Make the profile clickable
      profileCard.onclick = () =>
        window.location.href = `profile.html?user=${encodeURIComponent(profile.URL)}`;

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
  }

  // Update pagination controls
  function updatePaginationControls() {
    const totalPages = Math.ceil(profilesData.length / profilesPerPage);

    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  }

  // Handle "Previous" button click
  function handlePrevPage() {
    if (currentPage > 1) {
      currentPage--;
      renderProfiles();
      updatePaginationControls();
    }
  }

  // Handle "Next" button click
  function handleNextPage() {
    const totalPages = Math.ceil(profilesData.length / profilesPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderProfiles();
      updatePaginationControls();
    }
  }

  // Fetch profiles on page load
  fetchProfiles();

  // Add event listeners for pagination buttons
  document.getElementById('prev-page').addEventListener('click', handlePrevPage);
  document.getElementById('next-page').addEventListener('click', handleNextPage);
});





