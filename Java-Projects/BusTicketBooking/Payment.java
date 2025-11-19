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

class CashPayment extends Payment {
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

class CreditCardPayment extends Payment {
    public CreditCardPayment(double amount) {
        super(amount);
    }

    private boolean simulatePaymentProcess(String cardNumber, String expiry, String cvv) {
        // Simulated logic: fail payment if CVV is "000"
        return !cvv.equals("000");
    }

    public boolean payWithCard(String cardNumber, String expiry, String cvv) {
        try {
            System.out.println(Dashboard.RED + "Paying ₹" + amount + " with card: " + cardNumber + Dashboard.RESET);
            boolean paymentSuccessful = simulatePaymentProcess(cardNumber, expiry, cvv);

            if (!paymentSuccessful) {
                throw new PaymentFailureExceptionRishabh("Card payment failed for card number: " + cardNumber);
            }
            return true;
        } catch (PaymentFailureExceptionRishabh e) {
            System.out.println(Dashboard.RED + e.getMessage() + Dashboard.RESET);
            return false;
        } catch (Exception e) {
            System.out.println(Dashboard.RED + "Unexpected payment error: " + e.getMessage() + Dashboard.RESET);
            return false;
        }
    }

    @Override
    public boolean pay() {
        System.out.println("Use payWithCard() method to perform card payment.");
        return false;
    }
}
