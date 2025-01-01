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

          const ratingsSection = document.getElementById('profile-ratings');
          profile.ratings.forEach(rating => {
            const ratingDiv = document.createElement('div');
            ratingDiv.className = 'rating';
            ratingDiv.innerHTML = `
              <p><strong>By:</strong> ${rating.rating_by}</p>
              <p><strong>Date:</strong> ${rating.rating_date}</p>
              <p><strong>Rating Description:</strong>
              <p>${rating.rating_description}</p>
            `;
            ratingsSection.appendChild(ratingDiv);
          });

          // Handle Contact Now functionality
          const contactButton = document.getElementById('contact-now-button');
          contactButton.addEventListener('click', async () => {
            const isMember = await checkMembership();
            if (isMember) {
              document.getElementById('profile-phone-number').textContent = profile.phone_number;
              const contactDetails = document.getElementById('contact-details');
              contactDetails.classList.remove('hidden');
            } else {
              showSubscriptionPopup(profile); // Pass profile if needed
            }
          });
        }
      })
      .catch(error => console.error('Error loading profile:', error));
  }
});

async function checkMembership(email) {
  try {
    const response = await fetch('https://f311-86-160-46-121.ngrok-free.app/check-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    console.log('Response from membership check:', data);
    return data.active;
  } catch (error) {
    console.error('Error checking membership:', error);
    return false;
  }
}

async function showSubscriptionPopup() {
  // Check if the user is logged in using local storage
  const currentUser = await checkLoggedInUser();

  if (currentUser) {
    // Check if the user is an active member
    const isMember = await checkMembership(currentUser.email);

    if (isMember) {
      // Fetch the profile and show the phone number and rates
      const urlParams = new URLSearchParams(window.location.search);
      const userUrl = urlParams.get('user');

      if (userUrl) {
        fetch('profiles.json')
          .then(response => response.json())
          .then(data => {
            const profile = data.profiles.find(p => p.URL === userUrl);

            if (profile) {
              // Show the phone number
              document.getElementById('profile-phone-number').textContent = profile.phone_number || "N/A";

              // Show in-call rates
              const inCallRates = profile.rates?.in_calls || {};
              document.getElementById('in-call-rates').innerHTML = Object.entries(inCallRates)
                .filter(([_, value]) => value !== "-" && value.trim() !== "")
                .map(([key, value]) => `<li>${key.replace("_", " ")}: £${value}</li>`)
                .join("") || "<li>No in-call rates available</li>";

              // Show out-call rates
              const outCallRates = profile.rates?.out_calls || {};
              document.getElementById('out-call-rates').innerHTML = Object.entries(outCallRates)
                .filter(([_, value]) => value !== "-" && value.trim() !== "")
                .map(([key, value]) => `<li>${key.replace("_", " ")}: £${value}</li>`)
                .join("") || "<li>No out-call rates available</li>";

              // Show contact details section
              const contactDetails = document.getElementById('contact-details');
              contactDetails.classList.remove('hidden'); // Make contact details visible
              return; // Exit the function as no subscription popup is needed
            }
          })
          .catch(error => console.error("Error fetching profiles.json or processing data:", error));
      }
    } else {
      // If not a member, show the subscription popup
      const modal = document.createElement('div');
      modal.className = 'modal';
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
          <button id="proceed-to-payment" class="btn-primary">Proceed to Payment</button>
          <button onclick="closeModal()" class="btn-secondary">Cancel</button>
        </div>
      `;
      document.body.appendChild(modal);

      // Handle payment redirection
      document.getElementById("proceed-to-payment").addEventListener("click", () => {
        redirectToPayment(currentUser.email);
      });
    }
  } else {
    // If the user is not logged in, prompt them to log in or create an account
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
        <p>Please log in or create an account to proceed:</p>
        <button onclick="redirectToLogin()" class="btn-primary">Log In / Sign Up</button>
        <button onclick="closeModal()" class="btn-secondary">Cancel</button>
      </div>
    `;
    document.body.appendChild(modal);
  }
}


// Check if the user is logged in using local storage
async function checkLoggedInUser() {
  return new Promise((resolve) => {
    const user = JSON.parse(localStorage.getItem("loggedInUser")); // Retrieves user from local storage
    resolve(user);
  });
}

// Redirect to login page
function redirectToLogin() {
  window.location.href = "login.html"; // Adjust this to your login page URL
}

function redirectToPayment(email) {
  // Construct the Stripe Payment Link with the user's email as a query parameter
  const paymentLink = `https://buy.stripe.com/test_7sI9DwcLn4iVdmEdQQ?client_reference_id=${encodeURIComponent(email)}`;

  // Redirect the user to the Stripe Payment Link
  window.location.href = paymentLink;
}

// Close modal
function closeModal() {
  const modal = document.querySelector(".modal");
  if (modal) modal.remove();
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

