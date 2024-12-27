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
            const isMember = await checkMembership();
            if (isMember) {
              // Reveal phone number and rates
              document.getElementById('profile-phone-number').textContent = profile.phone_number || 'N/A';
              contactDetails.classList.remove('hidden');
            } else {
              showSubscriptionPopup(profile);
            }
          });
        }
      })
      .catch(error => console.error("Error loading profile:", error));
  }
});

// Simulate membership check
async function checkMembership() {
  // Replace with backend check
  return new Promise((resolve) => {
    const isMember = localStorage.getItem('isMember') === 'true';
    resolve(isMember);
  });
}

// Show Subscription Popup
function showSubscriptionPopup(profile) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Get Full Access to AffairWhispers</h2>
      <p>Join <strong>AffairWhispers</strong> and unlock exclusive features:</p>
      <ul class="subscription-benefits">
        <li><strong>Access Verified Profiles:</strong> Every profile is ID verified for authenticity.</li>
        <li><strong>Phone Numbers Unlocked:</strong> Directly connect with your matches.</li>
        <li><strong>Detailed Profiles:</strong> Full access to preferences, interests, and more.</li>
        <li><strong>No Hidden Fees:</strong> Transparent pricing with no surprises.</li>
        <li><strong>Discreet Billing:</strong> Appears as "AMZNMKTPLACE" in bank statements.</li>
      </ul>
      <button id="proceed-to-payment" class="btn-primary">Subscribe Now</button>
      <p>Already a member? <a id="login-link" href="login.html">Log In</a></p>
      <button onclick="closeModal()" class="btn-secondary">Cancel</button>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('proceed-to-payment').addEventListener('click', redirectToPayment);
}

// Redirect to Stripe payment page
function redirectToPayment() {
  const stripePublicKey = 'pk_test_51M2LCuB0HvM76esk0scIQVcbL2HhYxldNk4MFJIgwxaZuKf6DVqLh3GWvAuLWkmfBeWdUNACBMvMwPjkBCMMKdZI00kBAXwK9B'; // Replace with your Stripe public key
  const stripe = Stripe(stripePublicKey);

  stripe.redirectToCheckout({
    lineItems: [
      {
        price: 'price_1QZttOB0HvM76eskACyPw35o', // Replace with your Stripe price ID
        quantity: 1,
      },
    ],
    mode: 'subscription',
    successUrl: window.location.href + '&paid=true',
    cancelUrl: window.location.href,
  }).then((result) => {
    if (result.error) {
      alert(result.error.message);
    }
  });
}

function showImageInModal(imageSrc) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <img src="${imageSrc}" class="modal-image" alt="Profile Image">
      <span class="close-modal" onclick="closeModal()">×</span>
    </div>
  `;
  document.body.appendChild(modal);
}

function closeModal() {
  const modal = document.querySelector('.modal');
  if (modal) modal.remove();
}


