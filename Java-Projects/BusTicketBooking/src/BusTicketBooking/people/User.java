package BusTicketBooking.people;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

import BusTicketBooking.booking.Booking;
import BusTicketBooking.bus.Bus;
import BusTicketBooking.exceptions.MaximumSeatsBookingException;
import BusTicketBooking.payment.CashPayment;
import BusTicketBooking.payment.CreditCardPayment;
import BusTicketBooking.payment.UPIPayment;
import BusTicketBooking.ui.Dashboard;

public class User extends Person  {
    private String userId;
    private Booking[] myBookings = new Booking[50];
    private int bookingCount = 0;
    private Scanner sc = new Scanner(System.in);

    public User() { super(); this.userId = "U001"; }
    public User(String userId, String name, String username, String password, String phone) {
        super();
        this.userId = userId;
        this.name = name;
        this.username = username;
        this.password = password;
        this.phone = phone;
    }

    // Getter methods for passenger details
    public String getName() { return name; }
    public String getGender() { return gender; }
    public int getAge() { return age; }
    public String getPhone() { return phone; }
    public String getUsername() { return username; }
    public boolean authenticate(String enteredUsername, String enteredPassword) {
        return username != null && password != null
            && username.equalsIgnoreCase(enteredUsername)
            && password.equals(enteredPassword);
    }

   public void run(){
        
    }

    public Bus findBusById(Bus[] buses, int busCount, String busId) {
        if (busId == null) {
            return null;
        }

        for (int i = 0; i < busCount; i++) {
            if (buses[i].getBusId().equalsIgnoreCase(busId.trim())) {
                return buses[i];
            }
        }
        return null;
    }

    public List<Bus> findBusesByRoute(Bus[] buses, int busCount, String src, String dest) {
        List<Bus> matches = new ArrayList<>();
        for (int i = 0; i < busCount; i++) {
            if (buses[i].getSource().equalsIgnoreCase(src.trim()) &&
                buses[i].getDestination().equalsIgnoreCase(dest.trim())) {
                matches.add(buses[i]);
            }
        }
        return matches;
    }

    public List<Bus> findBusesByType(Bus[] buses, int busCount, String type) {
        List<Bus> matches = new ArrayList<>();
        for (int i = 0; i < busCount; i++) {
            if (buses[i].getBusType().equalsIgnoreCase(type.trim())) {
                matches.add(buses[i]);
            }
        }
        return matches;
    }

    public Booking createBooking(Bus[] buses, int busCount, String busId, int[] seatNumbers,
                                 String passengerName, int passengerAge, String passengerGender,
                                 String passengerPhone) {
        Bus chosen = findBusById(buses, busCount, busId);
        if (chosen == null) {
            throw new IllegalArgumentException("Bus not found.");
        }
        if (seatNumbers == null || seatNumbers.length == 0) {
            throw new IllegalArgumentException("Please select at least one seat.");
        }
        if (seatNumbers.length > 6) {
            throw new IllegalArgumentException("Cannot book more than 6 seats at once.");
        }
        if (chosen.getAvailableSeats() < seatNumbers.length) {
            throw new IllegalArgumentException("Not enough seats available.");
        }
        if (passengerName == null || passengerName.isBlank()) {
            throw new IllegalArgumentException("Passenger name is required.");
        }
        if (passengerAge <= 0) {
            throw new IllegalArgumentException("Passenger age must be valid.");
        }
        if (passengerGender == null || passengerGender.isBlank()) {
            throw new IllegalArgumentException("Passenger gender is required.");
        }
        if (passengerPhone == null || passengerPhone.isBlank()) {
            throw new IllegalArgumentException("Passenger phone is required.");
        }

        for (int seatNumber : seatNumbers) {
            if (!chosen.isSeatAvailable(seatNumber)) {
                throw new IllegalArgumentException("Seat " + seatNumber + " is not available.");
            }
        }

        this.name = passengerName.trim();
        this.age = passengerAge;
        this.gender = passengerGender.trim();
        this.phone = passengerPhone.trim();

        double fare = chosen.calculateFare() * seatNumbers.length;
        String bookingId = "B" + (bookingCount + 1);

        if (!chosen.reserveSeats(seatNumbers)) {
            throw new IllegalStateException("Could not reserve the selected seats.");
        }

        Booking newBooking = new Booking(
            bookingId,
            this,
            chosen.getBusId(),
            chosen.getSource(),
            chosen.getDestination(),
            seatNumbers.length,
            fare,
            seatNumbers
        );

        myBookings[bookingCount++] = newBooking;
        return newBooking;
    }

