package BusTicketBooking;

import BusTicketBooking.bus.AC_BUS;
import BusTicketBooking.bus.Bus;
import BusTicketBooking.bus.EXPRESS_BUS;
import BusTicketBooking.bus.NON_AC_BUS;
import BusTicketBooking.bus.SLEEPER_BUS;
import BusTicketBooking.people.Admin;
import BusTicketBooking.people.User;
import BusTicketBooking.ui.BusTicketBookingUI;
import BusTicketBooking.ui.Dashboard;

import javax.swing.SwingUtilities;

public class Main {
    public static void main(String[] args) {
        if (args.length > 0 && args[0].equalsIgnoreCase("console")) {
            runConsoleApp();
            return;
        }

        SwingUtilities.invokeLater(() -> new BusTicketBookingUI().setVisible(true));
    }

    public static Bus[] createDefaultBuses() {
        Bus[] buses = new Bus[100];
        buses[0] = new AC_BUS("B001", "Rajkot", "Ahmedabad", 250, 40);
        buses[1] = new SLEEPER_BUS("B002", "Rajkot", "Mumbai", 700, 45);
        buses[2] = new NON_AC_BUS("B003", "Rajkot", "Surat", 400, 45);
        buses[3] = new EXPRESS_BUS("B004", "Rajkot", "Bhavnagar", 200, 30);
        return buses;
    }

    public static void runConsoleApp() {
        Dashboard dash = new Dashboard();
        Admin admin = new Admin();
        User user = new User();

        Bus[] buses = createDefaultBuses();
        int busCount = 4;
        System.out.println();

        Dashboard.showLoadingScreen();

        while (true) {
            int mainChoice = dash.showMainMenu();

            switch (mainChoice) {
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
                                user.processPayment();
                                break;
                            case 6:
                                // user.cancelTicket(buses, busCount);
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

                case 3:
                    Dashboard.showExitAnimation();
                    return;
                    
                default:
                    System.out.println("Invalid Choice! Try again.");
            }
        }
    }
}
