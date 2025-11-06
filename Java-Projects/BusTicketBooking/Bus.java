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
    // seat occupancy: false = empty, true = occupied
    protected boolean[] seats;

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
        this.seats = new boolean[totalSeats]; // all false == empty
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

    // Display seat map: O = empty, ✓ = occupied (green)
    public void displaySeatMap() {
        final String RED = "\u001B[31m";
        final String CROSS = "\u2717";
        final String GREEN = "\u001B[32m";
        final String RESET = "\u001B[0m";
        final String STAR = "\u2605"; // ✓

        System.out.println("\nSeat map ("+GREEN+STAR+RESET+" = empty, " + RED + CROSS + RESET + " = occupied):");
        int perRow = 4;
        for (int i = 0; i < totalSeats; i++) {
            int seatNo = i + 1;
            String symbol = seats[i] ? (RED + CROSS + RESET) : (GREEN + STAR + RESET);
            System.out.printf("%02d(%s) ", seatNo, symbol);
            if ((seatNo) % perRow == 0) System.out.println();
        }
        System.out.println("\n");
    }

    // Check if a single seat number (1-based) is available
    public boolean isSeatAvailable(int seatNo) {
        if (seatNo < 1 || seatNo > totalSeats) return false;
        return !seats[seatNo - 1];
    }

    // Reserve given seats (1-based). Returns true if all seats reserved successfully.
    public boolean reserveSeats(int[] seatNos) {
        // validate
        for (int n : seatNos) {
            if (n < 1 || n > totalSeats) return false;
            if (seats[n - 1]) return false; // already occupied
        }
        // reserve
        for (int n : seatNos) {
            seats[n - 1] = true;
            availableSeats = Math.max(0, availableSeats - 1);
        }
        return true;
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

