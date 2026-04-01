package BusTicketBooking.payment;

import BusTicketBooking.ui.Dashboard;

public class CreditCardPayment extends Payment {
    public CreditCardPayment(double amount) {
        super(amount);
    }

    private boolean simulatePaymentProcess(String cardNumber, String expiry, String cvv) {
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
