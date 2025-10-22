package BusTicketBooking;
import java.util.Scanner;

public class User extends Person {
    private String userId;
    private Booking[] myBookings = new Booking[50];
    private int bookingCount = 0;
    private Scanner sc = new Scanner(System.in);

    public User() { super(); this.userId = "U001"; }

    // Bus data will be passed from Admin or Main
    public void viewAvailableBuses(Bus[] buses, int busCount) {
        System.out.println("\n=== Available Buses ===");
        for (int i = 0; i < busCount; i++) {
            buses[i].displayInfo();
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

        if (chosen.getAvailableSeats() < seats) {
            System.out.println("Not enough seats available!");
            return;
        }

        System.out.print("Enter your name: ");
        String name = sc.nextLine();

        double fare = chosen.calculateFare() * seats;
        String bookingId = "B" + (bookingCount + 1);

        Booking newBooking = new Booking(bookingId, name, chosen.getBusId(), seats, fare);
        myBookings[bookingCount++] = newBooking;

        chosen.bookSeat(seats);
        System.out.println("✅ Ticket booked! Your booking ID: " + bookingId + ", Total Fare: ₹" + fare);
    }

    public void makePayment() {
        System.out.print("Enter Booking ID: ");
        String id = sc.nextLine();

        for (int i = 0; i < bookingCount; i++) {
            if (myBookings[i].getBookingId().equalsIgnoreCase(id)) {
                myBookings[i].markPaid();
                System.out.println("💳 Payment successful for ₹" + myBookings[i].getTotalFare());
                return;
            }
        }
        System.out.println("Booking not found!");
    }

    public void cancelTicket(Bus[] buses, int busCount) {
        System.out.print("Enter Booking ID to cancel: ");
        String id = sc.nextLine();

        for (int i = 0; i < bookingCount; i++) {
            if (myBookings[i].getBookingId().equalsIgnoreCase(id)) {
                String busId = myBookings[i].getBusId();
                for (int j = 0; j < busCount; j++) {
                    if (buses[j].getBusId().equalsIgnoreCase(busId)) {
                        buses[j].cancelSeat(myBookings[i].seatCount);
                    }
                }
                System.out.println("❌ Ticket cancelled: " + id);
                myBookings[i] = null;
                return;
            }
        }
        System.out.println("Booking ID not found!");
    }

    public void viewMyBookings() {
        System.out.println("\n=== Your Bookings ===");
        for (int i = 0; i < bookingCount; i++) {
            if (myBookings[i] != null) {
                myBookings[i].display();
            }
        }
    }
}