    public Booking findBookingById(String bookingId) {
        if (bookingId == null) {
            return null;
        }

        for (int i = 0; i < bookingCount; i++) {
            if (myBookings[i] != null && myBookings[i].getBookingId().equalsIgnoreCase(bookingId.trim())) {
                return myBookings[i];
            }
        }
        return null;
    }

    public Booking[] getMyBookings() {
        Booking[] bookings = new Booking[bookingCount];
        for (int i = 0; i < bookingCount; i++) {
            bookings[i] = myBookings[i];
        }
        return bookings;
    }

    public boolean processPayment(Booking booking, String paymentMethod, String upiId,
                                  String cardNumber, String expiry, String cvv) {
        if (booking == null) {
            throw new IllegalArgumentException("Booking not found.");
        }
        if (booking.isPaid()) {
            return true;
        }

        double amount = booking.getTotalFare();
        boolean success;

        switch (paymentMethod.trim().toLowerCase()) {
            case "cash":
                success = new CashPayment(amount).pay();
                break;
            case "upi":
                if (upiId == null || upiId.isBlank()) {
                    throw new IllegalArgumentException("UPI ID is required.");
                }
                success = new UPIPayment(amount).payWithUPI(upiId.trim());
                break;
            case "card":
            case "credit card":
                if (cardNumber == null || cardNumber.isBlank() ||
                    expiry == null || expiry.isBlank() ||
                    cvv == null || cvv.isBlank()) {
                    throw new IllegalArgumentException("Card number, expiry, and CVV are required.");
                }
                success = new CreditCardPayment(amount).payWithCard(
                    cardNumber.trim(),
                    expiry.trim(),
                    cvv.trim()
                );
                break;
            default:
                throw new IllegalArgumentException("Unsupported payment method.");
        }

        if (success) {
            booking.markPaid();
        }
        return success;
    }

    public void viewAvailableBuses(Bus[] buses, int busCount) {
        System.out.println("\n=== Available Buses ===");
        for (int i = 0; i < busCount; i++) {
            buses[i].displayInfo();
            System.out.println("--------------");
        }
    }

    public void searchBusByRoute(Bus[] buses, int busCount) {
        System.out.print("Enter source: ");
        String src = sc.nextLine();
        System.out.print("Enter destination: ");
        String dest = sc.nextLine();

        boolean found = false;
        for (int i = 0; i < busCount; i++) {
            if (buses[i].getSource().equalsIgnoreCase(src) &&
                buses[i].getDestination().equalsIgnoreCase(dest)) {
                buses[i].displayInfo();
                found = true;
            }
        }
        if (!found) System.out.println("No buses found on this route!");
    }

    public void selectBusType(Bus[] buses, int busCount) {
        System.out.print("Enter bus type (AC/NonAC/Sleeper/Express): ");
        String type = sc.nextLine();
        boolean found = false;
        for (int i = 0; i < busCount; i++) {
            if (buses[i].getBusType().equalsIgnoreCase(type)) {
                buses[i].displayInfo();
                found = true;
            }
        }
        if (!found) System.out.println("No buses of this type available!");
    }

