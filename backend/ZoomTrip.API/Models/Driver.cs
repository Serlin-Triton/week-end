using System.Collections.Generic;

namespace ZoomTrip.API.Models
{
    public class Driver
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string MobileNumber { get; set; } = string.Empty;
        public string LicenseNumber { get; set; } = string.Empty;
        public string? PhotoUrl { get; set; }
    }
}
