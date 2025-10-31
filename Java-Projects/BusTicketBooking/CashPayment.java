package BusTicketBooking;

public class CashPayment implements Payment {
    private double amount;

    public CashPayment(double amount) {
        this.amount = amount;
    }

    @Override
    public boolean pay() {
        System.out.println("Paying ₹" + amount + " in cash.");
        return true; // Simulate success
    }
}
