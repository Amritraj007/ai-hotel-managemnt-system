const rooms = [
    { 
        id: 1, 
        name: "Single Room", 
        price: 1000,
        capacity: 1,
        area: "150 sq ft",
        amenities: "WiFi, AC, TV, Bathroom"
    },
    { 
        id: 2, 
        name: "Double Room", 
        price: 2000,
        capacity: 2,
        area: "250 sq ft",
        amenities: "WiFi, AC, TV, Mini Bar, Bathroom"
    },
    { 
        id: 3, 
        name: "Deluxe Room", 
        price: 3000,
        capacity: 4,
        area: "400 sq ft",
        amenities: "WiFi, AC, TV, Mini Bar, Gym, Bathroom, Balcony"
    },
    { 
        id: 4, 
        name: "Suite", 
        price: 5000,
        capacity: 6,
        area: "600 sq ft",
        amenities: "WiFi, AC, TV, Mini Bar, Gym, Spa, Balcony, Kitchen"
    },
    { 
        id: 5, 
        name: "Presidential Suite", 
        price: 10000,
        capacity: 8,
        area: "1000 sq ft",
        amenities: "All Premium + Jacuzzi, Wine Bar, Personal Butler"
    },
    { 
        id: 6, 
        name: "Garden View Room", 
        price: 1500,
        capacity: 2,
        area: "200 sq ft",
        amenities: "WiFi, AC, TV, Garden View, Bathroom"
    }
];

let currentRoomId = null;
let bookings = JSON.parse(localStorage.getItem('hotelBookings')) || [];

// Chat responses
const chatResponses = {
    "hello": "Hello! Welcome to Luxury Stays. How can I help you today?",
    "hi": "Hi there! 👋 Looking for a room booking?",
    "rooms": "We have 6 amazing room types: Single, Double, Deluxe, Suite, Presidential Suite, and Garden View rooms!",
    "price": "Our rooms range from ₹1000 to ₹10000 per night depending on the type.",
    "services": "We offer swimming pool, spa, restaurant, gym, entertainment zone, car rental, and more!",
    "booking": "Click on 'Rooms' and select any room, then click 'Book Now' to proceed.",
    "cancel": "You can cancel bookings from the 'My Bookings' section.",
    "wifi": "Yes! WiFi is available in all our rooms.",
    "parking": "We have secure parking available for all guests.",
    "checkout": "Standard checkout time is 11:00 AM.",
    "checkin": "Standard check-in time is 2:00 PM.",
    "default": "I'm here to help! You can ask about rooms, prices, services, or bookings."
};

// Display rooms on page load
function displayRooms(roomsToDisplay = rooms) {
    const roomContainer = document.getElementById("rooms");
    roomContainer.innerHTML = '';

    roomsToDisplay.forEach(room => {
        const div = document.createElement("div");
        div.className = "room";
        div.innerHTML = `
            <div class="room-header">
                <h3>${room.name}</h3>
                <span class="room-badge">⭐ Popular</span>
            </div>
            <div class="room-details">
                <p><strong>👥 Capacity:</strong> ${room.capacity} guests</p>
                <p><strong>📐 Area:</strong> ${room.area}</p>
            </div>
            <div class="amenities">
                <strong>✨ Amenities:</strong><br>${room.amenities}
            </div>
            <div class="price-section">
                <div>
                    <div class="price-label">Price per night</div>
                    <div class="price">₹${room.price}</div>
                </div>
            </div>
            <button onclick="openBookingModal(${room.id})">Book Now</button>
        `;
        roomContainer.appendChild(div);
    });
}

// Page navigation
function showPage(pageName) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageName).classList.add('active');
    
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');
}

// Chat functionality
function toggleChat() {
    const chatbot = document.getElementById('chatbot');
    chatbot.classList.toggle('active');
    if (chatbot.classList.contains('active')) {
        document.getElementById('chatInput').focus();
    }
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message) return;
    
    const chatMessages = document.getElementById('chatMessages');
    
    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'message user-message';
    userMsg.textContent = message;
    chatMessages.appendChild(userMsg);
    
    // Get bot response
    const lowerMsg = message.toLowerCase();
    let response = chatResponses['default'];
    
    for (let key in chatResponses) {
        if (lowerMsg.includes(key)) {
            response = chatResponses[key];
            break;
        }
    }
    
    // Add bot message
    setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'message bot-message';
        botMsg.textContent = response;
        chatMessages.appendChild(botMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 500);
    
    input.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Search functionality
