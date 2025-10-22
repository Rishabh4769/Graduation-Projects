package BusTicketBooking;
import java.util.Scanner;

public class Dashboard {

    Scanner sc = new Scanner(System.in);
    final String ADMIN_USER = "Admin";
    final String ADMIN_PASS = "admin@123";

    public int showMainMenu() {
        System.out.println("\n=====================================");
        System.out.println("      ONLINE BUS BOOKING SYSTEM");
        System.out.println("=====================================");
        System.out.println("1. Admin Login");
        System.out.println("2. User Menu");
        System.out.println("3. Exit");
        System.out.print("Enter your choice: ");
        int choice = sc.nextInt();
        sc.nextLine();
        return choice;
    }

    public boolean checkAdminLogin() {
        System.out.print("Enter Username: ");
        String uname = sc.nextLine();
        System.out.print("Enter Password: ");
        String pwd = sc.nextLine();

        if (uname.equals(ADMIN_USER) && pwd.equals(ADMIN_PASS)) {
            System.out.println("\n✅ Admin Login Successful!");
            return true;
        } else {
            System.out.println("\n❌ Invalid Username or Password!");
            return false;
        }
    }

    public int showAdminMenu() {
        System.out.println("\n=====================================");
        System.out.println("        ADMIN DASHBOARD");
        System.out.println("=====================================");
        System.out.println("1. Add New Bus");
        System.out.println("2. View All Buses");
        System.out.println("3. Update Bus Details");
        System.out.println("4. Delete Bus");
        System.out.println("5. Logout");
        System.out.print("Enter your choice: ");
        int choice = sc.nextInt();
        sc.nextLine();
        return choice;
    }

    public int showUserMenu() {
        System.out.println("\n=====================================");
        System.out.println("         PASSENGER MENU");
        System.out.println("=====================================");
        System.out.println("1. View Available Buses");
        System.out.println("2. Search Bus by Route");
        System.out.println("3. Select Bus Type");
        System.out.println("4. Book Ticket");
        System.out.println("5. Make Payment");
        System.out.println("6. Cancel Ticket");
        System.out.println("7. View My Bookings");
        System.out.println("8. Back to Main Menu");
        System.out.print("Enter your choice: ");
        int choice = sc.nextInt();
        sc.nextLine();
        return choice;
    }
}
