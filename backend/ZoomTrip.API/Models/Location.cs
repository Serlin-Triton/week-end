namespace ZoomTrip.API.Models
{
    public class Location
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public bool IsStartLocation { get; set; } = false;
        public bool IsDropLocation { get; set; } = false;
    }
}
