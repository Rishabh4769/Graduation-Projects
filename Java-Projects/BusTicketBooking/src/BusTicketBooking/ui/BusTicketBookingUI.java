package BusTicketBooking.ui;

import java.awt.BorderLayout;
import java.awt.CardLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.GradientPaint;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.GridLayout;
import java.awt.Insets;
import java.awt.RenderingHints;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

import BusTicketBooking.Main;
import BusTicketBooking.booking.Booking;
import BusTicketBooking.bus.Bus;
import BusTicketBooking.people.Admin;
import BusTicketBooking.people.User;

import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JPasswordField;
import javax.swing.JScrollPane;
import javax.swing.JTabbedPane;
import javax.swing.JTable;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.ListSelectionModel;
import javax.swing.SwingConstants;
import javax.swing.UIManager;
import javax.swing.border.EmptyBorder;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.DefaultTableModel;

public class BusTicketBookingUI extends JFrame {
    private static final String SCREEN_LOGIN = "login";
    private static final String SCREEN_REGISTER = "register";
    private static final String SCREEN_USER_DASHBOARD = "userDashboard";
    private static final String SCREEN_ADMIN_DASHBOARD = "adminDashboard";

    private static final Color PAGE_BG = new Color(241, 244, 249);
    private static final Color PANEL_BG = new Color(252, 253, 255);
    private static final Color PANEL_ALT = new Color(232, 239, 247);
    private static final Color PRIMARY = new Color(17, 64, 122);
    private static final Color PRIMARY_DARK = new Color(8, 27, 51);
    private static final Color TEXT_MAIN = new Color(21, 34, 53);
    private static final Color TEXT_MUTED = new Color(95, 107, 128);

    private final Admin admin = new Admin();
    private final Bus[] buses = Main.createDefaultBuses();
    private final Map<String, User> registeredUsers = new LinkedHashMap<>();
    private int busCount = 4;
    private int userSequence = 1;
    private User currentUser;

    private final CardLayout screenLayout = new CardLayout();
    private final JPanel screenPanel = new JPanel(screenLayout);

    private final DefaultTableModel busTableModel = new DefaultTableModel(
        new String[] {"Bus ID", "From", "To", "Type", "Distance", "Fare", "Seats"}, 0
    ) {
        @Override
        public boolean isCellEditable(int row, int column) {
            return false;
        }
    };

    private final DefaultTableModel bookingTableModel = new DefaultTableModel(
        new String[] {"Booking ID", "Bus", "Route", "Seats", "Fare", "Status"}, 0
    ) {
        @Override
        public boolean isCellEditable(int row, int column) {
            return false;
        }
    };

    private final JTable busTable = new JTable(busTableModel);
    private final JTable bookingTable = new JTable(bookingTableModel);

    private final JTextField routeSourceField = new JTextField();
    private final JTextField routeDestinationField = new JTextField();
    private final JComboBox<String> typeFilterBox = new JComboBox<>(new String[] {"All", "AC", "NonAC", "Sleeper", "Express"});

    private final JTextField passengerNameField = new JTextField();
    private final JTextField passengerAgeField = new JTextField();
    private final JTextField passengerGenderField = new JTextField();
    private final JTextField passengerPhoneField = new JTextField();
    private final JTextField busIdField = new JTextField();
    private final JTextField seatNumbersField = new JTextField();

    private final JComboBox<String> bookingSelectionBox = new JComboBox<>();
    private final JComboBox<String> paymentMethodBox = new JComboBox<>(new String[] {"Cash", "UPI", "Card"});
    private final JTextField upiField = new JTextField();
    private final JTextField cardNumberField = new JTextField();
    private final JTextField expiryField = new JTextField();
    private final JTextField cvvField = new JTextField();

    private final JTextField adminBusIdField = new JTextField();
    private final JTextField adminSourceField = new JTextField();
    private final JTextField adminDestinationField = new JTextField();
    private final JTextField adminDistanceField = new JTextField();
    private final JTextField adminSeatsField = new JTextField();
    private final JComboBox<String> adminTypeBox = new JComboBox<>(new String[] {"AC", "NonAC", "Sleeper", "Express"});
    private final JTextField updateBusIdField = new JTextField();
    private final JTextField updateSeatsField = new JTextField();
    private final JTextField deleteBusIdField = new JTextField();

    private final JTextField loginUsernameField = new JTextField();
    private final JPasswordField loginPasswordField = new JPasswordField();
    private final JTextField registerNameField = new JTextField();
    private final JTextField registerUsernameField = new JTextField();
    private final JPasswordField registerPasswordField = new JPasswordField();
    private final JTextField registerPhoneField = new JTextField();

    private final JTextArea summaryArea = new JTextArea();
    private final JLabel busCountValue = new JLabel("0");
    private final JLabel bookingCountValue = new JLabel("0");
    private final JLabel revenueValue = new JLabel("Rs 0.00");
    private final JLabel statusValue = new JLabel("Ready");
    private final JLabel currentUserLabel = new JLabel("Guest");
    private final JLabel adminStatusLabel = new JLabel("Admin access");