document.getElementById("searchInput").addEventListener("keyup", function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = rooms.filter(room => 
        room.name.toLowerCase().includes(searchTerm)
    );
    displayRooms(filtered);
});

// Open booking modal
function openBookingModal(roomId) {
    currentRoomId = roomId;
    const room = rooms.find(r => r.id === roomId);
    document.getElementById("roomSelect").innerHTML = `<option value="${roomId}">${room.name} - ₹${room.price}/night</option>`;
    document.getElementById("bookingModal").style.display = "block";
}

// Close booking modal
function closeModal() {
    document.getElementById("bookingModal").style.display = "none";
    document.getElementById("bookingForm").reset();
}

// Close bookings modal
function closeBookingsModal() {
    document.getElementById("bookingsModal").style.display = "none";
}

// Calculate price when dates change
document.getElementById("checkInDate").addEventListener("change", calculatePrice);
document.getElementById("checkOutDate").addEventListener("change", calculatePrice);

function calculatePrice() {
    const checkIn = new Date(document.getElementById("checkInDate").value);
    const checkOut = new Date(document.getElementById("checkOutDate").value);
    
    if (checkIn && checkOut && checkOut > checkIn) {
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        const room = rooms.find(r => r.id === currentRoomId);
        const totalPrice = nights * room.price;
        
        document.getElementById("priceCalculation").innerHTML = 
            `<p>Nights: ${nights} | Price per night: ₹${room.price} | <strong>Total: ₹${totalPrice}</strong></p>`;
    }
}

// Handle form submission
document.getElementById("bookingForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const room = rooms.find(r => r.id === currentRoomId);
    const checkIn = new Date(document.getElementById("checkInDate").value);
    const checkOut = new Date(document.getElementById("checkOutDate").value);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    const booking = {
        id: Date.now(),
        roomName: room.name,
        roomId: currentRoomId,
        guestName: document.getElementById("guestName").value,
        guestEmail: document.getElementById("guestEmail").value,
        guestPhone: document.getElementById("guestPhone").value,
        checkInDate: document.getElementById("checkInDate").value,
        checkOutDate: document.getElementById("checkOutDate").value,
        totalPrice: nights * room.price,
        bookingDate: new Date().toLocaleDateString()
    };
    
    bookings.push(booking);
    localStorage.setItem('hotelBookings', JSON.stringify(bookings));
    
    alert(`✅ Room booked successfully!\n\nConfirmation has been sent to ${booking.guestEmail}`);
    closeModal();
    document.getElementById("bookingForm").reset();
});

// Show bookings
function showBookings() {
    const bookingsList = document.getElementById("bookingsList");
    
    if (bookings.length === 0) {
        bookingsList.innerHTML = '<p style="text-align: center; color: #999;">No bookings yet</p>';
    } else {
        bookingsList.innerHTML = bookings.map(booking => `
            <div class="booking-item">
                <p><strong>🏨 Room:</strong> ${booking.roomName}</p>
                <p><strong>👤 Guest:</strong> ${booking.guestName}</p>
                <p><strong>📧 Email:</strong> ${booking.guestEmail}</p>
                <p><strong>📱 Phone:</strong> ${booking.guestPhone}</p>
                <p><strong>📅 Check-in:</strong> ${booking.checkInDate}</p>
                <p><strong>📅 Check-out:</strong> ${booking.checkOutDate}</p>
                <p><strong>💰 Total Price:</strong> ₹${booking.totalPrice}</p>
                <p><strong>🗓️ Booked on:</strong> ${booking.bookingDate}</p>
                <button class="delete-btn" onclick="cancelBooking(${booking.id})">❌ Cancel Booking</button>
            </div>
        `).join('');
    }
    
    document.getElementById("bookingsModal").style.display = "block";
}

// Cancel booking
function cancelBooking(bookingId) {
    if (confirm("Are you sure you want to cancel this booking?")) {
        bookings = bookings.filter(b => b.id !== bookingId);
        localStorage.setItem('hotelBookings', JSON.stringify(bookings));
        showBookings();
    }
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const bookingModal = document.getElementById("bookingModal");
    const bookingsModal = document.getElementById("bookingsModal");
    
    if (event.target == bookingModal) {
        bookingModal.style.display = "none";
    }
    if (event.target == bookingsModal) {
        bookingsModal.style.display = "none";
    }
}

// Initialize
displayRooms();