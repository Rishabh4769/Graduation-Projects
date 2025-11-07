package BusTicketBooking;

import java.util.InputMismatchException;
import java.util.Scanner;

public class Dashboard {

    Scanner sc = new Scanner(System.in);
    final String ADMIN_USER = "Admin";
    final String ADMIN_PASS = "admin@123";
    private static String[] loadingChars = {"|", "/", "-", "\\"};
    private static int duration = 3000;
    private static int steps = 20;
    private static int delay = duration / steps;

    final static String RED = "\u001B[31m";
    final static String GREEN = "\u001B[32m";
    final static String CYAN = "\u001B[36m";
    final static String YELLOW = "\u001B[33m";
    final static String RESET = "\u001B[0m";

    public static void showLoadingScreen() {
        System.out.print(GREEN + "Loading Online Bus Booking System... 0%" + RESET);
        for (int i = 0; i < steps; i++) {
            int percent = ((i + 1) * 100) / steps;
            System.out.printf(GREEN + "\rLoading Online Bus Ticket Booking System... " + CYAN + "%d%% %s" + RESET + GREEN, percent, loadingChars[i % loadingChars.length]);
            try {
                Thread.sleep(delay);
                if (percent == 50 || percent == 95) {
                    Thread.sleep(1000);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        System.out.println(GREEN + "\rLoading Online Bus Ticket Booking System... 100% Done" + RESET);
    }

    public static void showExitAnimation() {
        System.out.print(YELLOW + "Exiting the system" + RESET);
        for (int i = 0; i < 4; i++) {
            try {
                Thread.sleep(700);
                System.out.print(YELLOW + " ." + RESET);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        System.out.println();
    }

    public static void showPaymentAnimation() {
        System.out.print(GREEN + "Processing payment... 0%" + RESET);
        for (int i = 0; i < steps; i++) {
            int percent = ((i + 1) * 100) / steps;
            System.out.printf(GREEN + "\rProcessing payment... " + CYAN + "%d%% %s" + RESET + GREEN, percent, loadingChars[i % loadingChars.length]);
            try {
                Thread.sleep(delay);
                if (percent == 45 || percent == 55) {
                    Thread.sleep(1000);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        System.out.println(GREEN + "\rProcessing payment... 100% Done" + RESET);
    }

    public int showMainMenu() {
        System.out.println("\n");
        System.out.println(GREEN + "==========================================" + RESET);
        System.out.println(GREEN + "|                                        |" + RESET);
        System.out.println(GREEN + "|      " + YELLOW + "ONLINE BUS BOOKING SYSTEM         " + GREEN + "|" + RESET);
        System.out.println(GREEN + "|                                        |" + RESET);
        System.out.println(GREEN + "==========================================" + RESET);
        System.out.println(GREEN + "|                                        |" + RESET);
        System.out.println(GREEN + "|  " + YELLOW + "1. Admin Login" + CYAN + "                        |" + RESET);
        System.out.println(GREEN + "|                                        |" + RESET);
        System.out.println(GREEN + "|  " + CYAN + "2. User Menu" + CYAN + "                          |" + RESET);
        System.out.println(GREEN + "|                                        |" + RESET);
        System.out.println(GREEN + "|  " + RED + "3. Exit" + GREEN + "                               |" + RESET);
        System.out.println(GREEN + "|                                        |" + RESET);
        System.out.println(GREEN + "==========================================" + RESET);
        try {
            System.out.print(YELLOW + "Enter your choice: " + RESET);
            int choice = sc.nextInt();
            sc.nextLine();
            System.out.println(CYAN + "------------------------------------------" + RESET);
            return choice;
        } catch (InputMismatchException e) {
            System.out.println(RED + "Invalid choice! Please enter a valid choice.\n" + RESET);
            sc.nextLine();
            return showMainMenu();
        }
    }

    public boolean checkAdminLogin() {
        System.out.println(CYAN + "\n------------------------------------------" + RESET);
        System.out.print(YELLOW + "Enter Username: " + RESET);
        String uname = sc.nextLine();
        System.out.print(YELLOW + "Enter Password: " + RESET);
        String pwd = sc.nextLine();
        System.out.println(CYAN + "------------------------------------------" + RESET);

        if (uname.toLowerCase().equals(ADMIN_USER.toLowerCase()) && pwd.equals(ADMIN_PASS)) {
            System.out.println(GREEN + "\n Admin Login Successful!" + RESET);
            return true;
        } else {
            System.out.println(RED + "\n Invalid Username or Password!" + RESET);
            return false;
        }
    }

    public int showAdminMenu() {
        System.out.println("\n");
        System.out.println(GREEN + "==========================================" + RESET);
        System.out.println(GREEN + "|            " + YELLOW + "ADMIN DASHBOARD             " + GREEN + "|" + RESET);
        System.out.println(GREEN + "==========================================" + RESET);
        System.out.println(GREEN + "|  1. Add New Bus                        |" + RESET);
        System.out.println(GREEN + "|  2. View All Buses                     |" + RESET);
        System.out.println(GREEN + "|  3. Update Bus Details                 |" + RESET);
        System.out.println(GREEN + "|  4. Delete Bus                         |" + RESET);
        System.out.println(GREEN + "|  5. Logout                             |" + RESET);
        System.out.println(GREEN + "==========================================" + RESET);
        System.out.print(YELLOW + "Enter your choice: " + RESET);
        try {
            int choice = sc.nextInt();
            sc.nextLine();
            System.out.println(CYAN + "------------------------------------------\n" + RESET);
            return choice;
        } catch (InputMismatchException e) {
            System.out.println(RED + "Invalid choice! Please enter a valid choice." + RESET);
            sc.nextLine();
            return showAdminMenu();
        }
    }

    public int showUserMenu() {
        System.out.println("\n");
        System.out.println(GREEN + "==========================================" + RESET);
        System.out.println(GREEN + "|         " + YELLOW + "PASSENGER MENU                 " + GREEN + "|" + RESET);
        System.out.println(GREEN + "==========================================" + RESET);
        System.out.println(GREEN + "|  1. View Available Buses               |" + RESET);
        System.out.println(GREEN + "|  2. Search Bus by Route                |" + RESET);
        System.out.println(GREEN + "|  3. Search Bus by Type                 |" + RESET);
        System.out.println(GREEN + "|  4. Book Ticket                        |" + RESET);
        System.out.println(GREEN + "|  5. Make Payment                       |" + RESET);
        System.out.println(GREEN + "|  6. Cancel Ticket                      |" + RESET);
        System.out.println(GREEN + "|  7. View My Bookings                   |" + RESET);
        System.out.println(GREEN + "|  8. Back to Main Menu                  |" + RESET);
        System.out.println(GREEN + "==========================================" + RESET);
        System.out.print(YELLOW + "Enter your choice: " + RESET);
        try{
            int choice = sc.nextInt();
            sc.nextLine();
            System.out.println(CYAN + "------------------------------------------\n" + RESET);
            return choice;
        }
        catch( InputMismatchException e){
            System.out.println(RED + "Invalid choice! Please enter a valid choice." + RESET);
            sc.nextLine();
            return showUserMenu();
        }
    }
}
