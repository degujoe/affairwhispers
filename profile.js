document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const userUrl = urlParams.get('user');

  if (userUrl) {
    fetch('profiles.json')
      .then(response => response.json())
      .then(data => {
        const profile = data.profiles.find(p => p.URL === userUrl);

        if (profile) {
          // Populate profile details
          document.getElementById('profile-name').textContent = profile.name;
          document.getElementById('profile-name-heading').textContent = profile.name;
          document.getElementById('profile-age').textContent = profile.age;
          document.getElementById('profile-gender').textContent = profile.gender;
          document.getElementById('profile-location').textContent = `${profile.town}, ${profile.county}, ${profile.region}, ${profile.country}`;
          document.getElementById('profile-ethnicity').textContent = profile.ethnicity;
          document.getElementById('profile-height').textContent = profile.height;
          document.getElementById('profile-hair').textContent = profile.hair_colour;
          document.getElementById('profile-eyes').textContent = profile.eye_colour;
          document.getElementById('profile-nationality').textContent = profile.nationality;
          document.getElementById('profile-orientation').textContent = profile.orientation;
          document.getElementById('profile-member_since').textContent = profile.member_since;
          document.getElementById('profile-last-login').textContent = profile.last_login;
          document.getElementById('profile-dress-size').textContent = profile.dress_size;
          document.getElementById('profile-chest-size').textContent = profile.chest_size;
          document.getElementById('profile-pubic-hair').textContent = profile.pubic_hair;

          // Set main profile image
          const mainImage = profile.images[0] || 'https://via.placeholder.com/150';
          document.getElementById('profile-main-image').src = mainImage;

          // Populate image thumbnails
          const thumbnailsContainer = document.getElementById('profile-thumbnails');
          profile.images.forEach(image => {
            const img = document.createElement('img');
            img.src = image;
            img.alt = `${profile.name}'s photo`;
            img.className = 'thumbnail';
            img.onclick = () => showImageInModal(image);
            thumbnailsContainer.appendChild(img);
          });

          // Populate reviews
          const reviewsSection = document.getElementById('profile-reviews');
          profile.reviews.forEach(review => {
            const reviewDiv = document.createElement('div');
            reviewDiv.className = 'review';
            reviewDiv.innerHTML = `
              <p><strong>By:</strong> ${review.report_by}</p>
              <p><strong>Date:</strong> ${review.meet_date}</p>
              <p><strong>Overall Rating:</strong> ${review.overall_rating}</p>
              <p><strong>Physical Rating:</strong> ${review.physical_score}</p>
              <p>${review.physical_description}</p>
              <p><strong>Personality Rating:</strong> ${review.personality_score}</p>
              <p>${review.personality_description}</p>
            `;
            reviewsSection.appendChild(reviewDiv);
          });

async function handleContactNow() {
  const currentUser = JSON.parse(localStorage.getItem("loggedInUser")); // Check if user is logged in

  const modal = document.createElement("div");
  modal.className = "modal";

  if (!currentUser) {
    // User is not logged in
    modal.innerHTML = `
      <div class="modal-content">
        <h2>Log In or Sign Up</h2>
        <p>You must log in or create an account to contact this profile.</p>
        <button onclick="redirectToLogin()" class="btn-primary">Log In / Sign Up</button>
        <button onclick="closeModal()" class="btn-secondary">Cancel</button>
      </div>
    `;
  } else {
    // User is logged in
    modal.innerHTML = `
      <div class="modal-content">
        <h2>Subscribe to AffairWhispers</h2>
        <p>Welcome back, <strong>${currentUser.email}</strong>!</p>
        <p>Unlock exclusive features:</p>
        <ul class="subscription-benefits">
          <li><strong>Access Verified Profiles:</strong> Every profile is ID verified for authenticity.</li>
          <li><strong>Phone Numbers Unlocked:</strong> Directly connect with your matches.</li>
          <li><strong>Detailed Profiles:</strong> Full access to preferences, interests, and more.</li>
          <li><strong>No Hidden Fees:</strong> Transparent pricing with no surprises.</li>
        </ul>
        <button onclick="closeModal()" class="btn-primary">OK</button>
      </div>
    `;
  }

  document.body.appendChild(modal);
}

// Redirect to login page
function redirectToLogin() {
  window.location.href = "login.html"; // Adjust this to your login page URL
}

// Close modal
function closeModal() {
  const modal = document.querySelector(".modal");
  if (modal) modal.remove();
}





function showImageInModal(imageSrc) {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content">
      <img src="${imageSrc}" class="modal-image" alt="Profile Image">
      <span class="close-modal" onclick="closeModal()">×</span>
    </div>
  `;
  document.body.appendChild(modal);
}

function closeModal() {
  const modal = document.querySelector(".modal");
  if (modal) modal.remove();
}
