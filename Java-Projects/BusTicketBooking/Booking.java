package BusTicketBooking;

public class Booking {
    private String bookingId;
    private String passengerName;
    private String busId;
    public int seatCount;
    private double totalFare;
    private boolean paid;

    public Booking(String bookingId, String passengerName, String busId, int seatCount, double totalFare) {
        this.bookingId = bookingId;
        this.passengerName = passengerName;
        this.busId = busId;
        this.seatCount = seatCount;
        this.totalFare = totalFare;
        this.paid = false;
    }

    public String getBookingId() { return bookingId; }
    public String getBusId() { return busId; }
    public double getTotalFare() { return totalFare; }
    public boolean isPaid() { return paid; }

    public void markPaid() { paid = true; }

    public void display() {
        System.out.println("Booking ID: " + bookingId +
                " | Passenger: " + passengerName +
                " | Bus: " + busId +
                " | Seats: " + seatCount +
                " | Total Fare: ₹" + totalFare +
                " | Paid: " + (paid ? "Yes" : "No"));
    }
}
