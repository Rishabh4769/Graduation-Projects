package BusTicketBooking;

public class Main {
    public static void main(String[] args) {

        Dashboard dash = new Dashboard();
        Admin admin = new Admin();
        User user = new User();

        // === Shared Bus Array ===
        Bus[] buses = new Bus[100];  // up to 10 buses can be stored
        int busCount = 0;

        // === Preloaded sample buses (optional for testing) ===
        buses[busCount++] = new AC_BUS("B001", "Rajkot", "Ahmedabad", 250, 40);
        buses[busCount++] = new SLEEPER_BUS("B002", "Rajkot", "Mumbai", 700, 45);
        buses[busCount++] = new NON_AC_BUS("B003", "Rajkot", "Surat", 400, 45);
        buses[busCount++] = new EXPRESS_BUS("B004", "Rajkot", "Bhavnagar", 200, 30);
        System.out.println();

        Dashboard.showLoadingScreen();

        while (true) {
            int mainChoice = dash.showMainMenu();

            switch (mainChoice) {
                // ---------------- Admin Section ----------------
                case 1:
                    if (dash.checkAdminLogin()) {
                        int adminChoice;
                        do {
                            adminChoice = dash.showAdminMenu();
                            switch (adminChoice) {
                                case 1:
                                    busCount = admin.addBus(buses, busCount);
                                    break;
                                case 2:
                                    admin.viewAllBuses(buses, busCount);
                                    break;
                                case 3:
                                    admin.updateBus(buses, busCount);
                                    break;
                                case 4:
                                    busCount = admin.deleteBus(buses, busCount);
                                    break;
                                case 5:
                                    System.out.println("Logging out from Admin...");
                                    break;
                                default:
                                    System.out.println("Invalid Choice!");
                            }
                        } while (adminChoice != 5);
                    }
                    break;

                // ---------------- User Section ----------------
                case 2:
                    int userChoice;
                    do {
                        userChoice = dash.showUserMenu();
                        switch (userChoice) {
                            case 1:
                                user.viewAvailableBuses(buses, busCount);
                                break;
                            case 2:
                                user.searchBusByRoute(buses, busCount);
                                break;
                            case 3:
                                user.selectBusType(buses, busCount);
                                break;
                            case 4:
                                user.bookTicket(buses, busCount);
                                break;
                            case 5:
                                user.makePayment();
                                break;
                            case 6:
                                user.cancelTicket(buses, busCount);
                                break;
                            case 7:
                                user.viewMyBookings();
                                break;
                            case 8:
                                System.out.println("Returning to Main Menu...");
                                break;
                            default:
                                System.out.println("Invalid Choice!");
                        }
                    } while (userChoice != 8);
                    break;

                // ---------------- Exit ----------------
                case 3:
                    System.out.println("Thank you for using the Online Bus Booking System!");
                    System.exit(0);
                    break;

                default:
                    System.out.println("Invalid Choice! Try again.");
            }
        }
    }
}
