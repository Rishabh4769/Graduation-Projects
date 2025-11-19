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
    public boolean isPaid;



    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy , HH:mm:ss"); 

    public String getBookingId() { return bookingId; }

    public void markPaid() { this.paid = true; }

    public boolean isPaid() { return paid; }

    public double getTotalFare() { return totalFare; }

    public String getBusId() { return busId; }

    public String getFormattedBookingTime() { return bookingTime.format(formatter); }

    public int[] getSeatNumbers() { return seatNumbers; }

    public String getFormattedJourneyDateTime() { return journeyDateTime.format(formatter); }
    
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
        final String RESET = "\u001B[0m";
        final String CYAN = "\u001B[36m";
        final String YELLOW = "\u001B[33m";
        final String GREEN = "\u001B[32m";
        final String RED = "\u001B[31m";

        String headerFooter = CYAN + "════════════════════════ TICKET DETAILS ════════════════════════" + RESET;

        System.out.println("\n" + headerFooter);
        System.out.println(YELLOW + "Passenger Name: " + RESET + passenger.getName().toUpperCase());
        System.out.println(YELLOW + "Booking ID:     " + RESET + bookingId);
        System.out.println("───────────────────────────────────────────────────────────────");
        System.out.println(YELLOW + "Age:            " + RESET + passenger.getAge());
        System.out.println(YELLOW + "Gender:         " + RESET + passenger.getGender());
        System.out.println(YELLOW + "Contact Number: " + RESET + passenger.getPhone());
        System.out.println(YELLOW + "Booking D & T:  " + RESET + getFormattedBookingTime());
        System.out.println(YELLOW + "Journey D & T:  " + RESET + getFormattedJourneyDateTime());
        System.out.println(YELLOW + "Bus ID:         " + RESET + busId);
        System.out.println(YELLOW + "Source:         " + RESET + busFrom);
        System.out.println(YELLOW + "Destination:    " + RESET + busTo);
        System.out.println(YELLOW + "Seats Booked:   " + RESET + seatCount);
        System.out.println(YELLOW + "Total Fare:     " + RESET + String.format("₹%.2f", totalFare));
        System.out.println(YELLOW + "Payment Status: " + RESET + (paid ? GREEN + "PAID" + RESET : RED + "NOT PAID" + RESET));
        System.out.println(headerFooter);
    }


}