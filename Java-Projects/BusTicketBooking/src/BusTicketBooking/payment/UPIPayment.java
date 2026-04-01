package BusTicketBooking.payment;

public class UPIPayment extends Payment {
    public UPIPayment(double amount) {
        super(amount);
    }

    public boolean payWithUPI(String upiId) {
        try {
            System.out.println("Paying ₹" + amount + " via UPI: " + upiId);
            return true;
        } catch (Exception e) {
            System.out.println("UPI payment error: " + e.getMessage());
            return false;
        }
    }

    @Override
    public boolean pay() {
        try {
            throw new UnsupportedOperationException("Use payWithUPI() instead.");
        } catch (UnsupportedOperationException e) {
            System.out.println(e.getMessage());
            return false;
        }
    }
}
