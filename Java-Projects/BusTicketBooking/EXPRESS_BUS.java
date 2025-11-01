package BusTicketBooking;

public class EXPRESS_BUS extends Bus {
    public EXPRESS_BUS(String busId, String source, String destination, double distance, int totalSeats) {
        super(busId, source, destination, "Express", 2.0f, distance, totalSeats);
    }
}
