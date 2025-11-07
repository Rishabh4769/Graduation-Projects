package BusTicketBooking;

public abstract class Payment {
    protected double amount;

    public Payment(double amount) {
        this.amount = amount;
    }

    public abstract boolean pay();
}
class UPIPayment extends Payment {
    public UPIPayment(double amount) {
        super(amount);
    }

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

class CashPayment extends Payment {
    public CashPayment(double amount) {
        super(amount);
    }

    @Override
    public boolean pay() {
        System.out.println("Paying ₹" + amount + " in cash.");
        return true;
    }
}

class CreditCardPayment extends Payment {
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
