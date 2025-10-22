package BusTicketBooking;

public class Bus {
    protected String busId;
    protected String source;
    protected String destination;
    protected String busType;
    protected float chargePerKm;
    protected double distance;
    protected int totalSeats;
    protected int availableSeats;

    // ✅ Parameterized constructor with 7 arguments
    public Bus(String busId, String source, String destination, String busType,
               float chargePerKm, double distance, int totalSeats) {
        this.busId = busId;
        this.source = source;
        this.destination = destination;
        this.busType = busType;
        this.chargePerKm = chargePerKm;
        this.distance = distance;
        this.totalSeats = totalSeats;
        this.availableSeats = totalSeats;
    }

    // Default constructor (optional but good to have)
    public Bus() {}

    // Simple methods
    public double calculateFare() { 
        return distance * chargePerKm; 
    }

    public void displayInfo() {
        System.out.println("Bus ID: " + busId +
                " | Route: " + source + " → " + destination +
                " | Type: " + busType +
                " | Distance: " + distance + " km" +
                " | ₹/Km: " + chargePerKm +
                " | Seats: " + availableSeats + "/" + totalSeats);
    }


    // Book seats (reduce available count)
    public void bookSeat(int seats) {
        if (availableSeats >= seats) {
            availableSeats -= seats;
        } else {
            System.out.println("Not enough seats available!");
        }
    }

    // Cancel seats (increase available count)
    public void cancelSeat(int seats) {
        availableSeats += seats;
        if (availableSeats > totalSeats)
            availableSeats = totalSeats;
    }

    // Getters (used by User class)
    public String getBusId() { return busId; }
    public String getBusType() { return busType; }
    public String getSource() { return source; }
    public String getDestination() { return destination; }
    public int getAvailableSeats() { return availableSeats; }
}

