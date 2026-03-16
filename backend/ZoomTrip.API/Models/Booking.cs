using System;

namespace ZoomTrip.API.Models
{
    public class Booking
    {
        public int Id { get; set; }
        
        public int StartPointId { get; set; }
        public Location? StartPoint { get; set; }

        public int DropPointId { get; set; }
        public Location? DropPoint { get; set; }

        public string RouteType { get; set; } = "One Way"; // One Way / Round Trip

        public decimal BookingAmount { get; set; }
        public DateTime BookingDate { get; set; } = DateTime.UtcNow;

        public int? DriverId { get; set; }
        public Driver? AssignedDriver { get; set; }

        public int? CarId { get; set; }
        public Car? AssignedCar { get; set; }

        public string Status { get; set; } = "Pending"; // Pending, Accepted, Payment Waiting, Completed
    }
}
