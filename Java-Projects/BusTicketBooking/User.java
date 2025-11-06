package BusTicketBooking;

import java.util.Scanner;

public class User extends Person  {
    private String userId;
    private Booking[] myBookings = new Booking[50];
    private int bookingCount = 0;
    private Scanner sc = new Scanner(System.in);

    public User() { super(); this.userId = "U001"; }

    // Getter methods for passenger details
    public String getName() { return name; }
    public String getGender() { return gender; }
    public int getAge() { return age; }
    public String getPhone() { return phone; }

   public void run(){
        
    }

    // Bus data will be passed from Admin or Main
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

        // Show seat map and ask user to select specific seats
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
        // Take passenger details dynamically and update User object fields
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

        // Reserve chosen seats on the bus
        boolean reserved = chosen.reserveSeats(seatNumbers);
        if (!reserved) {
            System.out.println("Failed to reserve the selected seats. They may have been taken by someone else.");
            return;
        }

        Booking newBooking = new Booking(
            bookingId,
            this,
            chosen.getBusId(),
            chosen.getSource(),      // busFrom
            chosen.getDestination(), // busTo
            seats,
            fare,
            seatNumbers
        );

        myBookings[bookingCount++] = newBooking;
        System.out.println("✅ Ticket booked! Your booking ID: " + bookingId + ", Total Fare: ₹" + fare);
    }

    // ... (makePayment, cancelTicket, viewMyBookings remain unchanged)
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
        System.out.println("Select payment method:\n1. Cash\n2. UPI\n3. Credit Card \nChoice: ");
        int choice = sc.nextInt(); sc.nextLine();

        Payment payment;
        double amount = booking.getTotalFare();
        if (booking == null) {
            System.out.println("No booking provided for payment.");
            return;
        }

        if (amount <= 0) {
            System.out.println("Invalid booking amount (₹" + amount + "). Cannot process payment.");
            return;
        }

        boolean success = false;

        switch (choice) {
            case 1: // Cash
                CashPayment cash = new CashPayment(amount);
                success = cash.pay();
                break;

            case 2: // UPI
                System.out.print("Enter UPI ID: ");
                String upiId = sc.nextLine();
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

                CreditCardPayment card = new CreditCardPayment(amount);
                success = card.payWithCard(cardNumber, expiry, cvv);
                break;

            default:
                System.out.println("Invalid option");
                return;
        }

        if (success) {
            booking.markPaid();
            System.out.println("Payment successful!");
        } else {
            System.out.println("Payment failed.");
        }
    }

    // Convenience method: ask user which of their bookings to pay for
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
