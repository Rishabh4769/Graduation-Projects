package BusTicketBooking;

// UPI payment class with its own method, does NOT override pay()
public class UPIPayment extends Payment {
    public UPIPayment(double amount) {
        super(amount);
    }

    // Provide a specific method for UPI payments instead of overriding pay()
    public boolean payWithUPI(String upiId) {
        System.out.println("Paying ₹" + amount + " via UPI: " + upiId);
        return true;
    }


    @Override
    public boolean pay()
    {
        try
        {
            throw new UnsupportedOperationException("Use payWithUPI() instead.");
        }
        catch (UnsupportedOperationException e)
        {
            System.out.println(e.getMessage());
            return false;
        }
    }
}
