package BusTicketBooking.people;

import BusTicketBooking.bus.AC_BUS;
import BusTicketBooking.bus.Bus;
import BusTicketBooking.bus.EXPRESS_BUS;
import BusTicketBooking.bus.NON_AC_BUS;
import BusTicketBooking.bus.SLEEPER_BUS;

import java.util.Scanner;

public class Admin extends Person {
    private String adminId;
    private Scanner sc = new Scanner(System.in);

    public Admin() {
        super();
        this.adminId = "A001";
        this.username = "Admin";
        this.password = "admin@123";
        this.name = "System Administrator";
    }

    public boolean authenticate(String enteredUsername, String enteredPassword) {
        return username.equalsIgnoreCase(enteredUsername) && password.equals(enteredPassword);
    }

    public int addBus(Bus[] buses, int busCount) {
        if (busCount >= buses.length) {
            System.out.println("Cannot add more buses (array full)!");
            return busCount;
        }

        System.out.print("Enter Bus ID: ");
        String id = sc.nextLine();
        System.out.print("Enter Source: ");
        String source = sc.nextLine();
        System.out.print("Enter Destination: ");
        String dest = sc.nextLine();
        System.out.print("Enter Distance (km): ");
        double dist = sc.nextDouble();
        System.out.print("Enter Total Seats: ");
        int seats = sc.nextInt();
        sc.nextLine();

        System.out.print("Enter Bus Type (AC / NonAC / Sleeper / Express): ");
        String type = sc.nextLine();

        Bus newBus = null;
        switch (type.toLowerCase()) {
            case "ac":
                newBus = new AC_BUS(id, source, dest, dist, seats);
                break;
            case "nonac":
            case "non-ac":
                newBus = new NON_AC_BUS(id, source, dest, dist, seats);
                break;
            case "sleeper":
                newBus = new SLEEPER_BUS(id, source, dest, dist, seats);
                break;
            case "express":
                newBus = new EXPRESS_BUS(id, source, dest, dist, seats);
                break;
            default:
                System.out.println("Invalid bus type! Bus not added.");
                return busCount;
        }

        buses[busCount] = newBus;
        System.out.println("Bus added successfully with ID: " + id);
        return busCount + 1;
    }

    public void viewAllBuses(Bus[] buses, int busCount) {
        if (busCount == 0) {
            System.out.println("No buses available!");
            return;
        }

        System.out.println("\n=== All Buses ===");
        for (int i = 0; i < busCount; i++) {
            System.out.print((i + 1) + ". ");
            buses[i].displayInfo();
        }
    }

    public void updateBus(Bus[] buses, int busCount) {
        if (busCount == 0) {
            System.out.println("No buses to update!");
            return;
        }

        System.out.print("Enter Bus ID to update: ");
        String id = sc.nextLine();
        boolean found = false;

        for (int i = 0; i < busCount; i++) {
            if (buses[i].getBusId().equalsIgnoreCase(id)) {
                found = true;
                System.out.println("Bus found!");
                buses[i].displayInfo();

                System.out.print("Enter new Total Seats: ");
                int newSeats = sc.nextInt();
                sc.nextLine();

                buses[i].resetSeatCapacity(newSeats);
                System.out.println("Bus details updated successfully!");
                break;
            }
        }

        if (!found) System.out.println("Bus ID not found!");
    }

    public int deleteBus(Bus[] buses, int busCount) {
        if (busCount == 0) {
            System.out.println("No buses to delete!");
            return busCount;
        }

        System.out.print("Enter Bus ID to delete: ");
        String id = sc.nextLine();
        int index = -1;

        for (int i = 0; i < busCount; i++) {
            if (buses[i].getBusId().equalsIgnoreCase(id)) {
                index = i;
                break;
            }
        }

        if (index == -1) {
            System.out.println("Bus ID not found!");
            return busCount;
        }

        for (int i = index; i < busCount - 1; i++) {
            buses[i] = buses[i + 1];
        }

        buses[busCount - 1] = null;
        System.out.println("Bus deleted successfully!");
        return busCount - 1;
    }

    public Bus createBus(String id, String source, String dest, double dist, int seats, String type) {
        switch (type.trim().toLowerCase()) {
            case "ac":
                return new AC_BUS(id, source, dest, dist, seats);
            case "nonac":
            case "non-ac":
                return new NON_AC_BUS(id, source, dest, dist, seats);
            case "sleeper":
                return new SLEEPER_BUS(id, source, dest, dist, seats);
            case "express":
                return new EXPRESS_BUS(id, source, dest, dist, seats);
            default:
                throw new IllegalArgumentException("Invalid bus type: " + type);
        }
    }

    public int addBus(Bus[] buses, int busCount, Bus newBus) {
        if (newBus == null) {
            throw new IllegalArgumentException("Bus details are required.");
        }
        if (busCount >= buses.length) {
            throw new IllegalStateException("Cannot add more buses. Storage is full.");
        }

        buses[busCount] = newBus;
        return busCount + 1;
    }

    public boolean updateBusSeats(Bus[] buses, int busCount, String busId, int newSeats) {
        for (int i = 0; i < busCount; i++) {
            if (buses[i].getBusId().equalsIgnoreCase(busId)) {
                buses[i].resetSeatCapacity(newSeats);
                return true;
            }
        }
        return false;
    }

    public int deleteBusById(Bus[] buses, int busCount, String busId) {
        if (busId == null || busId.isBlank()) {
            throw new IllegalArgumentException("Bus ID is required.");
        }

        int index = -1;
        for (int i = 0; i < busCount; i++) {
            if (buses[i].getBusId().equalsIgnoreCase(busId.trim())) {
                index = i;
                break;
            }
        }

        if (index == -1) {
            return busCount;
        }

        for (int i = index; i < busCount - 1; i++) {
            buses[i] = buses[i + 1];
        }
        buses[busCount - 1] = null;
        return busCount - 1;
    }
}
