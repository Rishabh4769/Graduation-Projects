package BusTicketBooking;
import java.util.Scanner;

public class Admin extends Person {
    private String adminId;
    private Scanner sc = new Scanner(System.in);

    public Admin() {
        super();
        this.adminId = "A001";
    }

    // ---------- 1️⃣ Add New Bus ----------
    public int addBus(Bus[] buses, int busCount) {
        if (busCount >= buses.length) {
            System.out.println("❌ Cannot add more buses (array full)!");
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
        sc.nextLine(); // consume newline

        System.out.print("Enter Bus Type (AC / NonAC / Sleeper / Express): ");
        String type = sc.nextLine();

        // Create bus based on type
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
        System.out.println("✅ Bus added successfully with ID: " + id);
        return busCount + 1;
    }

    // ---------- 2️⃣ View All Buses ----------
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

    // ---------- 3️⃣ Update Bus ----------
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

                buses[i].totalSeats = newSeats;
                buses[i].availableSeats = newSeats;
                System.out.println("✅ Bus details updated successfully!");
                break;
            }
        }

        if (!found) System.out.println("Bus ID not found!");
    }

    // ---------- 4️⃣ Delete Bus ----------
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
            System.out.println("❌ Bus ID not found!");
            return busCount;
        }

        // Shift array elements left to remove the bus
        for (int i = index; i < busCount - 1; i++) {
            buses[i] = buses[i + 1];
        }

        buses[busCount - 1] = null;
        System.out.println("✅ Bus deleted successfully!");
        return busCount - 1;
    }
}
