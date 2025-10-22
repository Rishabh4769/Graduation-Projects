package BusTicketBooking;

public class Person {
    protected String name;
    protected String email;
    protected String phone;
    protected String username;
    protected String password;

    // Default Constructor
    public Person() {}

    // Parameterized Constructor
    public Person(String name, String email, String phone, String username, String password) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.username = username;
        this.password = password;
    }

    // Method to display profile
    public void displayProfile() {
        System.out.println("Name: " + name);
        System.out.println("Email: " + email);
        System.out.println("Phone: " + phone);
        System.out.println("Username: " + username);
    }
}
