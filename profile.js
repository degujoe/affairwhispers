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

// Handle Contact Now functionality
const contactButton = document.getElementById('contact-now-button');
contactButton.addEventListener('click', async () => {
  const currentUser = await checkLoggedInUser();

  if (!currentUser) {
    // If the user is not logged in, show a login/signup popup
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h2>Login or Sign Up</h2>
        <p>You must log in or sign up to access this feature.</p>
        <button onclick="redirectToLogin()" class="btn-primary">Log In / Sign Up</button>
        <button onclick="closeModal()" class="btn-secondary">Cancel</button>
      </div>
    `;
    document.body.appendChild(modal);
    return;
  }

  // Check if the user is a member
  const isMember = await checkMembership();

  if (!isMember) {
    // Show subscription advertisement popup
    showSubscriptionPopup();
  } else {
    // Reveal phone number and rates for members
    document.getElementById('profile-phone-number').textContent = profile.phone_number || 'N/A';
    contactDetails.classList.remove('hidden');
  }
});

// Check if the user is logged in
async function checkLoggedInUser() {
  return new Promise((resolve) => {
    const user = JSON.parse(localStorage.getItem("loggedInUser")); // Replace with Firebase Auth if needed
    resolve(user);
  });
}

// Simulate membership check
async function checkMembership() {
  return new Promise((resolve) => {
    const isMember = localStorage.getItem('isMember') === 'true';
    resolve(isMember);
  });
}

// Show subscription popup
async function showSubscriptionPopup() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Subscribe to AffairWhispers</h2>
      <p>Unlock exclusive features:</p>
      <ul class="subscription-benefits">
        <li><strong>Access Verified Profiles:</strong> Every profile is ID verified for authenticity.</li>
        <li><strong>Phone Numbers Unlocked:</strong> Directly connect with your matches.</li>
        <li><strong>Detailed Profiles:</strong> Full access to preferences, interests, and more.</li>
        <li><strong>No Hidden Fees:</strong> Transparent pricing with no surprises.</li>
      </ul>
      <button id="proceed-to-payment" class="btn-primary">Subscribe Now</button>
      <button onclick="closeModal()" class="btn-secondary">Cancel</button>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById("proceed-to-payment").addEventListener("click", () => {
    const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
    redirectToPayment(currentUser.email);
  });
}

// Redirect to login page
function redirectToLogin() {
  window.location.href = "login.html";
}

// Redirect to Stripe payment page
function redirectToPayment(email) {
  fetch("/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  })
    .then((response) => response.json())
    .then((data) => {
      const stripe = Stripe("pk_test_51M2LCuB0HvM76esk0scIQVcbL2HhYxldNk4MFJIgwxaZuKf6DVqLh3GWvAuLWkmfBeWdUNACBMvMwPjkBCMMKdZI00kBAXwK9B");
      return stripe.redirectToCheckout({ sessionId: data.sessionId });
    })
    .catch((error) => {
      console.error("Error redirecting to payment:", error);
    });
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
