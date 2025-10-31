package BusTicketBooking;

import java.time.LocalDateTime;

public class Booking {
    private String bookingId;
    private User passenger; 
    private String busId;
    private String busFrom;
    private String busTo;
    public int seatCount;
    private double totalFare;
    private boolean paid;
    private LocalDateTime bookingTime; 
    private LocalDateTime journeyDateTime; 

    public String getBookingId() { return bookingId; }

    public void markPaid() { this.paid = true; }

    public double getTotalFare() { return totalFare; }

    public String getBusId() { return busId; }


    public Booking(String bookingId, User passenger, String busId, String busFrom, String busTo, int seatCount, double totalFare) {
        this.bookingId = bookingId;
        this.passenger = passenger;
        this.busId = busId;
        this.busFrom = busFrom;
        this.busTo = busTo;
        this.seatCount = seatCount;
        this.totalFare = totalFare;
        this.paid = false;
        this.bookingTime = LocalDateTime.now();
        this.journeyDateTime = LocalDateTime.now().plusDays(2); // example default  
    }

    // getters and markPaid() remain unchanged

    public void display() {
        System.out.println("\nBooking ID: " + bookingId +
            "\n | Passenger: " + passenger.getName() +
            "\n | Age: " + passenger.getAge() +
            "\n | Gender: " + passenger.getGender() +
            "\n | Phone: " + passenger.getPhone() +
            "\n | Date & Time of Booking: " + bookingTime +
            "\n | Date & Time of Journey: " + journeyDateTime +
            "\n | Bus ID: " + busId +
            "\n | Bus From: " + busFrom +
            "\n | Bus To: " + busTo +
            "\n | Seats: " + seatCount +
            "\n | Total Fare: ₹" + totalFare +
            "\n | Paid: " + (paid ? "Yes" : "No"));
    }

}
