// Example static data (move to a separate data file if you wish)
const PLACE_DATA = [
  {
    "id": "pangong-lake",
    "name": "Pangong Lake",
    "image": "/Project/static/images/pangong.jpg",
    "description": "Stunning brackish lake famous for its changing colors and peaceful surroundings, located in the Himalayas.",
    "special_details": [
      "Famous for Bollywood movie scenes",
      "Camping by the lakeshore",
      "Visit the nearby Chang La pass"
    ],
    "festivals_culture": [],
    "best_time_to_visit": "June - September",
    "region": "North"
  },
  {
    "id": "nubra-valley",
    "name": "Nubra Valley",
    "image": "/Project/static/images/nubra.jpg",
    "description": "A scenic valley characterized by sand dunes, double-humped camels, and Buddhist monasteries.",
    "special_details": [
      "Double-humped camel safaris",
      "Diskit Monastery panoramic views",
      "Hot springs at Panamik"
    ],
    "festivals_culture": [],
    "best_time_to_visit": "May - September",
    "region": "North"
  },
  {
    "id": "golden-temple",
    "name": "Golden Temple",
    "image": "/Project/static/images/golden-temple.jpg",
    "description": "The spiritual and cultural heart of Sikhism, known for its stunning gold leaf architecture and free community kitchen.",
    "special_details": [
      "Open 24/7 to visitors of all faiths",
      "Langar offers free meals to thousands daily",
      "Calm and peaceful environment with live devotional music"
    ],
    "festivals_culture": [
      "Hemis Festival (July)",
      "Gurpurab celebrations"
    ],
    "best_time_to_visit": "October - March",
    "region": "North"
  },
  {
    "id": "wagah-border",
    "name": "Wagah Border",
    "image": "/Project/static/images/wagah.jpg",
    "description": "Famous India-Pakistan border ceremony with lively drills and patriotic atmosphere.",
    "special_details": [
      "Daily Beating Retreat Ceremony",
      "Evening crowd participation"
    ],
    "festivals_culture": [],
    "best_time_to_visit": "October - March",
    "region": "North"
  },
  {
    "id": "amber-fort",
    "name": "Amber Fort",
    "image": "/Project/static/images/amber-fort.jpg",
    "description": "Majestic Rajput fort known for its artistic architecture, located near Jaipur.",
    "special_details": [
      "Elephant rides to the fort entrance",
      "Sound and light show in the evening",
      "Magnificent forts, palaces, and gardens"
    ],
    "festivals_culture": [
      "Jaipur Literature Festival vicinity"
    ],
    "best_time_to_visit": "October - March",
    "region": "North"
  },
  {
    "id": "hawa-mahal",
    "name": "Hawa Mahal",
    "image": "/Project/static/images/hawa-mahal.jpg",
    "description": "Iconic palace of winds in Jaipur with hundreds of small windows for ventilation.",
    "special_details": [
      "Panoramic views of the city",
      "Intricate lattice work"
    ],
    "festivals_culture": [],
    "best_time_to_visit": "October - March",
    "region": "North"
  },
  {
    "id": "alleppey-backwaters",
    "name": "Alleppey Backwaters",
    "image": "/Project/static/images/alleppey.jpg",
    "description": "Tranquil network of canals and lagoons famous for houseboat cruises.",
    "special_details": [
      "Houseboat stays",
      "Village life along the waterfront",
      "Local Kerala cuisine on board"
    ],
    "festivals_culture": [
      "Onam Festival"
    ],
    "best_time_to_visit": "November - February",
    "region": "South"
  },
  {
    "id": "kochi",
    "name": "Kochi",
    "image": "/Project/static/images/kochi.jpg",
    "description": "Historic port city known for its colonial influence and vibrant spice markets.",
    "special_details": [
      "Fort Kochi heritage walk",
      "Chinese fishing nets",
      "Jewish Synagogue and Dutch Palace"
    ],
    "festivals_culture": [],
    "best_time_to_visit": "October - March",
    "region": "South"
  },
  {
    "id": "munnar",
    "name": "Munnar",
    "image": "/Project/static/images/munnar.jpg",
    "description": "Hill station famous for tea plantations and misty landscapes.",
    "special_details": [
      "Eravikulam National Park",
      "Tea Museum and factory tours",
      "Anamudi Peak hikes"
    ],
    "festivals_culture": [],
    "best_time_to_visit": "October - March",
    "region": "South"
  },
  {
    "id": "hampi-ruins",
    "name": "Hampi Ruins",
    "image": "/Project/static/images/hampi.jpg",
    "description": "UNESCO heritage site of ancient Vijayanagara Empire temples and palaces.",
    "special_details": [
      "Stone chariot and Vittala Temple",
      "Matanga Hill sunrise views",
      "Boulder-strewn landscapes"
    ],
    "festivals_culture": [
      "Hampi Utsav"
    ],
    "best_time_to_visit": "October - February",
    "region": "South"
  },
  {
    "id": "ooty-gardens",
    "name": "Ooty Botanical Gardens",
    "image": "/Project/static/images/ooty.jpg",
    "description": "Famous botanical gardens featuring exotic plants and a rose garden.",
    "special_details": [
      "Nilgiri Mountain Railway Toy Train rides",
      "Flower shows",
      "Ooty Lake boating"
    ],
    "festivals_culture": [],
    "best_time_to_visit": "March - June",
    "region": "South"
  }
]



function getQueryParam(param) {
  const url = new URL(window.location.href);
  return url.searchParams.get(param);
}

function renderPlaceDetails() {
  const placeId = getQueryParam('id');
  const place = PLACE_DATA.find(p => p.id === placeId);
  const container = document.getElementById('place-details');
  if (!place) {
    container.innerHTML = `<div style="text-align:center;padding:60px 0;">Place not found.</div>`;
    return;
  }

  function renderList(title, items) {
    if (!items || !items.length) return '';
    return `<h3>${title}</h3><ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
  }

  container.innerHTML = `
    <div class="details-wrapper" style="display:flex;flex-wrap:wrap;gap:30px;padding:20px;">
      <img src="${place.image}" alt="${place.name}" class="place-img" style="max-width:380px;border-radius:15px;box-shadow:0 12px 28px rgba(0,0,0,0.12);flex:1 1 380px;"/>
      <div class="text-content" style="flex:1 1 400px;">
        <h2>${place.name} <span class="region" style="color:#417f89;font-weight:600;font-size:1.1rem;">(${place.region})</span></h2>
        <p style="font-size:1.1rem;line-height:1.45; margin-bottom:18px;">${place.description}</p>
        ${renderList('Highlights:', place.special_details)}
        ${renderList('Festivals & Culture:', place.festivals_culture)}
        <h3>Best Time to Visit</h3>
        <p style="font-weight:600;font-size:1.05rem;color:#325d61;">${place.best_time_to_visit}</p>
        <a href="/Project/templates/destinations.html" class="btn btn--outline" style="margin-top:18px;display:inline-block;">← Back to Destinations</a>
      </div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', renderPlaceDetails);