    public void bookTicket(Bus[] buses, int busCount) {
        System.out.print("Enter Bus ID to book: ");
        String id = sc.nextLine();
        Bus chosen = null;

        for (int i = 0; i < busCount; i++) {
            if (buses[i].getBusId().equalsIgnoreCase(id)) {
                chosen = buses[i];
                break;
            }
        }

        if (chosen == null) {
            System.out.println("Bus not found!");
            return;
        }



        System.out.print("Enter number of seats: ");
        int seats = sc.nextInt(); sc.nextLine();

        try {
            if (seats > 6) {
                throw new MaximumSeatsBookingException("Sorry as per Regulations Cannot book more than 6 seats at once.");
            }
        } 
        catch (MaximumSeatsBookingException e) {
            System.out.println(e.getMessage());
            return;
        }

        if (chosen.getAvailableSeats() < seats) {
            System.out.println("Not enough seats available!");
            return;
        }

        chosen.displaySeatMap();
        System.out.println("Enter the seat numbers you want to book separated by spaces (e.g. 1 2 3):");
        String seatLine = sc.nextLine().trim();
        if (seatLine.isEmpty()) {
            System.out.println("No seats entered. Cancelling booking.");
            return;
        }
        String[] parts = seatLine.split("\\s+");
        if (parts.length != seats) {
            System.out.println("Number of seat numbers entered (" + parts.length + ") doesn't match requested seats (" + seats + ").");
            return;
        }
        int[] seatNumbers = new int[seats];
        for (int i = 0; i < parts.length; i++) {
            try {
                seatNumbers[i] = Integer.parseInt(parts[i]);
            } catch (NumberFormatException e) {
                System.out.println("Invalid seat number: " + parts[i]);
                return;
            }
            if (!chosen.isSeatAvailable(seatNumbers[i])) {
                System.out.println("Seat " + seatNumbers[i] + " is not available. Choose different seats.");
                return;
            }
        }

        System.out.print("Enter your name: ");
        this.name = sc.nextLine();

        System.out.print("Enter your age: ");
        this.age = sc.nextInt(); sc.nextLine();

        System.out.print("Enter your gender: ");
        this.gender = sc.nextLine();

        System.out.print("Enter your contact number: ");
        this.phone = sc.nextLine();

        double fare = chosen.calculateFare() * seats;
        String bookingId = "B" + (bookingCount + 1);

        boolean reserved = chosen.reserveSeats(seatNumbers);
        if (!reserved) {
            System.out.println("Failed to reserve the selected seats. They may have been taken by someone else.");
            return;
        }

        Booking newBooking = new Booking(
            bookingId,
            this,
            chosen.getBusId(),
            chosen.getSource(),
            chosen.getDestination(),
            seats,
            fare,
            seatNumbers
        );

        myBookings[bookingCount++] = newBooking;
        System.out.println("✅ Ticket booked! Your booking ID: " + bookingId + ", Total Fare: ₹" + fare);
    }

    public void viewMyBookings() {
        System.out.println("\n=== Your Bookings ===");
        for (int i = 0; i < bookingCount; i++) {
            if (myBookings[i] != null) {
                myBookings[i].display();
            }
        }
        System.out.println("=====================\n");
    }

    public void processPayment(Booking booking) {
        if (booking == null) {
            System.out.println("No booking provided for payment.");
            return;
        }
        if (booking.isPaid()) {
            System.out.println("Booking is already paid.");
            return;
        }

        double amount = booking.getTotalFare();

        System.out.println("Select payment method:\n1. Cash\n2. UPI\n3. Credit Card \nChoice: ");
        int choice = sc.nextInt();
        sc.nextLine();

        boolean success = false;

        switch (choice) {
            case 1: // Cash
                Dashboard.showPaymentAnimation();
                CashPayment cash = new CashPayment(amount);
                success = cash.pay();
                break;

            case 2: // UPI
                System.out.print("Enter UPI ID: ");
                String upiId = sc.nextLine();
                Dashboard.showPaymentAnimation();
                UPIPayment upi = new UPIPayment(amount);
                success = upi.payWithUPI(upiId);
                break;

            case 3: // Credit Card Payment
                System.out.print("Enter Card Number: ");
                String cardNumber = sc.nextLine();

                System.out.print("Enter Expiry Date (MM/YY): ");
                String expiry = sc.nextLine();

                System.out.print("Enter CVV: ");
                String cvv = sc.nextLine();

                Dashboard.showPaymentAnimation();
                CreditCardPayment card = new CreditCardPayment(amount);
                success = card.payWithCard(cardNumber, expiry, cvv);
                break;

            default:
                System.out.println("Invalid option");
                return;
        }

        if (success) {
            booking.markPaid();
            System.out.println(Dashboard.GREEN + "Payment successful!" + Dashboard.RESET);
        } else {
            System.out.println(Dashboard.RED + "Payment failed." + Dashboard.RESET);
        }
    }

    public void processPayment() {
        if (bookingCount == 0) {
            System.out.println("You have no bookings to pay for.");
            return;
        }

        System.out.println("\n=== Your Bookings ===");
        for (int i = 0; i < bookingCount; i++) {
            if (myBookings[i] != null) {
                System.out.println("- " + myBookings[i].getBookingId() + " : ₹" + myBookings[i].getTotalFare());
            }
        }

        System.out.print("Enter Booking ID to pay: ");
        String id = sc.nextLine();

        Booking chosen = null;
        for (int i = 0; i < bookingCount; i++) {
            if (myBookings[i] != null && myBookings[i].getBookingId().equalsIgnoreCase(id)) {
                chosen = myBookings[i];
                break;
            }
        }

        if (chosen == null) {
            System.out.println("Booking not found!");
            return;
        }

        processPayment(chosen);
    }

}
