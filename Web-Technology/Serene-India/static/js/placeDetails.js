// Example static data (move to a separate data file if you wish)
const PLACE_DATA = [
  {
    "id": "pangong-lake",
    "name": "Pangong Lake", 
    "image": "https://imgs.search.brave.com/n0w0MTtgXrsUwQIhYjYpAV2dY7_q_Ved9ibkBGFJacg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly92YWpp/cmFtYW5kcmF2aS5j/b20vY3VycmVudC1h/ZmZhaXJzL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDI1LzA0L3Bh/bmdvbmdfdHNvX2xh/a2UucG5n",
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
    "image": "https://imgs.search.brave.com/PuGBpjB_xpzKNVUGa0cWMM69TKHHCnCwsN17mkQlIag/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvODgz/MTIyODQyL3Bob3Rv/L2xhbmRzY2FwZS1h/cm91bmQtbnVicmEt/dmFsbGV5LWluLWxh/ZGFraC1pbmRpYS5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/alptMDNCV1pZTTRn/RzFhQk1JTTlDajlY/bXlGV0IxRTdLR3RK/UVdzeFgxbz0",
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
    "id": "leh-town",
    "name": "Leh Town",
    "image": "https://imgs.search.brave.com/k5wQg7pGqL5xYPxMHGD_J8FQHHqQ8nxR5j7-KvQFsY8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE1/NjQ0OTE0NzQ5MTMt/NmQ4MmQ3MWE4YzM3",
    "description": "A high-altitude desert town in the Himalayas, Leh offers stunning mountain views, ancient monasteries, and vibrant Tibetan Buddhist culture.",
    "special_details": [
      "Leh Palace with panoramic city views",
      "Shanti Stupa for sunset views",
      "Explore the Old Town markets and local cafes",
      "Hall of Fame war museum"
    ],
    "festivals_culture": [
      "Hemis Festival in June-July",
      "Ladakh Festival in September"
    ],
    "best_time_to_visit": "May - September",
    "region": "North"
  },
  {
    "id": "rishikesh",
    "name": "Rishikesh",
    "image": "https://imgs.search.brave.com/YGMpJHKl5QzQvQcM8YXxY9p2qQJjXhqJGT8kKvC2Wg0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE1/NzE0NzQyOTY4NDMt/NzU1YjkwYzg1Yjgw",
    "description": "Known as the 'Yoga Capital of the World', Rishikesh is a spiritual haven on the banks of the Ganges, offering yoga retreats, adventure sports, and ancient temples.",
    "special_details": [
      "Evening Ganga Aarti at Parmarth Niketan",
      "Walk across Laxman Jhula and Ram Jhula suspension bridges",
      "White water rafting and bungee jumping",
      "Visit Beatles Ashram and meditation centers"
    ],
    "festivals_culture": [
      "International Yoga Festival in March",
      "Ganga Dussehra celebrations"
    ],
    "best_time_to_visit": "February - April, September - November",
    "region": "North"
  },
  {
    "id": "nainital",
    "name": "Nainital",
    "image": "https://imgs.search.brave.com/qXGH8kL5pJxPxQQkKjQQHD8kKvQ2Qg0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE1/NjI1ODM4NjM0MTEt/ZGY4Y2YyYjRjYzJl",
    "description": "A picturesque hill station known as the 'Lake District of India', Nainital features a stunning emerald lake surrounded by mountains and colonial charm.",
    "special_details": [
      "Boating on Naini Lake with mountain views",
      "Cable car ride to Snow View Point",
      "Trek to Naina Peak for Himalayan vistas",
      "Visit High Altitude Zoo and Eco Cave Gardens"
    ],
    "festivals_culture": [],
    "best_time_to_visit": "March - June, September - November",
    "region": "North"
  },
  {
    "id": "haridwar",
    "name": "Haridwar",
    "image": "https://imgs.search.brave.com/XQH8kL5pJxPxQQkKjQQHD8kKvQ2Qg0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE1/NzE0NzQyOTY4NDMt/NzU1YjkwYzg1Yjgw",
    "description": "One of the seven holiest places in Hinduism, Haridwar is where the sacred Ganges River emerges from the Himalayas, offering spiritual experiences and ancient temples.",
    "special_details": [
      "Attend mesmerizing Ganga Aarti at Har Ki Pauri",
      "Cable car rides to Mansa Devi and Chandi Devi temples",
      "Holy dip in the Ganges at sacred ghats",
      "Visit Bharat Mata Mandir with 8-floor temple depicting Indian history"
    ],
    "festivals_culture": [
      "Kumbh Mela every 12 years",
      "Kanwar Yatra in July-August",
      "Diwali and Navratri celebrations"
    ],
    "best_time_to_visit": "October - February",
    "region": "North"
  },
  {
    "id": "manali",
    "name": "Manali",
    "image": "https://imgs.search.brave.com/8kL5pJxPxQQkKjQQHD8kKvQ2Qg0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE1/NjQ0OTE0NzQ5MTMt/NmQ4MmQ3MWE4YzM3",
    "description": "A high-altitude Himalayan resort town renowned for its stunning snow-capped peaks, lush valleys, adventure sports, and honeymoon destinations.",
    "special_details": [
      "Adventure sports at Solang Valley - paragliding, skiing, zorbing",
      "Visit ancient Hadimba Temple surrounded by cedar forests",
      "Scenic Rohtang Pass for snow activities",
      "Old Manali cafes and hippie culture",
      "River rafting in Beas River"
    ],
    "festivals_culture": [
      "Kullu Dussehra in October",
      "Manali Winter Carnival"
    ],
    "best_time_to_visit": "March - June, October - February",
    "region": "North"
  },
  {
    "id": "shimla",
    "name": "Shimla",
    "image": "https://imgs.search.brave.com/XQH8kL5pJxPxQQkKjQQHD8kKvQ2Qg0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE1/NzE0NzQyOTY4NDMt/NzU1YjkwYzg1Yjgw",
    "description": "The 'Queen of Hill Stations' and former summer capital of British India, Shimla offers colonial architecture, scenic views, and pleasant climate.",
    "special_details": [
      "Walk along the iconic Mall Road and Ridge",
      "Visit Christ Church and Gaiety Theatre",
      "Toy train ride on UNESCO heritage Kalka-Shimla Railway",
      "Trekking and nature walks in Kufri and Naldehra",
      "Shopping for handicrafts and woolens"
    ],
    "festivals_culture": [
      "Summer Festival in June",
      "Ice Skating Carnival in winter"
    ],
    "best_time_to_visit": "March - June, September - November",
    "region": "North"
  },
  {
    "id": "kullu",
    "name": "Kullu",
    "image": "https://imgs.search.brave.com/qXGH8kL5pJxPxQQkKjQQHD8kKvQ2Qg0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE1/NjI1ODM4NjM0MTEt/ZGY4Y2YyYjRjYzJl",
    "description": "A picturesque valley town known for its apple orchards, temples, and adventure activities, nestled in the Beas River valley.",
    "special_details": [
      "Great Himalayan National Park - UNESCO World Heritage Site",
      "River rafting in Beas River rapids",
      "Visit Bijli Mahadev Temple with lightning rod",
      "Trek to Chandrakhani Pass",
      "Explore traditional Kullu shawl markets"
    ],
    "festivals_culture": [
      "Kullu Dussehra - week-long international festival in October"
    ],
    "best_time_to_visit": "March - June, September - November",
    "region": "North"
  },
  {
    "id": "jaipur",
    "name": "Jaipur",
    "image": "https://imgs.search.brave.com/YGMpJHKl5QzQvQcM8YXxY9p2qQJjXhqJGT8kKvC2Wg0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE1/NzE0NzQyOTY4NDMt/NzU1YjkwYzg1Yjgw",
    "description": "The 'Pink City' and Rajasthan's capital, Jaipur is a UNESCO World Heritage City famous for its magnificent forts, palaces, vibrant bazaars, and royal heritage.",
    "special_details": [
      "Explore majestic Amber Fort with elephant rides",
      "Marvel at Hawa Mahal's 953 intricate windows",
      "Visit City Palace and Jantar Mantar observatory",
      "Hot air balloon rides over the city",
      "Shop for jewelry, textiles, and handicrafts in Johari Bazaar"
    ],
    "festivals_culture": [
      "Jaipur Literature Festival in January",
      "Elephant Festival in March",
      "Teej Festival during monsoon"
    ],
    "best_time_to_visit": "October - March",
    "region": "North"
  },
  {
    "id": "udaipur",
    "name": "Udaipur",
    "image": "https://imgs.search.brave.com/k5wQg7pGqL5xYPxMHGD_J8FQHHqQ8nxR5j7-KvQFsY8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE1/NjQ0OTE0NzQ5MTMt/NmQ4MmQ3MWE4YzM3",
    "description": "The 'City of Lakes' and 'Venice of the East', Udaipur enchants with its romantic lakes, white marble palaces, and stunning sunset views.",
    "special_details": [
      "Sunset boat rides on Lake Pichola",
      "Explore the grand City Palace complex",
      "Visit Jag Mandir and Jag Niwas (Lake Palace)",
      "Watch cultural performances at Bagore Ki Haveli",
      "Wander through Saheliyon Ki Bari gardens"
    ],
    "festivals_culture": [
      "Mewar Festival in spring",
      "Shilpgram Crafts Festival in December"
    ],
    "best_time_to_visit": "October - March",
    "region": "North"
  },
  {
    "id": "jaisalmer",
    "name": "Jaisalmer",
    "image": "https://imgs.search.brave.com/PuGBpjB_xpzKNVUGa0cWMM69TKHHCnCwsN17mkQlIag/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvODgz/MTIyODQyL3Bob3Rv/L2xhbmRzY2FwZS1h/cm91bmQtbnVicmEt/dmFsbGV5LWluLWxh/ZGFraC1pbmRpYS5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/alptMDNCV1pZTTRn/RzFhQk1JTTlDajlY/bXlGV0IxRTdLR3RK/UVdzeFgxbz0",
    "description": "The 'Golden City' rising from Thar Desert sands, Jaisalmer captivates with its golden sandstone fort, ornate havelis, and desert adventures.",
    "special_details": [
      "Explore living Jaisalmer Fort with shops and homes inside",
      "Camel safari and camping in Sam Sand Dunes",
      "Visit intricately carved Patwon Ki Haveli",
      "Watch sunset from desert dunes",
      "Experience folk music and cultural performances"
    ],
    "festivals_culture": [
      "Desert Festival in February with camel races and folk performances",
      "Diwali celebrations light up the golden city"
    ],
    "best_time_to_visit": "October - March",
    "region": "North"
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
    container.innerHTML = `
      <div style="text-align:center;padding:60px 20px;color:#164850;">
        <h2>Place not found</h2>
        <p>Sorry, we couldn't find the details for this location.</p>
        <a href="../templates/destinations.html" class="btn" style="margin-top:20px;display:inline-block;">Back to Destinations</a>
      </div>
    `;
    return;
  }

    container.innerHTML = `
  <div class="details-wrapper">
    <img src="${place.image}" alt="${place.name}" class="place-img"/>
    <div class="text-content">
      <h2>${place.name}</h2>
      <span class="region">${place.region}</span>
      <p>${place.description}</p>
      
      ${place.special_details && place.special_details.length ? `
        <h3>Special Details</h3>
        <ul>
          ${place.special_details.map(detail => `<li>${detail}</li>`).join('')}
        </ul>
      ` : ''}
      
      ${place.best_time_to_visit ? `
        <h3>Best Time to Visit</h3>
        <p>${place.best_time_to_visit}</p>
      ` : ''}
      
      ${place.festivals_culture && place.festivals_culture.length ? `
        <h3>Festivals & Culture</h3>
        <ul>
          ${place.festivals_culture.map(festival => `<li>${festival}</li>`).join('')}
        </ul>
      ` : ''}
      
      <a href="../templates/destinations.html" class="btn">Back to Destinations</a>
    </div>
  </div>
  `;
}

document.addEventListener('DOMContentLoaded', renderPlaceDetails);
