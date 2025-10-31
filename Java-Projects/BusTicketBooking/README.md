# Bus Ticket Booking CLI Application  🚍🎫

***

## Overview  🔍

This is a **command-line interface (CLI)** based Bus Ticket Booking system implemented in **Java**. It simulates realistic bus ticket booking with **dynamic data handling** and strong **Object-Oriented Programming (OOP)** principles.

Designed as a portfolio-ready project showcasing your skills in modular design, abstraction, encapsulation, and polymorphism — ideal for software engineering roles and LinkedIn sharing.

***

## Key Features  ✨

### 🚀 CLI Driven Experience
- Simple, intuitive terminal interaction.
- Navigation across search, booking, payment, and cancellation.
- Runs in any standard Java environment — no GUI needed.

### 🔄 Dynamic Data Handling
- Real-time input of buses, passengers, bookings.
- Updates seat availability and booking status live.
- Includes multi-method payment support with extensible architecture.

### 🛠️ Robust OOP Concepts
- **Encapsulation:** Hides sensitive data behind getters/setters.
- **Inheritance:** User inherits from Person class.
- **Abstraction:** Abstract Payment class with specific payment implementations.
- **Polymorphism:** Multiple payment methods via method overriding.
- **Method Overloading:** Flexible payment APIs with overloaded `pay()`.

***

## Technologies Used  🛠️

| Technology       | Description                             |
|------------------|---------------------------------------|
| Java 17+         | Modern features and strong typing     |
| Java Time API    | Date/time handling & formatting       |
| Standard libs    | No external dependencies required     |

***

## Project Structure 🧱

- **Bus** — Bus details, seat management.  
- **Person/User** — User base & inheritance.  
- **Booking** — Ticket and journey details management.  
- **Payment** — Abstract class with `CashPayment`, `UPIPayment`, `CreditCardPayment` subclasses.  
- **Main** — Program entry, controls workflow.

***

## What You’ll Learn 📚

- Building functional Java CLI apps.  
- Real-time dynamic user input management.  
- Applying OOP best practices in Java.  
- Abstract classes and method overloading.  
- Date/time formatting with Java Time API.  
- Simulated payment processing flows.

***

## How It Works  ⚙️

1. **View Available Buses** — Lists buses dynamically.  
2. **Search Bus** — Filter by source/destination.  
3. **Select Bus Type** — AC, Sleeper, Express, etc.  
4. **Book Ticket** — Input dynamic passenger info, select seats.  
5. **Make Payment** — Choose payment method, process.  
6. **Cancel Ticket** — Cancel and refund seat availability.  
7. **View My Bookings** — Review booking history with formatted timestamps.

Dates and times rendered as:  
**`dd-MM-yyyy , HH:mm:ss`** for clear readability.

***

## Why You Should Care  💡

- ⏩ Realistic booking flow without heavy dependencies.  
- 📂 Clean, modular code structure — easy to extend.  
- 🎯 Demonstrates strong Java OOP mastery.  
- 🌱 Beginner to intermediate-friendly, yet comprehensive.  
- 💼 Impress recruiters by showcasing practical skills.  
- 📊 Dynamic CLI design with robust error handling.

***

## Future Enhancements 🔧

- Persistent storage (file/db).  
- GUI interface with JavaFX or Swing.  
- Integration with payment gateways.  
- Multi-day journey & scheduling.  
- User authentication and profile management.

***

## Run Instructions ▶️

1. Compile:

   ```bash
   javac BusTicketBooking/*.java
   ```

2. Run:

   ```bash
   java BusTicketBooking.Main
   ```

***

## Final Thoughts  🎉

This Bus Ticket Booking CLI app is a **powerful demonstration of Java OOP and dynamic programming**—a great asset for your GitHub portfolio or LinkedIn profile. Show off your ability to solve real-world problems with clean, maintainable code.

***

*Make your LinkedIn network notice your technical prowess by sharing this project!* 🚀✨

Sources
