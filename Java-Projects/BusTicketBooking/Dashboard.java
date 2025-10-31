package BusTicketBooking;

import java.util.Scanner;

public class Dashboard {

    Scanner sc = new Scanner(System.in);
    final String ADMIN_USER = "Admin";
    final String ADMIN_PASS = "admin@123";
    private static String[] loadingChars = {"|", "/", "-", "\\"};
    private static int duration = 3000;
    private static int steps = 20;
    private static int delay = duration / steps;


    // ======Loading Animation Module======

    public static void showLoadingScreen() {
        System.out.print("Loading Online Bus Booking System... 0%");
        for (int i = 0; i < steps; i++) {

            int percent = ((i + 1) * 100) / steps;
            System.out.printf("\rLoading Online Bus Ticket Booking System... %d%% %s", percent, loadingChars[i % loadingChars.length]);
        try {
                Thread.sleep(delay);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        System.out.println("\rLoading Online Bus Ticket Booking System... 100% Done");
    }

    // ======Main Menu Module======
    public int showMainMenu() {

        
        // ======Main Menu Display Board======

        System.out.println("\n");
        System.out.println("==========================================");
        System.out.println("|                                        |");
        System.out.println("|      ONLINE BUS BOOKING SYSTEM         |");
        System.out.println("|                                        |");
        System.out.println("==========================================");
        System.out.println("|                                        |");
        System.out.println("|  1. Admin Login                        |");
        System.out.println("|                                        |");
        System.out.println("|  2. User Menu                          |");
        System.out.println("|                                        |");
        System.out.println("|  3. Exit                               |");
        System.out.println("|                                        |");
        System.out.println("==========================================");
        System.out.print("Enter your choice: ");
        int choice = sc.nextInt();
        System.out.println("------------------------------------------\n");

        sc.nextLine();
        return choice;
    }

    // ======Admin Login Module======

    public boolean checkAdminLogin() {
        System.out.println("\n------------------------------------------");
        System.out.print("Enter Username: ");
        String uname = sc.nextLine();
        System.out.print("Enter Password: ");
        String pwd = sc.nextLine();
        System.out.println("------------------------------------------");

        if (uname.equals(ADMIN_USER) && pwd.equals(ADMIN_PASS)) {
            System.out.println("\n✅ Admin Login Successful!");
            return true;
        } else {
            System.out.println("\n❌ Invalid Username or Password!");
            return false;
        }
    }

    public int showAdminMenu() {
        System.out.println("\n");
        System.out.println("==========================================");
        System.out.println("|            ADMIN DASHBOARD             |");
        System.out.println("==========================================");
        System.out.println("|  1. Add New Bus                        |");
        System.out.println("|  2. View All Buses                     |");
        System.out.println("|  3. Update Bus Details                 |");
        System.out.println("|  4. Delete Bus                         |");
        System.out.println("|  5. Logout                             |");
        System.out.println("==========================================");
        System.out.print("Enter your choice: ");
        int choice = sc.nextInt();
        sc.nextLine();
        System.out.println("------------------------------------------\n");
        return choice;
    }

    public int showUserMenu() {
        System.out.println("\n");
        System.out.println("==========================================");
        System.out.println("|         PASSENGER MENU                 |");
        System.out.println("==========================================");
        System.out.println("|  1. View Available Buses               |");
        System.out.println("|  2. Search Bus by Route                |");
        System.out.println("|  3. Select Bus Type                    |");
        System.out.println("|  4. Book Ticket                        |");
        System.out.println("|  5. Make Payment                       |");
        System.out.println("|  6. Cancel Ticket                      |");
        System.out.println("|  7. View My Bookings                   |");
        System.out.println("|  8. Back to Main Menu                  |");
        System.out.println("==========================================");
        System.out.print("Enter your choice: ");
        int choice = sc.nextInt();
        sc.nextLine();
        System.out.println("------------------------------------------\n");
        return choice;
    }
}
