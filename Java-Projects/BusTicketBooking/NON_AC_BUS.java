package BusTicketBooking;

public class NON_AC_BUS extends Bus {
    public NON_AC_BUS(String busId, String source, String destination, double distance, int totalSeats) {
        super(busId, source, destination, "NonAC", 1.5f, distance, totalSeats);
    }
}
