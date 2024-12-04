const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Temporär lagring av bokningar (byt ut till en databas för produktion)
const bookings = [];

// Hämta alla bokningar
app.get("/bookings", (req, res) => {
  res.json(bookings);
});

// Skapa en ny bokning
app.post("/bookings", (req, res) => {
  const { start, end, spot } = req.body;

  // Kontrollera om platsen redan är bokad
  const isBooked = bookings.some((booking) => {
    return (
      booking.spot === spot &&
      ((new Date(start) >= new Date(booking.start) && new Date(start) < new Date(booking.end)) ||
        (new Date(end) > new Date(booking.start) && new Date(end) <= new Date(booking.end)) ||
        (new Date(start) <= new Date(booking.start) && new Date(end) >= new Date(booking.end)))
    );
  });

  if (isBooked) {
    return res.status(400).json({ error: "Platsen är redan bokad under dessa datum." });
  }

  // Lägg till bokningen
  bookings.push({ start, end, spot });
  res.status(201).json({ message: "Bokningen är skapad.", bookings });
});

// Kör servern
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


