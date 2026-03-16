using System.Collections.Generic;

namespace ZoomTrip.API.Models
{
    public class Car
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string CarNumber { get; set; } = string.Empty;
        public string CarType { get; set; } = string.Empty;
        
        public int OwnerId { get; set; }
        public Owner? Owner { get; set; }

        public int LocationId { get; set; }
        public Location? Location { get; set; }

        public string AvailabilityStatus { get; set; } = "Available"; // Available, Cars Outside, OutOfService
        public string? ImageUrl { get; set; }

        public ICollection<ServiceRecord> ServiceRecords { get; set; } = new List<ServiceRecord>();
    }
}
