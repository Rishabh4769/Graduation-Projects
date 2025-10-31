package BusTicketBooking;

// Credit card payment class
public class CreditCardPayment extends Payment {
    public CreditCardPayment(double amount) {
        super(amount);
    }

    public boolean payWithCard(String cardNumber, String expiry, String cvv) {
        System.out.println("Paying ₹" + amount + " with card: " + cardNumber);
        return true;
    }

    @Override
    public boolean pay() {
        throw new UnsupportedOperationException("Use payWithCard() instead.");
    }
}
