package BusTicketBooking;

// CashPayment overrides abstract pay() method
public class CashPayment extends Payment {
    public CashPayment(double amount) {
        super(amount);
    }

    @Override
    public boolean pay() {
        System.out.println("Paying ₹" + amount + " in cash.");
        return true;
    }
}
