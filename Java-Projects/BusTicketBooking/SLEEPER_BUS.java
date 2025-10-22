package BusTicketBooking;

public class SLEEPER_BUS extends Bus {
    public SLEEPER_BUS(String busId, String source, String destination, double distance, int totalSeats) {
        super(busId, source, destination, "Sleeper", 2.5f, distance, totalSeats);
    }
}