    public BusTicketBookingUI() {
        configureFrame();
        seedUsers();
        setContentPane(buildContent());
        refreshBusTable();
        refreshBookings();
        showScreen(SCREEN_LOGIN);
    }

    private void configureFrame() {
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception ignored) {
        }

        setTitle("Bus Ticket Booking System");
        setSize(1120, 760);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    }

    private void seedUsers() {
        User demoUser = new User("U001", "Demo User", "demo", "demo123", "9876543210");
        registeredUsers.put(demoUser.getUsername().toLowerCase(), demoUser);
        userSequence = 2;
    }

    private JPanel buildContent() {
        screenPanel.setBackground(PAGE_BG);
        screenPanel.add(buildLoginScreen(), SCREEN_LOGIN);
        screenPanel.add(buildRegisterScreen(), SCREEN_REGISTER);
        screenPanel.add(buildUserDashboardScreen(), SCREEN_USER_DASHBOARD);
        screenPanel.add(buildAdminDashboardScreen(), SCREEN_ADMIN_DASHBOARD);
        return screenPanel;
    }

    private JPanel buildLoginScreen() {
        JPanel root = new JPanel(new BorderLayout(20, 20));
        root.setBorder(new EmptyBorder(24, 24, 24, 24));
        root.setBackground(PAGE_BG);
        root.add(buildHeroPanel("Login", "Enter username and password."), BorderLayout.NORTH);

        JPanel center = new JPanel(new FlowLayout(FlowLayout.CENTER, 0, 40));
        center.setOpaque(false);

        JPanel card = createCardPanel("Account Login");
        card.setPreferredSize(new Dimension(420, 320));
        card.setLayout(new BorderLayout(0, 16));

        JPanel form = new JPanel(new GridLayout(4, 1, 8, 8));
        form.setOpaque(false);
        form.add(new JLabel("Username"));
        form.add(loginUsernameField);
        form.add(new JLabel("Password"));
        form.add(loginPasswordField);

        JButton loginButton = new JButton("Login");
        loginButton.addActionListener(e -> handleLogin());
        JButton registerButton = new JButton("Create Account");
        registerButton.addActionListener(e -> showScreen(SCREEN_REGISTER));

        styleFormField(loginUsernameField);
        styleFormField(loginPasswordField);
        stylePrimaryButton(loginButton);
        styleSecondaryButton(registerButton);

        JPanel actions = new JPanel(new GridLayout(2, 1, 0, 12));
        actions.setOpaque(false);
        actions.add(loginButton);
        actions.add(registerButton);

        JLabel helper = new JLabel("Demo: demo/demo123   Admin: Admin/admin@123");
        helper.setFont(new Font("SansSerif", Font.PLAIN, 12));
        helper.setForeground(TEXT_MUTED);
        helper.setHorizontalAlignment(SwingConstants.CENTER);

        JPanel body = new JPanel(new BorderLayout(0, 16));
        body.setOpaque(false);
        body.add(form, BorderLayout.NORTH);
        body.add(actions, BorderLayout.CENTER);

        card.add(body, BorderLayout.CENTER);
        card.add(helper, BorderLayout.SOUTH);

        center.add(card);
        root.add(center, BorderLayout.CENTER);
        return root;
    }

    private JPanel buildRegisterScreen() {
        JPanel root = new JPanel(new BorderLayout(20, 20));
        root.setBorder(new EmptyBorder(24, 24, 24, 24));
        root.setBackground(PAGE_BG);
        root.add(buildHeroPanel("Register", "Create a user account. After registration you will return to the login screen."), BorderLayout.NORTH);

        JPanel center = new JPanel(new FlowLayout(FlowLayout.CENTER, 0, 40));
        center.setOpaque(false);

        JPanel card = createCardPanel("Create User Account");
        card.setPreferredSize(new Dimension(460, 380));
        card.setLayout(new BorderLayout(0, 16));

        JPanel form = new JPanel(new GridLayout(8, 1, 8, 8));
        form.setOpaque(false);
        form.add(new JLabel("Full Name"));
        form.add(registerNameField);
        form.add(new JLabel("Username"));
        form.add(registerUsernameField);
        form.add(new JLabel("Password"));
        form.add(registerPasswordField);
        form.add(new JLabel("Phone"));
        form.add(registerPhoneField);

        JButton registerButton = new JButton("Register");
        registerButton.addActionListener(e -> handleUserRegistration());
        JButton backButton = new JButton("Back To Login");
        backButton.addActionListener(e -> showScreen(SCREEN_LOGIN));
        styleFormField(registerNameField);
        styleFormField(registerUsernameField);
        stylePasswordField(registerPasswordField);
        styleFormField(registerPhoneField);
        stylePrimaryButton(registerButton);
        styleSecondaryButton(backButton);

        JPanel actions = new JPanel(new GridLayout(2, 1, 0, 12));
        actions.setOpaque(false);
        actions.add(registerButton);
        actions.add(backButton);

        card.add(form, BorderLayout.NORTH);
        card.add(actions, BorderLayout.CENTER);

        center.add(card);
        root.add(center, BorderLayout.CENTER);
        return root;
    }

    private JPanel buildUserDashboardScreen() {
        JPanel root = new JPanel(new BorderLayout(16, 16));
        root.setBorder(new EmptyBorder(16, 16, 16, 16));
        root.setBackground(PAGE_BG);

        JPanel topSection = new JPanel(new BorderLayout(0, 14));
        topSection.setOpaque(false);
        topSection.add(buildHeroPanel("Passenger Dashboard", "Search routes, create bookings, and complete payments."), BorderLayout.NORTH);
        topSection.add(buildMetricsPanel(currentUserLabel, "Signed in user"), BorderLayout.SOUTH);
        root.add(topSection, BorderLayout.NORTH);

        JTabbedPane tabs = new JTabbedPane();
        tabs.setFont(new Font("SansSerif", Font.BOLD, 14));
        tabs.addTab("Browse Buses", buildBrowsePanel());
        tabs.addTab("Book Ticket", buildBookingPanel());
        tabs.addTab("Payments", buildPaymentPanel());
        tabs.addTab("My Bookings", buildBookingsPanel());
        root.add(tabs, BorderLayout.CENTER);
        root.add(buildBottomBar(true), BorderLayout.SOUTH);
        return root;
    }

    private JPanel buildAdminDashboardScreen() {
        JPanel root = new JPanel(new BorderLayout(16, 16));
        root.setBorder(new EmptyBorder(16, 16, 16, 16));
        root.setBackground(PAGE_BG);

        JPanel topSection = new JPanel(new BorderLayout(0, 14));
        topSection.setOpaque(false);
        topSection.add(buildHeroPanel("Admin Dashboard", "Manage inventory, capacities, and route availability."), BorderLayout.NORTH);
        topSection.add(buildMetricsPanel(adminStatusLabel, "Current access role"), BorderLayout.SOUTH);
        root.add(topSection, BorderLayout.NORTH);

        JTabbedPane tabs = new JTabbedPane();
        tabs.setFont(new Font("SansSerif", Font.BOLD, 14));
        tabs.addTab("All Buses", buildBrowsePanel());
        tabs.addTab("Manage Buses", buildAdminPanel());
        root.add(tabs, BorderLayout.CENTER);
        root.add(buildBottomBar(false), BorderLayout.SOUTH);
        return root;
    }

    private JPanel buildBottomBar(boolean includeSummary) {
        JPanel wrapper = new JPanel(new BorderLayout(12, 12));
        wrapper.setOpaque(false);

        if (includeSummary) {
            summaryArea.setEditable(false);
            summaryArea.setFont(new Font("Monospaced", Font.PLAIN, 13));
            summaryArea.setRows(5);
            summaryArea.setBackground(PRIMARY_DARK);
            summaryArea.setForeground(new Color(233, 239, 247));
            summaryArea.setBorder(new EmptyBorder(14, 14, 14, 14));
            JScrollPane summaryScroll = new JScrollPane(summaryArea);
            summaryScroll.setBorder(BorderFactory.createTitledBorder("Activity Summary"));
            wrapper.add(summaryScroll, BorderLayout.CENTER);
        }

        JPanel actions = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        actions.setOpaque(false);
        JButton logoutButton = new JButton("Logout");
        logoutButton.addActionListener(e -> logout());
        styleSecondaryButton(logoutButton);
        actions.add(logoutButton);
        wrapper.add(actions, BorderLayout.SOUTH);
        return wrapper;
    }

    private GradientPanel buildHeroPanel(String titleText, String subtitleText) {
        GradientPanel hero = new GradientPanel();
        hero.setLayout(new BorderLayout(12, 12));
        hero.setBorder(new EmptyBorder(24, 28, 24, 28));

        JLabel title = new JLabel(titleText);
        title.setFont(new Font("Serif", Font.BOLD, 31));
        title.setForeground(Color.WHITE);

        JLabel subtitle = new JLabel("<html>" + subtitleText + "</html>");
        subtitle.setFont(new Font("SansSerif", Font.PLAIN, 15));
        subtitle.setForeground(new Color(223, 231, 242));

        JPanel textBlock = new JPanel(new GridLayout(2, 1, 0, 6));
        textBlock.setOpaque(false);
        textBlock.add(title);
        textBlock.add(subtitle);

        hero.add(textBlock, BorderLayout.CENTER);
        return hero;
    }

    private JPanel buildMetricsPanel(JLabel roleValueLabel, String roleCaption) {
        JPanel metrics = new JPanel(new GridLayout(1, 4, 12, 12));
        metrics.setOpaque(false);
        metrics.add(createMetricCard("Active Buses", busCountValue, "Routes currently available"));
        metrics.add(createMetricCard("Bookings", bookingCountValue, "Bookings in current session"));
        metrics.add(createMetricCard("Revenue", revenueValue, "Paid booking total"));
        metrics.add(createMetricCard("Status", roleValueLabel, roleCaption));
        return metrics;
    }

    private JPanel createMetricCard(String title, JLabel valueLabel, String caption) {
        RoundedPanel card = new RoundedPanel(PANEL_BG, 24);
        card.setLayout(new GridLayout(3, 1, 0, 4));
        card.setBorder(new EmptyBorder(16, 18, 16, 18));

        JLabel titleLabel = new JLabel(title);
        titleLabel.setFont(new Font("SansSerif", Font.BOLD, 13));
        titleLabel.setForeground(TEXT_MUTED);

        valueLabel.setFont(new Font("Serif", Font.BOLD, 24));
        valueLabel.setForeground(PRIMARY_DARK);

        JLabel captionLabel = new JLabel(caption);
        captionLabel.setFont(new Font("SansSerif", Font.PLAIN, 12));
        captionLabel.setForeground(TEXT_MUTED);

        card.add(titleLabel);
        card.add(valueLabel);
        card.add(captionLabel);
        return card;
    }

    private JPanel buildBrowsePanel() {
        JPanel panel = createSectionPanel();

        JPanel filters = createCardPanel("Refine Search");
        filters.setLayout(new GridLayout(2, 4, 10, 10));
        filters.add(new JLabel("Source"));
        filters.add(routeSourceField);
        filters.add(new JLabel("Destination"));
        filters.add(routeDestinationField);
        filters.add(new JLabel("Bus Type"));
        filters.add(typeFilterBox);

        styleFormField(routeSourceField);
        styleFormField(routeDestinationField);
        styleCombo(typeFilterBox);

        JButton searchButton = new JButton("Apply Filters");
        searchButton.addActionListener(e -> refreshBusTable());
        JButton resetButton = new JButton("Reset");
        resetButton.addActionListener(e -> {
            routeSourceField.setText("");
            routeDestinationField.setText("");
            typeFilterBox.setSelectedIndex(0);
            refreshBusTable();
        });
        stylePrimaryButton(searchButton);
        styleSecondaryButton(resetButton);

        JPanel buttonRow = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 0));
        buttonRow.setOpaque(false);
        buttonRow.add(searchButton);
        buttonRow.add(resetButton);
        filters.add(buttonRow);
        filters.add(new JLabel(""));
        panel.add(filters, BorderLayout.NORTH);

        busTable.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        styleTable(busTable);
        JScrollPane busScroll = new JScrollPane(busTable);
        panel.add(wrapCard("Available Buses", busScroll), BorderLayout.CENTER);

        JButton useSelectedButton = new JButton("Use Selected Bus For Booking");
        useSelectedButton.addActionListener(e -> populateBookingBusFromSelection());
        stylePrimaryButton(useSelectedButton);
        JPanel footer = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        footer.setOpaque(false);
        footer.add(useSelectedButton);
        panel.add(footer, BorderLayout.SOUTH);

        return panel;
    }

    private JPanel buildBookingPanel() {
        JPanel panel = createSectionPanel();

        JPanel form = createCardPanel("Passenger and Seat Details");
        form.setLayout(new GridLayout(7, 2, 10, 10));
        form.add(new JLabel("Bus ID"));
        form.add(busIdField);
        form.add(new JLabel("Seat Numbers"));
        form.add(seatNumbersField);
        form.add(new JLabel("Passenger Name"));
        form.add(passengerNameField);
        form.add(new JLabel("Age"));
        form.add(passengerAgeField);
        form.add(new JLabel("Gender"));
        form.add(passengerGenderField);
        form.add(new JLabel("Phone"));
        form.add(passengerPhoneField);

        styleFormField(busIdField);
        styleFormField(seatNumbersField);
        styleFormField(passengerNameField);
        styleFormField(passengerAgeField);
        styleFormField(passengerGenderField);
        styleFormField(passengerPhoneField);

        JButton bookButton = new JButton("Book Ticket");
        bookButton.addActionListener(e -> handleBooking());
        JButton clearButton = new JButton("Clear");
        clearButton.addActionListener(e -> clearBookingForm());
        stylePrimaryButton(bookButton);
        styleSecondaryButton(clearButton);
        form.add(bookButton);
        form.add(clearButton);

        JTextArea help = new JTextArea("Enter seat numbers separated by commas. Example: 1,2,3");
        help.setEditable(false);
        help.setBackground(PANEL_ALT);
        help.setForeground(TEXT_MAIN);
        help.setBorder(new EmptyBorder(18, 18, 18, 18));

        panel.add(form, BorderLayout.NORTH);
        panel.add(wrapCard("Booking Guide", help), BorderLayout.CENTER);
        return panel;
    }

    private JPanel buildPaymentPanel() {
        JPanel panel = createCardPanel("Complete Payment");
        panel.setLayout(new GridLayout(6, 2, 10, 10));

        paymentMethodBox.addActionListener(e -> updatePaymentFields());
        updatePaymentFields();

        styleCombo(bookingSelectionBox);
        styleCombo(paymentMethodBox);
        styleFormField(upiField);
        styleFormField(cardNumberField);
        styleFormField(expiryField);
        styleFormField(cvvField);

        panel.add(new JLabel("Booking"));
        panel.add(bookingSelectionBox);
        panel.add(new JLabel("Method"));
        panel.add(paymentMethodBox);
        panel.add(new JLabel("UPI ID"));
        panel.add(upiField);
        panel.add(new JLabel("Card Number"));
        panel.add(cardNumberField);
        panel.add(new JLabel("Expiry"));
        panel.add(expiryField);
        panel.add(new JLabel("CVV"));
        panel.add(cvvField);

        JButton payButton = new JButton("Pay Now");
        payButton.addActionListener(e -> handlePayment());
        stylePrimaryButton(payButton);

        JPanel wrapper = new JPanel(new BorderLayout(12, 12));
        wrapper.setOpaque(false);
        wrapper.add(panel, BorderLayout.NORTH);

        JPanel buttons = new JPanel(new FlowLayout(FlowLayout.LEFT));
        buttons.setOpaque(false);
        buttons.add(payButton);
        wrapper.add(buttons, BorderLayout.SOUTH);
        return wrapper;
    }

    private JPanel buildBookingsPanel() {
        JPanel panel = createSectionPanel();
        styleTable(bookingTable);
        JScrollPane bookingScroll = new JScrollPane(bookingTable);
        panel.add(wrapCard("Booking Ledger", bookingScroll), BorderLayout.CENTER);
        return panel;
    }

    private JPanel buildAdminPanel() {
        JPanel panel = createSectionPanel();
        JPanel grid = new JPanel(new GridLayout(3, 1, 12, 12));
        grid.setOpaque(false);

        JPanel addPanel = createCardPanel("Add Bus");
        addPanel.setLayout(new GridLayout(4, 2, 8, 8));
        addPanel.add(new JLabel("Bus ID"));
        addPanel.add(adminBusIdField);
        addPanel.add(new JLabel("Source"));
        addPanel.add(adminSourceField);
        addPanel.add(new JLabel("Destination"));
        addPanel.add(adminDestinationField);
        addPanel.add(new JLabel("Distance"));
        addPanel.add(adminDistanceField);
        addPanel.add(new JLabel("Seats"));
        addPanel.add(adminSeatsField);
        addPanel.add(new JLabel("Type"));
        addPanel.add(adminTypeBox);
        JButton addButton = new JButton("Add Bus");
        addButton.addActionListener(e -> handleAddBus());
        stylePrimaryButton(addButton);
        addPanel.add(addButton);
        addPanel.add(new JLabel(""));

        styleFormField(adminBusIdField);
        styleFormField(adminSourceField);
        styleFormField(adminDestinationField);
        styleFormField(adminDistanceField);
        styleFormField(adminSeatsField);
        styleCombo(adminTypeBox);

        JPanel updatePanel = createCardPanel("Update Seats");
        updatePanel.setLayout(new GridLayout(2, 2, 8, 8));
        updatePanel.add(new JLabel("Bus ID"));
        updatePanel.add(updateBusIdField);
        updatePanel.add(new JLabel("New Total Seats"));
        updatePanel.add(updateSeatsField);
        JButton updateButton = new JButton("Update Bus");
        updateButton.addActionListener(e -> handleUpdateBus());
        stylePrimaryButton(updateButton);
        styleFormField(updateBusIdField);
        styleFormField(updateSeatsField);
        JPanel updateWrapper = new JPanel(new BorderLayout());
        updateWrapper.setOpaque(false);
        updateWrapper.add(updatePanel, BorderLayout.CENTER);
        updateWrapper.add(updateButton, BorderLayout.SOUTH);

        JPanel deletePanel = createCardPanel("Delete Bus");
        deletePanel.setLayout(new GridLayout(2, 1, 8, 8));
        deletePanel.add(deleteBusIdField);
        JButton deleteButton = new JButton("Delete Bus");
        deleteButton.addActionListener(e -> handleDeleteBus());
        styleSecondaryButton(deleteButton);
        styleFormField(deleteBusIdField);
        deletePanel.add(deleteButton);

        grid.add(addPanel);
        grid.add(updateWrapper);
        grid.add(deletePanel);
        panel.add(grid, BorderLayout.NORTH);
        return panel;
    }

    private void handleUserRegistration() {
        String name = registerNameField.getText().trim();
        String username = registerUsernameField.getText().trim();
        String password = new String(registerPasswordField.getPassword()).trim();
        String phone = registerPhoneField.getText().trim();

        if (name.isEmpty() || username.isEmpty() || password.isEmpty() || phone.isEmpty()) {
            showError("Fill all registration fields.");
            return;
        }
        if (registeredUsers.containsKey(username.toLowerCase())) {
            showError("Username already exists.");
            return;
        }

        User newUser = new User(String.format("U%03d", userSequence++), name, username, password, phone);
        registeredUsers.put(username.toLowerCase(), newUser);
        loginUsernameField.setText(username);
        loginPasswordField.setText(password);
        showInfo("Registration complete. Use Login.");
        showScreen(SCREEN_LOGIN);
    }

    private void handleLogin() {
        String username = loginUsernameField.getText().trim();
        String password = new String(loginPasswordField.getPassword()).trim();

        if (admin.authenticate(username, password)) {
            adminStatusLabel.setText("Administrator");
            refreshBusTable();
            updateDashboardMetrics("Admin session active");
            showScreen(SCREEN_ADMIN_DASHBOARD);
            return;
        }

        User foundUser = registeredUsers.get(username.toLowerCase());
        if (foundUser == null || !foundUser.authenticate(username, password)) {
            showError("Invalid credentials.");
            return;
        }

        currentUser = foundUser;
        currentUserLabel.setText(currentUser.getName());
        refreshBusTable();
        refreshBookings();
        updateDashboardMetrics("Logged in as " + currentUser.getUsername());
        showScreen(SCREEN_USER_DASHBOARD);
    }

    private void logout() {
        currentUser = null;
        currentUserLabel.setText("Guest");
        adminStatusLabel.setText("Admin access");
        loginPasswordField.setText("");
        clearBookingForm();
        bookingTableModel.setRowCount(0);
        bookingSelectionBox.removeAllItems();
        showScreen(SCREEN_LOGIN);
    }

    private void showScreen(String screenName) {
        screenLayout.show(screenPanel, screenName);
    }

    private void refreshBusTable() {
        busTableModel.setRowCount(0);
        String sourceFilter = routeSourceField.getText().trim();
        String destinationFilter = routeDestinationField.getText().trim();
        String typeFilter = String.valueOf(typeFilterBox.getSelectedItem());

        for (int i = 0; i < busCount; i++) {
            Bus bus = buses[i];
            boolean matchesSource = sourceFilter.isBlank() || bus.getSource().equalsIgnoreCase(sourceFilter);
            boolean matchesDestination = destinationFilter.isBlank() || bus.getDestination().equalsIgnoreCase(destinationFilter);
            boolean matchesType = "All".equalsIgnoreCase(typeFilter) || bus.getBusType().equalsIgnoreCase(typeFilter);
            if (matchesSource && matchesDestination && matchesType) {
                busTableModel.addRow(new Object[] {
                    bus.getBusId(),
                    bus.getSource(),
                    bus.getDestination(),
                    bus.getBusType(),
                    String.format("%.0f km", bus.getDistance()),
                    String.format("Rs %.2f", bus.calculateFare()),
                    bus.getAvailableSeats() + "/" + bus.getTotalSeats()
                });
            }
        }
        updateDashboardMetrics("Browsing " + busTableModel.getRowCount() + " buses");
    }

    private void populateBookingBusFromSelection() {
        int row = busTable.getSelectedRow();
        if (row < 0) {
            showInfo("Select a bus first.");
            return;
        }
        busIdField.setText(String.valueOf(busTableModel.getValueAt(row, 0)));
    }

    private void handleBooking() {
        if (currentUser == null) {
            showError("Login as a user first.");
            return;
        }
        try {
            int age = Integer.parseInt(passengerAgeField.getText().trim());
            int[] seatNumbers = parseSeatNumbers(seatNumbersField.getText());
            Booking booking = currentUser.createBooking(
                buses,
                busCount,
                busIdField.getText(),
                seatNumbers,
                passengerNameField.getText(),
                age,
                passengerGenderField.getText(),
                passengerPhoneField.getText()
            );
            refreshBusTable();
            refreshBookings();
            logSummary("Created booking " + booking.getBookingId());
            showInfo("Booking created: " + booking.getBookingId());
            clearBookingForm();
        } catch (NumberFormatException ex) {
            showError("Age must be numeric.");
        } catch (Exception ex) {
            showError(ex.getMessage());
        }
    }

    private void refreshBookings() {
        bookingTableModel.setRowCount(0);
        bookingSelectionBox.removeAllItems();
        if (currentUser == null) {
            updateDashboardMetrics("No user session");
            return;
        }

        for (Booking booking : currentUser.getMyBookings()) {
            if (booking == null) {
                continue;
            }
            String route = booking.getBusFrom() + " -> " + booking.getBusTo();
            String status = booking.isPaid() ? "Paid" : "Pending";
            String seatList = Arrays.stream(booking.getSeatNumbers()).mapToObj(String::valueOf).collect(Collectors.joining(", "));
            bookingTableModel.addRow(new Object[] {
                booking.getBookingId(), booking.getBusId(), route, seatList,
                String.format("Rs %.2f", booking.getTotalFare()), status
            });
            bookingSelectionBox.addItem(booking.getBookingId() + " - " + route + " - " + status);
        }
        updatePaymentFields();
        updateDashboardMetrics("Bookings refreshed");
    }

    private void updatePaymentFields() {
        String method = String.valueOf(paymentMethodBox.getSelectedItem());
        boolean upiVisible = "UPI".equalsIgnoreCase(method);
        boolean cardVisible = "Card".equalsIgnoreCase(method);
        upiField.setEnabled(upiVisible);
        cardNumberField.setEnabled(cardVisible);
        expiryField.setEnabled(cardVisible);
        cvvField.setEnabled(cardVisible);
    }

    private void handlePayment() {
        if (currentUser == null) {
            showError("Login as a user first.");
            return;
        }
        if (bookingSelectionBox.getSelectedItem() == null) {
            showInfo("No booking available.");
            return;
        }
        String bookingId = String.valueOf(bookingSelectionBox.getSelectedItem()).split(" - ")[0];
        Booking booking = currentUser.findBookingById(bookingId);
        try {
            boolean success = currentUser.processPayment(
                booking,
                String.valueOf(paymentMethodBox.getSelectedItem()),
                upiField.getText(),
                cardNumberField.getText(),
                expiryField.getText(),
                cvvField.getText()
            );
            refreshBookings();
            if (success) {
                logSummary("Payment completed for " + bookingId);
                showInfo("Payment successful.");
            } else {
                showError("Payment failed.");
            }
        } catch (Exception ex) {
            showError(ex.getMessage());
        }
    }

    private void handleAddBus() {
        try {
            Bus newBus = admin.createBus(
                adminBusIdField.getText().trim(),
                adminSourceField.getText().trim(),
                adminDestinationField.getText().trim(),
                Double.parseDouble(adminDistanceField.getText().trim()),
                Integer.parseInt(adminSeatsField.getText().trim()),
                String.valueOf(adminTypeBox.getSelectedItem())
            );
            busCount = admin.addBus(buses, busCount, newBus);
            refreshBusTable();
            updateDashboardMetrics("Bus " + newBus.getBusId() + " added");
            showInfo("Bus added.");
        } catch (Exception ex) {
            showError(ex.getMessage());
        }
    }

    private void handleUpdateBus() {
        try {
            boolean updated = admin.updateBusSeats(
                buses,
                busCount,
                updateBusIdField.getText().trim(),
                Integer.parseInt(updateSeatsField.getText().trim())
            );
            if (!updated) {
                showError("Bus ID not found.");
                return;
            }
            refreshBusTable();
            updateDashboardMetrics("Bus updated");
            showInfo("Bus updated.");
        } catch (Exception ex) {
            showError(ex.getMessage());
        }
    }

    private void handleDeleteBus() {
        try {
            int newCount = admin.deleteBusById(buses, busCount, deleteBusIdField.getText().trim());
            if (newCount == busCount) {
                showError("Bus ID not found.");
                return;
            }
            busCount = newCount;
            refreshBusTable();
            updateDashboardMetrics("Bus deleted");
            showInfo("Bus deleted.");
        } catch (Exception ex) {
            showError(ex.getMessage());
        }
    }

    private void clearBookingForm() {
        busIdField.setText("");
        seatNumbersField.setText("");
        passengerNameField.setText("");
        passengerAgeField.setText("");
        passengerGenderField.setText("");
        passengerPhoneField.setText("");
    }

    private int[] parseSeatNumbers(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Seat numbers are required.");
        }
        String[] parts = value.split(",");
        int[] seats = new int[parts.length];
        for (int i = 0; i < parts.length; i++) {
            seats[i] = Integer.parseInt(parts[i].trim());
        }
        return seats;
    }

    private void logSummary(String message) {
        summaryArea.append(message + System.lineSeparator());
        summaryArea.setCaretPosition(summaryArea.getDocument().getLength());
    }

    private void updateDashboardMetrics(String statusText) {
        int bookingCount = 0;
        double paidRevenue = 0;
        if (currentUser != null) {
            for (Booking booking : currentUser.getMyBookings()) {
                if (booking != null) {
                    bookingCount++;
                    if (booking.isPaid()) {
                        paidRevenue += booking.getTotalFare();
                    }
                }
            }
        }
        busCountValue.setText(String.valueOf(busCount));
        bookingCountValue.setText(String.valueOf(bookingCount));
        revenueValue.setText(String.format("Rs %.2f", paidRevenue));
        statusValue.setText(statusText);
    }

    private JPanel createSectionPanel() {
        JPanel panel = new JPanel(new BorderLayout(12, 12));
        panel.setOpaque(false);
        return panel;
    }

    private RoundedPanel createCardPanel(String title) {
        RoundedPanel card = new RoundedPanel(PANEL_BG, 24);
        card.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(218, 225, 236)),
            BorderFactory.createCompoundBorder(BorderFactory.createTitledBorder(title), new EmptyBorder(14, 16, 16, 16))
        ));
        return card;
    }

    private JPanel wrapCard(String title, Component component) {
        RoundedPanel card = createCardPanel(title);
        card.setLayout(new BorderLayout());
        card.add(component, BorderLayout.CENTER);
        return card;
    }

    private void styleFormField(JTextField field) {
        field.setFont(new Font("SansSerif", Font.PLAIN, 14));
        field.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(205, 214, 227)),
            new EmptyBorder(9, 10, 9, 10)
        ));
        field.setPreferredSize(new Dimension(260, 40));
    }

    private void stylePasswordField(JPasswordField field) {
        field.setFont(new Font("SansSerif", Font.PLAIN, 14));
        field.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(205, 214, 227)),
            new EmptyBorder(9, 10, 9, 10)
        ));
        field.setPreferredSize(new Dimension(260, 40));
    }

    private void styleCombo(JComboBox<?> comboBox) {
        comboBox.setFont(new Font("SansSerif", Font.PLAIN, 14));
        comboBox.setBorder(BorderFactory.createLineBorder(new Color(205, 214, 227)));
    }

    private void stylePrimaryButton(JButton button) {
        button.setBackground(PRIMARY);
        button.setForeground(Color.WHITE);
        button.setFocusPainted(false);
        button.setFont(new Font("SansSerif", Font.BOLD, 13));
        button.setBorder(new EmptyBorder(10, 18, 10, 18));
        button.setMargin(new Insets(10, 18, 10, 18));
        button.setPreferredSize(new Dimension(220, 46));
        button.setMinimumSize(new Dimension(220, 46));
    }

    private void styleSecondaryButton(JButton button) {
        button.setBackground(new Color(228, 234, 242));
        button.setForeground(PRIMARY_DARK);
        button.setFocusPainted(false);
        button.setFont(new Font("SansSerif", Font.BOLD, 13));
        button.setBorder(new EmptyBorder(10, 18, 10, 18));
        button.setMargin(new Insets(10, 18, 10, 18));
        button.setPreferredSize(new Dimension(220, 46));
        button.setMinimumSize(new Dimension(220, 46));
    }

    private void styleTable(JTable table) {
        table.setRowHeight(28);
        table.setShowVerticalLines(false);
        table.setSelectionBackground(new Color(220, 231, 244));
        table.setSelectionForeground(PRIMARY_DARK);
        table.setFont(new Font("SansSerif", Font.PLAIN, 13));
        table.getTableHeader().setFont(new Font("SansSerif", Font.BOLD, 13));
        table.getTableHeader().setBackground(PRIMARY_DARK);
        table.getTableHeader().setForeground(Color.WHITE);
        table.setDefaultRenderer(Object.class, new DefaultTableCellRenderer() {
            @Override
            public Component getTableCellRendererComponent(JTable table, Object value, boolean isSelected,
                                                           boolean hasFocus, int row, int column) {
                Component component = super.getTableCellRendererComponent(table, value, isSelected, hasFocus, row, column);
                if (!isSelected) {
                    component.setBackground(row % 2 == 0 ? Color.WHITE : new Color(248, 250, 253));
                    component.setForeground(TEXT_MAIN);
                }
                return component;
            }
        });
    }

    private void showInfo(String message) {
        JOptionPane.showMessageDialog(this, message, "Bus Ticket Booking", JOptionPane.INFORMATION_MESSAGE);
    }

    private void showError(String message) {
        JOptionPane.showMessageDialog(this, message, "Bus Ticket Booking", JOptionPane.ERROR_MESSAGE);
    }

    private static class GradientPanel extends JPanel {
        @Override
        protected void paintComponent(Graphics g) {
            super.paintComponent(g);
            Graphics2D g2 = (Graphics2D) g.create();
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            GradientPaint gradient = new GradientPaint(0, 0, PRIMARY_DARK, getWidth(), getHeight(), PRIMARY);
            g2.setPaint(gradient);
            g2.fillRoundRect(0, 0, getWidth(), getHeight(), 32, 32);
            g2.dispose();
        }
    }

    private static class RoundedPanel extends JPanel {
        private final Color backgroundColor;
        private final int arc;

        private RoundedPanel(Color backgroundColor, int arc) {
            this.backgroundColor = backgroundColor;
            this.arc = arc;
            setOpaque(false);
        }

        @Override
        public Dimension getPreferredSize() {
            Dimension size = super.getPreferredSize();
            return new Dimension(size.width, Math.max(size.height, 80));
        }

        @Override
        protected void paintComponent(Graphics g) {
            Graphics2D g2 = (Graphics2D) g.create();
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            g2.setColor(new Color(21, 34, 53, 18));
            g2.fillRoundRect(4, 6, getWidth() - 8, getHeight() - 6, arc, arc);
            g2.setColor(backgroundColor);
            g2.fillRoundRect(0, 0, getWidth() - 8, getHeight() - 8, arc, arc);
            g2.dispose();
            super.paintComponent(g);
        }
    }
}
