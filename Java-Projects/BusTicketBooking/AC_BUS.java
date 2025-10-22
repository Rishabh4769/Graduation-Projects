package BusTicketBooking;

public class AC_BUS extends Bus {
    public AC_BUS(String busId, String source, String destination, double distance, int totalSeats) {
        super(busId, source, destination, "AC", 3.0f, distance, totalSeats);
    }
}
