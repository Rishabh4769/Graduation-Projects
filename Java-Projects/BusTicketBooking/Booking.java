package BusTicketBooking;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Booking {
    private String bookingId;
    private User passenger; 
    private String busId;
    private String busFrom;
    private String busTo;
    public int seatCount;
    private double totalFare;
    private int[] seatNumbers;
    private boolean paid;
    private LocalDateTime bookingTime;
    private LocalDateTime journeyDateTime;

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy , HH:mm:ss"); 

    public String getBookingId() { return bookingId; }

    public void markPaid() { this.paid = true; }

    public double getTotalFare() { return totalFare; }

    public String getBusId() { return busId; }

    public String getFormattedBookingTime()
    {
        return bookingTime.format(formatter);
    }

    public String getFormattedJourneyDateTime()
    {
        return journeyDateTime.format(formatter);
    }
    
    public Booking() {
        // Default constructor to create empty Booking object
    }


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

    // New constructor with explicit seat numbers
    public Booking(String bookingId, User passenger, String busId, String busFrom, String busTo, int seatCount, double totalFare, int[] seatNumbers) {
        this(bookingId, passenger, busId, busFrom, busTo, seatCount, totalFare);
        this.seatNumbers = seatNumbers;
    }

    // getters and markPaid() remain unchanged

    public void display() {
        System.out.println("\n---------------------------------------------");
        System.out.println("Ticket Details:");
        System.out.println("---------------------------------------------");
        System.out.println("| Booking ID: " + bookingId +
            "\n| Passenger: " + passenger.getName() +
            "\n| Age: " + passenger.getAge() +
            "\n| Gender: " + passenger.getGender() +
            "\n| Phone: " + passenger.getPhone() +
            "\n| Date & Time of Booking: " + getFormattedBookingTime() +
            "\n| Date & Time of Journey: " + getFormattedJourneyDateTime() +
            "\n| Bus ID: " + busId +
            "\n| Bus From: " + busFrom +
            "\n| Bus To: " + busTo +
            "\n| Seats: " + seatCount +
            (seatNumbers != null ? " | Seat Nos: " + java.util.Arrays.toString(seatNumbers) : "") +
            "\n| Total Fare: ₹" + totalFare +
            "\n| Paid: " + (paid ? "Yes" : "No"));
        System.out.println("---------------------------------------------");
    }

    public int[] getSeatNumbers() { return seatNumbers; }

}
