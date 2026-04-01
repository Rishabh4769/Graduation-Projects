package BusTicketBooking.payment;

public class CashPayment extends Payment {
    public CashPayment(double amount) {
        super(amount);
    }

    @Override
    public boolean pay() {
        try {
            System.out.println("Paying ₹" + amount + " in cash.");
            return true;
        } catch (Exception e) {
            System.out.println("Cash payment error: " + e.getMessage());
            return false;
        }
    }
}
