package BusTicketBooking;

class Exceptions extends Exception {
    
    public Exceptions(String message) {
        super(message);
    }
}
class MaximumSeatsBookingException extends Exceptions {
    public MaximumSeatsBookingException(String message) {
        super(message);
    }
}
class PaymentFailureExceptionRishabh extends Exception {
    public PaymentFailureExceptionRishabh(String message) {
        super(message);
    }
}